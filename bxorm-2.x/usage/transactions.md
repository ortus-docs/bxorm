---
description: "How ORM work shares the BoxLang transaction: commit, rollback, locking and read-only loads"
icon: code-commit
---

# Transactions

A transaction is any discrete unit of work used to pool database queries and statements to execute at once. This helps us to prevent a failed update from leaving the database in a broken state.

To denote a transaction, we wrap it in the `transaction{}` tag:

```js
transaction{
    // queries go here
}
```

The transaction will automatically commit (persist) at the end of the transaction block.

{% hint style="info" %}
**One transaction for ORM and SQL:** ORM work inside `transaction{}` uses that transaction's JDBC connection. ORM writes and `queryExecute()` calls on the same datasource commit together and roll back together. BoxLang does the real commit or rollback.

ORM sessions on other datasources are flushed on commit and cleared on rollback, but their SQL is not part of the transaction.
{% endhint %}

## Transaction Rollback

A transaction rollback undoes all changes made within the transaction block and prevents them from being persisted to the database. This is useful when an error occurs or business rules are violated.

### Automatic Rollback on Error

If an exception occurs within a transaction block, the transaction is automatically rolled back:

```js
try {
    transaction {
        var user = entityNew( "User" );
        user.setUsername( "johndoe" );
        entitySave( user );
        
        // This will throw an exception and trigger automatic rollback
        var invalid = entityLoadByPK( "NonExistentEntity", 1 );
    }
} catch ( any e ) {
    // Transaction has been rolled back, user was not saved
    writeOutput( "Error: #e.message#" );
}
```

### Manual Rollback

You can manually trigger a rollback using `transactionRollback()`:

```js
transaction {
    var account = entityLoadByPK( "Account", 1 );
    var newBalance = account.getBalance() - 100;
    
    // Business rule: account balance cannot go negative
    if ( newBalance < 0 ) {
        transactionRollback();
        writeOutput( "Insufficient funds - transaction rolled back" );
    } else {
        account.setBalance( newBalance );
        entitySave( account );
        // Transaction commits automatically at end of block
    }
}
```

The alternative syntax `action="rollback"` is also supported.

## Transaction Commit

A transaction commit persists all changes made within the transaction block to the database. By default, transactions automatically commit when the transaction block completes successfully.

### Automatic Commit

When a transaction block completes without errors or explicit rollback, it will be automatically committed:

```js
transaction {
    // Create a new user
    var user = entityNew( "User" );
    user.setUsername( "janedoe" );
    user.setEmail( "jane@example.com" );
    entitySave( user );
    
    // Create a profile for the user
    var profile = entityNew( "Profile" );
    profile.setUser( user );
    profile.setBio( "Software developer" );
    entitySave( profile );
    
    // Both saves commit together at the end of this block
}
```

### Manual Commit

You can manually commit a transaction using `transactionCommit()` when you need to persist changes before the end of the block:

```js
transaction {
    // First batch of operations
    var batch1 = entityNew( "Batch" );
    batch1.setName( "Batch 1" );
    entitySave( batch1 );
    transactionCommit();
    writeOutput( "Batch 1 committed successfully" );
    
    // Second batch of operations
    var batch2 = entityNew( "Batch" );
    batch2.setName( "Batch 2" );
    entitySave( batch2 );
    transactionCommit();
    writeOutput( "Batch 2 committed successfully" );
}
```

The alternative syntax `action="commit"` is also supported.

{% hint style="warning" %}
**Important:** When you manually commit a transaction using `transactionCommit()`, it effectively closes the current transaction and immediately begins a new one. This means that any subsequent operations within the transaction block will be part of a new transaction context.
{% endhint %}

### Named Transactions

Nested transactions are handled by BoxLang. With BoxLang's default setting (`enableNestedTransactions=false`), a nested `transaction{}` is part of the outer transaction. A commit inside the nested block commits the outer transaction too:

```js
transaction name="outer" {
    var customer = entityNew( "Customer" );
    customer.setName( "Acme Corp" );
    entitySave( customer );

    transaction name="inner" {
        var invoice = entityNew( "Invoice" );
        invoice.setCustomer( customer );
        invoice.setAmount( 1000.00 );
        entitySave( invoice );

        // With the default setting, this also commits the customer
        transactionCommit();
    }
}
```

A commit or rollback scoped to the nested block (with savepoints) needs BoxLang's experimental `enableNestedTransactions` runtime setting. bx-orm follows whatever BoxLang commits or rolls back.

## After the commit

To run code only once ORM writes are committed (and never for rolled-back ones), use the [`postCommit`](events.md#postcommit-after-the-commit) event. Inside `transaction{}` it fires for each written entity after BoxLang commits the transaction, when the transaction ends, in write order.

```js
class persistent="true" {
	function postCommit( entity, action ) {
		// insert, update or delete: the row is committed
	}
}
```

## Locking

A database lock stops other transactions from changing the locked rows until your transaction ends (a `write` lock also stops them from locking the rows). Locks need a transaction: taking one outside `transaction{}` raises an `orm.argument` error, and every lock is released when the transaction commits or rolls back.

```js
transaction {
    var account = entityLoadByPK( "Account", 1, { lock : "write" } );
    account.setBalance( account.getBalance() - 100 );
}
```

| To lock                          | Use                                                                                          |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| An entity you already loaded     | [entityLock( entity, [mode], [options] )](../reference/built-in-functions/entitylock.md)     |
| An entity while loading it by id | The `lock` option of [entityLoadByPK()](../reference/built-in-functions/entityloadbypk.md)   |
| The rows of a criteria query     | [`lock()`](criteria.md#locking-rows) on `entityCriteria()`                                   |
| The rows of an HQL query         | The `lock` option of [ORMExecuteQuery()](../reference/built-in-functions/ormexecutequery.md) |

The modes are `write` (exclusive, the default), `read` (shared) and `force` (exclusive, and increments the version of a versioned entity). Each also takes a lock timeout in seconds (`timeout`, or `lockTimeout` for `ormExecuteQuery()`; `0` means do not wait) and `skipLocked`.

### Read-only loads

When you only read entities (reports, exports), load them read-only. They are not dirty-checked, so flushes are cheaper, and changes made to them by mistake are never saved:

* [ormReadOnly( callback )](../reference/built-in-functions/ormreadonly.md) makes every entity loaded inside the closure read-only.
* [entityLoadReadOnly()](../reference/built-in-functions/entityloadreadonly.md) is `entityLoad()` with read-only results.
* The `readOnly` option of `entityLoad()`, `entityLoadByPK()` and `ormExecuteQuery()`, and `readOnly()` on `entityCriteria()`.

## Transaction Savepoint

ORM work rides the BoxLang transaction, so savepoints are BoxLang's. They only exist when BoxLang's experimental `enableNestedTransactions` runtime setting is on. With the default setting, you cannot roll back part of a transaction.

When a nested `transaction` block ends, bx-orm flushes the ORM session for each datasource, so the nested block's changes reach the database before the outer transaction continues.

{% hint style="info" %}
Looking for full ORM savepoint support? [Contact our Support team to consider sponsoring this feature](https://boxlang.io/plans).
{% endhint %}

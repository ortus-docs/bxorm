---
description: Learn transaction management with bx-orm
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

Named transactions allow you to commit or rollback specific transactions when dealing with nested transactions:

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
        
        // Commit only the inner transaction
        transactionCommit( "inner" );
    }
    
    // Outer transaction commits automatically
}
```

## Transaction Savepoint

Savepoints are not _currently_ supported on ORM transactions.

{% hint style="info" %}
Looking for ORM savepoint support? [Contact our Support team to consider sponsoring this feature](https://boxlang.io/plans).
{% endhint %}

---
title: Transactions and the session
summary: Commit and roll back ORM work, see what changed before it is saved, lock rows and mix ORM with SQL safely.
icon: phosphor-duotone:arrows-clockwise
tags: [course]
---

You have wrapped every write in `transaction {}` so far. This lesson explains why, and what happens between loading an entity and the SQL reaching the database.

## The session

Every request (or script run) has an ORM **session**. It remembers every entity you load or save, so:

- Loading the same row twice gives you the same object, with one query.
- Changes to loaded entities are tracked. You don't call `entitySave()` after a `set...()`.
- SQL is not sent right away. It waits until the session **flushes**.

A transaction flushes the session when it ends, then commits. That is why writes go inside `transaction {}`.

## Commit and roll back

A transaction commits when its block ends without an error. An error rolls everything back:

```boxlang title="app.bxs"
try {
    transaction {
        entitySave( entityNew( "Tag", { name : "temporary" } ) );
        throw( type = "demo", message = "Something went wrong" );
    }
} catch ( any e ) {
    // the tag was never saved
}
```

Roll back on purpose with `transactionRollback()`:

```boxlang title="publish.bxs"
transaction {
    draft = entityNew( "Post", { title : "Draft", author : ann } );
    entitySave( draft );

    if ( !len( draft.getBody() ) ) {
        transactionRollback(); // an empty post is not saved
    }
}
```

## What changed?

Before a flush, you can ask what the session will write:

```boxlang title="app.bxs"
import blog.models.Post;

transaction {
    entry = Post::get( 3 );
    entry.setTitle( "Relationships 101" );

    println( entityIsDirty( entry ) );            // true
    println( entityGetDirtyProperties( entry ) ); // [ "title" ]
    println( ormIsSessionDirty() );               // true: a flush would write something
}
```

`ormFlush()` writes pending changes right away, inside the transaction. `ormClearSession()` forgets every loaded entity without writing anything.

## Mixing ORM and SQL

ORM work inside `transaction {}` uses the same database connection as `queryExecute()` on the same datasource. They commit together and roll back together:

```boxlang title="publish.bxs"
import blog.models.Post;

function publishPost( required numeric id ) {
    transaction {
        entry = Post::getOrFail( id );
        entry.setPublished( true );

        // Plain SQL in the same transaction: both commit, or neither does
        queryExecute(
            "insert into audit_log ( message ) values ( :message )",
            { message : "Published post #id#" }
        );
    }
}
```

## Locking rows

Two editors publishing the same post at the same moment? Lock the row. A lock lasts until the transaction ends:

```boxlang
transaction {
    entry = entityLoadByPK( "Post", 3, { lock : "write" } );
    entry.setPublished( true );
}
```

To lock an entity you already loaded, call `entityLock( entry, "write" )`. Locks need a transaction: outside one, you get an `orm.argument` error.

## Read-only loads

Reports and exports only read. Load read-only and the session skips dirty checking, so flushes are cheaper and an accidental `set...()` is never saved:

```boxlang
posts  = entityLoad( "Post", { published : true }, "createdDate desc", { readOnly : true } );
report = ormReadOnly( () => entityLoad( "Post" ) );
```

`ormReadOnly()` makes every entity loaded inside the closure read-only.

## Try it

- Save a tag, then throw an error in the same transaction. Check that the tag is not in the table.
- Load a post, change its title and print `entityGetDirtyProperties()`. Then call `ormClearSession()` and reload it. Was the title saved?
- Create an `audit_log` table and build `publishPost()`. Make the SQL fail on purpose and check that the post stays unpublished.

## Learn more

- [Transactions](https://bxorm.ortusbooks.com/bxorm-2.x/usage/transactions)
- [Session management](https://bxorm.ortusbooks.com/bxorm-2.x/usage/session-management)

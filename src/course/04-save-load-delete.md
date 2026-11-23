---
title: Save, load and delete
summary: Create users, save them, load them back by id or by a filter, change them and delete them.
icon: phosphor-duotone:floppy-disk
tags: [course]
---

You have a `User` entity. Now you put rows in the table and get them back, using the ORM's built-in functions. Every function in this lesson takes the entity name as its first argument.

## Create and save

`entityNew()` creates a new, unsaved entity. Pass a struct to fill its properties. `entitySave()` saves it:

```boxlang title="app.bxs"
transaction {
    ann = entityNew( "User", { email : "ann@example.com", name : "Ann" } );
    entitySave( ann );
}

println( ann.getId() ); // the id the database generated
```

Why the `transaction`? The ORM writes SQL when its session **flushes**, and a transaction flushes when it ends. Wrap writes in a transaction and they commit together, or not at all. Lesson 9 goes deeper.

`entitySave()` also takes an array, to save several entities at once:

```boxlang
transaction {
    entitySave( [
        entityNew( "User", { email : "bob@example.com", name : "Bob" } ),
        entityNew( "User", { email : "cy@example.com", name : "Cy" } )
    ] );
}
```

## Load

| You want                                     | Use                                                 |
| -------------------------------------------- | --------------------------------------------------- |
| One entity by id, or `null`                  | `entityLoadByPK( "User", id )`                      |
| One entity by id, or an `orm.notFound` error | `entityLoadByPKOrFail( "User", id )`                |
| All entities, or those matching a filter     | `entityLoad( "User", [filter], [sort], [options] )` |
| One entity matching a filter                 | `entityLoad( "User", filter, true )`                |
| One entity by id or filter, or an error      | `entityLoadOrFail( "User", idOrFilter )`            |

```boxlang title="app.bxs"
// By primary key: null when there is no such row
user = entityLoadByPK( "User", 1 );

// By primary key, or throw orm.notFound
user = entityLoadByPKOrFail( "User", 1 );

// Everyone, sorted
users = entityLoad( "User", {}, "name asc" );

// A filter, a sort and paging
page = entityLoad( "User", { name : "Ann" }, "email asc", { maxResults : 10, offset : 0 } );

// Exactly one match
ann = entityLoad( "User", { email : "ann@example.com" }, true );
```

The `OrFail` versions are great in request handlers: a missing row becomes a clear error instead of a `null` you trip over later:

```text
orm.notFound: No [User] with id [99] was found.
```

## Load or create

Need "find it, or make it"? There are functions for that:

```boxlang
transaction {
    // The user, or a new one that is saved
    dee = entityLoadOrSave( "User", { email : "dee@example.com" }, { name : "Dee" } );
}
```

`entityLoadOrNew()` does the same but leaves the new entity unsaved. A new entity is filled from the filter first, then from the third argument.

## Update

A loaded entity is **managed**: the ORM compares it with the database when the session flushes and writes only what changed. You don't call `entitySave()` again:

```boxlang title="app.bxs"
transaction {
    user = entityLoadByPKOrFail( "User", 1 );
    user.setName( "Ann Lee" );
} // the UPDATE runs here
```

## Delete

`entityDelete()` deletes an entity, or an array of them:

```boxlang title="app.bxs"
transaction {
    entityDelete( entityLoadByPKOrFail( "User", 3 ) );
}
```

## See the SQL

With `logSQL : true` from lesson 2, each step prints its SQL. Watch for one `insert` per save, one `select` per load and an `update` that only lists the changed column.

## Try it

- Save three users, then load them sorted by email, descending.
- Load a user by an id that does not exist with `entityLoadByPK()`, then with `entityLoadByPKOrFail()`. Compare.
- Change a user's name inside a transaction without calling `entitySave()`, then reload it to confirm the change was saved.
- Run `entityLoadOrSave()` twice with the same email. How many rows are there?

## Learn more

- [Working with entities](https://bxorm.ortusbooks.com/bxorm-2.x/usage/working-with-entities)
- [entityLoad()](https://bxorm.ortusbooks.com/bxorm-2.x/reference/built-in-functions/entityload)
- [entitySave()](https://bxorm.ortusbooks.com/bxorm-2.x/reference/built-in-functions/entitysave)

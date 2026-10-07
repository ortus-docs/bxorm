---
description: Create, load, save, update and delete entities with the ORM built-in functions
icon: cubes
---

# Working with Entities

This page walks through an entity's life: create it, save it, load it, change it and delete it. Each section names the built-in functions (BIFs) to use; their reference pages have every argument.

{% hint style="info" %}
Do your writes inside `transaction{}`. The ORM saves changes when the transaction commits and throws them away when it rolls back. See [Transactions](transactions.md).
{% endhint %}

## Create

[entityNew()](../reference/built-in-functions/entitynew.md) creates a new, unsaved entity, optionally filled from a struct:

```js
var user = entityNew( "User" );
var user = entityNew( "User", { firstName : "Ann", lastName : "Lee" } );
```

With `eventHandling` on, `entityNew()` fires the `postNew` event on the entity and the global event handler. See [Events](events.md).

## Save

[entitySave()](../reference/built-in-functions/entitysave.md) saves a new entity, or an array of them:

```js
transaction {
    entitySave( user );
    entitySave( [ ann, bob, cy ] );
}
```

* A new entity is inserted. A detached entity (loaded in an earlier request) is merged back. An entity already in the session needs no call: its changes are saved anyway.
* The SQL runs when the session flushes, at the end of the `transaction{}`. Pass `{ flush : true }` to write right away, for example to get a database-generated id:

```js
entitySave( user, { flush : true } );
println( user.getId() );
```

## Load

| You want                                               | Use                                                                                                   |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| One entity by primary key, or `null`                   | [entityLoadByPK( name, id )](../reference/built-in-functions/entityloadbypk.md)                       |
| Several entities by primary key, in the order asked    | `entityLoadByPK( name, [ id1, id2 ] )`                                                                |
| One entity by primary key, or an `orm.notFound` error  | [entityLoadByPKOrFail( name, id )](../reference/built-in-functions/entityloadbypkorfail.md)           |
| All entities, or those matching a filter               | [entityLoad( name, [filter], [sortOrder], [options] )](../reference/built-in-functions/entityload.md) |
| One entity matching a filter                           | `entityLoad( name, filter, true )`                                                                    |
| One entity by id or filter, or an `orm.notFound` error | [entityLoadOrFail( name, idOrFilter )](../reference/built-in-functions/entityloadorfail.md)           |
| Entities that look like an example entity              | [entityLoadByExample( entity, [unique] )](../reference/built-in-functions/entityloadbyexample.md)     |
| Anything more complex                                  | [entityCriteria()](criteria.md) or [HQL](querying.md)                                                 |

```js
var user   = entityLoadByPK( "User", 1 );
var users  = entityLoadByPK( "User", [ 3, 1, 99 ] ); // [ user3, user1, null ], one query
var smiths = entityLoad( "User", { lastName : "Smith" }, "firstName asc", { maxResults : 20, offset : 40 } );
var ann    = entityLoad( "User", { email : "ann@example.com" }, true );
```

A `unique` load that matches more than one row raises `orm.query.nonUnique`. Pass `{ uniqueFirst : true }` to take the first row instead.

Without a sort order, `entityLoad()` uses the entity's [`defaultSort`](../modeling/entities.md#default-sort-order) when it declares one.

### Load or Create

| You want                               | Use                                                                                                       |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| The entity, or a new unsaved one       | [entityLoadOrNew( name, idOrFilter, [properties] )](../reference/built-in-functions/entityloadornew.md)   |
| The entity, or a new one that is saved | [entityLoadOrSave( name, idOrFilter, [properties] )](../reference/built-in-functions/entityloadorsave.md) |

```js
transaction {
    var tag = entityLoadOrSave( "Tag", { name : "boxlang" } );
}
```

A new entity is filled from the filter's values, then from `properties`.

{% hint style="warning" %}
Two requests can both find nothing and both insert. Put a unique constraint on the filter's columns so the database rejects the second insert.
{% endhint %}

### Read-Only Loads

Entities you only read don't need dirty checking. Load them read-only to save memory and time:

```js
var orders = entityLoadReadOnly( "Order", { status : "shipped" } );
var orders = entityLoad( "Order", { status : "shipped" }, "createdDate desc", { readOnly : true } );
var user   = entityLoadByPK( "User", 1, { readOnly : true } );

// Everything loaded inside the closure is read-only
var report = ormReadOnly( () => buildReport() );
```

Changes to a read-only entity are never saved. See [Read-only loads](transactions.md#read-only-loads).

## Update

An entity loaded in the current session is managed: the ORM compares it with the database at flush time and writes only what changed. You don't need `entitySave()`:

```js
transaction {
    var user = entityLoadByPKOrFail( "User", 1 );
    user.setEmail( "ann.lee@example.com" );
} // UPDATE runs here
```

Ask what changed before it is saved:

```js
entityIsDirty( user );            // true
entityGetDirtyProperties( user ); // [ "email" ]
ormIsSessionDirty();              // true: something in the session changed
```

## Delete

[entityDelete()](../reference/built-in-functions/entitydelete.md) deletes an entity, or an array of them. Like saves, the `DELETE` runs at flush time, or right away with `{ flush : true }`:

```js
transaction {
    entityDelete( user );
    entityDelete( entityLoad( "Session", { expired : true } ) );
}
```

Relationships with a `cascade` delete their children too. An entity with [`softDelete`](../modeling/entities.md#soft-delete) is marked deleted instead of removed, and every load skips it.

To delete many rows without loading them, use a criteria [bulk delete](criteria.md#bulk-updates-and-deletes) (`deleteAll()`) or an HQL `delete` statement.

## The Session

Every entity you load or save lives in the ORM session of the current request until the session closes. These BIFs work with it:

| BIF                                                                                      | What it does                                                                                              |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [entityGetReference( name, id )](../reference/built-in-functions/entitygetreference.md)  | A lazy reference by id, without a `SELECT`. Ideal for setting an association when all you have is the id. |
| [entityReload( entity )](../reference/built-in-functions/entityreload.md)                | Re-read the entity's values from the database.                                                            |
| [entityMerge( entity )](../reference/built-in-functions/entitymerge.md)                  | Copy a detached entity's state into the session.                                                          |
| [entityEvict( entityOrArray )](../reference/built-in-functions/entityevict.md)           | Stop tracking entities: later changes are not saved. Nothing is deleted.                                  |
| [entityIsAttached( entity )](../reference/built-in-functions/entityisattached.md)        | Whether the entity is in the current session.                                                             |
| [entityLock( entity, [mode], [options] )](../reference/built-in-functions/entitylock.md) | Lock the entity's row until the transaction ends. See [Locking](transactions.md#locking).                 |
| [ormFlush()](../reference/built-in-functions/ormflush.md)                                | Write pending changes now.                                                                                |
| [ormClearSession()](../reference/built-in-functions/ormclearsession.md)                  | Drop every entity from the session.                                                                       |

```js
var order = entityNew( "Order" );
order.setCustomer( entityGetReference( "Customer", form.customerId ) ); // no SELECT
entitySave( order );
```

See [Session Management](session-management.md) for how sessions open and close.

## Inspect

| BIF                                                                                                                                            | Returns                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [entityGetName( entity )](../reference/built-in-functions/entitygetname.md)                                                                    | The entity name                                                |
| [entityGetId( entity )](../reference/built-in-functions/entitygetid.md)                                                                        | The primary key value (a struct for composite keys)            |
| [entityGetDatasource( entityOrName )](../reference/built-in-functions/entitygetdatasource.md)                                                  | The datasource the entity is stored in                         |
| [entityGetMetadata( entityOrName )](../reference/built-in-functions/entitygetmetadata.md)                                                      | Table, id, properties, relationships and settings, as a struct |
| [entityNameArray()](../reference/built-in-functions/entitynamearray.md), [entityNameList()](../reference/built-in-functions/entitynamelist.md) | The entity names of the application                            |

## Convert

| BIF                                                                                                         | Returns                                                           |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [entityToStruct( entityOrArray, [options] )](../reference/built-in-functions/entitytostruct.md)             | Structs, ready for JSON. See [Entities as Structs](structs.md).   |
| [entityLoadAsStruct( name, idOrFilter, [includes] )](../reference/built-in-functions/entityloadasstruct.md) | The same structs, read without loading entities                   |
| [entityToQuery( entityOrArray )](../reference/built-in-functions/entitytoquery.md)                          | A query, no relation data. See [Entities as Queries](queries.md). |

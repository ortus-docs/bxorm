---
description: Load, find, count and write entities straight from the entity class, like User::get( 1 )
icon: bolt
---

# Static Entity Methods

Every entity class gets static helper methods at ORM startup, so you can work with an entity without a service object or a base class:

```js
user  = User::get( 1 );
admin = User::findWhere( { email : "admin@example.com" } );
total = User::count( { active : true } );
page  = User::list( { max : 20, offset : 40, sort : "lastName" } );
```

Each method calls the matching built-in function with the entity name filled in, so it behaves exactly like that function: same session, events, errors and options.

## Methods

### Loading

| Method               | Returns                                                                                     | Same as                                    |
| -------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `get( id )`          | The entity, or `null`                                                                       | `entityLoadByPK( "User", id )`             |
| `getOrFail( id )`    | The entity, or an `orm.notFound` error                                                      | `entityLoadByPKOrFail( "User", id )`       |
| `getAll( [ids] )`    | Every entity when no ids are given; else the entities for an array or list of ids, in order | `entityLoad( "User" )`, `entityLoadByPK()` |
| `read( id )`         | The entity, read-only: changes to it are never saved                                        | `entityLoadByPK( …, { readOnly : true } )` |
| `getReference( id )` | A reference that loads on first use, without a `SELECT`                                     | `entityGetReference( "User", id )`         |

### Finding and counting

| Method                                        | Returns                                                                                                                                                         |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `findWhere( filter, [options] )`              | The one entity matching the filter, or `null`. More than one match is an `orm.query.nonUnique` error; pass `{ uniqueFirst : true }` to take the first.          |
| `findWhereOrFail( filter, [options] )`        | Like `findWhere()`, but no match is an `orm.notFound` error                                                                                                     |
| `findAllWhere( [filter], [sort], [options] )` | An array of the matching entities                                                                                                                               |
| `first( [filter], [sort] )`                   | The first matching entity, or `null`. Without a sort, the entity's `defaultSort` applies.                                                                       |
| `exists( idOrFilter )`                        | `true` when an entity with that id, or matching that filter, exists                                                                                             |
| `count( [filter] )`                           | The number of matching entities                                                                                                                                 |
| `list( [options] )`                           | The entities, with `max`, `offset` and `sort`, plus any [`entityLoad()`](../reference/built-in-functions/entityload.md) option such as `readOnly` or `asStream` |

### Queries

| Method                                     | Returns                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| `executeQuery( hql, [params], [options] )` | The same as [`ormExecuteQuery()`](../reference/built-in-functions/ormexecutequery.md) |
| `criteria()`, `newCriteria()`              | A new [criteria query](criteria.md) for the entity                                    |

### Creating and writing

| Method                                  | Returns                                                                           |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| `new( [properties] )`                   | A new, unsaved entity (`entityNew()`)                                             |
| `firstOrNew( filter, [properties] )`    | The entity matching the filter, or a new unsaved one (`entityLoadOrNew()`)        |
| `firstOrCreate( filter, [properties] )` | The entity matching the filter, or a new one that is saved (`entityLoadOrSave()`) |
| `updateWhere( filter, values )`         | The number of rows updated, in one statement                                      |
| `deleteWhere( filter )`                 | The number of rows deleted, in one statement                                      |

`updateWhere()` and `deleteWhere()` run one statement: no entity events or cascades fire, and entities already loaded are not refreshed. They refuse an empty filter (`orm.argument`), since it would affect every row. To affect every row on purpose, use `User::criteria().updateAll( values )` or `User::criteria().deleteAll()`.

Arguments can be positional or named:

```js
User::get( id = 1 );
User::findAllWhere( filter = { active : true }, sort = "lastName" );
```

## Examples

```js
// Load or fail with a clear error
order = Order::getOrFail( rc.orderId );

// Find, or create on first use
tag = Tag::firstOrCreate( { name : rc.tag } );

// Page through results
users = User::list( { max : 25, offset : ( rc.page - 1 ) * 25, sort : "lastName, firstName" } );

// Anything more complex: start a criteria query
recent = Order::criteria()
	.isEq( "status", "shipped" )
	.isGt( "shippedDate", dateAdd( "d", -7, now() ) )
	.order( "shippedDate", "desc" )
	.list();

// Bulk changes
transaction {
	archived = Order::updateWhere( { status : "shipped" }, { status : "archived" } );
}
```

## Rules

* **Your methods win.** A static method the entity declares itself is kept, never replaced.
* **Instances can call them too.** BoxLang lets an instance call its class's static methods, so `user.count()` works. An instance method with the same name, declared on the entity or a parent such as cborm's `ActiveEntity`, takes precedence.
* **Methods exist once the ORM has started.** They are added when the application's ORM starts, and again on `ormReload()`.

## Turning them off

The methods are on by default. To leave your entity classes untouched:

```js
this.ormSettings = {
	staticMethods : false
};
```

## In development

When you edit an entity file, BoxLang recompiles the class, and the new class starts without the static methods. bx-orm adds them back:

* at the start of the next request, when the BoxLang runtime's trusted cache is off (the usual development setting);
* as soon as an instance of the edited entity is created, for example by `entityNew()` or a load.

With the trusted cache on (the usual production setting), classes are never recompiled, so this check does not run.

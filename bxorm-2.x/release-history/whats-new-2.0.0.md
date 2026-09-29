---
description: A tour of everything new in bx-orm 2.0.0, from Hibernate 7.4 to fluent criteria queries
icon: wand-magic-sparkles
---

# What's New in 2.0.0

bx-orm 2.0.0 moves the module onto Hibernate ORM 7.4, adds a fluent query builder, clear errors, a boot cache for fast production starts, and a long list of conveniences inspired by Grails GORM, cborm and mementifier. Your existing BIF calls keep working: read [Upgrading to 2.0.0](upgrading-to-2.0.0.md) for the few behavior changes to check.

## Engine and Startup

### Hibernate ORM 7.4

bx-orm now runs on Hibernate ORM `7.4.8.Final` (up from 5.6.15). You get Hibernate's modern query engine, current database dialects and years of fixes, while the BoxLang side (`entityNew()`, `entitySave()`, `entityLoad()`, `ormExecuteQuery()` and the rest) behaves as before.

* Each entity maps to a generated Java class (a facade) that delegates to your BoxLang entity. This unlocks `uuid` and other id generators, composite primary keys, single-table and joined inheritance, `binary` properties and value collections (`fieldtype="collection"`).
* Mappings use Hibernate's modern `mapping.xml` format and are handed to Hibernate in memory. `savemapping : true` writes them as `{entityName}.orm.xml` beside each entity for debugging.
* Legacy dialect names such as `MySQL57` or `Oracle10g` still work: they map to the current dialect with a one-time warning. See [Dialects](../getting-started/configuration/README.md#dialects).

### Boot Cache

Large applications can now skip most of their ORM startup work. `ormManifest : "auto"` writes the resolved model and the generated classes to a `.bxorm/` folder, and `ormManifest : "trust"` boots straight from it in production. In `auto` mode, bx-orm also watches your entity files and reloads the ORM on the next request after you edit one.

```js
this.ormSettings = {
    entityPaths : [ "models" ],
    ormManifest : "auto" // "trust" in production
};
```

The new [`bxorm` CLI](../reference/cli-tools.md#bxorm-boot-cache-cli) (`boxlang module:orm info`) inspects, validates and clears the cache. See [Boot Cache](../getting-started/performance.md#boot-cache).

### Transactions Ride BoxLang

ORM work inside `transaction{}` now uses the same JDBC connection as `queryExecute()`. BoxLang owns the commit and rollback, so ORM writes and plain SQL commit or roll back together, and queries inside a transaction see the ORM writes made earlier in it. See [Transactions](../usage/transactions.md).

## Querying

### Case-Insensitive HQL Names

Hibernate 6+ resolves HQL names case-sensitively, but BoxLang is case-insensitive, so bx-orm resolves them for you: `ORMExecuteQuery( "from user where firstname = ?", [ "Luis" ] )` finds the `User` entity's `firstName` property. HQL in the declared case runs as is, and a corrected query is cached, so there is no ongoing cost. See [Querying](../usage/querying.md).

### Criteria Queries

`entityCriteria()` is a fluent query builder with automatic joins, groups, subqueries, projections, paging and streaming. It uses cborm's method names, so cborm code reads the same.

```js
var page = entityCriteria( "User" )
    .isEq( "status", "active" )
    .like( "role.name", "admin%" )
    .order( "lastName" )
    .paginate( page = 2, maxRows = 25 );
```

Functions work inside property paths (`isEq( "year(createdDate)", 2025 )`), `updateAll()` and `deleteAll()` run bulk statements, `getSQL()` shows the SQL a query will run, and cborm's `c.restrictions`, quantified subqueries (`subGeAll`, `propertyLtSome`, ...) and SQL log (`startSqlLog()`, `logSQL()`, `getSqlLog()`) work too. See [Criteria Queries](../usage/criteria.md).

### Named SQL Functions

Register SQL templates once and call them by name from HQL and criteria paths:

```js
this.ormSettings.sqlFunctions = {
    nameLen : { sql : "char_length(?1)", returns : "integer" }
};

ormExecuteQuery( "from User u where nameLen( u.lastName ) > 10" );
```

See [Named SQL Functions](../getting-started/configuration/README.md#named-sql-functions).

### Default Sort Order

`defaultSort="lastName, firstName desc"` on an entity sets the order `entityLoad()` and `entityCriteria()` use when you don't give one. See [Default sort order](../modeling/entities.md#default-sort-order).

## Entities as Structs

`entityToStruct()` turns entities into structs for APIs and views, compatible with mementifier's `this.memento` (includes, excludes, `neverInclude`, mappers, defaults and profiles). Dates come out as ISO 8601 strings, and your own getters are honored.

```js
return entityToStruct( user, { includes : "roles.name" } );
```

`entityLoadAsStruct()` and criteria `asStruct()` build the same structs with projection queries, without loading entities at all. See [Entities as Structs](../usage/structs.md).

## Modeling

| Feature                 | Shape                                                                                                                         | Learn more                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Soft delete             | `class softDelete="true"`: `entityDelete()` marks the row deleted and every load skips it. Also `"active"` and `"timestamp"`. | [Soft delete](../modeling/entities.md#soft-delete)                                                          |
| Automatic timestamps    | `property name="createdDate" autoTimestamp="create";` and `autoTimestamp="update"`.                                           | [Automatic Timestamps](../modeling/properties.md#automatic-timestamps)                                      |
| Entity `where`          | `class where="is_active = 1"` restricts every load and query of the entity. It was silently ignored before.                   | [Filtering rows](../modeling/entities.md#filtering-rows-with-where)                                         |
| Unique keys and indexes | `uniquekey` and `index` property annotations create their constraints and indexes, including multi-column ones.               | [Properties](../modeling/properties.md)                                                                     |
| `useDBForMapping`       | Adobe ColdFusion compatibility: untyped properties and missing ids are read from the existing tables at startup.              | [Using the Database for Mapping](../getting-started/configuration/README.md#using-the-database-for-mapping) |

## Working with Entities

| Feature                | Shape                                                                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Load or create         | `entityLoadOrNew()`, `entityLoadOrSave()`                                                                                                                                               |
| Load or fail           | `entityLoadOrFail()`, `entityLoadByPKOrFail()` raise `orm.notFound`                                                                                                                     |
| Load many by id        | `entityLoadByPK( "User", [ 3, 1, 99 ] )` returns `[ user3, user1, null ]` from one query                                                                                                |
| Save and delete arrays | `entitySave( [ a, b ], { flush : true } )`, `entityDelete( list, { flush : true } )`                                                                                                    |
| References             | `entityGetReference( "User", 1 )` gives a reference without a `SELECT`                                                                                                                  |
| Evict                  | `entityEvict( entityOrArray )` removes entities from the session                                                                                                                        |
| Pessimistic locking    | `entityLock()`, `entityLoadByPK( name, id, { lock : "write" } )`, criteria `lock()`                                                                                                     |
| Read-only loads        | `ormReadOnly( closure )`, `entityLoadReadOnly()`, `{ readOnly : true }`                                                                                                                 |
| Inspection             | `entityGetName()`, `entityGetId()`, `entityGetMetadata()`, `entityGetDatasource()`, `entityIsDirty()`, `entityGetDirtyProperties()`, `ormIsSessionDirty()`, `ormGetSessionStatistics()` |

See [Working with Entities](../usage/working-with-entities.md) for the whole tour.

## Events

* **Veto**: a `preInsert`, `preUpdate` or `preDelete` handler that returns `false` cancels the operation.
* **`postNew`**: fired by `entityNew()` on the entity and the global event handler.
* **`postCommit( entity, action )`**: fired once a write is committed, never for a rolled-back write. The place to send emails or clear caches.

See [Events](../usage/events.md).

## Errors and Diagnostics

Every error bx-orm raises is now an `orm.*` typed exception with a message in BoxLang terms, a fix in `detail`, and "Did you mean" suggestions for misspelled entity and property names:

```js
try {
    entityLoad( "Usr" );
} catch ( "orm.entity.notFound" e ) {
    // There is no entity named [Usr]. Did you mean [User]?
}
```

Startup checks catch duplicate entity names and unknown `ormtype` values, and `ormDiagnostics()` reports the ORM's state for the current application. See [Errors and Diagnostics](../usage/errors-and-diagnostics.md).

## Fixes

2.0.0 also fixes a long list of 1.x issues, among them optimistic-locking `version` columns, `text` columns mapping to `TEXT`, `binary` properties, inverse one-to-many without `fkcolumn`, millisecond date precision, `ormFlush( datasource )`, and the `cacheable`, `cacheName` and `timeout` query options. See the [2.x release notes](2x.md) for the complete list.

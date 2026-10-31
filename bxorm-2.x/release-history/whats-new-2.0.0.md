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
* Mappings use Hibernate's modern `mapping.xml` format and are handed to Hibernate in memory. `savemapping : true` writes them beside each entity for debugging. Each file is named after the entity's source file: `User.bx` gives `User.orm.xml`.
* Legacy dialect names such as `MySQL57` or `Oracle10g`, and Hibernate 5 dialect classes such as `org.hibernate.dialect.MySQL5InnoDBDialect`, still work: they map to the current dialect with a one-time warning. See [Dialects](../getting-started/configuration/README.md#dialects).

### Boot Cache

Applications can now skip entity discovery, parsing and code generation at startup. On a 250-entity model, this cuts the boot time about in half. `ormManifest : "auto"` writes the resolved model and the generated classes to a `.bxorm/` folder, and `ormManifest : "trust"` boots straight from it in production. In `auto` mode, bx-orm also watches your entity files and reloads the ORM on the next request after you edit one.

```js
this.ormSettings = {
    entityPaths : [ "models" ],
    ormManifest : "auto" // "trust" in production
};
```

The new [`bxorm` CLI](../reference/cli-tools.md#bxorm-boot-cache-cli) builds the cache without starting your application (`boxlang module:orm generate`, for Docker and CI builds), and inspects, validates and clears it. See [Boot Cache](../getting-started/performance.md#boot-cache).

* `ormManifestLocation` moves the `.bxorm/` folder. A relative path resolves against the application root.
* Several applications can share one `.bxorm/` folder. Each application's files carry its name (`manifest-{app}.json`), and the CLI picks one with `--app=<name>`.

### Faster Boot

Startup also does less work, without any setting:

* Generated ids (`native`, `identity`, `increment`, `uuid`, `sequence` and the like) tell Hibernate that a `null` id means "not saved yet". Hibernate no longer creates a throwaway instance of every entity at startup.
* The new `unsavedValue` id annotation sets the value that marks a new entity, for example `unsavedValue="0"` on an assigned numeric id. See [Unsaved Value](../modeling/identifiers.md#unsaved-value).
* The per-entity mappings are joined in memory, and apps with more than 20 entities add the static entity methods in parallel.

See [Performance](../getting-started/performance.md#measured-boot-times) for measured boot times.

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

### Streaming and Unique Results

* `asStream : true` on `ormExecuteQuery()` and `entityLoad()` returns a Java `Stream` that reads rows as you consume it, instead of an array. See [Streaming Results](../usage/querying.md#streaming-results).
* `unique` is now strict: more than one match raises `orm.query.nonUnique`. `uniqueFirst : true` takes the first row of a multi-row result, as 1.x did.
* Criteria `paginate()` includes `offset` (the rows skipped before the page) in its `pagination` struct.

### Default Sort Order

`defaultSort="lastName, firstName desc"` on an entity sets the order `entityLoad()` and `entityCriteria()` use when you don't give one. See [Default sort order](../modeling/entities.md#default-sort-order).

## Static Entity Methods

Every entity class gets static methods that call the matching BIF: `User::get( 1 )`, `User::findWhere( { email : email } )`, `User::count()`, `User::list()` and more. Instances reach them too (`user.count()`). They are on by default; set `staticMethods : false` in `ormSettings` to turn them off. See [Static Entity Methods](../usage/static-methods.md).

```js
var user  = User::getOrFail( id );
var total = User::count( { active : true } );
```

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

## Observability

Tools can listen to ORM activity without reaching into Hibernate:

* `onORMQuery` is announced after each SQL statement, with the SQL, timing, row count, datasource and entity. `announceQueryParams : true` adds the bound values.
* `onORMFlush` reports insert, update and delete counts per flush, and `onORMException` reports failures.
* `generateStatistics : true` turns on Hibernate statistics.
* `ORMPreConfigLoad` and `ORMPostConfigLoad` are announced before and after bx-orm reads an application's `ormSettings`.

See [Observability](../usage/observability.md).

## Second-Level Cache on BoxCache

The second-level cache now runs on BoxLang's own BoxCache. Every cache region is a BoxLang cache: tune all of them or each
one with `cacheConfig`, keep using an old `ehcache.xml` (it is read and mapped), put a region on a cache you define in
`boxlang.json` (any BoxLang provider, including distributed ones), and cache collections with `cacheUse`:

```js
this.ormSettings = {
    secondaryCacheEnabled : true,
    cacheConfig           : { maxObjects : 1000, regions : { "countries" : { defaultTimeout : 0 } } }
};
```

See [Caching](../usage/caching.md).

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

2.0.0 also fixes a long list of 1.x issues, among them optimistic-locking `version` columns, `text` columns mapping to `TEXT`, `binary` properties, inverse one-to-many without `fkcolumn`, millisecond date precision, `ormFlush( datasource )`, the `cacheable`, `cacheName` and `timeout` query options, and the `sqlScript` setting. `native` ids use a sequence again on
PostgreSQL and Oracle, as in 1.x. See the [2.x release notes](2x.md) for the complete list.

---
description: Step by step guide to upgrade a bx-orm 1.x application to 2.0.0
icon: arrow-up-right-dots
---

# Upgrading to 2.0.0

bx-orm 2.0.0 swaps the engine underneath (Hibernate 5.6 to 7.4) but keeps the BoxLang API: `entityNew()`, `entitySave()`, `entityLoad()`, `ormExecuteQuery()` and friends are called the same way. Most applications upgrade by bumping the version and checking the items below.

{% hint style="info" %}
Coming from Adobe ColdFusion or Lucee instead of bx-orm 1.x? Start with the [ACF/Lucee Migration Guide](../getting-started/migration-from-cfml.md), then come back here.
{% endhint %}

## Requirements

* **BoxLang 1.18.0 or later.** 2.0.0 depends on runtime features added in that release.
* **Hibernate ORM 7.4.8** is bundled. Nothing to install.

```bash
box install bx-orm@2
```

Until 2.0.0 is final, `bx-orm@2` finds nothing to install: ask for a pre-release such as `box install bx-orm@2.0.0-beta.1` instead. See [Installation](../getting-started/installation.md).

## Upgrade Checklist

Work through these in order. Each item says what changed and what to do.

### 1. Turn On `eventHandling` If You Use Events

1.x fired ORM events even when `eventHandling` was `false` (the default). 2.0.0 honors the setting, like Adobe ColdFusion and Lucee: with `eventHandling=false` no event fires. That covers entity methods such as `preInsert()`, the global `eventHandler` and `postNew`.

```js
this.ormSettings = {
    eventHandling : true,
    eventHandler  : "models.ORMEventHandler"
};
```

**Do this if** your entities or a global event handler have event methods. See [Events](../usage/events.md).

### 2. Catch `orm.*` Errors Instead of Hibernate Classes

ORM errors are now `orm.*` typed exceptions instead of raw Hibernate or JPA exceptions. The type tells you what went wrong (`orm.query.syntax`, `orm.constraint.unique`, `orm.stale`, ...), the message speaks in your entity names, and `detail` says how to fix it.

```js
// Before
catch ( "org.hibernate.StaleObjectStateException" e ) { ... }

// After
catch ( "orm.stale" e ) { ... }
catch ( "orm" e ) { ... } // any ORM error
```

**Do this if** you catch Hibernate or JPA exception class names, or inspect `e.type`. See the [error catalog](../usage/errors-and-diagnostics.md#error-catalog).

### 3. Check `unique` Queries

`unique=true` on `ormExecuteQuery()` and on the filter form of `entityLoad()` is now strict: when more than one row matches, you get an `orm.query.nonUnique` error instead of the first row.

```js
// Keep the 1.x behavior: take the first match
var user = entityLoad( "User", { lastName : "Smith" }, true, { uniqueFirst : true } );
```

`unique : true` given inside the options struct is now honored too, so a query such as `ormExecuteQuery( hql, params, { unique : true } )` returns one object instead of an array.

**Do this if** a `unique` query can match several rows. Narrow the query, or pass `uniqueFirst : true`. Also check calls that pass `unique` in the options struct and expect an array.

### 4. `entityLoadByPK()` Takes Options

The third argument of `entityLoadByPK()` is now an options struct (`lock`, `timeout`, `skipLocked`, `readOnly`). A boolean third argument (Lucee's `unique`) is still accepted and ignored, so existing calls keep working.

### 5. Replace Pre-Generated `.hbm.xml` Files

2.0.0 writes Hibernate's modern mapping format. `savemapping : true` now writes an `.orm.xml` file beside each entity, named after the entity's source file (`User.bx` gives `User.orm.xml`), and `generateMappings : false` (together with `savemapping : true`) reads those `.orm.xml` files from beside each entity. Old `.hbm.xml` files are not read.

**Do this if** you run with `generateMappings : false` (or `autoGenMap : false`):

1. Delete the old `.hbm.xml` files.
2. Boot once with `generateMappings : true` and `savemapping : true` to write the new `.orm.xml` files, or use the [GenerateMappings CLI](../reference/cli-tools.md#generatemappings).
3. Commit them and set `generateMappings : false`, keeping `savemapping : true` so bx-orm looks for the files beside the entities.

Or skip the files and use the [boot cache](../getting-started/performance.md#boot-cache) (`ormManifest : "trust"`), which also skips parsing and code generation.

### 6. Review Code That Mixes ORM and Plain SQL in a Transaction

Inside `transaction{}`, the ORM now uses the transaction's own JDBC connection instead of running a separate Hibernate transaction. ORM writes and `queryExecute()` now commit and roll back together, and a query inside the transaction sees the ORM writes made earlier in it.

This is what most code expected already. **Check it if** you relied on ORM writes being committed separately from SQL in the same `transaction{}`. See [Transactions](../usage/transactions.md).

### 7. Criteria `asStruct()` Dates Are ISO 8601 Strings

Criteria `asStruct()` returns date values as ISO 8601 strings (`2024-03-05T10:20:30Z`), like `entityToStruct()` and `entityLoadAsStruct()`. **Check it if** you read dates from `asStruct()` rows as date objects.

### 8. `useDBForMapping` Now Does Something

In 1.x `useDBForMapping` did nothing. In 2.0.0, `useDBForMapping : true` makes the ORM look at your database tables at startup (JDBC metadata, not mapping files) to find the type of properties without an `ormtype` and the id of entities without one, as Adobe ColdFusion does. It is off by default, which matches 1.x: untyped properties map as `string`, and an entity without an id uses its `id` property. **Check it if** your settings set it to `true`: remove it, or keep it on purpose. See [Using the Database for Mapping](../getting-started/configuration/README.md#using-the-database-for-mapping).

### 9. Entity `where` Is Now Applied

The entity-level `where` annotation (`class persistent="true" where="..."`) was ignored in 1.x. It now restricts every load and query of the entity, including `entityLoadByPK()`. **Check it if** an entity declares `where`: rows that don't match it no longer load.

### 10. Legacy Dialect Names Log a Warning

Version-specific dialect names such as `MySQL57`, `Oracle10g` or `DerbyTenSeven` still work: bx-orm maps each to the current Hibernate 7 dialect and logs a one-time deprecation warning. Hibernate 7 detects the database version itself, so you can leave `dialect` unset or use the plain database name. Hibernate 5 dialect class names, such as `org.hibernate.dialect.MySQL5InnoDBDialect`, are mapped the same way, with a one-time warning. Dialects for a few discontinued databases (FrontBase, McKoi, Pointbase, Progress, JDataStore, Interbase) were removed by Hibernate. See [Dialects](../getting-started/configuration/README.md#dialects).

### 11. Test Your HQL and Raw Hibernate Code

HQL is parsed by Hibernate 7's query engine, which is stricter than Hibernate 5's. Run your queries: a query that no longer parses raises `orm.query.syntax` with the line, column and token. Named parameters that a query never uses are now logged as a warning.

If you call the Hibernate API directly through `ormGetSession()` or `ormGetSessionFactory()`, review that code against the [Hibernate 7 migration guides](https://hibernate.org/orm/releases/). Those two functions return wrappers that accept BoxLang entity names and instances. A call on an entity the session does not hold still throws `org.hibernate.TransientObjectException`, as Hibernate 5 did (Hibernate 7 itself throws `IllegalArgumentException`), so code such as ColdBox's object populator keeps detecting new entities.

### 12. `proxyLazyLoading` and `lazy="extra"` No Longer Change Anything

`proxyLazyLoading` is accepted but has no effect: every lazy to-one relationship is a lazy proxy. `lazy="extra"` is accepted and works like `lazy="true"`, because Hibernate 7 has no extra-lazy collections. **Check it if** you relied on `size()` of an `extra` collection not loading the collection. See [Lazy Loading](../modeling/relationships.md#lazy-loading).

### 13. `entityNew()` Skips Keys That Are Not Properties

`entityNew( "User", data )` only sets keys that match a declared property of the entity (or a parent class). Other keys
are skipped without an error; 1.x copied every key onto the entity. A third `ignoreExtras` argument is accepted and
ignored. **Check it if** you passed extra keys to `entityNew()` and read them back from the entity.

### 14. `native` Ids Use a Sequence on PostgreSQL and Oracle

`generator="native"` uses the database's own strategy, as bx-orm 1.x did: an identity column on MySQL, MariaDB, SQL Server
and Derby, and the shared `hibernate_sequence` (increment 1) on PostgreSQL and Oracle, or the sequence named by the
`sequence` attribute. Databases created by bx-orm 1.x need no change. **Check it if** you created PostgreSQL or Oracle
tables with an earlier 2.0 pre-release, where `native` meant `identity`: switch those ids to `generator="identity"`, or
create `hibernate_sequence` starting above the highest existing id.

### 15. The Second-Level Cache Is BoxCache

Every cache region is now a BoxLang cache, and `cacheConfig` sets its BoxCache properties. An `ehcache.xml` from Adobe
ColdFusion or Lucee is read and mapped to BoxCache properties; EHCache itself is not used. **Check it if** you tuned the
cache with EHCache-specific settings (disk stores, clustering): those are ignored. See [Caching](../usage/caching.md).

## Things You Don't Need to Change

* BIF names, arguments and return values, apart from the items above.
* Entity annotations and property annotations.
* ORM settings in `Application.bx`. All 1.x settings are still read. `proxyLazyLoading` is ignored.

## After Upgrading

* Call [`ormDiagnostics()`](../reference/built-in-functions/ormdiagnostics.md) to check the ORM started cleanly: it lists the entities per datasource, startup warnings and key settings.
* Read [What's New in 2.0.0](whats-new-2.0.0.md) for the features you can adopt next.

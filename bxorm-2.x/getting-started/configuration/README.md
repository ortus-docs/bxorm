---
description: "Every ORM setting for Application.bx: datasource, entity paths, dialects, SQL functions and more"
icon: gear
---

# Configuration

## Application.bx

The ORM can be configured by a struct of settings set in `this.ormSettings` in your main `Application.bx`:

```js
class{
    this.ORMenabled = true;
    this.ormSettings = {
        // << Here Be ORM Configuration! 🤪 >>
    };
}
```

## ORM Settings

The full list of available properties you can use to configure the ORM are the following:

| Setting Name            | Default                  | Description                                                                                                                                                                                                                                                                                                                          |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `announceQueryParams`   | `false`                  | Includes bound parameter values in the `onORMQuery` event. Values can be sensitive, so they are never announced unless you ask. See [Observability](../../usage/observability.md).                                                                                                                                                   |
| `generateMappings`      | `true`                   | Automatically generate entity mappings for persistent classes. When `false`, bx-orm reads pre-generated `.orm.xml` files beside each entity; keep `savemapping : true` so it looks there. Each file is named after the entity's source file: `User.bx` gives `User.orm.xml`.                                                         |
| `autoGenMap`            | `true`                   | Backwards-compatible alias for `generateMappings`. Deprecated.                                                                                                                                                                                                                                                                       |
| `autoManageSession`     | `false`                  | Allows the engine to manage the Hibernate session. Use `transaction` blocks to demarcate transaction regions. See [Transactions](../../usage/transactions.md).                                                                                                                                                                       |
| `cacheConfig`           | *empty*                  | Secondary cache configuration. Used only when `secondaryCacheEnabled=true`. A struct holds the properties of the BoxLang caches that back the cache regions, when `cacheProvider` names a BoxLang cache provider. A file path is passed to the cache provider, but the file is not read. See [Secondary Cache](secondary-caches.md). |
| `cacheProvider`         | `"BoxCacheProvider"`     | Secondary cache provider: `BoxCacheProvider` (the default), the legacy aliases `ConcurrentHashMap` or `HashTable` (same as the default), or the name of a registered BoxLang cache provider. Resolved on first cache access. See [Secondary Cache](secondary-caches.md).                                                             |
| `catalog`               |                          | Default database catalog.                                                                                                                                                                                                                                                                                                            |
| `entityPaths`           | *empty*                  | Directory or array of directories searched for persistent classes. Specify this to avoid a startup performance cost.                                                                                                                                                                                                                 |
| `datasource`            | `application.datasource` | Datasource used by the ORM. Defaults to `this.datasource` in `Application.bx` when not specified.                                                                                                                                                                                                                                    |
| `defaultBatchSize`      | `16`                     | Default batch size Hibernate uses when fetching lazy collections or proxies.                                                                                                                                                                                                                                                         |
| `dbcreate`              | `none`                   | Schema strategy: `update` creates incremental updates, `dropcreate` recreates the database on reload, and `none` leaves the database unchanged. Hibernate `hbm2ddl.auto` values are accepted too, such as `create`, `create-drop`, `create-only`, `drop`, `validate` and `truncate`.                                                 |
| `dialect`               | `autodiscover`           | Database dialect. Hibernate introspects the datasource by default, or you can provide a fully qualified Java class name. See [Dialects](#dialects).                                                                                                                                                                                  |
| `eventHandling`         | `false`                  | Must be `true` for any ORM event to fire: entity event methods, the global `eventHandler` and `postNew`. See [Events](../../usage/events.md).                                                                                                                                                                                        |
| `eventHandler`          |                          | Path to the `.bx` class that manages global ORM events.                                                                                                                                                                                                                                                                              |
| `enableThreadedMapping` | `true`                   | With more than 20 entities, parses entity metadata and adds the static entity methods on parallel threads at startup. Set to `false` to force single-threaded startup.                                                                                                                                                               |
| `flushAtRequestEnd`     | `false`                  | Automatically flushes the ORM at the end of a request. Persistence should generally be done through `transaction` blocks.                                                                                                                                                                                                            |
| `generateStatistics`    | `false`                  | Collects Hibernate statistics at startup, for `ORMService.getStatistics()`. Collection has a small cost. See [Observability](../../usage/observability.md).                                                                                                                                                                          |
| `hibernateProperties`   | `empty`                  | Flat struct of raw Hibernate property name/value pairs applied directly to Hibernate configuration. Applied last, so it overrides ORM defaults and `ormconfig`. See [Custom Hibernate Config](custom-hibernate-config.md).                                                                                                           |
| `logSQL`                | `false`                  | Logs SQL queries to the console.                                                                                                                                                                                                                                                                                                     |
| `namingstrategy`        | `default`                | Naming convention used for table and column names. See [Naming Strategies](naming-strategies.md).                                                                                                                                                                                                                                    |
| `ormconfig`             |                          | Path to a flat `hibernate.properties` file. Applied before `hibernateProperties`; matching keys in `hibernateProperties` take precedence. The XML `hibernate.cfg.xml` format is not supported. See [Custom Hibernate Config](custom-hibernate-config.md).                                                                            |
| `proxyLazyLoading`      | `false`                  | Accepted for compatibility, but has no effect in bx-orm 2.0. Every lazy to-one relationship is loaded through a lazy proxy. See [Relationships](../../modeling/relationships.md).                                                                                                                                                    |
| `quoteIdentifiers`      | `false`                  | Quotes generated table and column identifiers in the Hibernate mapping.                                                                                                                                                                                                                                                              |
| `ormManifest`           | `off`                    | Boot cache mode: `off`, `auto` (write the `.bxorm/` boot cache on every boot and reload on entity changes) or `trust` (boot straight from the cache). See [Boot Cache](../performance.md#boot-cache).                                                                                                                                |
| `ormManifestLocation`   | *empty*                  | Parent folder for the `.bxorm/` boot cache. Blank uses the application root; a relative path resolves against it. See [Boot Cache](../performance.md#boot-cache).                                                                                                                                                                    |
| `savemapping`           | `false`                  | Writes each generated Hibernate mapping beside the entity, for debugging. The file is named after the entity's source file: `User.bx` gives `User.orm.xml`.                                                                                                                                                                          |
| `schema`                |                          | Default database schema.                                                                                                                                                                                                                                                                                                             |
| `secondaryCacheEnabled` | `false`                  | Enables the secondary cache. See [Caching](../../usage/caching.md).                                                                                                                                                                                                                                                                  |
| `ignoreParseErrors`     | `false`                  | Ignores classes with compile-time errors when `true`; otherwise throws exceptions.                                                                                                                                                                                                                                                   |
| `sqlScript`             |                          | Path to a SQL script executed after ORM initialization.                                                                                                                                                                                                                                                                              |
| `staticMethods`         | `true`                   | Adds static helper methods such as `User::get( 1 )` and `User::findWhere( filter )` to every entity class. Set `false` to leave entity classes untouched. See [Static Entity Methods](../../usage/static-methods.md).                                                                                                                |
| `sqlFunctions`          | *empty struct*           | Named SQL functions that HQL and `entityCriteria()` paths can call. See [Named SQL Functions](#named-sql-functions).                                                                                                                                                                                                                 |
| `useDBForMapping`       | `false`                  | Adobe ColdFusion compatibility: fill in untyped property types and missing ids from the existing tables at startup. Foreign keys are not inferred. See [Using the Database for Mapping](#using-the-database-for-mapping).                                                                                                            |

## Named SQL Functions

`sqlFunctions` registers SQL templates with Hibernate under a name, so [HQL](../../usage/querying.md#named-sql-functions) and [criteria paths](../../usage/criteria.md#functions-in-paths) can call them like built-in functions:

```js
this.ormSettings = {
    sqlFunctions : {
        nameLen : { sql : "char_length(?1)", returns : "integer" },
        shout   : "upper(?1)"
    }
};
```

```js
ormExecuteQuery( "select nameLen( m.name ) from Manufacturer m where m.id = 1", [], true ); // 18
entityCriteria( "Manufacturer" ).isEq( "nameLen(name)", 18 ).count();
entityCriteria( "Manufacturer" ).pluck( "shout(name)" );
```

* The value is the SQL template, or a struct with `sql` (the template) and `returns` (the result type).
* `?1`, `?2`, ... `?n` are the function's arguments.
* `returns` is one of `string`, `text`, `integer`, `int`, `long`, `bigint`, `double`, `float`, `decimal`, `numeric`, `boolean`, `date`, `time`, `timestamp` or `datetime`. Leave it out to let Hibernate infer the type.
* The SQL is passed to the database as written, so it must be valid for your database.

A name that is not letters, digits and underscores (starting with a letter or underscore), a function without SQL, an unknown `returns` type, or a `sqlFunctions` value that is not a struct stops the ORM from starting with an `orm.config` error.

[ormGetSQLFunctions()](../../reference/built-in-functions/ormgetsqlfunctions.md) returns the registered functions, and the `settings` of [ormDiagnostics()](../../reference/built-in-functions/ormdiagnostics.md) list their names.

## Using the Database for Mapping

`useDBForMapping` is for Adobe ColdFusion applications whose entities rely on the database to complete their mapping. It is `false` by default. With `useDBForMapping : true`, at startup the ORM reads each entity's existing table (JDBC metadata) and fills in:

* The `ormtype` of every plain property that declares no `ormtype`, `sqltype` or BoxLang `type`, from its column's JDBC type.
* For a root entity with no id property: `fieldtype="id"` on the properties mapped to the table's primary key columns.

| Column type                                 | `ormtype`     |
| ------------------------------------------- | ------------- |
| `varchar`, `char` (and `nvarchar`, `nchar`) | `string`      |
| `clob`, `longvarchar`                       | `text`        |
| `integer`                                   | `integer`     |
| `smallint`, `tinyint`                       | `short`       |
| `bigint`                                    | `long`        |
| `decimal`, `numeric`                        | `big_decimal` |
| `real`, `float`                             | `float`       |
| `double`                                    | `double`      |
| `bit`, `boolean`                            | `boolean`     |
| `date`, `timestamp`                         | `timestamp`   |
| `time`                                      | `time`        |
| `binary`, `varbinary`, `blob`               | `binary`      |

Other column types are left alone. Foreign keys are not inferred: declare relationships with their `fkcolumn`. A table that does not exist yet (for example, one `dbcreate` will create) is skipped, and a table whose metadata cannot be read is logged as a warning.

## Dialects

By using the `ormsettings.dialect` you can tell Hibernate which specific database dialect to use for building queries.  By default, Hibernate tries to inspect the datasource and define it for you.  95% of the time, this works.  However, if you want a specific one, then you can use the following names or a fully qualified Java class name.

> **Hibernate 7 note:** Hibernate 7 replaced the version-specific dialects (for example `MySQL5`, `Oracle10g`, `DerbyTenSeven`) with a single, version-detecting dialect per database. The legacy names in the table below are still accepted for backwards compatibility: bx-orm maps each to the current dialect for that database and logs a one-time deprecation warning, so you no longer need to pick a version. Databases such as SQLite, Derby, Firebird, Informix, Ingres, and CUBRID now come from the `hibernate-community-dialects` artifact, which bx-orm bundles. A few dialects for long-dead databases (FrontBase, McKoi, Pointbase, Progress, JDataStore, Interbase) were removed by Hibernate and are no longer supported. Prefer leaving `dialect` unset (auto-discovery) or using the plain database name.

Hibernate 5 dialect class names, such as `org.hibernate.dialect.MySQL5InnoDBDialect`, are mapped the same way. bx-orm logs a one-time warning for each.

| Dialect (short name)   | Database                                                    |
| ---------------------- | ----------------------------------------------------------- |
| `Cache71`              | InterSystems Caché.                                         |
| `CockroachDB192`       | CockroachDB.                                                |
| `CockroachDB201`       | CockroachDB.                                                |
| `CUBRID`               | CUBRID.                                                     |
| `DB2`                  | DB2.                                                        |
| `DB297`                | DB2.                                                        |
| `DB2390`               | DB2 for z/OS, also known as DB2/390.                        |
| `DB2400`               | DB2 for i, also known as DB2/400.                           |
| `DB2400V7R3`           | DB2 for i, also known as DB2/400.                           |
| `DerbyTenFive`         | Apache Derby.                                               |
| `DerbyTenSix`          | Apache Derby.                                               |
| `DerbyTenSeven`        | Apache Derby.                                               |
| `Firebird`             | Firebird.                                                   |
| `H2`                   | H2.                                                         |
| `HANACloudColumnStore` | SAP HANA (Cloud column store).                              |
| `HANAColumnStore`      | SAP HANA (column store).                                    |
| `HANARowStore`         | SAP HANA (row store).                                       |
| `HSQL`                 | HSQL (HyperSQL).                                            |
| `Informix`             | Informix.                                                   |
| `Ingres`               | Ingres.                                                     |
| `Ingres9`              | Ingres.                                                     |
| `Ingres10`             | Ingres.                                                     |
| `MimerSQL`             | Mimer SQL.                                                  |
| `MySQL5`               | MySQL.                                                      |
| `MySQL5InnoDB`         | MySQL.                                                      |
| `MySQL57InnoDB`        | MySQL.                                                      |
| `MariaDB`              | MariaDB.                                                    |
| `MariaDB53`            | MariaDB.                                                    |
| `Oracle8i`             | Oracle.                                                     |
| `Oracle9i`             | Oracle.                                                     |
| `Oracle10g`            | Oracle.                                                     |
| `PostgresPlus`         | Postgres Plus (EDB).                                        |
| `PostgreSQL81`         | PostgreSQL.                                                 |
| `PostgreSQL82`         | PostgreSQL.                                                 |
| `PostgreSQL9`          | PostgreSQL.                                                 |
| `SAPDB`                | SAP DB / MaxDB.                                             |
| `SQLite`               | SQLite. Detected automatically. Needs a SQLite JDBC driver. |
| `SQLServer`            | Microsoft SQL Server.                                       |
| `SQLServer2005`        | Microsoft SQL Server.                                       |
| `SQLServer2008`        | Microsoft SQL Server.                                       |
| `Sybase11`             | Sybase Adaptive Server Enterprise.                          |
| `SybaseAnywhere`       | SAP SQL Anywhere (Sybase Anywhere).                         |
| `SybaseASE15`          | Sybase Adaptive Server Enterprise.                          |
| `SybaseASE157`         | Sybase Adaptive Server Enterprise.                          |
| `Teradata`             | Teradata.                                                   |
| `TimesTen`             | Oracle TimesTen.                                            |

{% hint style="info" %}
See the Hibernate Dialect Section: [Hibernate\_User\_Guide.html#database-dialect](https://docs.hibernate.org/orm/7.4/userguide/html_single/Hibernate_User_Guide.html#database-dialect)
{% endhint %}

### SQLite

bx-orm automatically detects SQLite from the JDBC connection, so you do not need to configure `dialect: "SQLite"` explicitly.

```js
this.datasources = {
    "myDB" : {
        "connectionString" : "jdbc:sqlite:/path/to/my.db"
    }
};

this.ormSettings = {
	datasource : "myDB"
};
```

{% hint style="warning" %}
You'll need a SQLite JDBC driver (e.g. `org.xerial:sqlite-jdbc`) on your application's classpath, as bx-orm does not bundle one.
{% endhint %}

### PostgreSQL

With an explicit PostgreSQL `dialect`, bx-orm tells Hibernate to read generated keys from the JDBC driver, as auto-detection does. This keeps `generator="identity"` working on tables whose names are reserved words, such as `comment` or `user`. To override it, set `hibernate.jdbc.use_get_generated_keys` in `hibernateProperties`:

```js
this.ormSettings = {
    dialect             : "PostgreSQL",
    hibernateProperties : { "hibernate.jdbc.use_get_generated_keys" : false }
};
```

## Sample Config

Here is an example configuration from the popular ContentBox Modular CMS application

```js
// THE CONTENTBOX DATASOURCE NAME
this.datasource  = "contentbox";
// ORM SETTINGS
this.ormEnabled  = true;
this.ormSettings = {
	// An array of paths where your entity classes are located
	entityPaths           : [
		// If you create your own app entities
		"models",
		// The ContentBox Core Entities
		"modules/contentbox/models",
		// Custom Module Entities
		"modules_app",
		// Custom Module User Entities
		"modules/contentbox/modules_user"
	],
	// THE DIALECT OF YOUR DATABASE OR LET HIBERNATE FIGURE IT OUT, UP TO YOU TO CONFIGURE.
	dialect              : request.$systemHelper.getSystemSetting( "ORM_DIALECT", "" ),
    // The database creation strategy (e.g., "update", "create", "dropcreate")
	dbcreate             : "update",
    // Enable or disable the secondary cache
	secondarycacheenabled: request.$systemHelper.getSystemSetting( "ORM_SECONDARY_CACHE", false ),
    // The cache provider to use for the secondary cache
	cacheprovider        : "BoxCacheProvider",
	// Whether to log SQL statements
    logSQL               : request.$systemHelper.getSystemSetting( "ORM_LOGSQL", false ),
    // The SQL script to execute during ORM initialization
	sqlScript            : request.$systemHelper.getSystemSetting( "ORM_SQL_SCRIPT", "" ),
    // Whether to flush the session at the end of each request
	flushAtRequestEnd    : false,
    // Whether to automatically manage the session
	autoManageSession    : false,
    // Whether to enable event handling
	eventHandling        : true,
    // The event handler class to use
	eventHandler         : "cborm.models.BxEventHandler",
    // Whether to ignore parse errors
	ignoreParseErrors     : true,
	// TURN ON FOR Debugging if ORM mappings are not working.
	savemapping          : false
}
```

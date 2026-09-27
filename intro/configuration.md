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

|Setting Name|Default|Description|
|---|---|---|
|`generateMappings`|`true`|Automatically generate entity mappings for persistent classes. When `false`, bx-orm reads pre-generated `{entityName}.orm.xml` files beside each entity; keep `savemapping : true` so it looks there.|
|`autoGenMap`|`true`|Backwards-compatible alias for `generateMappings`. Deprecated.|
|`autoManageSession`|`false`|Allows the engine to manage the Hibernate session. Use `transaction` blocks to demarcate transaction regions. See [Transactions](../usage/transactions.md).|
|`cacheConfig`|*empty*|Location of the secondary cache provider configuration file. Used only when `secondaryCacheEnabled=true`. See [Secondary Cache](configuration/secondary-caches.md).|
|`cacheConfigProperties`|*empty struct*|Struct alternative to `cacheConfig` for defining secondary cache region settings. See [Secondary Cache](configuration/secondary-caches.md).|
|`cacheProvider`|`"BoxCacheProvider"`|Secondary cache provider. This can be a BoxLang cache provider name, a legacy alias such as `ehcache`, `ConcurrentHashMap`, or `HashTable`, or a fully qualified JCache provider class. See [Secondary Cache](configuration/secondary-caches.md).|
|`catalog`||Default database catalog.|
|`entityPaths`|*empty*|Directory or array of directories searched for persistent classes. Specify this to avoid a startup performance cost.|
|`datasource`|`application.datasource`|Datasource used by the ORM. Defaults to `this.datasource` in `Application.bx` when not specified.|
|`defaultBatchSize`|`16`|Default batch size Hibernate uses when fetching lazy collections or proxies.|
|`dbcreate`|`none`|Schema strategy: `update` creates incremental updates, `dropcreate` recreates the database on reload, and `none` leaves the database unchanged.|
|`dialect`|`autodiscover`|Database dialect. Hibernate introspects the datasource by default, or you can provide a fully qualified Java class name. See [Dialects](#dialects).|
|`eventHandling`|`false`|Must be `true` for any ORM event to fire: entity event methods, the global `eventHandler` and `postNew`. See [Events](../usage/events.md).|
|`eventHandler`||Path to the `.bx` class that manages global ORM events.|
|`enableThreadedMapping`|`true`|Runs entity mapping generation across multiple threads at startup. Set to `false` to force single-threaded generation.|
|`flushAtRequestEnd`|`false`|Automatically flushes the ORM at the end of a request. Persistence should generally be done through `transaction` blocks.|
|`hibernateProperties`|`empty`|Flat struct of raw Hibernate property name/value pairs applied directly to Hibernate configuration. Applied last, so it overrides ORM defaults and `ormconfig`. See [Custom Hibernate Config](configuration/custom-hibernate-config.md).|
|`logSQL`|`false`|Logs SQL queries to the console.|
|`namingstrategy`|`default`|Naming convention used for table and column names. See [Naming Strategies](./configuration/naming-strategies.md).|
|`ormconfig`||Path to a flat `hibernate.properties` file. Applied before `hibernateProperties`; matching keys in `hibernateProperties` take precedence. The XML `hibernate.cfg.xml` format is not supported. See [Custom Hibernate Config](configuration/custom-hibernate-config.md).|
|`proxyLazyLoading`|`false`|Wraps lazy-loaded relationship properties in a proxy instead of triggering an immediate load. See [Relationships](../modeling/relationships.md).|
|`quoteIdentifiers`|`false`|Quotes generated table and column identifiers in the Hibernate mapping.|
|`ormManifest`|`off`|Boot cache mode: `off`, `auto` (write the `.bxorm/` boot cache on every boot and reload on entity changes) or `trust` (boot straight from the cache). See [Boot Cache](../usage/performance.md#boot-cache).|
|`ormManifestLocation`|*empty*|Parent folder for the `.bxorm/` boot cache. Blank uses the application root; a relative path resolves against it. See [Boot Cache](../usage/performance.md#boot-cache).|
|`savemapping`|`false`|Writes each generated Hibernate mapping as `{entityName}.orm.xml` beside the entity, for debugging.|
|`schema`||Default database schema.|
|`secondaryCacheEnabled`|`false`|Enables the secondary cache. See [Caching](../usage/caching.md).|
|`ignoreParseErrors`|`false`|Ignores classes with compile-time errors when `true`; otherwise throws exceptions.|
|`sqlScript`||Path to a SQL script executed after ORM initialization.|
|`sqlFunctions`|*empty struct*|Named SQL functions that HQL and `entityCriteria()` paths can call. See [Named SQL Functions](#named-sql-functions).|
|`useDBForMapping`|`false`|Adobe ColdFusion compatibility: fill in untyped property types and missing ids from the existing tables at startup. Foreign keys are not inferred. See [Using the Database for Mapping](#using-the-database-for-mapping).|

## Named SQL Functions

`sqlFunctions` registers SQL templates with Hibernate under a name, so [HQL](../usage/querying.md#named-sql-functions) and [criteria paths](../usage/criteria.md#functions-in-paths) can call them like built-in functions:

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

[ormGetSQLFunctions()](../reference/built-in-functions/orm/ORMGetSQLFunctions.md) returns the registered functions, and the `settings` of [ormDiagnostics()](../reference/built-in-functions/orm/ORMDiagnostics.md) list their names.

## Using the Database for Mapping

`useDBForMapping` is for Adobe ColdFusion applications whose entities rely on the database to complete their mapping. It is `false` by default. With `useDBForMapping : true`, at startup the ORM reads each entity's existing table (JDBC metadata) and fills in:

* The `ormtype` of every plain property that declares no `ormtype`, `sqltype` or BoxLang `type`, from its column's JDBC type.
* For a root entity with no id property: `fieldtype="id"` on the properties mapped to the table's primary key columns.

| Column type | `ormtype` |
| --- | --- |
| `varchar`, `char` (and `nvarchar`, `nchar`) | `string` |
| `clob`, `longvarchar` | `text` |
| `integer` | `integer` |
| `smallint`, `tinyint` | `short` |
| `bigint` | `long` |
| `decimal`, `numeric` | `big_decimal` |
| `real`, `float` | `float` |
| `double` | `double` |
| `bit`, `boolean` | `boolean` |
| `date`, `timestamp` | `timestamp` |
| `time` | `time` |
| `binary`, `varbinary`, `blob` | `binary` |

Other column types are left alone. Foreign keys are not inferred: declare relationships with their `fkcolumn`. A table that does not exist yet (for example, one `dbcreate` will create) is skipped, and a table whose metadata cannot be read is logged as a warning.

## Dialects

By using the `ormsettings.dialect` you can tell Hibernate which specific database dialect to use for building queries.  By default, Hibernate tries to inspect the datasource and define it for you.  95% of the time, this works.  However, if you want a specific one, then you can use the following names or a fully qualified Java class name.

> **Hibernate 7 note:** Hibernate 7 replaced the version-specific dialects (for example `MySQL5`, `Oracle10g`, `DerbyTenSeven`) with a single, version-detecting dialect per database. The legacy names in the table below are still accepted for backwards compatibility: bx-orm maps each to the current dialect for that database and logs a one-time deprecation warning, so you no longer need to pick a version. Databases such as SQLite, Derby, Firebird, Informix, Ingres, and CUBRID now come from the `hibernate-community-dialects` artifact, which bx-orm bundles. A few dialects for long-dead databases (FrontBase, McKoi, Pointbase, Progress, JDataStore, Interbase) were removed by Hibernate and are no longer supported. Prefer leaving `dialect` unset (auto-discovery) or using the plain database name.

|Dialect (short name)|Remarks|
|---|---|
|`Cache71`|Support for the Caché database, version 2007.1.|
|`CockroachDB192`|Support for CockroachDB version 19.2.|
|`CockroachDB201`|Support for CockroachDB version 20.1.|
|`CUBRID`|Support for CUBRID version 8.3. May work with later versions.|
|`DB2`|Support for DB2 version 8.2.|
|`DB297`|Support for DB2 version 9.7.|
|`DB2390`|Support for DB2 Universal Database for OS/390, also known as DB2/390.|
|`DB2400`|Support for DB2 Universal Database for iSeries, also known as DB2/400.|
|`DB2400V7R3`|Support for DB2 Universal Database for i, also known as DB2/400, version 7.3.|
|`DerbyTenFive`|Support for Derby version 10.5.|
|`DerbyTenSix`|Support for Derby version 10.6.|
|`DerbyTenSeven`|Support for Derby version 10.7.|
|`Firebird`|Support for Firebird.|
|`FrontBase`|Support for Frontbase.|
|`H2`|Support for H2.|
|`HANACloudColumnStore`|Support for the SAP HANA Cloud column store.|
|`HANAColumnStore`|Support for the SAP HANA column store, version 2.x. May work with version 1.x.|
|`HANARowStore`|Support for the SAP HANA row store, version 2.x. May work with version 1.x.|
|`HSQL`|Support for HSQL (HyperSQL).|
|`Informix`|Support for Informix.|
|`Ingres`|Support for Ingres, version 9.2.|
|`Ingres9`|Support for Ingres, version 9.3. May work with newer versions.|
|`Ingres10`|Support for Ingres, version 10. May work with newer versions.|
|`Interbase`|Support for Interbase.|
|`JDataStore`|Support for JDataStore.|
|`McKoi`|Support for McKoi.|
|`Mimer`|Support for Mimer, version 9.2.1. May work with newer versions.|
|`MySQL5`|Support for MySQL, version 5.x.|
|`MySQL5InnoDB`|Support for MySQL, version 5.x, preferring the InnoDB storage engine.|
|`MySQL57InnoDB`|Support for MySQL, version 5.7, preferring the InnoDB storage engine. May work with newer versions.|
|`MariaDB`|Support for MariaDB. May work with newer versions.|
|`MariaDB53`|Support for MariaDB, version 5.3 and newer.|
|`Oracle8i`|Support for Oracle, version 8i.|
|`Oracle9i`|Support for Oracle, version 9i.|
|`Oracle10g`|Support for Oracle, version 10g.|
|`Pointbase`|Support for Pointbase.|
|`PostgresPlus`|Support for Postgres Plus.|
|`PostgreSQL81`|Support for PostgreSQL, version 8.1.|
|`PostgreSQL82`|Support for PostgreSQL, version 8.2.|
|`PostgreSQL9`|Support for PostgreSQL, version 9. May work with later versions.|
|`Progress`|Support for Progress, version 9.1C. May work with newer versions.|
|`SAPDB`|Support for SAPDB/MAXDB.|
|`SQLite`|Support for SQLite. It is not auto-discovered, so `dialect` must be set explicitly, and a SQLite JDBC driver must be added to the application.|
|`SQLServer`|Support for SQL Server 2000.|
|`SQLServer2005`|Support for SQL Server 2005.|
|`SQLServer2008`|Support for SQL Server 2008.|
|`Sybase11`|Support for Sybase up to version 11.9.2.|
|`SybaseAnywhere`|Support for Sybase Anywhere.|
|`SybaseASE15`|Support for Sybase Adaptive Server Enterprise, version 15.|
|`SybaseASE157`|Support for Sybase Adaptive Server Enterprise, version 15.7. May work with newer versions.|
|`Teradata`|Support for Teradata.|
|`TimesTen`|Support for TimesTen, version 5.1. May work with newer versions.|

{% hint style="info" %}
See the Hibernate Dialect Section: [Hibernate\_User\_Guide.html#database-dialect](https://docs.jboss.org/hibernate/orm/7.4/userguide/html_single/Hibernate_User_Guide.html#database-dialect)
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
	cacheprovider        : request.$systemHelper.getSystemSetting( "ORM_SECONDARY_CACHE", "ehCache" ),
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

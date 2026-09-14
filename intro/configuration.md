---
description: Easily configure Hibernate with BL
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
|`generateMappings`|`true`|Automatically generate entity mappings for persistent classes. When `false`, provide `{entityName}.hbm.xml` files beside the entity.|
|`autoGenMap`|`true`|Backwards-compatible alias for `generateMappings`. Deprecated.|
|`autoManageSession`|`false`|Allows the engine to manage the Hibernate session. Use `transaction` blocks to demarcate transaction regions. See the [Hibernate transaction guide](https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#transactions).|
|`cacheConfig`|*empty*|Location of the secondary cache provider configuration file. Used only when `secondaryCacheEnabled=true`. See [Secondary Cache](configuration.md#secondary-cache).|
|`cacheConfigProperties`|*empty struct*|Struct alternative to `cacheConfig` for defining secondary cache region settings. See [Secondary Cache](configuration.md#secondary-cache).|
|`cacheProvider`|`"BoxCacheProvider"`|Secondary cache provider. This can be a BoxLang cache provider name, a legacy alias such as `ehcache`, `ConcurrentHashMap`, or `HashTable`, or a fully qualified JCache provider class. See [Secondary Cache](configuration.md#secondary-cache).|
|`catalog`||Default database catalog.|
|`entityPaths`|*empty*|Directory or array of directories searched for persistent classes. Specify this to avoid a startup performance cost.|
|`datasource`|`application.datasource`|Datasource used by the ORM. Defaults to `this.datasource` in `Application.bx` when not specified.|
|`defaultBatchSize`|`16`|Default batch size Hibernate uses when fetching lazy collections or proxies.|
|`dbcreate`|`none`|Schema strategy: `update` creates incremental updates, `dropcreate` recreates the database on reload, and `none` leaves the database unchanged.|
|`dialect`|`autodiscover`|Database dialect. Hibernate introspects the datasource by default, or you can provide a fully qualified Java class name. See [Dialects](#dialects).|
|`eventHandling`|`false`|Enables ORM event callbacks in entities and globally through `eventHandler`.|
|`eventHandler`||Path to the `.bx` class that manages global ORM events.|
|`enableThreadedMapping`|`true`|Runs entity mapping generation across multiple threads at startup. Set to `false` to force single-threaded generation.|
|`flushAtRequestEnd`|`false`|Automatically flushes the ORM at the end of a request. Persistence should generally be done through `transaction` blocks.|
|`hibernateProperties`|`empty`|Flat struct of raw Hibernate property name/value pairs applied directly to Hibernate configuration. Applied last, so it overrides ORM defaults and `ormconfig`. See [Custom Hibernate Config](configuration/custom-hibernate-config.md).|
|`logSQL`|`false`|Logs SQL queries to the console.|
|`namingstrategy`|`default`|Naming convention used for table and column names. See [Naming Strategies](./configuration/naming-strategies.md).|
|`ormconfig`||Path to a flat `hibernate.properties` file. Applied before `hibernateProperties`; matching keys in `hibernateProperties` take precedence. The XML `hibernate.cfg.xml` format is not supported. See [Custom Hibernate Config](configuration/custom-hibernate-config.md).|
|`proxyLazyLoading`|`false`|Wraps lazy-loaded relationship properties in a proxy instead of triggering an immediate load. See [Relationships](../modeling/relationships.md).|
|`quoteIdentifiers`|`false`|Quotes generated table and column identifiers in the Hibernate mapping.|
|`savemapping`|`false`|Creates `*.hbmxml` mapping files beside the entities for debugging.|
|`schema`||Default database schema.|
|`secondaryCacheEnabled`|`false`|Enables the secondary cache. See [Caching](../usage/caching.md).|
|`ignoreParseErrors`|`false`|Ignores classes with compile-time errors when `true`; otherwise throws exceptions.|
|`sqlScript`||Path to a SQL script executed after ORM initialization.|
|`useDBForMapping`|`true`|Inspects the database for missing mapping information, including column types, primary keys, and foreign keys.|

## Dialects

By using the `ormsettings.dialect` you can tell Hibernate which specific database dialect to use for building queries.  By default, Hibernate tries to inspect the datasource and define it for you.  95% of the time, this works.  However, if you want a specific one, then you can use the following names or a fully qualified Java class name.

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
See the Hibernate Dialect Section: [Hibernate\_User\_Guide.html#database-dialect](https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#database-dialect)
{% endhint %}

### SQLite

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

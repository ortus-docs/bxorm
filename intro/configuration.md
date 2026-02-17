---
description: Easily configure Hibernate with BL
---

# Configuration

### Application.bx

The ORM can be configured by a struct of settings set in `this.ormSettings` in your main `Application.bx`:

```js
class{
    this.ORMenabled = true;
    this.ormSettings = {
        // << Here Be ORM Configuration! 🤪 >>
    };
}
```

### ORM Settings

The full list of available properties you can use to configure the ORM are the following:

<table><thead><tr><th width="258">Setting Name<th width="128">Default<th>Description<tbody><tr><td><code>generateMappings</code><td><code>true</code><td>Specifies whether ColdFusion should automatically generate entity mappings for the persistent classes. If <code>generateMappings=false</code>, xml mappings must be provided as <code>{entityName}.hbm.xml</code> files stored alongside the entity.<tr><td><code>autoGenMap</code><td><code>true</code><td>Backwards-compatible alias for <code>generateMappings</code>. Deprecated.<tr><td><code>autoManageSession</code><td><code>true</code><td>Allows the engine to manage the Hibernate session. It is recommended not to let the engine manage it for you.<br><br>Use <code>transaction</code> blocks in order to demarcate your regions that should start, flush and end a transaction.<br><br><a href="https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#transactions">https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#transactions</a><tr><td><code>cacheConfig</code><td><code>true</code><td>Specifies the location of the configuration file that the secondary cache provider should use. This setting is used only when <code>secondaryCacheEnabled=true</code>. See <a href="configuration.md#secondary-cache">Secondary Cache</a> below.<tr><td><code>cacheProvider</code><td><code>"ehcache"</code><td><p>Specifies the cache provider that ORM should use as a secondary cache. The values can be:<ul><li><code>Ehcache</code><li><code>ConcurrentHashMap</code><li>The fully qualified name of the class for any other cache provider.</ul><p>See <a href="configuration.md#secondary-cache">Secondary Cache</a> below.<tr><td><code>catalog</code><td><td>Specifies the default Database Catalog that ORM should use.<tr><td><code>entityPaths</code><td><code>empty</code><td><p>Specifies the directory (or array of directories) that should be used to search for persistent CFCs to generate the mapping.<p><p><strong>Always specify it or pay a performance startup price.</strong><p><p><strong>Important:</strong><p>If it is not set, the extension looks at the application directory, its sub-directories, and its mapped directories to search for persistent CFCs.<tr><td><code>datasource</code><td><code>application.datasource</code><td>This setting defines the data source to be utilized by the ORM. If not used, defaults to the <code>this.datasource</code> in the <code>Application.bx</code><tr><td><code>dbcreate</code><td><code>none</code><td><ul><li><code>update</code> : Creates the database according to your ORM model. It only does incremental updates. It will never remove tables, indexes, etc.<li><code>dropcreate</code> : Same as above but it destroys the database if it has ny content and recreates it every time the ORM is reloaded.<li><code>none</code> : Does not change the database at all.</ul><tr><td><code>dialect</code><td><code>autodiscover</code><td>The dialect to use for your database. By default Hibernate will introspect the datasource and try to figure it out. See the dialects section below.<br><br>You can also use the fully Java qualified name of the class.<br><br>See the <a href="configuration.md#dialects">dialects</a> section below.<tr><td><code>eventHandling</code><td><code>false</code><td>If true, then it enables the ORM event callbacks in entities and globally via the <code>eventHandler</code><tr><td><code>eventHandler</code><td><td>Path to the <code>.bx</code> class that will manage the global ORM events.<tr><td><code>flushAtRequestEnd</code><td><code>true</code><td>Specifies if an orm flush should be called automatically at the end of a request. In our opinion this SHOULD never be true. A database persistence should be done via <code>transaction</code> tags and good transaction demarcation.<tr><td><code>logSQL</code><td><code>false</code><td>Specifies if the SQL queries should be logged to the console.<tr><td><code>namingstrategy</code><td><code>default</code><td>Defines the naming convention to use on table and column names.<br><br>See <a href="./configuration/naming-strategies.md">Naming Strategies</a> for more information.<tr><td><code>ormconfig</code><td><td>The path to a custom Hibernate configuration file:<br><br>- hibernate.properties<br>- hibernate.bx.xml<br><br>Please see <a href="configuration/custom-hibernate-config.md">Custom Hibernate Config</a><tr><td><code>savemapping</code><td><code>false</code><td>If enabled, the ORM will create the Hibernate mapping XML (<code>*.hbmxml</code>) files alongside the entities. This is great for debugging your entities and relationships.<tr><td><code>schema</code><td><td>The default database schema to use<tr><td><code>secondaryCacheEnabled</code><td><code>false</code><td>Enable the secondary cache or not. See our <a href="../usage/caching.md">Caching</a> section.<tr><td><code>ignoreParseErrors</code><td><code>false</code><td>If <code>true</code>, then the ORM will ignore classes that have compile time errors in them. Use <code>false</code> to throw exceptions.<tr><td><code>sqlScript</code><td><td>Path to a SQL script file that will be executed after the ORM is initialized. A great way to seed a database.<tr><td><code>useDBForMapping</code><td><code>true</code><td><p>Specifies whether the database has to be inspected to identify the missing information required to generate the Hibernate mapping.<p><p>The database is inspected to get the column data type, primary key and foreign key information.</table>

### Dialects

By using the `ormsettings.dialect` you can tell Hibernate which specific database dialect to use for building queries.  By default, Hibernate tries to inspect the datasource and define it for you.  95% of the time, this works.  However, if you want a specific one, then you can use the following names or a fully qualified Java class name.

<table><thead><tr><th width="238">Dialect (short name)</th><th>Remarks</th></tr></thead><tbody><tr><td>Cache71</td><td>Support for the Caché database, version 2007.1.</td></tr><tr><td>CockroachDB192</td><td>Support for the CockroachDB database version 19.2.</td></tr><tr><td>CockroachDB201</td><td>Support for the CockroachDB database version 20.1.</td></tr><tr><td>CUBRID</td><td>Support for the CUBRID database, version 8.3. May work with later versions.</td></tr><tr><td>DB2</td><td>Support for the DB2 database, version 8.2.</td></tr><tr><td>DB297</td><td>Support for the DB2 database, version 9.7.</td></tr><tr><td>DB2390</td><td>Support for DB2 Universal Database for OS/390, also known as DB2/390.</td></tr><tr><td>DB2400</td><td>Support for DB2 Universal Database for iSeries, also known as DB2/400.</td></tr><tr><td>DB2400V7R3</td><td>Support for DB2 Universal Database for i, also known as DB2/400, version 7.3</td></tr><tr><td>DerbyTenFive</td><td>Support for the Derby database, version 10.5</td></tr><tr><td>DerbyTenSix</td><td>Support for the Derby database, version 10.6</td></tr><tr><td>DerbyTenSeven</td><td>Support for the Derby database, version 10.7</td></tr><tr><td>Firebird</td><td>Support for the Firebird database</td></tr><tr><td>FrontBase</td><td>Support for the Frontbase database</td></tr><tr><td>H2</td><td>Support for the H2 database</td></tr><tr><td>HANACloudColumnStore</td><td>Support for the SAP HANA Cloud database column store.</td></tr><tr><td>HANAColumnStore</td><td>Support for the SAP HANA database column store, version 2.x. This is the recommended dialect for the SAP HANA database. May work with SAP HANA, version 1.x</td></tr><tr><td>HANARowStore</td><td>Support for the SAP HANA database row store, version 2.x. May work with SAP HANA, version 1.x</td></tr><tr><td>HSQL</td><td>Support for the HSQL (HyperSQL) database</td></tr><tr><td>Informix</td><td>Support for the Informix database</td></tr><tr><td>Ingres</td><td>Support for the Ingres database, version 9.2</td></tr><tr><td>Ingres9</td><td>Support for the Ingres database, version 9.3. May work with newer versions</td></tr><tr><td>Ingres10</td><td>Support for the Ingres database, version 10. May work with newer versions</td></tr><tr><td>Interbase</td><td>Support for the Interbase database.</td></tr><tr><td>JDataStore</td><td>Support for the JDataStore database</td></tr><tr><td>McKoi</td><td>Support for the McKoi database</td></tr><tr><td>Mimer</td><td>Support for the Mimer database, version 9.2.1. May work with newer versions</td></tr><tr><td>MySQL5</td><td>Support for the MySQL database, version 5.x</td></tr><tr><td>MySQL5InnoDB</td><td>Support for the MySQL database, version 5.x preferring the InnoDB storage engine when exporting tables.</td></tr><tr><td>MySQL57InnoDB</td><td>Support for the MySQL database, version 5.7 preferring the InnoDB storage engine when exporting tables. May work with newer versions</td></tr><tr><td>MariaDB</td><td>Support for the MariaDB database. May work with newer versions</td></tr><tr><td>MariaDB53</td><td>Support for the MariaDB database, version 5.3 and newer.</td></tr><tr><td>Oracle8i</td><td>Support for the Oracle database, version 8i</td></tr><tr><td>Oracle9i</td><td>Support for the Oracle database, version 9i</td></tr><tr><td>Oracle10g</td><td>Support for the Oracle database, version 10g</td></tr><tr><td>Pointbase</td><td>Support for the Pointbase database</td></tr><tr><td>PostgresPlus</td><td>Support for the Postgres Plus database</td></tr><tr><td>PostgreSQL81</td><td>Support for the PostgrSQL database, version 8.1</td></tr><tr><td>PostgreSQL82</td><td>Support for the PostgreSQL database, version 8.2</td></tr><tr><td>PostgreSQL9</td><td>Support for the PostgreSQL database, version 9. May work with later versions.</td></tr><tr><td>Progress</td><td>Support for the Progress database, version 9.1C. May work with newer versions.</td></tr><tr><td>SAPDB</td><td>Support for the SAPDB/MAXDB database.</td></tr><tr><td>SQLServer</td><td>Support for the SQL Server 2000 database</td></tr><tr><td>SQLServer2005</td><td>Support for the SQL Server 2005 database</td></tr><tr><td>SQLServer2008</td><td>Support for the SQL Server 2008 database</td></tr><tr><td>Sybase11</td><td>Support for the Sybase database, up to version 11.9.2</td></tr><tr><td>SybaseAnywhere</td><td>Support for the Sybase Anywhere database</td></tr><tr><td>SybaseASE15</td><td>Support for the Sybase Adaptive Server Enterprise database, version 15</td></tr><tr><td>SybaseASE157</td><td>Support for the Sybase Adaptive Server Enterprise database, version 15.7. May work with newer versions.</td></tr><tr><td>Teradata</td><td>Support for the Teradata database</td></tr><tr><td>TimesTen</td><td>Support for the TimesTen database, version 5.1. May work with newer versions</td></tr></tbody></table>

{% hint style="info" %}
See the Hibernate Dialect Section: [Hibernate\_User\_Guide.html#database-dialect](https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#database-dialect)
{% endhint %}

### Sample Config

Here is an example configuration from the popular ContentBox Modular CMS application

```cfscript
// THE CONTENTBOX DATASOURCE NAME
this.datasource  = "contentbox";
// ORM SETTINGS
this.ormEnabled  = true;
// cfformat-ignore-start
this.ormSettings = {
	// ENTITY LOCATIONS, ADD MORE LOCATIONS AS YOU SEE FIT
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
	// DO NOT REMOVE THE FOLLOWING LINE OR AUTO-UPDATES MIGHT FAIL.
	dbcreate             : "update",
	secondarycacheenabled: request.$systemHelper.getSystemSetting( "ORM_SECONDARY_CACHE", false ),
	cacheprovider        : request.$systemHelper.getSystemSetting( "ORM_SECONDARY_CACHE", "ehCache" ),
	logSQL               : request.$systemHelper.getSystemSetting( "ORM_LOGSQL", false ),
	sqlScript            : request.$systemHelper.getSystemSetting( "ORM_SQL_SCRIPT", "" ),
	flushAtRequestEnd    : false,
	autoManageSession    : false,
	eventHandling        : true,
	eventHandler         : "cborm.models.EventHandler",
	ignoreParseErrors     : true,
	// TURN ON FOR Debugging if ORM mappings are not working.
	savemapping          : false
};
```
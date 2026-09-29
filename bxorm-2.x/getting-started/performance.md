---
description: Speed up ORM startup with the boot cache, and tune queries and fetching at runtime
icon: gauge-high
---

# Performance

bx-orm is designed to be as fast as possible, but there are some factors that can affect performance. Let's look at a few key areas where you can optimize performance in your application.

## ORM Startup

You want the short answer?

* Turn on the [boot cache](#boot-cache): `ormManifest : "auto"` in development and `ormManifest : "trust"` in production. A trusted boot skips entity discovery, parsing, mapping generation and facade code generation.
* Or commit your XML mapping files to disk and set `this.ormSettings.generateMappings = false` (with `savemapping = true`) to eliminate the XML mapping generation time on startup.
* Fine-tune `this.ormSettings.entityPaths` to minimize the number of candidate files that need to be parsed for entity discovery.

See also [Startup Metrics Logs](configuration/logging.md#startup-metrics) for consolidated examples of the debug log output for ORM startup performance metrics.

### Entity Discovery

The initial step in ORM startup is to discover ORM entities and parse the entity metadata into internal structures. The time will be proportional to the number of entities found and the number of candidate files that need to be parsed to find those entities. By default, bx-orm will scan all CFC files in the specified entity paths, which can lead to a large number of candidate files and increased startup time.

This can be minimized by fine-tuning `this.ormSettings.entityPaths` [in your orm configuration](configuration/README.md).

Enable debug logging to see the time taken for entity discovery and metadata parsing in the logs:

```bash
ORM startup metric - entity file discovery: 42ms (187 candidate files found)
ORM startup metric - entity metadata parsing: 310ms (23 persistent entities found, sequential mode)
```

### XML Mapping Generation

Once persistent entities are located and metadata is collected, bx-orm generates XML mapping files for each entity. This process can be time-consuming, especially if you have a large number of entities.

This startup penalty can be mostly eliminated by committing your `.orm.xml` mappings to disk (write them with `savemapping : true`) and setting `this.ormSettings.generateMappings = false`.

Note that for any ORM entity changes, you will need to regenerate the XML mapping files by setting `this.ormSettings.generateMappings = true` and running `ormReload()` or restarting your application. This will regenerate the XML mappings to pick up any changes.

You can also pre-generate `.orm.xml` files from the command line, without booting a full application, using the [GenerateMappings CLI tool](../reference/cli-tools.md).

Enable debug mode to see the time taken for XML mapping generation in the logs:

```bash
ORM startup metric - XML mapping generation: 88ms (23 mapping files written)
```

### Boot Cache

The boot cache stores everything bx-orm works out at startup in a `.bxorm/` folder: the resolved entity metadata, the generated Hibernate mappings (`manifest-{app}.json`) and the generated entity facade classes (`facades-{app}.jar`). The `ormManifest` setting picks the mode:

| Mode            | What happens at startup                                                                                                                      | Use it for                     |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `off` (default) | Discover, parse and map every entity on every boot.                                                                                          | Anything, the classic behavior |
| `auto`          | Boot normally, then write the `.bxorm/` cache. bx-orm also watches the entity paths: edit an entity and the ORM reloads on the next request. | Development                    |
| `trust`         | Boot straight from the `.bxorm/` cache: no discovery, parsing, mapping generation or facade code generation.                                 | Production                     |

```js
this.ormSettings = {
    entityPaths : [ "models" ],
    // "auto" on your machine and in CI, "trust" in production
    ormManifest : getSystemSetting( "ORM_MANIFEST", "auto" )
};
```

A `trust` boot fails closed. It refuses to start, naming what changed, when:

* The application's cache files are missing, or the checksum does not match (the manifest was edited or corrupted).
* The manifest belongs to another application (for example one copied or renamed by hand).
* A key ORM setting changed since the cache was written: dialect, datasource, naming strategy, application name, `dbcreate`, `quoteIdentifiers` or `entityPaths`.
* The bx-orm version changed.
* An entity source file changed since the cache was written.

`trust` mode does no discovery, so a newly added entity file is not picked up. Boot once with `auto` after changing entities to refresh the cache, then deploy the `.bxorm/` folder with your application.

By default the `.bxorm/` folder lives in the application root. `ormManifestLocation` moves it: a relative path resolves against the application root, an absolute path is used as is, and the folder is always named `.bxorm`.

#### Several Applications in One Folder

Sub-applications deployed under the same root can share one `.bxorm/` folder. Each application's files carry its name, so they never overwrite each other:

```text
.bxorm/
  manifest-shop.json
  manifest-shop.sha256
  facades-shop.jar
  manifest-admin.json
  manifest-admin.sha256
  facades-admin.jar
```

The `{app}` part is the application's `this.name` run through BoxLang's [`slugify()`](https://boxlang.ortusbooks.com/boxlang-language/reference/built-in-functions/string/slugify): `this.name = "My Shop"` writes `manifest-my-shop.json`. Deploy the whole folder; each application boots from its own files.

The gain grows with the number of entities: the work `trust` removes scales with your entity count, while Hibernate's own `SessionFactory` build (below) is a fixed cost either way.

Use the [`bxorm` CLI](../reference/cli-tools.md#bxorm-boot-cache-cli) to inspect, validate or clear the cache.

### SessionFactory Build

The bulk of this time is spent in hibernate startup itself. You can minimize this by investigating and applying standard Hibernate performance optimizations.

Enable debug mode to see the time taken for SessionFactory building in the logs:

```bash
ORM startup metric - Hibernate SessionFactory build time [myDatasource]: 1243ms
```

## Runtime Performance

Most ORM performance problems happen after startup. Measure the SQL generated by Hibernate and the time spent in the database before changing fetch strategies or caching. A faster application usually comes from loading fewer rows, issuing fewer queries, and keeping transactions short.

### Use Lazy Loading Deliberately

Keep large to-many relationships lazy so loading a parent entity does not also load its entire object graph. This is usually the right default for `one-to-many` and `many-to-many` relationships. See [Modeling Relationships](../modeling/relationships.md#lazy-loading) for the available `lazy` values.

Lazy loading is not a request to load data for free. Accessing a lazy relationship triggers another SQL query while the entity is attached to an ORM session. Access lazy properties inside the transaction or session boundary, and avoid returning entities to code that will access unloaded relationships after the session has closed.

Do not make every relationship eager to avoid lazy-loading errors. Eager to-many relationships can load a large amount of data and can multiply rows when several collections are joined. Choose the fetch plan for each use case instead.

### Prevent N+1 Queries

An N+1 query occurs when one query loads a list of parent entities and then one additional query runs for each parent's relationship. It is easy to create accidentally:

```js
var users = entityLoad( "User", {}, "name asc", { maxResults: 50 } );

for ( var user in users ) {
	// Accessing posts here can issue one query per user.
	println( user.getPosts().size() );
}
```

When a screen or operation needs a relationship for every result, fetch it intentionally with an HQL join:

```js
var users = ORMExecuteQuery(
	hql    : "SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.posts WHERE u.active = true",
	params : {},
	options: { maxResults: 50 }
);
```

Use fetch joins for the specific use case that needs the related data. Do not fetch-join multiple to-many collections in one query, and be cautious with pagination over a collection fetch join because the database paginates joined rows rather than distinct parent entities. For larger result sets, prefer batch fetching or separate queries.

### Batch Fetching

Batch fetching lets Hibernate initialize several lazy associations with fewer `SELECT` statements. Configure a moderate default batch size through `hibernateProperties`, then tune it using query logs and database metrics:

```js
this.ormSettings.hibernateProperties = {
	"hibernate.default_batch_fetch_size": 25
};
```

Batch fetching is useful when a request loads many entities and then accesses the same lazy relationship on several of them. It does not replace a good fetch plan: a fetch join is often better when the relationship is always required, while batching is useful when access is conditional.

### Batch Writes

For large insert or update jobs, use one transaction and enable JDBC batching. Hibernate can group compatible statements into fewer database round trips:

```js
this.ormSettings.hibernateProperties = {
	"hibernate.jdbc.batch_size": 25,
	"hibernate.order_inserts": true,
	"hibernate.order_updates": true
};
```

Use a batch size appropriate for the database and driver, and commit in bounded chunks for very large jobs. Keep an eye on memory because the session retains managed entities until they are flushed and cleared. Bulk HQL `UPDATE` and `DELETE` statements can be more efficient than loading and changing thousands of entities, but they bypass entity lifecycle events and require careful cache handling.

### Select Only What You Need

For reports, exports, and list screens, avoid loading a complete entity graph when a few columns are sufficient. Use an HQL projection or a purpose-built query, apply `maxResults` and `offset` for pagination, and return read-only results when the data will not be changed:

```js
var rows = ORMExecuteQuery(
	hql    : "SELECT u.id, u.name, u.email FROM User u WHERE u.active = true ORDER BY u.name",
	params : {},
	options: {
		maxResults: 100,
		offset    : 0,
		readOnly  : true
	}
);
```

For deep pagination, large offsets can become expensive because the database still has to find and discard preceding rows. Prefer keyset pagination, such as `WHERE u.id > :lastId ORDER BY u.id`, when the workflow supports it.

### Keep Transactions and Sessions Focused

Open the transaction as late as practical, perform the required work, and commit promptly. Do not hold a transaction open while rendering a response, calling a remote service, or waiting for user input. Long sessions also increase dirty-checking work and memory usage.

For read-heavy code, use `readOnly: true` on queries where supported so Hibernate does not need to track changes for those results. Do not use read-only mode for entities that the operation intends to modify.

### Index the Queries You Actually Run

Hibernate cannot compensate for missing database indexes. Add indexes for columns used frequently in `WHERE`, `JOIN`, and `ORDER BY` clauses, especially foreign keys used by relationships. Validate index choices with the database's execution plan; an index that helps one query can hurt write performance or be ignored when selectivity is poor.

### Inspect Before Optimizing

Enable SQL logging temporarily and inspect:

* the number of SQL statements for one request;
* repeated queries that differ only by an identifier, which often indicates N+1 loading;
* large result sets caused by eager relationships or fetch joins;
* slow statements in the database execution plan;
* flushes or unexpected updates before a query.

See [Querying](../usage/querying.md), [Session Management](../usage/session-management.md), and [Caching](../usage/caching.md) for bx-orm-specific behavior. For the underlying fetch and batching rules, see Hibernate's [Fetching](https://docs.hibernate.org/orm/7.4/userguide/html_single/Hibernate_User_Guide.html#fetching), [Batching](https://docs.hibernate.org/orm/7.4/userguide/html_single/Hibernate_User_Guide.html#batch), and [Querying](https://docs.hibernate.org/orm/7.4/userguide/html_single/Hibernate_User_Guide.html#hql) chapters.

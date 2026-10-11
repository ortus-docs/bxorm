---
description: Query your entities with HQL, filter-based lookups and named SQL functions
icon: magnifying-glass
---

# Querying

bx-orm gives you three ways to query entities: **HQL** (Hibernate Query Language) for anything beyond a simple lookup, **filter-based queries** for quick equality lookups without writing a query string at all, and the fluent [entityCriteria()](criteria.md) builder, which chains conditions, joins and projections without a query string.

## HQL Queries

HQL looks like SQL, but it queries **entity names and properties**, not table and column names. Use [ORMExecuteQuery](../reference/built-in-functions/ormexecutequery.md) to run one:

```js
var toyotas = ORMExecuteQuery(
    hql: "FROM Auto WHERE make = :make",
    params: { make: "Toyota" }
);
```

{% hint style="info" %}
Entity and property names are case-insensitive, as in the rest of BoxLang: `FROM auto WHERE MAKE = :make` works. HQL in the declared case runs as is; a wrong-case name is corrected once and the corrected HQL is reused. Text inside string literals is never changed, and a misspelled name still fails with a "Did you mean" suggestion.
{% endhint %}

### Parameters

Bind parameters using either named parameters (`:name`, with a struct of params) or positional parameters (`?`, with an array of params) - don't mix the two styles in the same query:

```js
// Named
ORMExecuteQuery( hql: "FROM Auto WHERE make = :make", params: { make: "Toyota" } );

// Positional
ORMExecuteQuery( hql: "FROM Auto WHERE make = ?", params: [ "Toyota" ] );
```

An array-valued parameter is expanded into a comma-separated list of placeholders automatically, so `IN` clauses work as expected:

```js
ORMExecuteQuery(
    hql: "FROM Auto WHERE make IN (:makes)",
    params: { makes: [ "Toyota", "Honda", "Ford" ] }
);
```

### Options

Pass a struct of options to control pagination, caching, and result shape:

| Option        | Description                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `unique`      | Return a single object (or `null`) instead of an array                                                                                       |
| `offset`      | Skip this many results                                                                                                                       |
| `maxResults`  | Limit the number of results returned                                                                                                         |
| `readOnly`    | Load results as read-only (not tracked for dirty-checking)                                                                                   |
| `datasource`  | Run the query against a specific datasource, instead of the entity's default                                                                 |
| `lock`        | Lock the returned rows until the transaction ends: `read`, `write` or `force`. Needs `transaction{}`. See [Locking](transactions.md#locking) |
| `lockTimeout` | Seconds to wait for the `lock` (`0` means do not wait)                                                                                       |
| `skipLocked`  | With `lock`, skip rows another transaction has locked instead of waiting                                                                     |
| `asStream`    | Return a Java `Stream` read from the database as it is consumed, instead of an array. See [Streaming Results](#streaming-results)            |

### Named SQL Functions

HQL can call the SQL functions the application registers with the [`sqlFunctions`](../getting-started/configuration/README.md#named-sql-functions) setting, by name, like any HQL function:

```js
// Application.bx: sqlFunctions : { nameLen : { sql : "char_length(?1)", returns : "integer" } }
var length = ORMExecuteQuery( "select nameLen( m.name ) from Manufacturer m where m.id = :id", { id : 1 }, true );
```

The same names work in [criteria paths](criteria.md#functions-in-paths). [ormGetSQLFunctions()](../reference/built-in-functions/ormgetsqlfunctions.md) lists them.

### Update and Delete Queries

HQL `UPDATE` and `DELETE` statements are executed directly against the database (bypassing the second-level cache and entity lifecycle events), and return the number of affected rows instead of a result list:

```js
var rowsUpdated = ORMExecuteQuery( hql: "UPDATE Auto SET discontinued = true WHERE make = :make", params: { make: "Yugo" } );
```

## Filter-Based Queries

For simple equality lookups, skip HQL entirely and use [EntityLoad](../reference/built-in-functions/entityload.md) with a struct of filter criteria:

```js
// All Toyotas
var toyotas = entityLoad( "Auto", { make: "Toyota" } );

// A single, unique Toyota
var toyota = entityLoad( "Auto", { make: "Toyota" }, true );

// With pagination and ordering
var page = entityLoad( "Auto", { make: "Toyota" }, "model asc", { offset: 0, maxResults: 25 } );
```

Every key in the filter struct must be a valid persistent property name on the entity; each key/value pair is combined with the others using `AND` equality. This only supports equality checks - reach for HQL as soon as you need `LIKE`, ranges, joins, or `OR` logic.

[EntityLoadByExample](../reference/built-in-functions/entityloadbyexample.md) works the same way, but takes a sample entity instance instead of a struct:

```js
var sample = entityNew( "Auto", { make: "Toyota" } );
var toyotas = entityLoadByExample( sample );
```

## Streaming Results

Pass `asStream : true` to `ORMExecuteQuery()` or `EntityLoad()` to get a Java `Stream` instead of an array. The rows are read from the database as the stream is consumed, so a large result never sits in memory at once. BoxLang closures work with the stream methods:

```js
var names = ORMExecuteQuery( "from Auto where make = :make", { make : "Toyota" }, false, { asStream : true } )
    .filter( ( auto ) => auto.getYear() > 2020 )
    .map( ( auto ) => auto.getModel() )
    .toList();

var count = entityLoad( "Auto", { make : "Toyota" }, "model", { asStream : true } ).count();
```

The stream holds an open database cursor until it is exhausted or closed, so consume it in the same request (Hibernate closes it with the session at the latest). `asStream` cannot be combined with `unique`, or with an update or delete: those raise an `orm.argument` error. Criteria have the same with [`asStream()`](criteria.md).

## Converting Results to a Query Object

If you need to hand entity results to code that expects a BoxLang `Query` object (e.g. for a report or grid), use [EntityToQuery](../reference/built-in-functions/entitytoquery.md):

```js
var toyotas = entityLoad( "Auto", { make: "Toyota" } );
var qryToyotas = entityToQuery( toyotas );
```

The query holds the entity's plain properties only, never relationship data. See [Entities as Queries](queries.md).

## Converting Results to Structs

For JSON APIs and views, [entityToStruct()](../reference/built-in-functions/entitytostruct.md) turns entities into structs, and [entityLoadAsStruct()](../reference/built-in-functions/entityloadasstruct.md) reads the same structs without loading the entities. See [Entities as Structs](structs.md).

```js
var toyotas = entityLoadAsStruct( "Auto", { make: "Toyota" }, "", { sortOrder: "model" } );
```

## Where Queries Run

Both HQL and filter-based queries execute against the current request's Hibernate session - see [Session Management](session-management.md) for how that session is opened and when it flushes. If `secondaryCacheEnabled` is on for an entity, HQL queries respect the query cache automatically; see [Caching](caching.md).

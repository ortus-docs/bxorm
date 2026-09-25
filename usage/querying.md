---
description: Query your entities with HQL or simple filter-based lookups
---

# Querying

bx-orm gives you three ways to query entities: **HQL** (Hibernate Query Language) for anything beyond a simple lookup, **filter-based queries** for quick equality lookups without writing a query string at all, and the fluent [entityCriteria()](criteria.md) builder, which chains conditions, joins and projections without a query string.

## HQL Queries

HQL looks like SQL, but it queries **entity names and properties**, not table and column names. Use [ORMExecuteQuery](../reference/built-in-functions/orm/ORMExecuteQuery.md) to run one:

```js
var toyotas = ORMExecuteQuery(
    hql: "FROM Auto WHERE make = :make",
    params: { make: "Toyota" }
);
```

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

| Option | Description |
|--------|-------------|
| `unique` | Return a single object (or `null`) instead of an array |
| `offset` | Skip this many results |
| `maxResults` | Limit the number of results returned |
| `readOnly` | Load results as read-only (not tracked for dirty-checking) |
| `datasource` | Run the query against a specific datasource, instead of the entity's default |

### Update and Delete Queries

HQL `UPDATE` and `DELETE` statements are executed directly against the database (bypassing the second-level cache and entity lifecycle events), and return the number of affected rows instead of a result list:

```js
var rowsUpdated = ORMExecuteQuery( hql: "UPDATE Auto SET discontinued = true WHERE make = :make", params: { make: "Yugo" } );
```

## Filter-Based Queries

For simple equality lookups, skip HQL entirely and use [EntityLoad](../reference/built-in-functions/orm/EntityLoad.md) with a struct of filter criteria:

```js
// All Toyotas
var toyotas = entityLoad( "Auto", { make: "Toyota" } );

// A single, unique Toyota
var toyota = entityLoad( "Auto", { make: "Toyota" }, true );

// With pagination and ordering
var page = entityLoad( "Auto", { make: "Toyota" }, "model asc", { offset: 0, maxResults: 25 } );
```

Every key in the filter struct must be a valid persistent property name on the entity; each key/value pair is combined with the others using `AND` equality. This only supports equality checks - reach for HQL as soon as you need `LIKE`, ranges, joins, or `OR` logic.

[EntityLoadByExample](../reference/built-in-functions/orm/EntityLoadByExample.md) works the same way, but takes a sample entity instance instead of a struct:

```js
var sample = entityNew( "Auto", { make: "Toyota" } );
var toyotas = entityLoadByExample( sample );
```

## Converting Results to a Query Object

If you need to hand entity results to code that expects a BoxLang `Query` object (e.g. for a report or grid), use [EntityToQuery](../reference/built-in-functions/orm/EntityToQuery.md):

```js
var toyotas = entityLoad( "Auto", { make: "Toyota" } );
var qryToyotas = entityToQuery( toyotas );
```

## Where Queries Run

Both HQL and filter-based queries execute against the current request's Hibernate session - see [Session Management](session-management.md) for how that session is opened and when it flushes. If `secondaryCacheEnabled` is on for an entity, HQL queries respect the query cache automatically; see [Caching](caching.md).

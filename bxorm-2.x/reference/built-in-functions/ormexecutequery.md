---
description: Run an HQL query with optional parameters and query options
---

# ORMExecuteQuery

Execute an HQL query with (optional) parameters and specific query options.

## Parameters

The `params` argument binds parameters to the HQL query.
Use an array of positional parameters or a struct of named parameters.

In the HQL, write `?` for a positional parameter and `:name` for a named parameter.

Example:

```js
ORMExecuteQuery( hql: "FROM autos WHERE make = ?", params: [ 'Ford' ] );
ORMExecuteQuery( hql: "FROM autos WHERE make = :make", params: { make: 'Ford' } );
```

## Options

The options struct can contain any of the following keys:

* **`unique`** - Specifies whether to retrieve a single, unique item. Default is false. If more than one row matches, an `orm.query.nonUnique` error is raised.
* **`uniqueFirst`** - Return the first row even when several match (implies `unique`). Default is false.
* **`datasource`** - The datasource to use for the query. If not specified, the default datasource will be used.
* **`offset`** - Specifies the position from which to retrieve the objects. Default is 0.
* **`maxresults`** - Specifies the maximum number of objects to be retrieved. Default is no limit.
* **`readonly`** - If true, the query will be read-only. Default is false.
* **`cacheable`** - Cache the result in the second-level query cache (needs `secondaryCacheEnabled`). Default is false.
* **`cacheName`** - The query cache region to use (alias `cacheRegion`). Implies `cacheable` unless `cacheable` is given.
* **`timeout`** - The query timeout in seconds. Default is no timeout.
* **`lock`** - Lock the rows the query returns until the transaction ends: `read`, `write` or `force` (see `entityLock()`). Needs `transaction{}`, otherwise an `orm.argument` error is raised.
* **`lockTimeout`** - Seconds to wait for the lock. `0` means do not wait.
* **`skipLocked`** - Skip rows another transaction has locked instead of waiting for them.
* **`fetchSize`** - The JDBC fetch size: how many rows the driver reads per round trip.
* **`comment`** - A comment added to the generated SQL. It shows up in the SQL when `hibernate.use_sql_comments` is on.
* **`hints`** - A struct of query hints, passed to Hibernate as name/value pairs (for example `{ "org.hibernate.fetchSize" : 50 }`).
* **`asStream`** - Return a Java `Stream` that reads the rows from the database as it is consumed, instead of an array. Consume it in the same request. Not allowed with `unique` or an update/delete (`orm.argument`). Default is false.

### Shorter Forms

The arguments can be shifted to the left:

* `params` may be a boolean. It then means `unique`: `ormExecuteQuery( "FROM Auto WHERE id = 1", true )`.
* `unique` may be the options struct: `ormExecuteQuery( hql, params, { maxResults : 10 } )`.

`unique` given inside the options struct is honored too.

## Method Signature

```
ORMExecuteQuery(hql=[String], params=[Any], unique=[Any], options=[Struct])
```

### Arguments


| Argument  | Type     | Required | Description                                                                                                                                                 | Default |
| --------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `hql`     | `String` | `true`   | The HQL query string to execute.                                                                                                                            |         |
| `params`  | `Any`    | `false`  | Parameters to bind to the HQL query: a struct of named parameters or an array of positional parameters. A boolean here means `unique`.                      |         |
| `unique`  | `Any`    | `false`  | Return one result (`true`) or an array (`false`). A unique query returns one object, or `null` when nothing matches. A struct here is treated as `options`. |         |
| `options` | `Struct` | `false`  | Optional struct of additional query options.                                                                                                                |         |

## Examples

### Simple HQL Query Execution

The `ORMExecuteQuery` function allows you to execute HQL (Hibernate Query Language) queries against your ORM entities. This function is useful for retrieving data based on specific criteria defined in your HQL query.

```java
var allToyotas = ORMExecuteQuery(
    hql = "FROM Auto WHERE Make = :make",
    params = { make = "Toyota" },
    options = { unique = false }
);
```

## Passing Parameters

You can pass parameters to your HQL query using either named parameters (as a struct) or positional parameters (as an array).

```java
var allToyotas = ORMExecuteQuery(
    hql = "FROM Auto WHERE Make = ?",
    params = [ "Toyota" ]
);
```

Using named parameters:

```java
var toyota = ORMExecuteQuery(
    hql = "FROM Auto WHERE Make = :make",
    params = { make = "Toyota" }
);
```

Named parameters are converted to JPA-style positional placeholders in the HQL string prior to execution. Thus, the above query is rewritten as:

```sql
FROM Auto WHERE Make = ?1
```

prior to query execution.

## Locking Rows

Inside a transaction, the `lock` option locks the rows the query returns until the transaction ends:

```java
transaction {
    var jobs = ORMExecuteQuery(
        hql     = "FROM Job WHERE status = :status",
        params  = { status = "new" },
        options = { lock = "write", skipLocked = true, maxResults = 10 }
    );
}
```

## Related

* [EntityCriteria](entitycriteria.md)
* [EntityDelete](entitydelete.md)
* [EntityEvict](entityevict.md)
* [EntityGetDatasource](entitygetdatasource.md)
* [EntityGetDirtyProperties](entitygetdirtyproperties.md)
* [EntityGetId](entitygetid.md)
* [EntityGetMetadata](entitygetmetadata.md)
* [EntityGetName](entitygetname.md)
* [EntityGetReference](entitygetreference.md)
* [EntityIsAttached](entityisattached.md)
* [EntityIsDirty](entityisdirty.md)
* [EntityLoad](entityload.md)
* [EntityLoadAsStruct](entityloadasstruct.md)
* [EntityLoadByExample](entityloadbyexample.md)
* [EntityLoadByPK](entityloadbypk.md)
* [EntityLoadByPKOrFail](entityloadbypkorfail.md)
* [EntityLoadOrFail](entityloadorfail.md)
* [EntityLoadOrNew](entityloadornew.md)
* [EntityLoadOrSave](entityloadorsave.md)
* [EntityLoadReadOnly](entityloadreadonly.md)
* [EntityLock](entitylock.md)
* [EntityMerge](entitymerge.md)
* [EntityNameArray](entitynamearray.md)
* [EntityNameList](entitynamelist.md)
* [EntityNew](entitynew.md)
* [EntityReload](entityreload.md)
* [EntitySave](entitysave.md)
* [EntityToQuery](entitytoquery.md)
* [EntityToStruct](entitytostruct.md)
* [ORMClearSession](ormclearsession.md)
* [ORMCloseAllSessions](ormcloseallsessions.md)
* [ORMCloseSession](ormclosesession.md)
* [ORMDiagnostics](ormdiagnostics.md)
* [ORMEvictCollection](ormevictcollection.md)
* [ORMEvictEntity](ormevictentity.md)
* [ORMEvictQueries](ormevictqueries.md)
* [ORMFlush](ormflush.md)
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSQLFunctions](ormgetsqlfunctions.md)
* [ORMGetSession](ormgetsession.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMGetSessionStatistics](ormgetsessionstatistics.md)
* [ORMIsSessionDirty](ormissessiondirty.md)
* [ORMReadOnly](ormreadonly.md)
* [ORMReload](ormreload.md)

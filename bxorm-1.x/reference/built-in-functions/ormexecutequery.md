# ORMExecuteQuery

Execute an HQL query with (optional) parameters and specific query options.

## Parameters

The `parameters` argument can be used to bind parameters to the SQL query. You can use either an array of binding parameters or a struct of named binding parameters.

The SQL must have the parameters bound using the syntax `?` for positional parameters or `:name` for named parameters.

Example:

```
 ORMExecuteQuery( hql: "FROM autos WHERE make = ?", params: [ 'Ford' ] );
 ORMExecuteQuery( hql: "FROM autos WHERE make = :make", params: { make: 'Ford' } );
 
```

## Options

The options struct can contain any of the following keys:

* **`unique`** - Specifies whether to retrieve a single, unique item. Default is false.
* **`datasource`** - The datasource to use for the query. If not specified, the default datasource will be used.
* **`offset`** - Specifies the position from which to retrieve the objects. Default is 0.
* **`maxresults`** - Specifies the maximum number of objects to be retrieved. Default is no limit.
* **`readonly`** - If true, the query will be read-only. Default is false.

## Method Signature

```
ORMExecuteQuery(hql=[String], params=[Any], unique=[Any], options=[Struct])
```

### Arguments

| Argument  | Type     | Required | Description                                                                                                                                                                              | Default |
| --------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `hql`     | `String` | `true`   | The HQL query string to execute.                                                                                                                                                         |         |
| `params`  | `Any`    | `false`  | Optional parameters for the HQL query. Can be a struct of named parameters or an array of positional parameters.                                                                         |         |
| `unique`  | `Any`    | `false`  | <p>Optional boolean indicating whether to return a unique result (true) or a list of results (false). If true, the query will return<br>a single object or null if no results found.</p> |         |
| `options` | `Struct` | `false`  | Optional struct of additional query options.                                                                                                                                             |         |

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

## Related

* [EntityDelete](entitydelete.md)
* [EntityIsAttached](entityisattached.md)
* [EntityLoad](entityload.md)
* [EntityLoadByExample](entityloadbyexample.md)
* [EntityLoadByPK](entityloadbypk.md)
* [EntityMerge](entitymerge.md)
* [EntityNameArray](entitynamearray.md)
* [EntityNameList](entitynamelist.md)
* [EntityNew](entitynew.md)
* [EntityReload](entityreload.md)
* [EntitySave](entitysave.md)
* [EntityToQuery](entitytoquery.md)
* [ORMClearSession](ormclearsession.md)
* [ORMCloseAllSessions](ormcloseallsessions.md)
* [ORMCloseSession](ormclosesession.md)
* [ORMEvictCollection](ormevictcollection.md)
* [ORMEvictEntity](ormevictentity.md)
* [ORMEvictQueries](ormevictqueries.md)
* [ORMFlush](ormflush.md)
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSession](ormgetsession.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMReload](ormreload.md)

# EntityLoad

Load an entity or array of entities from the database.

You can pass a struct of query options, including pagination, caching, and sort options.

## Parameters

The `parameters` argument can be used to bind parameters to the SQL query.
You can use either an array of binding parameters or a struct of named binding parameters.

## Options

* **`unique`** - Boolean. Specifies whether to retrieve a single, unique item. Default is `false`. If more than one entity matches the filter, an `orm.query.nonUnique` error is raised.
* **`uniqueFirst`** - Boolean. Return the first match even when several entities match (implies `unique`). Default is `false`.
* **`ignorecase`** - Boolean. Sorts text properties without regard to case. Number and date properties are sorted as-is. Use only if you specify the sortorder parameter. Defaults to `false`.
* **`offset`** - Number. Specifies the pagination offset. Defaults to 0.
* **`maxresults`** - Number. Specifies the maximum number of objects to be retrieved.
* **`cacheable`** - Boolean. Whether the result has to be cached in the second-level query cache (needs `secondaryCacheEnabled`). Default is `false`.
* **`cachename`** - String. The query cache region to use. Implies `cacheable` unless `cacheable` is given.
* **`timeout`** - Number. Specifies the timeout value (in seconds) for the query. No timeout by default.
* **`readOnly`** - Boolean. Load the entities read-only: they are not dirty-checked and changes to them are never saved. Works for filter loads and loads by id. Default is `false`. See also `entityLoadReadOnly()`.
* **`asStream`** - Boolean. Return a Java `Stream` that reads the entities from the database as it is consumed, instead of an array. Consume it in the same request. Not allowed with `unique` (`orm.argument`). Default is `false`.

## Method Signature

```
EntityLoad(entityName=[string], idOrFilter=[any], uniqueOrOrder=[any], options=[struct])
```

### Arguments


| Argument        | Type     | Required | Description                                                                                           | Default |
| --------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------- | ------- |
| `entityName`    | `string` | `true`   | The name of the entity to load.                                                                       |         |
| `idOrFilter`    | `any`    | `false`  | Either the ID of the entity to load, or a struct of filter criteria.                                  |         |
| `uniqueOrOrder` | `any`    | `false`  | Either a boolean indicating whether to return a unique result, or a string/array of order by clauses. |         |
| `options`       | `struct` | `false`  | A struct of options to modify the load operation. See below for supported options.                    |         |

## Examples

## Loading an Entity Array

To load an array of Autos from the database where the `Make` is `Ford`, you would do the following:

```java
var allFords = entityLoad( "Auto", { Make = "Ford" } );
```

By default, all matching records are returned. If you want to paginate the result set, you can pass a struct with query options as the fourth argument:

```java
var firstTenFords = entityLoad(
    "Auto",                         // first arg: entity name
    { Make = "Ford" },              // second arg: criteria struct
    false,                          // third arg: false for "not unique"
    { maxResults = 10, offset = 0 } // fourth arg: option struct
);
```

### Loading Unique Entities

We can also load single, unique entity results by passing `true` in the third argument to indicate that we want a single, unique result. For example, to load an entity named `Auto` with an ID of `123`, you would do the following:

```java
var myEntity = entityLoad( "Auto", 123, true );
```

This will retrieve the entity from the database and populate the `myEntity` variable with its data. If the entity is not found, an error will be thrown.

You can also use the `entityLoad()` function to load an entity by its unique properties, even if they are not the primary key. For example, to load an `Auto` entity with a specific `VIN`, you could do the following:

```java
var myEntity = entityLoad( "Auto", { VIN = "1HGCM82633A123456" }, true );
```

This will search for the `Auto` entity with the specified `VIN` and return it if found.

### Loading Read-Only Entities

Pass `readOnly : true` to load entities that are not dirty-checked. Changes made to them are never saved, which keeps large reads light:

```java
var shipped = entityLoad( "Order", { status = "shipped" }, "createdDate desc", { readOnly = true } );
```

[EntityLoadReadOnly](entityloadreadonly.md) does the same without the option.

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
* [ORMExecuteQuery](ormexecutequery.md)
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

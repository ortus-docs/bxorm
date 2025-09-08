[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityLoad`

Load an entity or array of entities from the database.

You can pass a struct of query options, including pagination, caching, and sort options.
 
 <h2>Parameters</h2>
 The <code>parameters</code> argument can be used to bind parameters to the SQL query.
 You can use either an array of binding parameters or a struct of named binding parameters.
 
 <h2>Options</h2>
 
 <ul>
 <li><strong><code>unique</code></strong> - Boolean. Specifies whether to retrieve a single, unique item. Default is `false`.</li>
 <li><strong><code>ignorecase</code></strong> - Boolean. Ignores the case of sort order when set to true. Use only if you specify the sortorder
 parameter. Defaults to `false`.</li>
 <li><strong><code>offset</code></strong> - Number. Specifies the pagination offset. Defaults to 0.</li>
 <li><strong><code>maxresults</code></strong> - Number. Specifies the maximum number of objects to be retrieved.</li>
 <li><strong><code>cacheable</code></strong> - Boolean. Whether the result has to be cached in the secondary cache. Default is `false`.</li>
 <li><strong><code>cachename</code></strong> - String. Name of the cache in secondary cache.</li>
 <li><strong><code>timeout</code></strong> - Number. Specifies the timeout value (in seconds) for the query. No timeout by default.</li>
 </ul>

## Method Signature

```
EntityLoad(entityName=[string], idOrFilter=[any], uniqueOrOrder=[any], options=[struct])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entityName` | `string` | `true` | The name of the entity to load. |  |
| `idOrFilter` | `any` | `false` | Either the ID of the entity to load, or a struct of filter criteria. |  |
| `uniqueOrOrder` | `any` | `false` | Either a boolean indicating whether to return a unique result, or a string/array of order by clauses. |  |
| `options` | `struct` | `false` | A struct of options to modify the load operation. See below for supported options. |  |

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

## Related

  * [EntityDelete](./EntityDelete.md)
  * [EntityLoadByExample](./EntityLoadByExample.md)
  * [EntityLoadByPK](./EntityLoadByPK.md)
  * [EntityMerge](./EntityMerge.md)
  * [EntityNameArray](./EntityNameArray.md)
  * [EntityNameList](./EntityNameList.md)
  * [EntityNew](./EntityNew.md)
  * [EntityReload](./EntityReload.md)
  * [EntitySave](./EntitySave.md)
  * [EntityToQuery](./EntityToQuery.md)
  * [ORMClearSession](./ORMClearSession.md)
  * [ORMCloseAllSessions](./ORMCloseAllSessions.md)
  * [ORMCloseSession](./ORMCloseSession.md)
  * [ORMEvictCollection](./ORMEvictCollection.md)
  * [ORMEvictEntity](./ORMEvictEntity.md)
  * [ORMEvictQueries](./ORMEvictQueries.md)
  * [ORMExecuteQuery](./ORMExecuteQuery.md)
  * [ORMFlush](./ORMFlush.md)
  * [ORMFlushAll](./ORMFlushAll.md)
  * [ORMGetHibernateVersion](./ORMGetHibernateVersion.md)
  * [ORMGetSession](./ORMGetSession.md)
  * [ORMGetSessionFactory](./ORMGetSessionFactory.md)
  * [ORMReload](./ORMReload.md)

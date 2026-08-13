[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityToQuery`

Convert an entity or array of entities to a Query object.

## Method Signature

```
EntityToQuery(entity=[Any], name=[Any])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entity` | `Any` | `true` | An instance of an ORM entity or an array of entities. |  |
| `name` | `Any` | `false` | The name of the entity. Required if `entity` is an array. |  |

## Examples

### Convert a Single Entity
Pass one loaded entity to get a single-row query result.

```java
result = entityToQuery( entityLoadByPK( "Vehicle", "1HGCM82633A123456" ), "Vehicle" );
```

### Convert an Entity Array
Pass an array of entities to get one row per entity.

```java
result = entityToQuery( entityLoad( "Vehicle", { Make = "Honda" } ), "Vehicle" );
```

You can also omit the entity name and let the function infer it from the entity type:

```java
result = entityToQuery( entityLoadByPK( "Vehicle", "1HGCM82633A123456" ) );
```

Note that for performance reasons we recommend passing the entity name explicitly.

## Related

  * [EntityDelete](./EntityDelete.md)
  * [EntityLoad](./EntityLoad.md)
  * [EntityLoadByExample](./EntityLoadByExample.md)
  * [EntityLoadByPK](./EntityLoadByPK.md)
  * [EntityMerge](./EntityMerge.md)
  * [EntityNameArray](./EntityNameArray.md)
  * [EntityNameList](./EntityNameList.md)
  * [EntityNew](./EntityNew.md)
  * [EntityReload](./EntityReload.md)
  * [EntitySave](./EntitySave.md)
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

[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `ORMEvictCollection`

Evict all entity data for a given collection on a given entity type from the second-level cache.

## Method Signature

```
ORMEvictCollection(entityName=[String], collectionName=[String], primaryKey=[String])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entityName` | `String` | `true` | The name of the entity on which the collection is defined. |  |
| `collectionName` | `String` | `true` | The name of the collection property to evict. |  |
| `primaryKey` | `String` | `false` | Optional primary key of the entity instance for which to evict the collection. If not provided, all cached data for the<br>                      collection will be evicted. |  |

## Examples



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
  * [EntityToQuery](./EntityToQuery.md)
  * [ORMClearSession](./ORMClearSession.md)
  * [ORMCloseAllSessions](./ORMCloseAllSessions.md)
  * [ORMCloseSession](./ORMCloseSession.md)
  * [ORMEvictEntity](./ORMEvictEntity.md)
  * [ORMEvictQueries](./ORMEvictQueries.md)
  * [ORMExecuteQuery](./ORMExecuteQuery.md)
  * [ORMFlush](./ORMFlush.md)
  * [ORMFlushAll](./ORMFlushAll.md)
  * [ORMGetHibernateVersion](./ORMGetHibernateVersion.md)
  * [ORMGetSession](./ORMGetSession.md)
  * [ORMGetSessionFactory](./ORMGetSessionFactory.md)
  * [ORMReload](./ORMReload.md)

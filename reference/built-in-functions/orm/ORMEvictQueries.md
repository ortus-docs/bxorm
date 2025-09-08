[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `ORMEvictQueries`

Evict all queries from the named or default cache on the named or default datasource.

## Method Signature

```
ORMEvictQueries(cacheName=[String], datasource=[String])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `cacheName` | `String` | `false` | The name of the cache region to evict. If not provided, the default query cache will be evicted. |  |
| `datasource` | `String` | `false` | The name of the datasource on which to evict the cache. If not provided, the default datasource will be used. |  |

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
  * [ORMEvictCollection](./ORMEvictCollection.md)
  * [ORMEvictEntity](./ORMEvictEntity.md)
  * [ORMExecuteQuery](./ORMExecuteQuery.md)
  * [ORMFlush](./ORMFlush.md)
  * [ORMFlushAll](./ORMFlushAll.md)
  * [ORMGetHibernateVersion](./ORMGetHibernateVersion.md)
  * [ORMGetSession](./ORMGetSession.md)
  * [ORMGetSessionFactory](./ORMGetSessionFactory.md)
  * [ORMReload](./ORMReload.md)

[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityLoadByExample`

Load entities matching an example entity.

## Method Signature

```
EntityLoadByExample(sampleEntity=[any], unique=[boolean])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `sampleEntity` | `any` | `true` | Instance of an ORM entity to use as an example for the query. |  |
| `unique` | `boolean` | `false` | Whether to return a single unique result (true) or an array of results (false). | `false` |

## Examples



## Related

  * [EntityDelete](./EntityDelete.md)
  * [EntityLoad](./EntityLoad.md)
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

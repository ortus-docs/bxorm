[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityLoad`

Load an entity or array of entities from the database.

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

[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityNameList`

Retrieve an array of entity names for this ORM application.

## Method Signature

```
EntityNameList(delimiter=[String], datasource=[String])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `delimiter` | `String` | `false` | The delimiter to use between entity names. | `,` |
| `datasource` | `String` | `false` | The name of the datasource to filter on. If provided, only entities configured for this datasource will be returned. |  |

## Examples



## Related

  * [EntityDelete](./EntityDelete.md)
  * [EntityLoad](./EntityLoad.md)
  * [EntityLoadByExample](./EntityLoadByExample.md)
  * [EntityLoadByPK](./EntityLoadByPK.md)
  * [EntityMerge](./EntityMerge.md)
  * [EntityNameArray](./EntityNameArray.md)
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

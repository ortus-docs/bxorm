[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntitySave`

Save the provided entity to the persistence context

## Method Signature

```
EntitySave(entity=[Any], forceinsert=[Boolean])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entity` | `Any` | `true` | The entity instance to save. |  |
| `forceinsert` | `Boolean` | `false` | If true, will force an insert operation. Otherwise, a save or update operation will be performed (an insert for a new entity, an update for an existing one). |  |

## Examples

### Save a New Entity
Create a new entity and persist it in one flow.

```java
entitySave( entityNew( "Manufacturer", { name: "Audi Corp", address: "101 Audi Way" } ) );
```

### Force Insert Behavior
Use the second argument when you need explicit insert-oriented behavior.

```java
manufacturer = entityNew( "Manufacturer", { name: "Volvo", address: "123 Main St" } );
entitySave( manufacturer, true );
```

## Related

  * [EntityCriteria](./EntityCriteria.md)
  * [EntityDelete](./EntityDelete.md)
  * [EntityEvict](./EntityEvict.md)
  * [EntityGetDatasource](./EntityGetDatasource.md)
  * [EntityGetDirtyProperties](./EntityGetDirtyProperties.md)
  * [EntityGetId](./EntityGetId.md)
  * [EntityGetMetadata](./EntityGetMetadata.md)
  * [EntityGetName](./EntityGetName.md)
  * [EntityGetReference](./EntityGetReference.md)
  * [EntityIsAttached](./EntityIsAttached.md)
  * [EntityIsDirty](./EntityIsDirty.md)
  * [EntityLoad](./EntityLoad.md)
  * [EntityLoadByExample](./EntityLoadByExample.md)
  * [EntityLoadByPK](./EntityLoadByPK.md)
  * [EntityLoadByPKOrFail](./EntityLoadByPKOrFail.md)
  * [EntityLoadOrFail](./EntityLoadOrFail.md)
  * [EntityLoadOrNew](./EntityLoadOrNew.md)
  * [EntityLoadOrSave](./EntityLoadOrSave.md)
  * [EntityLoadReadOnly](./EntityLoadReadOnly.md)
  * [EntityLock](./EntityLock.md)
  * [EntityMerge](./EntityMerge.md)
  * [EntityNameArray](./EntityNameArray.md)
  * [EntityNameList](./EntityNameList.md)
  * [EntityNew](./EntityNew.md)
  * [EntityReload](./EntityReload.md)
  * [EntityToQuery](./EntityToQuery.md)
  * [ORMClearSession](./ORMClearSession.md)
  * [ORMCloseAllSessions](./ORMCloseAllSessions.md)
  * [ORMCloseSession](./ORMCloseSession.md)
  * [ORMDiagnostics](./ORMDiagnostics.md)
  * [ORMEvictCollection](./ORMEvictCollection.md)
  * [ORMEvictEntity](./ORMEvictEntity.md)
  * [ORMEvictQueries](./ORMEvictQueries.md)
  * [ORMExecuteQuery](./ORMExecuteQuery.md)
  * [ORMFlush](./ORMFlush.md)
  * [ORMFlushAll](./ORMFlushAll.md)
  * [ORMGetHibernateVersion](./ORMGetHibernateVersion.md)
  * [ORMGetSession](./ORMGetSession.md)
  * [ORMGetSessionFactory](./ORMGetSessionFactory.md)
  * [ORMGetSessionStatistics](./ORMGetSessionStatistics.md)
  * [ORMIsSessionDirty](./ORMIsSessionDirty.md)
  * [ORMReadOnly](./ORMReadOnly.md)
  * [ORMReload](./ORMReload.md)

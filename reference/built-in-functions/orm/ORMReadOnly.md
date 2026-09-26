[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `ORMReadOnly`

Run a closure with every entity it loads read-only, and return what the closure returns.

Read-only entities are not dirty-checked, so reports and exports over many entities use less memory and flush faster, and changes made to them by mistake are never saved.

Only entities loaded inside the closure are read-only: entities already in the session keep their state, and new entities can still be saved. Blocks can nest.

## Method Signature

```
ORMReadOnly(callback=[Function])
```

### Arguments

| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `callback` | `Function` | `true` | The closure to run. |  |

Returns what the closure returned.

## Examples

```java
total = ormReadOnly( () => {
    return entityLoad( "Order", { status : "shipped" } ).reduce( ( sum, o ) => sum + o.getTotal(), 0 );
} );
```

An export where nothing loaded can be saved by mistake:

```java
ormReadOnly( () => {
    entityCriteria( "Customer" ).isTrue( "active" ).each( ( customer ) => {
        writeOutput( customer.getName() & "," & customer.getEmail() & chr( 10 ) );
    } );
} );
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
  * [EntitySave](./EntitySave.md)
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
  * [ORMReload](./ORMReload.md)

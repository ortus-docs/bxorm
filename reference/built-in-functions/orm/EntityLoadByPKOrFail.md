[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityLoadByPKOrFail`

Load an entity by its primary key, or throw an `orm.notFound` error when no row has that id.

Takes the same options as [EntityLoadByPK](./EntityLoadByPK.md): `lock`, `timeout`, `skipLocked` and `readOnly`.

## Method Signature

```
EntityLoadByPKOrFail(entity=[String], id=[Any], options=[Struct])
```

### Arguments

| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entity` | `String` | `true` | The name of the entity to load. |  |
| `id` | `Any` | `true` | The primary key value, or a struct of key/value pairs for composite keys. |  |
| `options` | `Struct` | `false` | A struct of load options: `lock`, `timeout`, `skipLocked`, `readOnly`. See [EntityLoadByPK](./EntityLoadByPK.md). |  |

Returns the entity.

## Examples

```java
order = entityLoadByPKOrFail( "Order", url.id );
```

Load and lock the row in one step:

```java
transaction {
    order = entityLoadByPKOrFail( "Order", url.id, { lock : "write" } );
    order.setStatus( "paid" );
}
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
  * [ORMReadOnly](./ORMReadOnly.md)
  * [ORMReload](./ORMReload.md)

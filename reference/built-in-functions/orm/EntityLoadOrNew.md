[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityLoadOrNew`

Load an entity by id or filter, or return a new, unsaved one when none exists.

* When an entity is found, it is returned as is. `properties` is ignored.
* Otherwise a new entity is created and filled with the filter's values (or with the id, but only when the entity's id is assigned: no `generator`, or `generator="assigned"`), then with `properties`, which win.

The new entity is not saved: call `entitySave()` when you want it stored, or use [EntityLoadOrSave](./EntityLoadOrSave.md). A filter must match at most one entity, otherwise an `orm.query.nonUnique` error is raised.

As with `entityNew()`, the `postNew` event fires for the new entity (when `eventHandling` is enabled).

## Method Signature

```
EntityLoadOrNew(entityName=[String], idOrFilter=[Any], properties=[Struct])
```

### Arguments

| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entityName` | `String` | `true` | The name of the entity. |  |
| `idOrFilter` | `Any` | `true` | The primary key value, a composite key struct, or a struct of property values to match. |  |
| `properties` | `Struct` | `false` | Property values for the new entity when none is found. |  |

Returns the entity found, or a new, unsaved one.

## Examples

```java
user = entityLoadOrNew( "User", { email : "ann@example.com" }, { status : "invited" } );
if ( !entityIsAttached( user ) ) {
    // a new user: email is "ann@example.com", status is "invited"
    entitySave( user );
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
  * [EntityLoadByPKOrFail](./EntityLoadByPKOrFail.md)
  * [EntityLoadOrFail](./EntityLoadOrFail.md)
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

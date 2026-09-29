# EntityLoadOrNew

Load an entity by id or filter, or return a new, unsaved one when none exists.

* When an entity is found, it is returned as is. `properties` is ignored.
* Otherwise a new entity is created and filled with the filter's values (or with the id, but only when the entity's id is assigned: no `generator`, or `generator="assigned"`), then with `properties`, which win.

The new entity is not saved: call `entitySave()` when you want it stored, or use [EntityLoadOrSave](entityloadorsave.md). A filter must match at most one entity, otherwise an `orm.query.nonUnique` error is raised.

As with `entityNew()`, the `postNew` event fires for the new entity (when `eventHandling` is enabled).

## Method Signature

```
EntityLoadOrNew(entityName=[String], idOrFilter=[Any], properties=[Struct])
```

### Arguments

| Argument     | Type     | Required | Description                                                                             | Default |
| ------------ | -------- | -------- | --------------------------------------------------------------------------------------- | ------- |
| `entityName` | `String` | `true`   | The name of the entity.                                                                 |         |
| `idOrFilter` | `Any`    | `true`   | The primary key value, a composite key struct, or a struct of property values to match. |         |
| `properties` | `Struct` | `false`  | Property values for the new entity when none is found.                                  |         |

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

* [EntityCriteria](entitycriteria.md)
* [EntityDelete](entitydelete.md)
* [EntityEvict](entityevict.md)
* [EntityGetDatasource](entitygetdatasource.md)
* [EntityGetDirtyProperties](entitygetdirtyproperties.md)
* [EntityGetId](entitygetid.md)
* [EntityGetMetadata](entitygetmetadata.md)
* [EntityGetName](entitygetname.md)
* [EntityGetReference](entitygetreference.md)
* [EntityIsAttached](entityisattached.md)
* [EntityIsDirty](entityisdirty.md)
* [EntityLoad](entityload.md)
* [EntityLoadAsStruct](entityloadasstruct.md)
* [EntityLoadByExample](entityloadbyexample.md)
* [EntityLoadByPK](entityloadbypk.md)
* [EntityLoadByPKOrFail](entityloadbypkorfail.md)
* [EntityLoadOrFail](entityloadorfail.md)
* [EntityLoadOrSave](entityloadorsave.md)
* [EntityLoadReadOnly](entityloadreadonly.md)
* [EntityLock](entitylock.md)
* [EntityMerge](entitymerge.md)
* [EntityNameArray](entitynamearray.md)
* [EntityNameList](entitynamelist.md)
* [EntityNew](entitynew.md)
* [EntityReload](entityreload.md)
* [EntitySave](entitysave.md)
* [EntityToQuery](entitytoquery.md)
* [EntityToStruct](entitytostruct.md)
* [ORMClearSession](ormclearsession.md)
* [ORMCloseAllSessions](ormcloseallsessions.md)
* [ORMCloseSession](ormclosesession.md)
* [ORMDiagnostics](ormdiagnostics.md)
* [ORMEvictCollection](ormevictcollection.md)
* [ORMEvictEntity](ormevictentity.md)
* [ORMEvictQueries](ormevictqueries.md)
* [ORMExecuteQuery](ormexecutequery.md)
* [ORMFlush](ormflush.md)
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSQLFunctions](ormgetsqlfunctions.md)
* [ORMGetSession](ormgetsession.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMGetSessionStatistics](ormgetsessionstatistics.md)
* [ORMIsSessionDirty](ormissessiondirty.md)
* [ORMReadOnly](ormreadonly.md)
* [ORMReload](ormreload.md)

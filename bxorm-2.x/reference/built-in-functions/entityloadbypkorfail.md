# EntityLoadByPKOrFail

Load an entity by its primary key, or throw an `orm.notFound` error when no row has that id.

Takes the same options as [EntityLoadByPK](entityloadbypk.md): `lock`, `timeout`, `skipLocked` and `readOnly`.

## Method Signature

```
EntityLoadByPKOrFail(entity=[String], id=[Any], options=[Struct])
```

### Arguments

| Argument  | Type     | Required | Description                                                                                                     | Default |
| --------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------- | ------- |
| `entity`  | `String` | `true`   | The name of the entity to load.                                                                                 |         |
| `id`      | `Any`    | `true`   | The primary key value, or a struct of key/value pairs for composite keys.                                       |         |
| `options` | `Struct` | `false`  | A struct of load options: `lock`, `timeout`, `skipLocked`, `readOnly`. See [EntityLoadByPK](entityloadbypk.md). |         |

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
* [EntityLoadOrFail](entityloadorfail.md)
* [EntityLoadOrNew](entityloadornew.md)
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

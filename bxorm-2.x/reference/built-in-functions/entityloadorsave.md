# EntityLoadOrSave

Load an entity by id or filter, or create and save a new one when none exists.

Works like [EntityLoadOrNew](entityloadornew.md), then saves the new entity with `entitySave()`. As with any save, the row is written when the session flushes (at the end of the `transaction{}`). A found entity is returned as is, and `properties` is ignored.

{% hint style="warning" %}
Two requests can both find nothing and both insert. Put a unique constraint on the filter's columns (for example `unique="true"` or `uniquekey`) so the database rejects the second insert.
{% endhint %}

## Method Signature

```
EntityLoadOrSave(entityName=[String], idOrFilter=[Any], properties=[Struct])
```

### Arguments

| Argument     | Type     | Required | Description                                                                             | Default |
| ------------ | -------- | -------- | --------------------------------------------------------------------------------------- | ------- |
| `entityName` | `String` | `true`   | The name of the entity.                                                                 |         |
| `idOrFilter` | `Any`    | `true`   | The primary key value, a composite key struct, or a struct of property values to match. |         |
| `properties` | `Struct` | `false`  | Property values for the new entity when none is found.                                  |         |

Returns the entity found, or the new one, saved.

## Examples

```java
transaction {
    tag = entityLoadOrSave( "Tag", { slug : "boxlang" }, { name : "BoxLang" } );
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
* [EntityLoadOrNew](entityloadornew.md)
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

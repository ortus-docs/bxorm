# EntityLoadReadOnly

Load entities like [EntityLoad](entityload.md), read-only: they are not dirty-checked and changes to them are never saved. Takes the same arguments and options as `entityLoad()`, with the `readOnly` option always on.

An entity that is already in the session keeps its state.

## Method Signature

```
EntityLoadReadOnly(entityName=[string], idOrFilter=[any], uniqueOrOrder=[any], options=[struct])
```

### Arguments

| Argument        | Type     | Required | Description                                                                                           | Default |
| --------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------- | ------- |
| `entityName`    | `string` | `true`   | The name of the entity to load.                                                                       |         |
| `idOrFilter`    | `any`    | `false`  | Either the ID of the entity to load, or a struct of filter criteria.                                  |         |
| `uniqueOrOrder` | `any`    | `false`  | Either a boolean indicating whether to return a unique result, or a string/array of order by clauses. |         |
| `options`       | `struct` | `false`  | A struct of options, as for `entityLoad()`. `readOnly` is always on.                                  |         |

Returns an array of read-only entities, or one entity (or `null`) for a unique load.

## Examples

```java
orders = entityLoadReadOnly( "Order", { status : "shipped" }, "createdDate desc" );
order  = entityLoadReadOnly( "Order", 42, true );
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
* [EntityLoadOrSave](entityloadorsave.md)
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

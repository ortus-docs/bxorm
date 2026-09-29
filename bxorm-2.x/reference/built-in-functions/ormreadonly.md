# ORMReadOnly

Run a closure with every entity it loads read-only, and return what the closure returns.

Read-only entities are not dirty-checked, so reports and exports over many entities use less memory and flush faster, and changes made to them by mistake are never saved.

Only entities loaded inside the closure are read-only: entities already in the session keep their state, and new entities can still be saved. Blocks can nest.

## Method Signature

```
ORMReadOnly(callback=[Function])
```

### Arguments

| Argument   | Type       | Required | Description         | Default |
| ---------- | ---------- | -------- | ------------------- | ------- |
| `callback` | `Function` | `true`   | The closure to run. |         |

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
* [ORMReload](ormreload.md)

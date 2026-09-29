# EntityLock

Lock an entity's row in the database until the current transaction ends.

Modes:

* `write` (default): an exclusive lock (`select ... for update`). Other transactions wait to lock or change the row.
* `read`: a shared lock. Others can read and share-lock the row, nobody can change it.
* `force`: an exclusive lock that also increments the entity's version. Versioned entities only (a `fieldtype="version"` or `"timestamp"` property); any other entity raises `orm.argument`.

The entity must be in the session (loaded in this request and not evicted), otherwise an `orm.transient` error is raised. `entityLock()` must run inside `transaction{}`, otherwise an `orm.argument` error ("needs a transaction") is raised. The lock is released when the transaction ends.

To load and lock in one step, use `entityLoadByPK( name, id, { lock : "write" } )`.

## Method Signature

```
EntityLock(entity=[Any], mode=[String], options=[Struct])
```

### Arguments

| Argument  | Type     | Required | Description                                                                                     | Default |
| --------- | -------- | -------- | ----------------------------------------------------------------------------------------------- | ------- |
| `entity`  | `Any`    | `true`   | The entity to lock.                                                                             |         |
| `mode`    | `String` | `false`  | The lock mode: `write`, `read` or `force`.                                                      | `write` |
| `options` | `Struct` | `false`  | Lock options: `timeout` (seconds to wait for the lock; `0` means do not wait) and `skipLocked`. |         |

Returns `null`.

## Examples

```java
transaction {
    account = entityLoadByPK( "Account", id );
    entityLock( account );
    account.setBalance( account.getBalance() - amount );
}
```

Wait at most 5 seconds for the lock:

```java
transaction {
    entityLock( account, "write", { timeout : 5 } );
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
* [EntityLoadOrSave](entityloadorsave.md)
* [EntityLoadReadOnly](entityloadreadonly.md)
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

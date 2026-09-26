[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityLock`

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

| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entity` | `Any` | `true` | The entity to lock. |  |
| `mode` | `String` | `false` | The lock mode: `write`, `read` or `force`. | `write` |
| `options` | `Struct` | `false` | Lock options: `timeout` (seconds to wait for the lock; `0` means do not wait) and `skipLocked`. |  |

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

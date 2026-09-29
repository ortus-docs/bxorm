# EntityEvict

Remove one entity, or an array of entities, from the ORM session. The session stops tracking them: later changes to an evicted entity are not saved, and loading it again reads it fresh from the database. Nothing is deleted.

Unsaved changes to an evicted entity are dropped, so flush first (`ormFlush()`) if you want to keep them. Evicting an entity that is not in the session does nothing.

This is not the same as [ORMEvictEntity](ormevictentity.md), which removes cached data from the second-level cache and leaves the session alone.

## Method Signature

```
EntityEvict(entity=[Any])
```

### Arguments

| Argument | Type  | Required | Description                                                     | Default |
| -------- | ----- | -------- | --------------------------------------------------------------- | ------- |
| `entity` | `Any` | `true`   | An entity, or an array of entities, to remove from the session. |         |

Returns `null`.

## Examples

```java
entityEvict( user );
entityEvict( [ user, order ] );
```

Changes made after the eviction are not saved:

```java
user = entityLoadByPK( "User", 1 );
entityEvict( user );
user.setEmail( "new@example.com" );
ormFlush();                            // no UPDATE: the session no longer tracks the user
entityIsAttached( user );              // false
```

## Related

* [EntityCriteria](entitycriteria.md)
* [EntityDelete](entitydelete.md)
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
* [ORMReadOnly](ormreadonly.md)
* [ORMReload](ormreload.md)

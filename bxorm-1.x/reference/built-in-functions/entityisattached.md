# EntityIsAttached

Check whether an entity is attached to the current ORM session.

## Method Signature

```
EntityIsAttached(entity=[Any])
```

### Arguments

| Argument | Type  | Required | Description                   | Default |
| -------- | ----- | -------- | ----------------------------- | ------- |
| `entity` | `Any` | `true`   | The entity instance to check. |         |

## Examples

Check whether a loaded entity is still attached to its datasource's session:

```java
manufacturer = entityLoadByPK( "Manufacturer", 1 );
isAttached   = entityIsAttached( manufacturer );

ormEvictEntity( "Manufacturer" );
isAttached   = entityIsAttached( manufacturer ); // false
```

## Related

* [EntityDelete](entitydelete.md)
* [EntityLoad](entityload.md)
* [EntityLoadByExample](entityloadbyexample.md)
* [EntityLoadByPK](entityloadbypk.md)
* [EntityMerge](entitymerge.md)
* [EntityNameArray](entitynamearray.md)
* [EntityNameList](entitynamelist.md)
* [EntityNew](entitynew.md)
* [EntityReload](entityreload.md)
* [EntitySave](entitysave.md)
* [EntityToQuery](entitytoquery.md)
* [ORMClearSession](ormclearsession.md)
* [ORMCloseAllSessions](ormcloseallsessions.md)
* [ORMCloseSession](ormclosesession.md)
* [ORMEvictCollection](ormevictcollection.md)
* [ORMEvictEntity](ormevictentity.md)
* [ORMEvictQueries](ormevictqueries.md)
* [ORMExecuteQuery](ormexecutequery.md)
* [ORMFlush](ormflush.md)
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSession](ormgetsession.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMReload](ormreload.md)

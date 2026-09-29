# EntityMerge

Merge the state of the given entity into the current persistence context (session).

## Method Signature

```
EntityMerge(entity=[Any])
```

### Arguments

| Argument | Type  | Required | Description                   | Default |
| -------- | ----- | -------- | ----------------------------- | ------- |
| `entity` | `Any` | `true`   | The entity instance to merge. |         |

## Examples

```java
vehicle = entityLoadByPK( "Vehicle", "1HGCM82633A123456" );
ormGetSession().detach( vehicle );

vehicle.setModel( "Accord EX" );
entityMerge( vehicle );
ormFlush();
```

## Related

* [EntityDelete](entitydelete.md)
* [EntityIsAttached](entityisattached.md)
* [EntityLoad](entityload.md)
* [EntityLoadByExample](entityloadbyexample.md)
* [EntityLoadByPK](entityloadbypk.md)
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

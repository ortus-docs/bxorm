# ORMFlush

Flush the Hibernate session - synchronizing the in-memory state with the database.

## Method Signature

```
ORMFlush(datasource=[String])
```

### Arguments

| Argument     | Type     | Required | Description                                                                                                 | Default |
| ------------ | -------- | -------- | ----------------------------------------------------------------------------------------------------------- | ------- |
| `datasource` | `String` | `false`  | The datasource on which to flush the current session. If not provided, the default datasource will be used. |         |

## Examples

Flush the ORM session for the default datasource:

```java
ormFlush();
```

Flush the ORM session for a secondary, named datasource:

```java
ormFlush( "admin" );
```

## Related

* [EntityDelete](entitydelete.md)
* [EntityIsAttached](entityisattached.md)
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
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSession](ormgetsession.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMReload](ormreload.md)

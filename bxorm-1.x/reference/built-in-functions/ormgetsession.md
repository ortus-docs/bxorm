# ORMGetSession

Retrieve the Hibernate Session configured for this datasource or default datasource.

## Method Signature

```
ORMGetSession(datasource=[String])
```

### Arguments

| Argument     | Type     | Required | Description                                                                                                             | Default |
| ------------ | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ------- |
| `datasource` | `String` | `false`  | The name of the datasource to retrieve the Session for. If not specified, the Application's default datasource is used. |         |

## Examples

Retrieve the ORM session for the default datasource:

```java
session = ormGetSession();
```

Retrieve the ORM session for the "admin" datasource:

```java
session = ormGetSession( "admin" );
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
* [ORMFlush](ormflush.md)
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMReload](ormreload.md)

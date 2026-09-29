# ORMGetSessionFactory

Retrieve the Hibernate SessionFactory configured for this datasource or default datasource.

## Method Signature

```
ORMGetSessionFactory(datasource=[String])
```

### Arguments

| Argument     | Type     | Required | Description                                                                                                                    | Default |
| ------------ | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `datasource` | `String` | `false`  | The name of the datasource to retrieve the SessionFactory for. If not specified, the Application's default datasource is used. |         |

## Examples

Omitting a datasource name will return the default session factory:

```java
factory = ormGetSessionFactory();
```

Pass a datasource name when working with alternate datasources within the ORM app:

```java
factory = ormGetSessionFactory( "admin" );
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
* [ORMGetSession](ormgetsession.md)
* [ORMReload](ormreload.md)

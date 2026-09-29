# ORMCloseSession

Close the Hibernate session for the current context and provided (or default) datasource

## Method Signature

```
ORMCloseSession(datasource=[String])
```

### Arguments

| Argument     | Type     | Required | Description                                                                                                 | Default |
| ------------ | -------- | -------- | ----------------------------------------------------------------------------------------------------------- | ------- |
| `datasource` | `String` | `false`  | The datasource on which to close the current session. If not provided, the default datasource will be used. |         |

## Examples

Close the ORM session for the default datasource:

```java
ormCloseSession();
```

Close the ORM session for a secondary, named datasource:

```java
ormCloseSession( "admin" );
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

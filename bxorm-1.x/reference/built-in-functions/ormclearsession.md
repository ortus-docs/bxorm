# ORMClearSession

Clear the Hibernate session for the current context and provided (or default) datasource

## Method Signature

```
ORMClearSession(datasource=[String])
```

### Arguments

| Argument     | Type     | Required | Description                                                                                                 | Default |
| ------------ | -------- | -------- | ----------------------------------------------------------------------------------------------------------- | ------- |
| `datasource` | `String` | `false`  | The datasource on which to clear the current session. If not provided, the default datasource will be used. |         |

## Examples

Clear the ORM session for the default datasource:

```java
ormClearSession();
```

Since an ORM session is datasource-specific, you can clear a specific session by passing the datasource name:

```java
ormClearSession( "hr" );
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

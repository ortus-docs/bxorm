# EntityNameArray

Retrieve an array of entity names for this ORM application.

## Method Signature

```
EntityNameArray(delimiter=[String], datasource=[String])
```

### Arguments

| Argument     | Type     | Required | Description                                                                                                          | Default |
| ------------ | -------- | -------- | -------------------------------------------------------------------------------------------------------------------- | ------- |
| `delimiter`  | `String` | `false`  | The delimiter to use between entity names.                                                                           | `,`     |
| `datasource` | `String` | `false`  | The name of the datasource to filter on. If provided, only entities configured for this datasource will be returned. |         |

## Examples

Retrieve names of all entities in the ORM app:

```java
entityNames = entityNameArray();
```

Retrieve entity names for entities under a specific datasource:

```java
entityNames = entityNameArray( datasource = "admin" );
```

## Related

* [EntityDelete](entitydelete.md)
* [EntityIsAttached](entityisattached.md)
* [EntityLoad](entityload.md)
* [EntityLoadByExample](entityloadbyexample.md)
* [EntityLoadByPK](entityloadbypk.md)
* [EntityMerge](entitymerge.md)
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

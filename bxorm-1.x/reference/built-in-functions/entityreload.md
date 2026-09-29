# EntityReload

Reload an entity from the database.

Will repopulate all persistent properties on the entity with the latest values from the database.

## Method Signature

```
EntityReload(entity=[Any])
```

### Arguments

| Argument | Type  | Required | Description                    | Default |
| -------- | ----- | -------- | ------------------------------ | ------- |
| `entity` | `Any` | `true`   | The entity instance to reload. |         |

## Examples

Reload an entity by passing the entity object directly:

```java
manufacturer = entityLoadByPK( "Manufacturer", 1 );
reloaded = entityReload( manufacturer );
```

Reload all in-session entities by entity name:

```java
manufacturer = entityLoadByPK( "Manufacturer", 1 );
reloaded = entityReload( "manufacturer" );
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

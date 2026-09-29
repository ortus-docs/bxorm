# ORMEvictCollection

Evict all entity data for a given collection on a given entity type from the second-level cache.

## Method Signature

```
ORMEvictCollection(entityName=[String], collectionName=[String], primaryKey=[String])
```

### Arguments

| Argument         | Type     | Required | Description                                                                                                                                                   | Default |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `entityName`     | `String` | `true`   | The name of the entity on which the collection is defined.                                                                                                    |         |
| `collectionName` | `String` | `true`   | The name of the collection property to evict.                                                                                                                 |         |
| `primaryKey`     | `String` | `false`  | <p>Optional primary key of the entity instance for which to evict the collection. If not provided, all cached data for the<br>collection will be evicted.</p> |         |

## Examples

Evict all cached entries for a collection mapping:

```java
ormEvictCollection( "Manufacturer", "vehicles" );
```

You can also pass a primary key to evict the collection for a specific entity:

```java
record = entityLoadByPK( "Manufacturer", 1 );
ormEvictCollection( "Manufacturer", "vehicles", record.getId() );
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
* [ORMEvictEntity](ormevictentity.md)
* [ORMEvictQueries](ormevictqueries.md)
* [ORMExecuteQuery](ormexecutequery.md)
* [ORMFlush](ormflush.md)
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSession](ormgetsession.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMReload](ormreload.md)

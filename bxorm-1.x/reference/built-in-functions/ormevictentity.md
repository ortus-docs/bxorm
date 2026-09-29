# ORMEvictEntity

Evict all entity data for this entity name from the second-level cache.

## Method Signature

```
ORMEvictEntity(entityName=[String], primaryKey=[String])
```

### Arguments

| Argument     | Type     | Required | Description                                                                                                                                            | Default |
| ------------ | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `entityName` | `String` | `true`   | The name of the entity on which to evict all cached data.                                                                                              |         |
| `primaryKey` | `String` | `false`  | <p>Optional primary key of the entity instance for which to evict cached data. If not provided, all cached data for the entity<br>will be evicted.</p> |         |

## Examples

### Evict All Entities by Type

Clear second-level cache entries for a full entity type.

```java
ormEvictEntity( "Manufacturer" );
```

### Evict Entity by Primary Key

Pass the primary key to remove a single entity cache entry.

```java
record = entityLoadByPK( "Manufacturer", 1 );
ormEvictEntity( "Manufacturer", record.getId() );
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
* [ORMEvictQueries](ormevictqueries.md)
* [ORMExecuteQuery](ormexecutequery.md)
* [ORMFlush](ormflush.md)
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSession](ormgetsession.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMReload](ormreload.md)

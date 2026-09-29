# ORMEvictQueries

Evict all queries from the named or default cache on the named or default datasource.

## Method Signature

```
ORMEvictQueries(cacheName=[String], datasource=[String])
```

### Arguments

| Argument     | Type     | Required | Description                                                                                                   | Default |
| ------------ | -------- | -------- | ------------------------------------------------------------------------------------------------------------- | ------- |
| `cacheName`  | `String` | `false`  | The name of the cache region to evict. If not provided, the default query cache will be evicted.              |         |
| `datasource` | `String` | `false`  | The name of the datasource on which to evict the cache. If not provided, the default datasource will be used. |         |

## Examples

### Evict All Query Caches

Call with no arguments to clear all query cache regions.

```java
ormEvictQueries();
```

### Evict by Region and Datasource Cache

You can target a specific cache region and datasource.

```java
ormEvictQueries( "queries", "admin" );
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
* [ORMExecuteQuery](ormexecutequery.md)
* [ORMFlush](ormflush.md)
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSession](ormgetsession.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMReload](ormreload.md)

# EntityToQuery

Convert an entity or array of entities to a Query object.

## Method Signature

```
EntityToQuery(entity=[Any], name=[Any])
```

### Arguments

| Argument | Type  | Required | Description                                               | Default |
| -------- | ----- | -------- | --------------------------------------------------------- | ------- |
| `entity` | `Any` | `true`   | An instance of an ORM entity or an array of entities.     |         |
| `name`   | `Any` | `false`  | The name of the entity. Required if `entity` is an array. |         |

## Examples

### Convert a Single Entity

Pass one loaded entity to get a single-row query result.

```java
result = entityToQuery( entityLoadByPK( "Vehicle", "1HGCM82633A123456" ), "Vehicle" );
```

### Convert an Entity Array

Pass an array of entities to get one row per entity.

```java
result = entityToQuery( entityLoad( "Vehicle", { Make = "Honda" } ), "Vehicle" );
```

You can also omit the entity name and let the function infer it from the entity type:

```java
result = entityToQuery( entityLoadByPK( "Vehicle", "1HGCM82633A123456" ) );
```

Note that for performance reasons we recommend passing the entity name explicitly.

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

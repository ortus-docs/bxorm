# EntityLoadByExample

Load entities matching an example entity.

## Method Signature

```
EntityLoadByExample(sampleEntity=[any], unique=[boolean])
```

### Arguments

| Argument       | Type      | Required | Description                                                                     | Default |
| -------------- | --------- | -------- | ------------------------------------------------------------------------------- | ------- |
| `sampleEntity` | `any`     | `true`   | Instance of an ORM entity to use as an example for the query.                   |         |
| `unique`       | `boolean` | `false`  | Whether to return a single unique result (true) or an array of results (false). | `false` |

## Examples

Load all matching entities using a sample entity as the filter.

```java
sample = entityNew( "Manufacturer", { name: "Honda" } );
matches = entityLoadByExample( sample );
```

Pass `unique=true` to return a single matching entity:

```java
sample = entityNew( "Manufacturer", { name: "Honda" } );
singleMatch = entityLoadByExample( sample, true );
```

## Related

* [EntityDelete](entitydelete.md)
* [EntityIsAttached](entityisattached.md)
* [EntityLoad](entityload.md)
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
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMReload](ormreload.md)

# EntitySave

Save the provided entity to the persistence context

## Method Signature

```
EntitySave(entity=[Any], forceinsert=[Boolean])
```

### Arguments

| Argument      | Type      | Required | Description                                                                                     | Default |
| ------------- | --------- | -------- | ----------------------------------------------------------------------------------------------- | ------- |
| `entity`      | `Any`     | `true`   | The entity instance to save.                                                                    |         |
| `forceinsert` | `Boolean` | `false`  | If true, will force an insert operation. Otherwise, a saveOrUpdate operation will be performed. |         |

## Examples

### Save a New Entity

Create a new entity and persist it in one flow.

```java
entitySave( entityNew( "Manufacturer", { name: "Audi Corp", address: "101 Audi Way" } ) );
```

### Force Insert Behavior

Use the second argument when you need explicit insert-oriented behavior.

```java
manufacturer = entityNew( "Manufacturer", { name: "Volvo", address: "123 Main St" } );
entitySave( manufacturer, true );
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

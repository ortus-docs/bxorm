# EntityLoadByPK

Load an array of entities by the primary key.

`var myAuto = entityLoadByPK( "Automobile", "1HGCM82633A123456" );`

In Lucee, by default, an array of entities is returned and you must pass a third \`unique=true\` argument to return only a single entity. In BoxLang, only a single entity is returned - matching the Adobe ColdFusion behavior - and no \`unique\` attribute is supported. To return an array of entities, use the \`entityLoad\` BIF.

Composite keys are also supported:

```
 entityLoadByPK( "VehicleType", { make : "Ford", model: "Fusion" } );
 
```

## Method Signature

```
EntityLoadByPK(entity=[String], id=[Any], unique=[String])
```

### Arguments

| Argument | Type     | Required | Description                                                               | Default |
| -------- | -------- | -------- | ------------------------------------------------------------------------- | ------- |
| `entity` | `String` | `true`   | The name of the entity to load.                                           |         |
| `id`     | `Any`    | `true`   | The primary key value, or a struct of key/value pairs for composite keys. |         |
| `unique` | `String` | `false`  | Not implemented. In BoxLang, a single entity is always returned.          |         |

## Examples

### Load by Primary Key

Load entity by primary key:

```java
vehicle = entityLoadByPK( "Vehicle", "1HGCM82633A123456" );
```

### Load by Composite Key

Pass a struct when the entity key is composite.

```java
vehicleType = entityLoadByPK( "VehicleType", { make: "Ford", model: "Fusion" } );
```

## Related

* [EntityDelete](entitydelete.md)
* [EntityIsAttached](entityisattached.md)
* [EntityLoad](entityload.md)
* [EntityLoadByExample](entityloadbyexample.md)
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

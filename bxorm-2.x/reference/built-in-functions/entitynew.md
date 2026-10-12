---
description: Create a new entity, optionally with a struct of properties
---

# EntityNew

Instantiate a new entity, optionally with a struct of properties.

## Method Signature

```
EntityNew(entityName=[String], properties=[Struct])
```

### Arguments


| Argument     | Type     | Required | Description                                           | Default |
| ------------ | -------- | -------- | ----------------------------------------------------- | ------- |
| `entityName` | `String` | `true`   | The name of the entity to create.                     |         |
| `properties` | `Struct` | `false`  | A struct of properties to populate on the new entity. |         |

## Examples

### Creating Simple Entities

Creating an instance of an ORM entity is as simple as calling `entityNew()` with the name of the entity you wish to create. For example, to create a new instance of an entity named `Auto`, you would do the following:

```java
var myEntity = entityNew( "Auto" );
```

To populate the entity with initial values, you can pass a struct of properties as the second argument:

```java
var myEntity = entityNew( "Auto", {
    Make = "Toyota",
    Model = "Camry",
    Year = 2020
} );
```

### Extra Keys

Only keys that match a declared property of the entity (or of a parent class) are set, in any case. Other keys are
skipped, without an error:

```java
// name is set, notAProperty is skipped
var user = entityNew( "User", { name : "Ana", notAProperty : 1 } );
```

Code written for Adobe ColdFusion that passes a third `ignoreExtras` argument keeps working: the argument is accepted and
ignored.

### The `postNew` Event

When `eventHandling` is on, `entityNew()` fires the `postNew` event on the entity and on the global `eventHandler`.

## Related

* [EntityCriteria](entitycriteria.md)
* [EntityDelete](entitydelete.md)
* [EntityEvict](entityevict.md)
* [EntityGetDatasource](entitygetdatasource.md)
* [EntityGetDirtyProperties](entitygetdirtyproperties.md)
* [EntityGetId](entitygetid.md)
* [EntityGetMetadata](entitygetmetadata.md)
* [EntityGetName](entitygetname.md)
* [EntityGetReference](entitygetreference.md)
* [EntityIsAttached](entityisattached.md)
* [EntityIsDirty](entityisdirty.md)
* [EntityLoad](entityload.md)
* [EntityLoadAsStruct](entityloadasstruct.md)
* [EntityLoadByExample](entityloadbyexample.md)
* [EntityLoadByPK](entityloadbypk.md)
* [EntityLoadByPKOrFail](entityloadbypkorfail.md)
* [EntityLoadOrFail](entityloadorfail.md)
* [EntityLoadOrNew](entityloadornew.md)
* [EntityLoadOrSave](entityloadorsave.md)
* [EntityLoadReadOnly](entityloadreadonly.md)
* [EntityLock](entitylock.md)
* [EntityMerge](entitymerge.md)
* [EntityNameArray](entitynamearray.md)
* [EntityNameList](entitynamelist.md)
* [EntityReload](entityreload.md)
* [EntitySave](entitysave.md)
* [EntityToQuery](entitytoquery.md)
* [EntityToStruct](entitytostruct.md)
* [ORMClearSession](ormclearsession.md)
* [ORMCloseAllSessions](ormcloseallsessions.md)
* [ORMCloseSession](ormclosesession.md)
* [ORMDiagnostics](ormdiagnostics.md)
* [ORMEvictCollection](ormevictcollection.md)
* [ORMEvictEntity](ormevictentity.md)
* [ORMEvictQueries](ormevictqueries.md)
* [ORMExecuteQuery](ormexecutequery.md)
* [ORMFlush](ormflush.md)
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSQLFunctions](ormgetsqlfunctions.md)
* [ORMGetSession](ormgetsession.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMGetSessionStatistics](ormgetsessionstatistics.md)
* [ORMIsSessionDirty](ormissessiondirty.md)
* [ORMReadOnly](ormreadonly.md)
* [ORMReload](ormreload.md)

[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityNew`

Instantiate a new entity, optionally with a struct of properties.

## Method Signature

```
EntityNew(entityName=[String], properties=[Struct], ignoreExtras=[Boolean])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entityName` | `String` | `true` | The name of the entity to create. |  |
| `properties` | `Struct` | `false` | A struct of properties to populate on the new entity. |  |
| `ignoreExtras` | `Boolean` | `false` | If false, an error will be thrown if properties are provided that do not exist on the entity. Not implemented. |  |

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

### Ignoring Extra Properties

(Coming soon) By default, `ignoreExtra` is set to `false`, meaning that if you provide properties that do not exist on the entity, an error will be thrown. 

For example, this will throw an error if `Color` is not a defined property on the `Auto` entity:

```java
var myEntity = entityNew( "Auto", {
    Make = "Toyota",
    Model = "Camry",
    Year = 2020,
    Color = "Blue"
}, true );
```
To change this behavior, you can set the `ignoreExtra` argument to `true`:

```java
var myEntity = entityNew( "Auto", {
    Make = "Toyota",
    Model = "Camry",
    Year = 2020,
    Color = "Blue"
}, true );
```

This will create the entity and ignore the `Color` property if it does not exist on the `Auto` entity.

## Related

  * [EntityDelete](./EntityDelete.md)
  * [EntityLoad](./EntityLoad.md)
  * [EntityLoadByExample](./EntityLoadByExample.md)
  * [EntityLoadByPK](./EntityLoadByPK.md)
  * [EntityMerge](./EntityMerge.md)
  * [EntityNameArray](./EntityNameArray.md)
  * [EntityNameList](./EntityNameList.md)
  * [EntityReload](./EntityReload.md)
  * [EntitySave](./EntitySave.md)
  * [EntityToQuery](./EntityToQuery.md)
  * [ORMClearSession](./ORMClearSession.md)
  * [ORMCloseAllSessions](./ORMCloseAllSessions.md)
  * [ORMCloseSession](./ORMCloseSession.md)
  * [ORMEvictCollection](./ORMEvictCollection.md)
  * [ORMEvictEntity](./ORMEvictEntity.md)
  * [ORMEvictQueries](./ORMEvictQueries.md)
  * [ORMExecuteQuery](./ORMExecuteQuery.md)
  * [ORMFlush](./ORMFlush.md)
  * [ORMFlushAll](./ORMFlushAll.md)
  * [ORMGetHibernateVersion](./ORMGetHibernateVersion.md)
  * [ORMGetSession](./ORMGetSession.md)
  * [ORMGetSessionFactory](./ORMGetSessionFactory.md)
  * [ORMReload](./ORMReload.md)

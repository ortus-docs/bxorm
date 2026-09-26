[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityToStruct`

Turn an entity, or an array of entities, into a struct (or an array of structs), for JSON APIs and views.

By default the struct holds the id and the plain properties. Options:

* `includes`: properties, getters (without `get`) or dotted association paths to add, as a list or array: `"id,name,role.name,orders"`. An association with no path below it uses the associated entity's own defaults; with paths below it, only those fields. `"lastLoginTime:lastLogin"` renames a key. `"*"` is every plain property.
* `excludes`: names or dotted paths to leave out (`"passwordHash,orders.total"`).
* `mappers`: a struct of key to `( value, memento ) => newValue`. Mappers run last, on the keys the struct holds. An include that is neither a property nor a getter is a computed key built by its mapper.
* `defaults`: a struct of key to the value to use when the value is null. Otherwise a null becomes an empty string, and a null collection an empty array.
* `ignoreDefaults`: ignore the entity's `this.memento` default includes and excludes.
* `profile`: use a `this.memento.profiles` entry, down the whole graph.

Entities may declare mementifier's `this.memento = { defaultIncludes, defaultExcludes, neverInclude, defaults, mappers, profiles }`; the options add to it. Dates are ISO 8601 strings. An entity that already appears higher up the same branch is written as its id, so cycles end.

Unlike mementifier, an include that is neither a property, a getter nor a mapper key raises an `orm.property.unknown` error instead of being skipped. A value that is not an entity raises `orm.argument`.

See [Entities as Structs](../../../usage/structs.md) for the full rules.

## Method Signature

```
EntityToStruct(entity=[Any], options=[Struct])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entity` | `Any` | `true` | An entity, or an array of entities. |  |
| `options` | `Struct` | `false` | `includes`, `excludes`, `mappers`, `defaults`, `ignoreDefaults`, `profile`. |  |

Returns a struct, or an array of structs for an array of entities.

## Examples

The id and plain properties (or the entity's `this.memento` defaults):

```java
entityToStruct( entityLoadByPK( "Manufacturer", 1 ) );
// { id : 1, name : "Ford Motor Company", address : "202 Ford Way, Dearborn MI" }
```

Add associations and leave fields out:

```java
entityToStruct( user, { includes : "role.name,orders", excludes : "passwordHash,orders.notes" } );
// { id : 42, firstName : "Ann", ..., role : { name : "admin" }, orders : [ { id : 7, total : 99.5, ... } ] }
```

Rename a key, compute a key, and change a value:

```java
entityToStruct( user, {
    includes : "lastLoginTime:lastLogin,initials",
    mappers  : {
        initials : ( value, memento ) => left( memento.firstName, 1 ) & left( memento.lastName, 1 ),
        email    : ( value ) => lcase( value )
    }
} );
```

An array of entities, with a profile:

```java
entityToStruct( entityLoad( "User", { active : true } ), { profile : "export" } );
```

To read structs without loading the entities at all, use [EntityLoadAsStruct](./EntityLoadAsStruct.md).

## Related

  * [EntityCriteria](./EntityCriteria.md)
  * [EntityDelete](./EntityDelete.md)
  * [EntityEvict](./EntityEvict.md)
  * [EntityGetDatasource](./EntityGetDatasource.md)
  * [EntityGetDirtyProperties](./EntityGetDirtyProperties.md)
  * [EntityGetId](./EntityGetId.md)
  * [EntityGetMetadata](./EntityGetMetadata.md)
  * [EntityGetName](./EntityGetName.md)
  * [EntityGetReference](./EntityGetReference.md)
  * [EntityIsAttached](./EntityIsAttached.md)
  * [EntityIsDirty](./EntityIsDirty.md)
  * [EntityLoad](./EntityLoad.md)
  * [EntityLoadAsStruct](./EntityLoadAsStruct.md)
  * [EntityLoadByExample](./EntityLoadByExample.md)
  * [EntityLoadByPK](./EntityLoadByPK.md)
  * [EntityLoadByPKOrFail](./EntityLoadByPKOrFail.md)
  * [EntityLoadOrFail](./EntityLoadOrFail.md)
  * [EntityLoadOrNew](./EntityLoadOrNew.md)
  * [EntityLoadOrSave](./EntityLoadOrSave.md)
  * [EntityLoadReadOnly](./EntityLoadReadOnly.md)
  * [EntityLock](./EntityLock.md)
  * [EntityMerge](./EntityMerge.md)
  * [EntityNameArray](./EntityNameArray.md)
  * [EntityNameList](./EntityNameList.md)
  * [EntityNew](./EntityNew.md)
  * [EntityReload](./EntityReload.md)
  * [EntitySave](./EntitySave.md)
  * [EntityToQuery](./EntityToQuery.md)
  * [ORMClearSession](./ORMClearSession.md)
  * [ORMCloseAllSessions](./ORMCloseAllSessions.md)
  * [ORMCloseSession](./ORMCloseSession.md)
  * [ORMDiagnostics](./ORMDiagnostics.md)
  * [ORMEvictCollection](./ORMEvictCollection.md)
  * [ORMEvictEntity](./ORMEvictEntity.md)
  * [ORMEvictQueries](./ORMEvictQueries.md)
  * [ORMExecuteQuery](./ORMExecuteQuery.md)
  * [ORMFlush](./ORMFlush.md)
  * [ORMFlushAll](./ORMFlushAll.md)
  * [ORMGetHibernateVersion](./ORMGetHibernateVersion.md)
  * [ORMGetSQLFunctions](./ORMGetSQLFunctions.md)
  * [ORMGetSession](./ORMGetSession.md)
  * [ORMGetSessionFactory](./ORMGetSessionFactory.md)
  * [ORMGetSessionStatistics](./ORMGetSessionStatistics.md)
  * [ORMIsSessionDirty](./ORMIsSessionDirty.md)
  * [ORMReadOnly](./ORMReadOnly.md)
  * [ORMReload](./ORMReload.md)

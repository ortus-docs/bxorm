[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityLoadAsStruct`

Load entities straight into structs, without loading the entities: one projection query for the plain values and to-one associations (left joins), plus one query per to-many association, limited to the ids just read. The structs match what `entityToStruct()` builds for the same includes: the entity's `this.memento`, includes, excludes, mappers, defaults, profiles and ISO 8601 dates.

* An id returns a struct, or `null` when no row matches.
* A filter struct (property values to match, `null` for `is null`) returns an array of structs, or one struct (or `null`) with the `unique` option. Several matching rows with `unique` raise `orm.query.nonUnique`.
* Collections come back in id order.

Getters need a loaded entity: a getter listed in the entity's `this.memento` defaults is left out, and a getter you ask for in `includes` raises `orm.argument` (use `entityToStruct()`, or compute the key with a mapper). Value collections (`fieldtype="collection"`) and entities with a composite id raise `orm.argument` too. An unknown include raises `orm.property.unknown`.

See [Entities as Structs](../../../usage/structs.md).

## Method Signature

```
EntityLoadAsStruct(entityName=[String], idOrFilter=[Any], includes=[Any], options=[Struct])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entityName` | `String` | `true` | The name of the entity. |  |
| `idOrFilter` | `Any` | `true` | The primary key value, or a struct of property values to match. |  |
| `includes` | `Any` | `false` | Properties and dotted association paths to add to the entity's defaults, as a list or array. Empty for the defaults only. |  |
| `options` | `Struct` | `false` | `sortOrder`, `maxResults`, `offset`, `unique`, and the struct options of `entityToStruct()`: `excludes`, `mappers`, `defaults`, `ignoreDefaults`, `profile`. |  |

Returns a struct or `null` for an id (or a filter with `unique`), else an array of structs.

## Examples

By id, with the entity's defaults and one association field:

```java
user = entityLoadAsStruct( "User", 42, "role.name" );
// { id : 42, firstName : "Ann", ..., role : { name : "admin" } }
```

By filter, with a collection, sorted and limited:

```java
users = entityLoadAsStruct( "User", { active : true }, "orders", { sortOrder : "lastName", maxResults : 20 } );
```

A profile and no extra includes:

```java
rows = entityLoadAsStruct( "User", { active : true }, "", { profile : "list" } );
```

One struct from a filter:

```java
user = entityLoadAsStruct( "User", { email : "ann@example.com" }, "", { unique : true } );
```

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
  * [EntityToStruct](./EntityToStruct.md)
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

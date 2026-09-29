# EntityLoadAsStruct

Load entities straight into structs, without loading the entities: one projection query for the plain values and to-one associations (left joins), plus one query per to-many association, limited to the ids just read. The structs match what `entityToStruct()` builds for the same includes: the entity's `this.memento`, includes, excludes, mappers, defaults, profiles and ISO 8601 dates.

* An id returns a struct, or `null` when no row matches.
* A filter struct (property values to match, `null` for `is null`) returns an array of structs, or one struct (or `null`) with the `unique` option. Several matching rows with `unique` raise `orm.query.nonUnique`.
* Collections come back in id order.

A property whose getter you wrote is read through that getter, as in `entityToStruct()`: the row's plain values are copied into a scratch instance and the getter is called on it (associations are not loaded there). Includes that are only getters, not properties, need a loaded entity: one listed in the entity's `this.memento` defaults is left out, and one you ask for in `includes` raises `orm.argument` (use `entityToStruct()`, or compute the key with a mapper). Value collections (`fieldtype="collection"`) and entities with a composite id raise `orm.argument` too. An unknown include raises `orm.property.unknown`.

See [Entities as Structs](../../usage/structs.md).

## Method Signature

```
EntityLoadAsStruct(entityName=[String], idOrFilter=[Any], includes=[Any], options=[Struct])
```

### Arguments


| Argument     | Type     | Required | Description                                                                                                                                                  | Default |
| ------------ | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `entityName` | `String` | `true`   | The name of the entity.                                                                                                                                      |         |
| `idOrFilter` | `Any`    | `true`   | The primary key value, or a struct of property values to match.                                                                                              |         |
| `includes`   | `Any`    | `false`  | Properties and dotted association paths to add to the entity's defaults, as a list or array. Empty for the defaults only.                                    |         |
| `options`    | `Struct` | `false`  | `sortOrder`, `maxResults`, `offset`, `unique`, and the struct options of `entityToStruct()`: `excludes`, `mappers`, `defaults`, `ignoreDefaults`, `profile`. |         |

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
* [EntityNew](entitynew.md)
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

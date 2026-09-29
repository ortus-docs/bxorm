# EntitySave

Save one entity, or an array of entities: a new entity is inserted, a detached one merged, and a managed one needs nothing (its changes are written when the session flushes, at the end of the `transaction{}`). Pass `{ flush : true }` to flush right away.

An array item that is not an entity raises an `orm.argument` error.

## Method Signature

```
EntitySave(entity=[Any], forceinsert=[Any], options=[Struct])
```

### Arguments


| Argument      | Type     | Required | Description                                                                                                                                                                                                       | Default |
| ------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `entity`      | `Any`    | `true`   | The entity to save, or an array of entities.                                                                                                                                                                      |         |
| `forceinsert` | `Any`    | `false`  | If true, always insert. Otherwise, a save or update operation will be performed (an insert for a new entity, an update for an existing one). May also be the options struct: `entitySave( e, { flush : true } )`. |         |
| `options`     | `Struct` | `false`  | Options: `flush` (boolean) flushes the session after the save.                                                                                                                                                    |         |

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

### Save Several and Flush

Pass an array to save several entities, and `{ flush : true }` to write them to the database now instead of at the next flush. Each session the entities belong to is flushed:

```java
entitySave( [ order, invoice ], { flush : true } );

// the options struct can take the place of forceInsert
entitySave( user, { flush : true } );

// or come third, after forceInsert
entitySave( user, true, { flush : true } );
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
* [EntityNew](entitynew.md)
* [EntityReload](entityreload.md)
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

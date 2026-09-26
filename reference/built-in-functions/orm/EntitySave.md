[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntitySave`

Save one entity, or an array of entities: a new entity is inserted, a detached one merged, and a managed one needs nothing (its changes are written when the session flushes, at the end of the `transaction{}`). Pass `{ flush : true }` to flush right away.

An array item that is not an entity raises an `orm.argument` error.

## Method Signature

```
EntitySave(entity=[Any], forceinsert=[Any], options=[Struct])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entity` | `Any` | `true` | The entity to save, or an array of entities. |  |
| `forceinsert` | `Any` | `false` | If true, always insert. Otherwise, a save or update operation will be performed (an insert for a new entity, an update for an existing one). May also be the options struct: `entitySave( e, { flush : true } )`. |  |
| `options` | `Struct` | `false` | Options: `flush` (boolean) flushes the session after the save. |  |

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

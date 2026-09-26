[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityLoadByPK`

Load an entity by its primary key.

<p>
 <code>
 var myAuto = entityLoadByPK( "Automobile", "1HGCM82633A123456" );
 </code>
 <p>
 In Lucee, by default, an array of entities is returned and you must pass a third `unique=true` argument to return only a single entity. In BoxLang,
 only a single entity is returned - matching the Adobe ColdFusion behavior. A boolean third argument (Lucee's
 `unique`) is accepted and ignored. To return an array of entities, use the `entityLoad` BIF, or pass an array of ids.
 <p>
 Pass an array of ids to load several entities in one query. The result is an array in the order of the ids, with
 null where no row has that id:

 <pre>
 users = entityLoadByPK( "User", [ 3, 1, 99 ] ); // [ user3, user1, null ]
 </pre>
 <p>
 Composite keys are also supported:

 <pre>
 entityLoadByPK( "VehicleType", { make : "Ford", model: "Fusion" } );
 </pre>

## Options

The third argument is a struct of load options. They apply to every entity of an array of ids too:

| Option | Description |
|--------|-------------|
| `lock` | Lock the row while loading it: `read`, `write` or `force` (see [EntityLock](./EntityLock.md)). Needs `transaction{}`, otherwise an `orm.argument` error is raised. |
| `timeout` | Seconds to wait for the lock. `0` means do not wait. |
| `skipLocked` | Return `null` instead of waiting when the row is locked by someone else. |
| `readOnly` | Load the entity read-only, so changes to it are never saved. |

## Method Signature

```
EntityLoadByPK(entity=[String], id=[Any], options=[Any])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entity` | `String` | `true` | The name of the entity to load. |  |
| `id` | `Any` | `true` | The primary key value, a struct of key/value pairs for composite keys, or an array of either. |  |
| `options` | `Any` | `false` | A struct of load options: `lock`, `timeout`, `skipLocked`, `readOnly`. A boolean (Lucee's `unique`) is accepted and ignored. |  |

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

### Load Several by Primary Key

Pass an array of ids to load them all with one batched query. The array keeps the order you asked for, with `null` where no row has that id. An id asked for twice returns the same instance twice:

```java
users = entityLoadByPK( "User", [ 3, 1, 99 ] );
// [ user3, user1, null ]

types = entityLoadByPK( "VehicleType", [ { make: "Honda", model: "Civic" }, { make: "Ford", model: "Fusion" } ] );

reports = entityLoadByPK( "Report", ids, { readOnly : true } );
```

An empty array returns an empty array.

### Load and Lock

Lock the row until the transaction ends, so no one else can change it in the meantime:

```java
transaction {
    account = entityLoadByPK( "Account", id, { lock : "write" } );
    account.setBalance( account.getBalance() - amount );
}
```

Skip a row another transaction has locked instead of waiting for it:

```java
transaction {
    job = entityLoadByPK( "Job", id, { lock : "write", skipLocked : true } );
    if ( isNull( job ) ) {
        // someone else is working on it
    }
}
```

### Load Read-Only

```java
report = entityLoadByPK( "Report", id, { readOnly : true } );
```

To throw an `orm.notFound` error instead of returning `null`, use [EntityLoadByPKOrFail](./EntityLoadByPKOrFail.md).

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

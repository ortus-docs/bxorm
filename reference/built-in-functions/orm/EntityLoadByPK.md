[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityLoadByPK`

Load an array of entities by the primary key.

<p>
 <code>
 var myAuto = entityLoadByPK( "Automobile", "1HGCM82633A123456" );
 </code>
 <p>
 In Lucee, by default, an array of entities is returned and you must pass a third `unique=true` argument to return only a single entity. In BoxLang,
 only a single entity is returned - matching the Adobe ColdFusion behavior - and no `unique` attribute
 is supported. To return an array of entities, use the `entityLoad` BIF.
 <p>
 Composite keys are also supported:
 <code>
 entityLoadByPK( "VehicleType", { make : "Ford", model: "Fusion" } );
 </code>

## Method Signature

```
EntityLoadByPK(entity=[String], id=[String], unique=[String])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entity` | `String` | `true` |  |  |
| `id` | `String` | `true` |  |  |
| `unique` | `String` | `false` |  |  |

## Examples



## Related

  * [EntityDelete](./EntityDelete.md)
  * [EntityLoad](./EntityLoad.md)
  * [EntityLoadByExample](./EntityLoadByExample.md)
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

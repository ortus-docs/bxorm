[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityDelete`

Delete one entity, or an array of entities, from the database.

Delete operations will cascade to related entities if `cascade` is enabled on the relationship property. The rows are deleted when the session flushes (at the end of the `transaction{}`); pass `{ flush : true }` to flush right away.

An array item that is not an entity raises an `orm.argument` error.

## Method Signature

```
EntityDelete(entity=[Any], options=[Struct])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entity` | `Any` | `true` | The entity to delete, or an array of entities. |  |
| `options` | `Struct` | `false` | Options: `flush` (boolean) flushes the session after the delete. |  |

## Examples

Delete an entity by passing the entity object to `entityDelete()`:

```java
entityDelete( entityLoadByPK( "Vehicle", "1HGCM82633A123456" ) );
```

Delete several entities and flush at once, so the rows are gone before the next statement runs:

```java
transaction {
    entityDelete( [ order1, order2 ], { flush : true } );
    remaining = queryExecute( "SELECT count(*) AS total FROM orders" ).total;
}
```

Note that this operation will also remove associated child entities depending on the `cascade` configuration in the entity property mapping. In this case, we wish a deletion of a blog post to also delete all associated comments:

```java
property
    name="comments"
    cfc="Comment"
    fieldtype="one-to-many"
    inverse="true"
    cascade="delete";
...
entityDelete( entityLoadByPK( "blogPost", "779ccbb8-a444-11eb-ab6f-0290cc502ae3" ) );
```

## Related

  * [EntityCriteria](./EntityCriteria.md)
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

[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityDelete`

Delete an entity from the database.

Delete operations will cascade to related entities if `cascade` is enabled on the relationship property.

## Method Signature

```
EntityDelete(entity=[class])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entity` | `class` | `true` | The entity instance to delete. |  |

## Examples

Delete an entity by passing the entity object to `entityDelete()`:

```java
entityDelete( entityLoadByPK( "Vehicle", "1HGCM82633A123456" ) );
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

  * [EntityLoad](./EntityLoad.md)
  * [EntityLoadByExample](./EntityLoadByExample.md)
  * [EntityLoadByPK](./EntityLoadByPK.md)
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

# EntityDelete

Delete an entity from the database.

Delete operations will cascade to related entities if `cascade` is enabled on the relationship property.

## Method Signature

```
EntityDelete(entity=[class])
```

### Arguments

| Argument | Type    | Required | Description                    | Default |
| -------- | ------- | -------- | ------------------------------ | ------- |
| `entity` | `class` | `true`   | The entity instance to delete. |         |

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

* [EntityIsAttached](entityisattached.md)
* [EntityLoad](entityload.md)
* [EntityLoadByExample](entityloadbyexample.md)
* [EntityLoadByPK](entityloadbypk.md)
* [EntityMerge](entitymerge.md)
* [EntityNameArray](entitynamearray.md)
* [EntityNameList](entitynamelist.md)
* [EntityNew](entitynew.md)
* [EntityReload](entityreload.md)
* [EntitySave](entitysave.md)
* [EntityToQuery](entitytoquery.md)
* [ORMClearSession](ormclearsession.md)
* [ORMCloseAllSessions](ormcloseallsessions.md)
* [ORMCloseSession](ormclosesession.md)
* [ORMEvictCollection](ormevictcollection.md)
* [ORMEvictEntity](ormevictentity.md)
* [ORMEvictQueries](ormevictqueries.md)
* [ORMExecuteQuery](ormexecutequery.md)
* [ORMFlush](ormflush.md)
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSession](ormgetsession.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMReload](ormreload.md)

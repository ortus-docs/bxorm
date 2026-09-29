# EntityDelete

Delete one entity, or an array of entities, from the database.

Delete operations will cascade to related entities if `cascade` is enabled on the relationship property. The rows are deleted when the session flushes (at the end of the `transaction{}`); pass `{ flush : true }` to flush right away.

An array item that is not an entity raises an `orm.argument` error.

## Method Signature

```
EntityDelete(entity=[Any], options=[Struct])
```

### Arguments


| Argument  | Type     | Required | Description                                                      | Default |
| --------- | -------- | -------- | ---------------------------------------------------------------- | ------- |
| `entity`  | `Any`    | `true`   | The entity to delete, or an array of entities.                   |         |
| `options` | `Struct` | `false`  | Options: `flush` (boolean) flushes the session after the delete. |         |

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

* [EntityCriteria](entitycriteria.md)
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

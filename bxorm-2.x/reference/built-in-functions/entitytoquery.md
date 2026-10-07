# EntityToQuery

Convert an entity or array of entities to a Query object.

The query holds one row per entity and one column per id, column, version and timestamp property, inherited ones included.

{% hint style="warning" %}
The result query will not contain any relation data. Relationship properties (`one-to-one`, `one-to-many`, `many-to-one`, `many-to-many`) are not included as columns. See [Entities as Queries](../../usage/queries.md) for details and alternatives.
{% endhint %}

## Method Signature

```
EntityToQuery(entity=[Any], name=[Any])
```

### Arguments


| Argument | Type  | Required | Description                                                                                                        | Default |
| -------- | ----- | -------- | ------------------------------------------------------------------------------------------------------------------ | ------- |
| `entity` | `Any` | `true`   | An instance of an ORM entity or an array of entities. All entities in an array must be of the same type.           |         |
| `name`   | `Any` | `false`  | The name of the entity. Inferred from the (first) entity when omitted. Useful to pick the entity with inheritance. |         |

## Examples

### Convert a Single Entity

Pass one loaded entity to get a single-row query result.

```java
result = entityToQuery( entityLoadByPK( "Vehicle", "1HGCM82633A123456" ), "Vehicle" );
```

### Convert an Entity Array

Pass an array of entities to get one row per entity.

```java
result = entityToQuery( entityLoad( "Vehicle", { Make = "Honda" } ), "Vehicle" );
```

You can also omit the entity name and let the function infer it from the entity type:

```java
result = entityToQuery( entityLoadByPK( "Vehicle", "1HGCM82633A123456" ) );
```

Note that for performance reasons we recommend passing the entity name explicitly.

See [Entities as Queries](../../usage/queries.md) for the full guide.

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
* [EntitySave](entitysave.md)
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

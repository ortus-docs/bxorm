# EntityGetMetadata

The mapping metadata of an entity, as a struct. Built once per entity and cached for the life of the ORM application; each call returns a copy you may change.

## Method Signature

```
EntityGetMetadata(entity=[Any])
```

### Arguments


| Argument | Type  | Required | Description                                                             | Default |
| -------- | ----- | -------- | ----------------------------------------------------------------------- | ------- |
| `entity` | `Any` | `true`   | An entity instance (loaded, new or a lazy reference) or an entity name. |         |

### Returned keys

| Key                              | Description                                                                                                                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entityName`                     | The entity name.                                                                                                                                                                                   |
| `className`                      | The BoxLang class path.                                                                                                                                                                            |
| `datasource`                     | The datasource name.                                                                                                                                                                               |
| `tableName`, `schema`, `catalog` | Where the entity is stored.                                                                                                                                                                        |
| `parent`                         | The parent entity name for inheritance, or empty.                                                                                                                                                  |
| `readOnly`                       | True for an immutable entity.                                                                                                                                                                      |
| `discriminator`                  | `{ column, value }` for single-table inheritance.                                                                                                                                                  |
| `idProperties`                   | The id property names (more than one for a composite id).                                                                                                                                          |
| `idType`                         | The id ormtype, or `composite`.                                                                                                                                                                    |
| `version`                        | The version property name, or empty.                                                                                                                                                               |
| `properties`                     | One struct per column-backed property: `name`, `column` (empty for a formula), `ormtype`, `fieldtype`, `nullable`, `unique`, `length`, `precision`, `scale`, `formula`, `insertable`, `updatable`. |
| `associations`                   | One struct per association: `name`, `kind` (`many-to-one`, `one-to-many`, ...), `target` (entity name), `cascade`, `lazy`, `inverse`, `fkcolumn`, `mappedBy`, `linkTable`, `orderBy`.              |
| `propertyNames`                  | Every non-id property name.                                                                                                                                                                        |

## Examples

```java
meta = entityGetMetadata( "User" );
meta.tableName;                              // "users"
meta.idProperties;                           // [ "id" ]
meta.associations.map( a => a.name );        // [ "role", "orders" ]
meta.properties.filter( p => !p.nullable );  // required columns
```

## Related

* [EntityCriteria](entitycriteria.md)
* [EntityDelete](entitydelete.md)
* [EntityEvict](entityevict.md)
* [EntityGetDatasource](entitygetdatasource.md)
* [EntityGetDirtyProperties](entitygetdirtyproperties.md)
* [EntityGetId](entitygetid.md)
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

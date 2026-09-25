[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityGetMetadata`

The mapping metadata of an entity, as a struct. Built once per entity and cached for the life of the ORM application; each call returns a copy you may change.

## Method Signature

```
EntityGetMetadata(entity=[Any])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entity` | `Any` | `true` | An entity instance (loaded, new or a lazy reference) or an entity name. |  |

### Returned keys

| Key | Description |
| --- | --- |
| `entityName` | The entity name. |
| `className` | The BoxLang class path. |
| `datasource` | The datasource name. |
| `tableName`, `schema`, `catalog` | Where the entity is stored. |
| `parent` | The parent entity name for inheritance, or empty. |
| `readOnly` | True for an immutable entity. |
| `discriminator` | `{ column, value }` for single-table inheritance. |
| `idProperties` | The id property names (more than one for a composite id). |
| `idType` | The id ormtype, or `composite`. |
| `version` | The version property name, or empty. |
| `properties` | One struct per column-backed property: `name`, `column` (empty for a formula), `ormtype`, `fieldtype`, `nullable`, `unique`, `length`, `precision`, `scale`, `formula`, `insertable`, `updatable`. |
| `associations` | One struct per association: `name`, `kind` (`many-to-one`, `one-to-many`, ...), `target` (entity name), `cascade`, `lazy`, `inverse`, `fkcolumn`, `mappedBy`, `linkTable`, `orderBy`. |
| `propertyNames` | Every non-id property name. |

## Examples

```java
meta = entityGetMetadata( "User" );
meta.tableName;                              // "users"
meta.idProperties;                           // [ "id" ]
meta.associations.map( a => a.name );        // [ "role", "orders" ]
meta.properties.filter( p => !p.nullable );  // required columns
```

## Related

  * [EntityCriteria](./EntityCriteria.md)
  * [EntityDelete](./EntityDelete.md)
  * [EntityGetDatasource](./EntityGetDatasource.md)
  * [EntityGetDirtyProperties](./EntityGetDirtyProperties.md)
  * [EntityGetId](./EntityGetId.md)
  * [EntityGetName](./EntityGetName.md)
  * [EntityIsAttached](./EntityIsAttached.md)
  * [EntityIsDirty](./EntityIsDirty.md)
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
  * [ORMDiagnostics](./ORMDiagnostics.md)
  * [ORMEvictCollection](./ORMEvictCollection.md)
  * [ORMEvictEntity](./ORMEvictEntity.md)
  * [ORMEvictQueries](./ORMEvictQueries.md)
  * [ORMExecuteQuery](./ORMExecuteQuery.md)
  * [ORMFlush](./ORMFlush.md)
  * [ORMFlushAll](./ORMFlushAll.md)
  * [ORMGetHibernateVersion](./ORMGetHibernateVersion.md)
  * [ORMGetSession](./ORMGetSession.md)
  * [ORMGetSessionFactory](./ORMGetSessionFactory.md)
  * [ORMGetSessionStatistics](./ORMGetSessionStatistics.md)
  * [ORMIsSessionDirty](./ORMIsSessionDirty.md)
  * [ORMReload](./ORMReload.md)

---
description: Every bx-orm built-in function, grouped by what you want to do
icon: code
---

# Built-in Functions

bx-orm ships 47 built-in functions (BIFs) for working with entities, queries and the ORM session. They are grouped below by task; the navigation lists them alphabetically.

## Create and Save

Make new entities and write them to the database. See [Working with Entities](../../usage/working-with-entities.md).

| Function | Description |
| --- | --- |
| [EntityNew](orm/EntityNew.md) | Instantiate a new entity, optionally with a struct of properties. |
| [EntitySave](orm/EntitySave.md) | Save an entity, or an array of entities, to the persistence context. |
| [EntityMerge](orm/EntityMerge.md) | Merge the state of the given entity into the current persistence context (session). |

## Load

Read entities by id, by filter or by example.

| Function | Description |
| --- | --- |
| [EntityLoad](orm/EntityLoad.md) | Load an entity or array of entities from the database. |
| [EntityLoadByPK](orm/EntityLoadByPK.md) | Load an entity, or an array of entities, by primary key, optionally locked or read-only. |
| [EntityLoadByPKOrFail](orm/EntityLoadByPKOrFail.md) | Load an entity by its primary key, or throw `orm.notFound`. |
| [EntityLoadOrFail](orm/EntityLoadOrFail.md) | Load one entity by id or filter, or throw `orm.notFound`. |
| [EntityLoadOrNew](orm/EntityLoadOrNew.md) | Load an entity by id or filter, or return a new, unsaved one. |
| [EntityLoadOrSave](orm/EntityLoadOrSave.md) | Load an entity by id or filter, or create and save a new one. |
| [EntityLoadByExample](orm/EntityLoadByExample.md) | Load entities matching an example entity. |
| [EntityLoadReadOnly](orm/EntityLoadReadOnly.md) | Load entities like `entityLoad()`, read-only. |
| [EntityGetReference](orm/EntityGetReference.md) | Get a lazy reference to an entity by id without loading it from the database. |
| [EntityReload](orm/EntityReload.md) | Reload an entity from the database. |

## Delete

| Function | Description |
| --- | --- |
| [EntityDelete](orm/EntityDelete.md) | Delete an entity, or an array of entities, from the database. |

## Query

Query with the fluent builder or HQL. See [Criteria Queries](../../usage/criteria.md) and [Queries and HQL](../../usage/querying.md).

| Function | Description |
| --- | --- |
| [EntityCriteria](orm/EntityCriteria.md) | Start a fluent query on an entity: conditions, joins, projections, paging, bulk updates and locks. |
| [ORMExecuteQuery](orm/ORMExecuteQuery.md) | Execute an HQL query with (optional) parameters and specific query options. |
| [ORMGetSQLFunctions](orm/ORMGetSQLFunctions.md) | Retrieve the named SQL functions registered with the `sqlFunctions` setting. |

## Convert

Turn entities into structs or queries. See [Entities as Structs](../../usage/structs.md).

| Function | Description |
| --- | --- |
| [EntityToStruct](orm/EntityToStruct.md) | Convert an entity or array of entities to a struct or array of structs. |
| [EntityLoadAsStruct](orm/EntityLoadAsStruct.md) | Load entities straight into structs, without loading the entities. |
| [EntityToQuery](orm/EntityToQuery.md) | Convert an entity or array of entities to a Query object. |

## Inspect

Ask about an entity or the entity model.

| Function | Description |
| --- | --- |
| [EntityGetName](orm/EntityGetName.md) | The entity name of an entity instance, lazy reference or name (a name comes back with its declared casing). |
| [EntityGetId](orm/EntityGetId.md) | The primary key of an entity (a struct for composite keys). |
| [EntityGetDatasource](orm/EntityGetDatasource.md) | The name of the datasource an entity is stored in. |
| [EntityGetMetadata](orm/EntityGetMetadata.md) | The mapping metadata of an entity, as a struct. |
| [EntityIsDirty](orm/EntityIsDirty.md) | Whether an entity has changes that are not saved yet. |
| [EntityGetDirtyProperties](orm/EntityGetDirtyProperties.md) | The names of an entity's properties whose values differ from the stored ones. |
| [EntityIsAttached](orm/EntityIsAttached.md) | Check whether an entity is attached to the current ORM session. |
| [EntityNameArray](orm/EntityNameArray.md) | Retrieve an array of entity names for this ORM application. |
| [EntityNameList](orm/EntityNameList.md) | Retrieve a list of entity names for this ORM application. |

## Session and Transactions

Work with the ORM session and database locks. See [Session Management](../../usage/session-management.md) and [Transactions](../../usage/transactions.md).

| Function | Description |
| --- | --- |
| [EntityEvict](orm/EntityEvict.md) | Remove an entity, or an array of entities, from the ORM session without deleting it. |
| [EntityLock](orm/EntityLock.md) | Lock an entity's row in the database until the current transaction ends. |
| [ORMReadOnly](orm/ORMReadOnly.md) | Run a closure with every entity it loads read-only. |
| [ORMFlush](orm/ORMFlush.md) | Flush the Hibernate session, synchronizing the in-memory state with the database. |
| [ORMFlushAll](orm/ORMFlushAll.md) | Flush all open Hibernate sessions in the current request. |
| [ORMClearSession](orm/ORMClearSession.md) | Clear the Hibernate session for the current context and provided (or default) datasource. |
| [ORMCloseSession](orm/ORMCloseSession.md) | Close the Hibernate session for the current context and provided (or default) datasource. |
| [ORMCloseAllSessions](orm/ORMCloseAllSessions.md) | Close all Hibernate sessions for the current context on all datasources. |
| [ORMIsSessionDirty](orm/ORMIsSessionDirty.md) | Whether the ORM session for a datasource has changes that are not flushed to the database yet. |
| [ORMGetSessionStatistics](orm/ORMGetSessionStatistics.md) | Statistics of the ORM session for a datasource: how many entities and collections it holds, and which. |
| [ORMGetSession](orm/ORMGetSession.md) | Retrieve the Hibernate Session configured for this datasource or default datasource. |
| [ORMGetSessionFactory](orm/ORMGetSessionFactory.md) | Retrieve the Hibernate SessionFactory configured for this datasource or default datasource. |

## Second-Level Cache

Evict data from the secondary cache. See [Caching](../../usage/caching.md).

| Function | Description |
| --- | --- |
| [ORMEvictEntity](orm/ORMEvictEntity.md) | Evict all entity data for this entity name from the second-level cache. |
| [ORMEvictCollection](orm/ORMEvictCollection.md) | Evict all entity data for a given collection on a given entity type from the second-level cache. |
| [ORMEvictQueries](orm/ORMEvictQueries.md) | Evict all queries from the named or default cache on the named or default datasource. |

## ORM Application

Reload and diagnose the ORM. See [Errors and Diagnostics](../../usage/errors-and-diagnostics.md).

| Function | Description |
| --- | --- |
| [ORMReload](orm/ORMReload.md) | Reload the ORM application. |
| [ORMDiagnostics](orm/ORMDiagnostics.md) | A snapshot of the ORM for this application: the first thing to check when something is wrong. It never throws. |
| [ORMGetHibernateVersion](orm/ORMGetHibernateVersion.md) | Retrieve the installed Hibernate version. |

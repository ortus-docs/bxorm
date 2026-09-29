---
description: Every bx-orm built-in function, grouped by what you want to do
icon: code
---

# Built-in Functions

bx-orm ships 47 built-in functions (BIFs) for working with entities, queries and the ORM session. They are grouped below by task; the navigation lists them alphabetically.

## Create and Save

Make new entities and write them to the database. See [Working with Entities](../../usage/working-with-entities.md).

| Function                      | Description                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| [EntityNew](entitynew.md)     | Instantiate a new entity, optionally with a struct of properties.                   |
| [EntitySave](entitysave.md)   | Save an entity, or an array of entities, to the persistence context.                |
| [EntityMerge](entitymerge.md) | Merge the state of the given entity into the current persistence context (session). |

## Load

Read entities by id, by filter or by example.

| Function                                        | Description                                                                              |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [EntityLoad](entityload.md)                     | Load an entity or array of entities from the database.                                   |
| [EntityLoadByPK](entityloadbypk.md)             | Load an entity, or an array of entities, by primary key, optionally locked or read-only. |
| [EntityLoadByPKOrFail](entityloadbypkorfail.md) | Load an entity by its primary key, or throw `orm.notFound`.                              |
| [EntityLoadOrFail](entityloadorfail.md)         | Load one entity by id or filter, or throw `orm.notFound`.                                |
| [EntityLoadOrNew](entityloadornew.md)           | Load an entity by id or filter, or return a new, unsaved one.                            |
| [EntityLoadOrSave](entityloadorsave.md)         | Load an entity by id or filter, or create and save a new one.                            |
| [EntityLoadByExample](entityloadbyexample.md)   | Load entities matching an example entity.                                                |
| [EntityLoadReadOnly](entityloadreadonly.md)     | Load entities like `entityLoad()`, read-only.                                            |
| [EntityGetReference](entitygetreference.md)     | Get a lazy reference to an entity by id without loading it from the database.            |
| [EntityReload](entityreload.md)                 | Reload an entity from the database.                                                      |

## Delete

| Function                        | Description                                                   |
| ------------------------------- | ------------------------------------------------------------- |
| [EntityDelete](entitydelete.md) | Delete an entity, or an array of entities, from the database. |

## Query

Query with the fluent builder or HQL. See [Criteria Queries](../../usage/criteria.md) and [Queries and HQL](../../usage/querying.md).

| Function                                    | Description                                                                                        |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [EntityCriteria](entitycriteria.md)         | Start a fluent query on an entity: conditions, joins, projections, paging, bulk updates and locks. |
| [ORMExecuteQuery](ormexecutequery.md)       | Execute an HQL query with (optional) parameters and specific query options.                        |
| [ORMGetSQLFunctions](ormgetsqlfunctions.md) | Retrieve the named SQL functions registered with the `sqlFunctions` setting.                       |

## Convert

Turn entities into structs or queries. See [Entities as Structs](../../usage/structs.md).

| Function                                    | Description                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| [EntityToStruct](entitytostruct.md)         | Convert an entity or array of entities to a struct or array of structs. |
| [EntityLoadAsStruct](entityloadasstruct.md) | Load entities straight into structs, without loading the entities.      |
| [EntityToQuery](entitytoquery.md)           | Convert an entity or array of entities to a Query object.               |

## Inspect

Ask about an entity or the entity model.

| Function                                                | Description                                                                                                 |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [EntityGetName](entitygetname.md)                       | The entity name of an entity instance, lazy reference or name (a name comes back with its declared casing). |
| [EntityGetId](entitygetid.md)                           | The primary key of an entity (a struct for composite keys).                                                 |
| [EntityGetDatasource](entitygetdatasource.md)           | The name of the datasource an entity is stored in.                                                          |
| [EntityGetMetadata](entitygetmetadata.md)               | The mapping metadata of an entity, as a struct.                                                             |
| [EntityIsDirty](entityisdirty.md)                       | Whether an entity has changes that are not saved yet.                                                       |
| [EntityGetDirtyProperties](entitygetdirtyproperties.md) | The names of an entity's properties whose values differ from the stored ones.                               |
| [EntityIsAttached](entityisattached.md)                 | Check whether an entity is attached to the current ORM session.                                             |
| [EntityNameArray](entitynamearray.md)                   | Retrieve an array of entity names for this ORM application.                                                 |
| [EntityNameList](entitynamelist.md)                     | Retrieve a list of entity names for this ORM application.                                                   |

## Session and Transactions

Work with the ORM session and database locks. See [Session Management](../../usage/session-management.md) and [Transactions](../../usage/transactions.md).

| Function                                              | Description                                                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [EntityEvict](entityevict.md)                         | Remove an entity, or an array of entities, from the ORM session without deleting it.                   |
| [EntityLock](entitylock.md)                           | Lock an entity's row in the database until the current transaction ends.                               |
| [ORMReadOnly](ormreadonly.md)                         | Run a closure with every entity it loads read-only.                                                    |
| [ORMFlush](ormflush.md)                               | Flush the Hibernate session, synchronizing the in-memory state with the database.                      |
| [ORMFlushAll](ormflushall.md)                         | Flush all open Hibernate sessions in the current request.                                              |
| [ORMClearSession](ormclearsession.md)                 | Clear the Hibernate session for the current context and provided (or default) datasource.              |
| [ORMCloseSession](ormclosesession.md)                 | Close the Hibernate session for the current context and provided (or default) datasource.              |
| [ORMCloseAllSessions](ormcloseallsessions.md)         | Close all Hibernate sessions for the current context on all datasources.                               |
| [ORMIsSessionDirty](ormissessiondirty.md)             | Whether the ORM session for a datasource has changes that are not flushed to the database yet.         |
| [ORMGetSessionStatistics](ormgetsessionstatistics.md) | Statistics of the ORM session for a datasource: how many entities and collections it holds, and which. |
| [ORMGetSession](ormgetsession.md)                     | Retrieve the Hibernate Session configured for this datasource or default datasource.                   |
| [ORMGetSessionFactory](ormgetsessionfactory.md)       | Retrieve the Hibernate SessionFactory configured for this datasource or default datasource.            |

## Second-Level Cache

Evict data from the secondary cache. See [Caching](../../usage/caching.md).

| Function                                    | Description                                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [ORMEvictEntity](ormevictentity.md)         | Evict all entity data for this entity name from the second-level cache.                          |
| [ORMEvictCollection](ormevictcollection.md) | Evict all entity data for a given collection on a given entity type from the second-level cache. |
| [ORMEvictQueries](ormevictqueries.md)       | Evict all queries from the named or default cache on the named or default datasource.            |

## ORM Application

Reload and diagnose the ORM. See [Errors and Diagnostics](../../usage/errors-and-diagnostics.md).

| Function                                            | Description                                                                                                    |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [ORMReload](ormreload.md)                           | Reload the ORM application.                                                                                    |
| [ORMDiagnostics](ormdiagnostics.md)                 | A snapshot of the ORM for this application: the first thing to check when something is wrong. It never throws. |
| [ORMGetHibernateVersion](ormgethibernateversion.md) | Retrieve the installed Hibernate version.                                                                      |

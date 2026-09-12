# Built-in Functions

bx-orm ships a set of Built-in Functions (BIFs) for working with entities and the underlying Hibernate session. They fall into two groups:

## Entity Functions

| Function | Description |
|----------|-------------|
| [EntityDelete](orm/EntityDelete.md) | Delete an entity from the database. |
| [EntityIsAttached](orm/EntityIsAttached.md) | Check whether an entity is attached to the current ORM session. |
| [EntityLoad](orm/EntityLoad.md) | Load an entity or array of entities from the database. |
| [EntityLoadByExample](orm/EntityLoadByExample.md) | Load entities matching an example entity. |
| [EntityLoadByPK](orm/EntityLoadByPK.md) | Load an array of entities by the primary key. |
| [EntityMerge](orm/EntityMerge.md) | Merge the state of the given entity into the current persistence context (session). |
| [EntityNameArray](orm/EntityNameArray.md) | Retrieve an array of entity names for this ORM application. |
| [EntityNameList](orm/EntityNameList.md) | Retrieve a list of entity names for this ORM application. |
| [EntityNew](orm/EntityNew.md) | Instantiate a new entity, optionally with a struct of properties. |
| [EntityReload](orm/EntityReload.md) | Reload an entity from the database. |
| [EntitySave](orm/EntitySave.md) | Save the provided entity to the persistence context. |
| [EntityToQuery](orm/EntityToQuery.md) | Convert an entity or array of entities to a Query object. |

## ORM Session Functions

| Function | Description |
|----------|-------------|
| [ORMClearSession](orm/ORMClearSession.md) | Clear the Hibernate session for the current context and provided (or default) datasource. |
| [ORMCloseAllSessions](orm/ORMCloseAllSessions.md) | Close all Hibernate sessions for the current context on all datasources. |
| [ORMCloseSession](orm/ORMCloseSession.md) | Close the Hibernate session for the current context and provided (or default) datasource. |
| [ORMEvictCollection](orm/ORMEvictCollection.md) | Evict all entity data for a given collection on a given entity type from the second-level cache. |
| [ORMEvictEntity](orm/ORMEvictEntity.md) | Evict all entity data for this entity name from the second-level cache. |
| [ORMEvictQueries](orm/ORMEvictQueries.md) | Evict all queries from the named or default cache on the named or default datasource. |
| [ORMExecuteQuery](orm/ORMExecuteQuery.md) | Execute an HQL query with (optional) parameters and specific query options. |
| [ORMFlush](orm/ORMFlush.md) | Flush the Hibernate session, synchronizing the in-memory state with the database. |
| [ORMFlushAll](orm/ORMFlushAll.md) | Flush all open Hibernate sessions in the current request. |
| [ORMGetHibernateVersion](orm/ORMGetHibernateVersion.md) | Retrieve the installed Hibernate version. |
| [ORMGetSession](orm/ORMGetSession.md) | Retrieve the Hibernate Session configured for this datasource or default datasource. |
| [ORMGetSessionFactory](orm/ORMGetSessionFactory.md) | Retrieve the Hibernate SessionFactory configured for this datasource or default datasource. |
| [ORMReload](orm/ORMReload.md) | Reload the ORM application. |

# Built-in Functions

bx-orm ships a set of Built-in Functions (BIFs) for working with entities and the underlying Hibernate session. They fall into two groups:

## Entity Functions

| Function                                      | Description                                                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------------- |
| [EntityDelete](entitydelete.md)               | Delete an entity from the database.                                                 |
| [EntityIsAttached](entityisattached.md)       | Check whether an entity is attached to the current ORM session.                     |
| [EntityLoad](entityload.md)                   | Load an entity or array of entities from the database.                              |
| [EntityLoadByExample](entityloadbyexample.md) | Load entities matching an example entity.                                           |
| [EntityLoadByPK](entityloadbypk.md)           | Load an array of entities by the primary key.                                       |
| [EntityMerge](entitymerge.md)                 | Merge the state of the given entity into the current persistence context (session). |
| [EntityNameArray](entitynamearray.md)         | Retrieve an array of entity names for this ORM application.                         |
| [EntityNameList](entitynamelist.md)           | Retrieve a list of entity names for this ORM application.                           |
| [EntityNew](entitynew.md)                     | Instantiate a new entity, optionally with a struct of properties.                   |
| [EntityReload](entityreload.md)               | Reload an entity from the database.                                                 |
| [EntitySave](entitysave.md)                   | Save the provided entity to the persistence context.                                |
| [EntityToQuery](entitytoquery.md)             | Convert an entity or array of entities to a Query object.                           |

## ORM Session Functions

| Function                                            | Description                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [ORMClearSession](ormclearsession.md)               | Clear the Hibernate session for the current context and provided (or default) datasource.        |
| [ORMCloseAllSessions](ormcloseallsessions.md)       | Close all Hibernate sessions for the current context on all datasources.                         |
| [ORMCloseSession](ormclosesession.md)               | Close the Hibernate session for the current context and provided (or default) datasource.        |
| [ORMEvictCollection](ormevictcollection.md)         | Evict all entity data for a given collection on a given entity type from the second-level cache. |
| [ORMEvictEntity](ormevictentity.md)                 | Evict all entity data for this entity name from the second-level cache.                          |
| [ORMEvictQueries](ormevictqueries.md)               | Evict all queries from the named or default cache on the named or default datasource.            |
| [ORMExecuteQuery](ormexecutequery.md)               | Execute an HQL query with (optional) parameters and specific query options.                      |
| [ORMFlush](ormflush.md)                             | Flush the Hibernate session, synchronizing the in-memory state with the database.                |
| [ORMFlushAll](ormflushall.md)                       | Flush all open Hibernate sessions in the current request.                                        |
| [ORMGetHibernateVersion](ormgethibernateversion.md) | Retrieve the installed Hibernate version.                                                        |
| [ORMGetSession](ormgetsession.md)                   | Retrieve the Hibernate Session configured for this datasource or default datasource.             |
| [ORMGetSessionFactory](ormgetsessionfactory.md)     | Retrieve the Hibernate SessionFactory configured for this datasource or default datasource.      |
| [ORMReload](ormreload.md)                           | Reload the ORM application.                                                                      |

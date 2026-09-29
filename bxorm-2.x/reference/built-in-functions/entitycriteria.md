# EntityCriteria

Start a fluent query on an entity. Chain conditions, joins, projections, ordering and options, then run it with a terminal method such as list(), count(), get(), first(), paginate() or each(). The updateAll() and deleteAll() terminals change every matching row with one statement, and lock() locks the rows a query returns.

## Method Signature

```
EntityCriteria(entityName=[String])
```

### Arguments


| Argument     | Type     | Required | Description          | Default |
| ------------ | -------- | -------- | -------------------- | ------- |
| `entityName` | `String` | `true`   | The entity to query. |         |

Returns a criteria builder. See [Criteria Queries](../../usage/criteria.md) for every method.

## Examples

Active users whose last name starts with "Sm", ordered:

```java
users = entityCriteria( "User" )
    .isEq( "active", true )
    .like( "lastName", "Sm%" )
    .order( "lastName" )
    .list();
```

Or-groups and association paths (joined automatically):

```java
admins = entityCriteria( "User" )
    .anyOf( ( c ) => c.isEq( "role.name", "admin" ).isTrue( "isSuperUser" ) )
    .count();
```

A page of results with its paging numbers:

```java
page = entityCriteria( "Order" )
    .isGe( "createdDate", dateAdd( "d", -30, now() ) )
    .orderByDesc( "createdDate" )
    .paginate( page = 2, maxRows = 25 );
// { results : [...], pagination : { page : 2, maxRows : 25, totalRecords : 130, totalPages : 6 } }
```

Grouped totals as structs:

```java
totals = entityCriteria( "Order" )
    .project( ( p ) => p.group( "status" ).count( "id", "orders" ).sum( "total", "revenue" ) )
    .asStruct()
    .list();
```

Structs built like `entityToStruct()`, read with projection queries instead of loading entities (see [Entities as Structs](../../usage/structs.md)):

```java
users = entityCriteria( "User" )
    .isEq( "active", true )
    .asStruct( "id,name,role.name,orders" )
    .list();
```

A property argument can be a function call, including the application's named [`sqlFunctions`](../../getting-started/configuration/README.md#named-sql-functions):

```java
thisYear = entityCriteria( "Order" ).isEq( "year(createdDate)", 2025 ).order( "lower(customer.name)" ).list();
```

Change or delete every matching row with one statement (no entity events or cascades, see [Bulk updates and deletes](../../usage/criteria.md#bulk-updates-and-deletes)):

```java
archived = entityCriteria( "Order" ).isLt( "createdDate", cutoff ).updateAll( { status : "archived" } );
removed  = entityCriteria( "Session" ).isLt( "expires", now() ).deleteAll();
```

Lock the rows a query returns until the transaction ends:

```java
transaction {
    jobs = entityCriteria( "Job" ).isEq( "status", "new" ).lock( "write", { skipLocked : true } ).maxResults( 10 ).list();
}
```

See the SQL without running the query:

```java
writeOutput( entityCriteria( "User" ).isEq( "active", true ).getSQL( true ) );
```

## Related

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

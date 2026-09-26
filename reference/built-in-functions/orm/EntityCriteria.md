[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `EntityCriteria`

Start a fluent query on an entity. Chain conditions, joins, projections, ordering and options, then run it with a terminal method such as list(), count(), get(), first(), paginate() or each(). The updateAll() and deleteAll() terminals change every matching row with one statement, and lock() locks the rows a query returns.

## Method Signature

```
EntityCriteria(entityName=[String])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `entityName` | `String` | `true` | The entity to query. |  |

Returns a criteria builder. See [Criteria Queries](../../../usage/criteria.md) for every method.

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

Change or delete every matching row with one statement (no entity events or cascades, see [Bulk updates and deletes](../../../usage/criteria.md#bulk-updates-and-deletes)):

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

  * [EntityDelete](./EntityDelete.md)
  * [EntityEvict](./EntityEvict.md)
  * [EntityGetDatasource](./EntityGetDatasource.md)
  * [EntityGetDirtyProperties](./EntityGetDirtyProperties.md)
  * [EntityGetId](./EntityGetId.md)
  * [EntityGetMetadata](./EntityGetMetadata.md)
  * [EntityGetName](./EntityGetName.md)
  * [EntityGetReference](./EntityGetReference.md)
  * [EntityIsAttached](./EntityIsAttached.md)
  * [EntityIsDirty](./EntityIsDirty.md)
  * [EntityLoad](./EntityLoad.md)
  * [EntityLoadByExample](./EntityLoadByExample.md)
  * [EntityLoadByPK](./EntityLoadByPK.md)
  * [EntityLoadByPKOrFail](./EntityLoadByPKOrFail.md)
  * [EntityLoadOrFail](./EntityLoadOrFail.md)
  * [EntityLoadOrNew](./EntityLoadOrNew.md)
  * [EntityLoadOrSave](./EntityLoadOrSave.md)
  * [EntityLoadReadOnly](./EntityLoadReadOnly.md)
  * [EntityLock](./EntityLock.md)
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
  * [ORMReadOnly](./ORMReadOnly.md)
  * [ORMReload](./ORMReload.md)

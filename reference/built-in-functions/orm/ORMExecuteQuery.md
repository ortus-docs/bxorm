[comment]: # (Note: This documentation is generated dynamically in the build process.  To modify the contents, change the javadoc on the _invoke method of the BIF class)

# Function: `ORMExecuteQuery`

Execute an HQL query with (optional) parameters and specific query options.

<h2>Parameters</h2>
 The <code>parameters</code> argument can be used to bind parameters to the SQL query.
 You can use either an array of binding parameters or a struct of named binding parameters.
 
 The SQL must have the parameters bound using the syntax <code>?</code> for positional parameters or <code>:name</code> for named parameters.
 <p>
 Example:

 <pre>
 ORMExecuteQuery( hql: "FROM autos WHERE make = ?", params: [ 'Ford' ] );
 ORMExecuteQuery( hql: "FROM autos WHERE make = :make", params: { make: 'Ford' } );
 </pre>
 
 <h2>Options</h2>
 
 The options struct can contain any of the following keys:
 <ul>
 <li><strong><code>unique</code></strong> - Specifies whether to retrieve a single, unique item. Default is false.</li>
 <li><strong><code>datasource</code></strong> - The datasource to use for the query. If not specified, the default datasource will be used.</li>
 <li><strong><code>offset</code></strong> - Specifies the position from which to retrieve the objects. Default is 0.</li>
 <li><strong><code>maxresults</code></strong> - Specifies the maximum number of objects to be retrieved. Default is no limit.</li>
 <li><strong><code>readonly</code></strong> - If true, the query will be read-only. Default is false.</li>
 </ul>

## Method Signature

```
ORMExecuteQuery(hql=[String], params=[Any], unique=[Any], options=[Struct])
```

### Arguments


| Argument | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `hql` | `String` | `true` | The HQL query string to execute. |  |
| `params` | `Any` | `false` | Optional parameters for the HQL query. Can be a struct of named parameters or an array of positional parameters. |  |
| `unique` | `Any` | `false` | Optional boolean indicating whether to return a unique result (true) or a list of results (false). If true, the query will return<br>                  a single object or null if no results found. |  |
| `options` | `Struct` | `false` | Optional struct of additional query options. |  |

## Examples

### Simple HQL Query Execution

The `ORMExecuteQuery` function allows you to execute HQL (Hibernate Query Language) queries against your ORM entities. This function is useful for retrieving data based on specific criteria defined in your HQL query.

```java
var allToyotas = ORMExecuteQuery(
    hql = "FROM Auto WHERE Make = :make",
    params = { make = "Toyota" },
    options = { unique = false }
);
```

## Passing parameters

You can pass parameters to your HQL query using either named parameters (as a struct) or positional parameters (as an array).

```java
var allToyotas = ORMExecuteQuery(
    hql = "FROM Auto WHERE Make = ?",
    params = [ "Toyota" ]
);
```

Using named parameters:

```java
var toyota = ORMExecuteQuery(
    hql = "FROM Auto WHERE Make = :make",
    params = { make = "Toyota" }
);
```

Named parameters are converted to JPA-style positional placeholders in the HQL string prior to execution. Thus, the above query is rewritten as:

```sql
FROM Auto WHERE Make = ?1
```

prior to query execution.

## Related

  * [EntityDelete](./EntityDelete.md)
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
  * [ORMEvictCollection](./ORMEvictCollection.md)
  * [ORMEvictEntity](./ORMEvictEntity.md)
  * [ORMEvictQueries](./ORMEvictQueries.md)
  * [ORMFlush](./ORMFlush.md)
  * [ORMFlushAll](./ORMFlushAll.md)
  * [ORMGetHibernateVersion](./ORMGetHibernateVersion.md)
  * [ORMGetSession](./ORMGetSession.md)
  * [ORMGetSessionFactory](./ORMGetSessionFactory.md)
  * [ORMReload](./ORMReload.md)

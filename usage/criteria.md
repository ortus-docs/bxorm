---
description: Build queries fluently with entityCriteria()
---

# Criteria Queries

`entityCriteria()` builds a query one method at a time. You chain conditions, joins, projections and ordering, then run it with a terminal method such as `list()`, `count()`, `get()` or `paginate()`. There is no query string to write, property names are checked as you go, and values are always bound as parameters.

```js
users = entityCriteria( "User" )
    .isEq( "active", true )
    .like( "lastName", "Sm%" )
    .order( "lastName" )
    .list();
```

## How it works

* **Building methods** add to the criteria and return it, so they chain.
* **Terminal methods** run the query and return the result. They never change the criteria, so one criteria can run several queries (`count()` then `list()`, for example).
* `copy()` gives you an independent copy to branch from.
* Method names are case-insensitive and accept positional or named arguments: `isEq( "make", "Ford" )` or `isEq( property = "make", value = "Ford" )`.
* Property names are checked when you add them. A typo fails at once with a suggestion: `Vehicle has no property [mkae]. Did you mean [make]?`

```js
c = entityCriteria( "Vehicle" ).isEq( "make", "Honda" );
total = c.count();
page  = c.order( "model" ).maxResults( 10 ).list();
```

## Conditions

Every condition is added with `and`. Values are bound as parameters and converted to the property's type, so `isEq( "id", "42" )` works for a numeric id.

| Method (aliases) | Meaning |
| --- | --- |
| `isEq( p, v )` (`eq`) | `p = v`; a `null` value means `p is null` |
| `ne( p, v )` (`isNe`) | `p <> v`; a `null` value means `p is not null` |
| `isGt` (`gt`), `isGe` (`ge`, `gte`), `isLt` (`lt`), `isLe` (`le`, `lte`) | Comparisons |
| `like( p, pattern )` | `p like pattern` (you include the `%` wildcards) |
| `ilike( p, pattern )` | `like`, ignoring case |
| `between( p, min, max )` | Inclusive range |
| `isIn( p, values )` (`in`, `whereIn`) | `values` is an array, a comma-separated list, or a subquery. An empty list matches nothing |
| `isNotIn( p, values )` | The opposite of `isIn` |
| `isNull( p )`, `isNotNull( p )` | Null checks |
| `isTrue( p )`, `isFalse( p )` | Boolean properties |
| `isEmpty( p )`, `isNotEmpty( p )` | Collections (one-to-many, many-to-many) |
| `sizeEq`, `sizeNe`, `sizeGt`, `sizeGe`, `sizeLt`, `sizeLe( p, n )` | Collection size |
| `eqProperty`, `neProperty`, `gtProperty`, `geProperty`, `ltProperty`, `leProperty( p, other )` | Compare two properties |
| `idEq( id )` | Match the id. For a composite id pass a struct: `idEq( { make : "Ford", model : "F-150" } )` |
| `sql( fragment, params )` (`sqlRestriction`) | A native SQL condition, see below |

### `where()` shorthands

```js
c.where( "make", "Honda" );              // isEq
c.where( "price", ">=", 20000 );         // =, !=, >, >=, <, <=, like, ilike, in, not in
c.where( { make : "Honda", year : 2024 } ); // several isEq; a null value means is null
c.where( ( c ) => c.isEq( "a", 1 ).isEq( "b", 2 ) ); // an and-group
```

### Groups: `anyOf()` and `allOf()`

`anyOf()` joins the conditions of its closure with `or`. `allOf()` joins them with `and`, which is useful inside `anyOf()`.

```js
// make = Honda OR make = Toyota
entityCriteria( "Vehicle" ).anyOf( ( c ) => c.isEq( "make", "Honda" ).isEq( "make", "Toyota" ) );

// (make = Honda AND model like R%) OR year < 2000
entityCriteria( "Vehicle" ).anyOf( ( c ) => c
    .allOf( ( a ) => a.isEq( "make", "Honda" ).like( "model", "R%" ) )
    .isLt( "year", 2000 )
);
```

Several closures passed to `anyOf()` are alternatives, and each closure's own conditions must all match:

```js
entityCriteria( "Vehicle" ).anyOf(
    ( c ) => c.isEq( "make", "Honda" ).isEq( "model", "Civic" ),
    ( c ) => c.isEq( "make", "Ford" )
);
```

Aliases: `$or`, `or`, `orWhere`, `disjunction` for `anyOf`; `$and`, `and`, `conjunction` for `allOf`.

### Negation

`not( closure )` negates a group. Any condition can also be negated with the `not` prefix: `notLike`, `notIn`, `notBetween`, `notEq`, `notEmpty`, ...

```js
entityCriteria( "Vehicle" ).notLike( "make", "Hon%" );
entityCriteria( "Vehicle" ).not( ( c ) => c.isEq( "make", "Honda" ).isEq( "model", "Civic" ) );
```

### Native SQL: `sql()`

`sql( fragment, params )` adds a SQL condition. `?` takes the params in order (always bound). `{alias}.column` refers to a column of the entity, and `{property}` (or `{association.property}`) to a property.

```js
c.sql( "upper({alias}.first_name) = ?", [ "LUIS" ] );
c.sql( "lower({make}) = ? or {model} = ?", [ "ford", "Civic" ] );
```

## Associations and joins

A dotted path joins its associations automatically:

```js
entityCriteria( "Vehicle" ).isEq( "manufacturer.name", "Ford Motor Company" );
```

* A condition uses an **inner** join, so rows without the association are left out.
* Inside `anyOf()` and `not()` a **left** join is used, so a row without the association can still match another branch.
* Ordering and projections use a **left** join, so ordering never drops rows.
* The same path is joined once and reused.
* `manufacturer.id` compares the foreign key and needs no join.
* An association can be compared with an id or an entity: `isEq( "manufacturer", 42 )`, `isIn( "manufacturer", [ 1, 42 ] )`.

The root entity's alias is `this` (`this.name`).

### Aliases and join types

```js
entityCriteria( "Vehicle" )
    .joinTo( "manufacturer", "m" )          // alias createAlias; optional third argument: join type
    .isEq( "m.name", "Honda Motor Co." );

c.leftJoin( "manufacturer", "m" );          // also innerJoin, rightJoin, fullJoin
c.joinTo( "manufacturer", "m", "left" );    // inner, left, right, full, or c.LEFT_JOIN (cborm constants)
```

Right and full joins need database support (MySQL and MariaDB have no full join).

### `with{Association}()`

`with{Association}()` makes an association the start of unqualified paths. With a closure it applies to the closure's conditions; without one it applies until `end()`. `createCriteria( association )` is the cborm form.

```js
entityCriteria( "Vehicle" )
    .withManufacturer( ( m ) => m.like( "name", "Honda%" ) )
    .isEq( "model", "Civic" );

entityCriteria( "Vehicle" )
    .withManufacturer( "left" )
        .like( "name", "Honda%" )
    .end()
    .isEq( "model", "Civic" );
```

### Fetching

`fetch( association )` loads an association together with the root rows, so reading it later needs no extra query:

```js
vehicles = entityCriteria( "Vehicle" ).fetch( "manufacturer" ).list();
```

When a condition goes through a to-many association, each root entity is returned once, and `count()` counts each root once.

## Subqueries

`subquery( entityName, alias )` creates a subquery. Inside it, unqualified paths start at the subquery's entity, and `this.` refers to the outer query's root.

```js
c = entityCriteria( "Manufacturer" );

// manufacturers that make a Honda
c.exists( c.subquery( "Vehicle", "v" ).eqProperty( "v.manufacturer", "this" ).isEq( "make", "Honda" ) );

// manufacturers with no vehicles
c.notExists( c.subquery( "Vehicle", "v" ).eqProperty( "v.manufacturer", "this" ) );

// isIn with the subquery's projection
c.isIn( "id", c.subquery( "Vehicle", "v" ).isEq( "make", "Ford" ).project( ( p ) => p.property( "manufacturer.id" ) ) );
```

The cborm forms are available too: `propertyEq`, `propertyNe`, `propertyGt`, `propertyGe`, `propertyLt`, `propertyLe`, `propertyIn`, `propertyNotIn` compare a property with a subquery, and `subEq`, `subNe`, `subGt`, `subGe`, `subLt`, `subLe`, `subIn`, `subNotIn` compare a value with one:

```js
counted = c.subquery( "Vehicle", "v" ).eqProperty( "v.manufacturer", "this" ).project( ( p ) => p.rowCount() );
c.subLe( 2, counted );   // manufacturers with at least 2 vehicles
```

## Results

### Projections

`project()` selects columns instead of entities. Each method takes a property and an optional alias:

```js
entityCriteria( "Vehicle" )
    .project( ( p ) => p.group( "make" ).count( "vin", "total" ).avg( "price" ) )
    .asStruct()
    .list();
// [ { make : "Ford", total : 1, price : ... }, ... ]
```

Methods: `property`, `group` (`groupProperty`), `sum`, `avg`, `min`, `max`, `count`, `countDistinct`, `rowCount( [alias] )`, `id( [alias] )`. An alias defaults to the property name.

The cborm form, `withProjections()`, takes a struct or named arguments whose values are `property[:alias]` lists:

```js
c.withProjections( groupProperty = "make", count = "vin:total", distinct = "model" );
```

With one projection, `list()` returns plain values; with several, one array per row, or one struct per row with `asStruct()`.

### Result shapes

| Method | `list()` returns |
| --- | --- |
| (default) | Entities |
| `asStruct()` | One struct per row. Without projections: the id and plain properties |
| `asQuery()` | A query |
| `asStream()` | A Java stream |
| `asDistinct()` | Distinct rows |

### Ordering and paging

```js
c.order( "lastName" );                    // asc by default
c.order( "lastName", "desc" );
c.order( "lastName", "asc", true );       // ignore case (text properties)
c.orderBy( "make desc, model asc" );
c.orderByDesc( "createdDate" );
c.firstResult( 20 ).maxResults( 10 );     // aliases: offset, limit
```

### Options

| Method | Effect |
| --- | --- |
| `cache( [region] )` | Cache the result in the second-level query cache (needs `secondaryCacheEnabled`); `cache( false )` to turn it off |
| `readOnly()` | Loaded entities are read-only: their changes are not saved |
| `timeout( seconds )` | Query timeout |
| `fetchSize( n )` | JDBC fetch size |
| `comment( text )` | SQL comment (shown with `logSQL` in the ORM settings) |
| `queryHint( name, value )` | A Hibernate query hint |

## Terminal methods

| Method | Returns |
| --- | --- |
| `list()` | The rows. cborm arguments work too: `list( max, offset, timeout, sortOrder, ignoreCase, asQuery )` |
| `count( [property] )` | The number of matching entities, or of distinct values of a property |
| `exists()` | Whether any row matches |
| `get( [uniqueFirst] )` | The single match, or null. More than one match is an `orm.query.nonUnique` error unless `uniqueFirst` is true |
| `getOrFail( [uniqueFirst] )` | Like `get()`, but no match is an `orm.notFound` error |
| `first()` | The first row in order, or null |
| `firstOrFail()` | Like `first()`, but no row is an `orm.notFound` error |
| `paginate( page = 1, maxRows = 25 )` | `{ results, pagination : { page, maxRows, totalRecords, totalPages } }` |
| `simplePaginate( page = 1, maxRows = 25 )` | `{ results, pagination : { page, maxRows, hasMore } }`, without counting |
| `pluck( property )` | One property's values, in order |
| `sum`, `avg`, `min`, `max( property )` | An aggregate |
| `each( callback, [size] )` | Calls the closure once per row; returns the row count |
| `chunk( size, callback )` | Calls the closure with each batch of rows; returns the row count |

`each()` and `chunk()` read the rows in batches (100 by default for `each()`). After each batch the session is flushed, so changes made in the callback are saved, and cleared, so memory stays flat. Without an explicit order, batches follow the id, so deleting or changing rows in the callback never skips any.

```js
entityCriteria( "User" ).isFalse( "verified" ).chunk( 500, ( users ) => {
    users.each( ( u ) => u.setReminderSent( true ) );
} );
```

## Flow helpers

```js
entityCriteria( "User" )
    .when( len( search ), ( c ) => c.like( "lastName", search & "%" ) )
    .when( role == "admin", ( c ) => c.isTrue( "isAdmin" ), ( c ) => c.isFalse( "isAdmin" ) )
    .unless( showDeleted, ( c ) => c.isFalse( "isDeleted" ) )
    .apply( activeUsers )        // a reusable closure: activeUsers = ( c ) => c.isTrue( "active" )
    .peek( ( c ) => writeLog( c.count() ) )
    .list();
```

## Seeing the query

| Method | What it does |
| --- | --- |
| `getSQL( [executable], [format] )` | The SQL Hibernate would run, without running it. `executable = true` puts the values in (for pasting into a SQL tool); `format = false` keeps it on one line. Paging is not included |
| `peekSQL( callback )` | Calls the closure with the SQL and keeps chaining |
| `logSQL( [label] )` | Writes the SQL to the ORM log and keeps chaining |
| `getHQL()` | The HQL the criteria compiles to |
| `toString()` / `writeDump()` | The calls you made, the HQL, the parameters and the SQL |

```js
writeDump( entityCriteria( "Vehicle" ).isEq( "make", "Honda" ).like( "manufacturer.name", "Honda%" ) );
// entityCriteria( "Vehicle" )
//     .isEq( "make", "Honda" )
//     .like( "manufacturer.name", "Honda%" )
// HQL: select bx_this from Vehicle bx_this inner join bx_this.manufacturer bx_j1 where (bx_this.make = ?1 and bx_j1.name like ?2)
// Params: ["Honda", "Honda%"]
// SQL: select ...
```

`getSQL()` needs bx-orm's Hibernate statement inspector. If your ORM settings configure your own (`hibernate.session_factory.statement_inspector`), `getSQL()` says so.

## Interception points

The cborm criteria events are announced as BoxLang interception points. Each receives `criteriaBuilder`, and the `after` points also receive the result.

| Point | Extra data |
| --- | --- |
| `beforeCriteriaBuilderList` | |
| `afterCriteriaBuilderList` | `results` |
| `beforeCriteriaBuilderCount` | |
| `afterCriteriaBuilderCount` | `count` |
| `beforeCriteriaBuilderGet` | |
| `afterCriteriaBuilderGet` | `result` |
| `onCriteriaBuilderAddition` | `type` (the condition method) |

## Errors

| Error | When |
| --- | --- |
| `orm.property.unknown` | A property that does not exist, or a path through a plain value, with a suggestion |
| `orm.argument` | An unknown method or argument, a bad join type, operator or sort direction, a subquery run on its own |
| `orm.query.nonUnique` | `get()` matched more than one row |
| `orm.notFound` | `getOrFail()` or `firstOrFail()` matched nothing |
| `orm.query.parameter` | `sql()` params do not match its `?` placeholders |

See [Errors and Diagnostics](errors-and-diagnostics.md) for the full catalog.

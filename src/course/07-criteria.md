---
title: Criteria queries
summary: Build queries in code with entityCriteria(): conditions, automatic joins, projections, paging and bulk changes.
icon: phosphor-duotone:funnel
tags: [course]
---

Filters like `{ name : "Ann" }` only go so far. The blog needs searches like "published posts by Ann, tagged orm, newest first, page 2". That is a job for **criteria queries**: a query you build by chaining methods.

```boxlang title="app.bxs"
posts = entityCriteria( "Post" )
    .isTrue( "published" )
    .isEq( "author.email", "ann@example.com" )
    .order( "createdDate", "desc" )
    .list();
```

`entityCriteria( "Post" )` starts a query. On an imported entity, `Post::criteria()` does the same.

## Building and running

- **Building methods** (`isEq()`, `like()`, `order()`, ...) add to the query and return it, so they chain.
- **Terminal methods** (`list()`, `count()`, `get()`, ...) run it and return a result. They don't change the query, so one query can run twice:

```boxlang
c     = entityCriteria( "Post" ).isTrue( "published" );
total = c.count();
posts = c.order( "title" ).maxResults( 10 ).list();
```

## Conditions

Every condition is joined with `and`. Values are always bound as parameters and converted to the property's type.

| Method                                      | Meaning                                 |
| ------------------------------------------- | --------------------------------------- |
| `isEq( p, v )`, `ne( p, v )`                | Equal, not equal (`null` means is null) |
| `isGt`, `isGe`, `isLt`, `isLe`              | Comparisons                             |
| `like( p, pattern )`, `ilike( p, pattern )` | Pattern match, `ilike` ignores case     |
| `between( p, min, max )`                    | Inclusive range                         |
| `isIn( p, values )`, `isNotIn( p, values )` | In a list or array                      |
| `isNull( p )`, `isNotNull( p )`             | Null checks                             |
| `isTrue( p )`, `isFalse( p )`               | Boolean properties                      |
| `isEmpty( p )`, `isNotEmpty( p )`           | Collections                             |

Need an `or`? Group conditions with `anyOf()`:

```boxlang
entityCriteria( "Post" ).anyOf( ( c ) => c.like( "title", "%BoxLang%" ).like( "title", "%ORM%" ) );
```

Property names are checked as you add them. A typo fails at once:

```text
Post has no property [titel]. Did you mean [title]?
```

## Automatic joins

A dotted path joins the association for you:

```boxlang
// Posts by Ann
entityCriteria( "Post" ).isEq( "author.email", "ann@example.com" ).list();

// Posts tagged "orm"
entityCriteria( "Post" ).isEq( "tags.name", "orm" ).list();

// An association compares with an entity or an id
entityCriteria( "Post" ).isEq( "author", ann ).list();
```

No join syntax, no aliases to manage. The same path is joined once and reused.

## Paging

`paginate()` runs the page and the count for you:

```boxlang title="app.bxs"
result = entityCriteria( "Post" )
    .isTrue( "published" )
    .orderByDesc( "createdDate" )
    .paginate( page = 2, maxRows = 10 );

println( result.pagination );
// { page : 2, maxRows : 10, offset : 10, totalRecords : 42, totalPages : 5 }
posts = result.results;
```

For simple "load more" buttons, `simplePaginate()` skips the count and tells you `hasMore` instead.

## Projections

Sometimes you want numbers, not entities. `project()` selects columns. With `asStruct()`, each row is a struct:

```boxlang title="app.bxs"
stats = entityCriteria( "Post" )
    .project( ( p ) => p.group( "author.name", "author" ).count( "id", "posts" ) )
    .asStruct()
    .list();
// [ { author : "Ann", posts : 2 }, ... ]
```

`pluck()` returns one property's values, and `sum()`, `avg()`, `min()` and `max()` return an aggregate:

```boxlang
tagNames = entityCriteria( "Tag" ).order( "name" ).pluck( "name" );
```

## Building a search page

Real searches have optional filters. `when()` adds conditions only when a test is true, so there are no `if` blocks in the middle of your chain:

```boxlang title="search.bxs"
function searchPosts( string q = "", string tag = "", numeric page = 1 ) {
    return entityCriteria( "Post" )
        .isTrue( "published" )
        .when( len( q ), ( c ) => c.ilike( "title", "%#q#%" ) )
        .when( len( tag ), ( c ) => c.isEq( "tags.name", tag ) )
        .orderByDesc( "createdDate" )
        .paginate( page = page, maxRows = 10 );
}
```

## See the SQL

`getSQL()` shows the SQL a query would run, without running it:

```boxlang
println( entityCriteria( "Post" ).isTrue( "published" ).getSQL() );
```

## Bulk changes

`updateAll()` and `deleteAll()` change every matching row with one statement:

```boxlang
transaction {
    count = entityCriteria( "Post" )
        .isFalse( "published" )
        .isLt( "createdDate", dateAdd( "d", -365, now() ) )
        .deleteAll();
}
```

Like `deleteWhere()`, they skip entity events and cascades. Run them in a transaction.

## Try it

- Count Ann's published posts.
- List posts tagged `orm` or `boxlang`, newest first.
- Build `searchPosts()` and call it with and without each filter. Print `getSQL()` for each.
- Use a projection to count posts per tag.

## Learn more

- [Criteria queries](https://bxorm.ortusbooks.com/bxorm-2.x/working-with-entities/criteria)
- [entityCriteria()](https://bxorm.ortusbooks.com/bxorm-2.x/reference/built-in-functions/entitycriteria)

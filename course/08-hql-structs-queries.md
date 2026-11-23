---
title: HQL, structs and queries
summary: Query with HQL, and turn entities into structs for a JSON API or into a query for reports.
icon: phosphor-duotone:code
tags: [course]
---

Criteria queries cover most needs. When a query is easier to write as text, use **HQL**, Hibernate's query language. And when you send data out of your app, as JSON or a report, you want plain structs or a query object, not entities. This lesson covers both.

## HQL

HQL looks like SQL, but it talks about **entities and properties**, not tables and columns:

```boxlang title="app.bxs"
posts = ormExecuteQuery(
    "from Post where author.email = :email order by createdDate desc",
    { email : "ann@example.com" }
);
```

- `from Post` means the `Post` entity, not the `posts` table.
- `author.email` follows the relationship. No join needed.
- `:email` is a named parameter. Always pass values as parameters, never by gluing strings together.

Names are case-insensitive, like the rest of BoxLang, so `from post where TITLE like :t` works too.

## Parameters and options

```boxlang title="app.bxs"
// Positional parameters
ormExecuteQuery( "from Post where title like ?", [ "%ORM%" ] );

// An array expands for IN
ormExecuteQuery( "from Tag where name in (:names)", { names : [ "orm", "boxlang" ] } );

// One value instead of an array: pass true as the third argument
total = ormExecuteQuery( "select count(p) from Post p", {}, true );

// Paging and other options go in the fourth argument
page = ormExecuteQuery( "from Post order by id", {}, false, { maxResults : 10, offset : 20 } );
```

Other options include `readOnly`, `datasource` and `asStream`. On an imported entity, `Post::executeQuery( hql, params )` does the same as `ormExecuteQuery()`.

## Structs for a JSON API

`entityToStruct()` turns an entity, or an array of them, into plain structs. By default a struct holds the id and the plain properties. `includes` adds relationships, and `excludes` leaves things out:

```boxlang title="api.bxs"
function getPost( required numeric id ) {
    var post = entityLoadByPKOrFail( "Post", id );
    return entityToStruct( post, {
        includes : "author.name,tags",
        excludes : "body"
    } );
}

println( jsonSerialize( getPost( 3 ) ) );
```

```json
{
  "id": 3,
  "title": "Relationships",
  "published": false,
  "createdDate": "2026-11-23T13:59:10Z",
  "updatedDate": "2026-11-23T13:59:10Z",
  "author": { "name": "Ann" },
  "tags": [ { "id": 3, "name": "orm" } ]
}
```

A few rules make the output API-friendly:

- Dates become ISO 8601 strings.
- A `null` becomes an empty string, or the value you give in `defaults`.
- A to-one relationship becomes a struct, and a to-many one becomes an array of structs.
- An include that doesn't exist is an `orm.property.unknown` error that suggests the right name.

If you don't need the entities at all, skip them. `entityLoadAsStruct()` and a criteria query's `asStruct( includes )` build the same structs straight from the database:

```boxlang
ann   = entityLoadAsStruct( "User", 1, "posts.title" );
posts = entityCriteria( "Post" ).isTrue( "published" ).asStruct( "author.name" ).list();
```

## Queries for reports

Some code wants a BoxLang `Query` object: a report, a data grid, a CSV export. `entityToQuery()` gives one row per entity and one column per plain property:

```boxlang title="report.bxs"
users = entityLoad( "User", {}, "email" );
qUsers = entityToQuery( users );

println( qUsers.columnList ); // id,email,name,createdDate
```

Relationships are not included. When the report needs related data, use a criteria projection with `asStruct()` instead.

## Try it

- Write an HQL query that counts each user's published posts.
- Build a tiny JSON endpoint that returns a post with its author's name and its tags.
- Return the newest ten posts as structs without loading entities, using `asStruct()`.
- Export all users to a query and print it as CSV.

## Learn more

- [Queries and HQL](https://bxorm.ortusbooks.com/bxorm-2.x/working-with-entities/querying)
- [Entities as structs](https://bxorm.ortusbooks.com/bxorm-2.x/working-with-entities/structs)
- [Entities as queries](https://bxorm.ortusbooks.com/bxorm-2.x/working-with-entities/queries)

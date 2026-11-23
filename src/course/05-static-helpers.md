---
title: Static helpers
summary: Load, find, count, create and bulk change entities straight from the class, like User::get( 1 ).
icon: phosphor-duotone:lightning
tags: [course]
---

The functions from the last lesson all start with an entity name: `entityLoadByPK( "User", 1 )`. BxORM also adds **static helper methods** to every entity class at startup, so the same work reads like plain English:

```boxlang
ann   = User::get( 1 );
bob   = User::findWhere( { email : "bob@example.com" } );
total = User::count();
```

There is no base class to extend and no service to write. Each helper calls the matching built-in function with the entity name filled in, so it behaves exactly like that function: same session, events, errors and options.

## Import the entity

To call a static method, BoxLang needs to know which class `User` is. Import it at the top of the script, using the `/blog` mapping from lesson 2:

```boxlang title="app.bxs"
import blog.models.User;
import blog.models.Tag;

println( User::count() );
```

One catch: a variable cannot have the same name as an import, and BoxLang names ignore case. After `import blog.models.Tag;`, write `boxlangTag = Tag::get( 1 )`, not `tag = Tag::get( 1 )`.

## Loading

| Method               | Returns                                                   |
| -------------------- | --------------------------------------------------------- |
| `get( id )`          | The entity, or `null`                                     |
| `getOrFail( id )`    | The entity, or an `orm.notFound` error                    |
| `getAll( [ids] )`    | Every entity, or the entities for an array or list of ids |
| `read( id )`         | The entity, read-only: changes to it are never saved      |
| `getReference( id )` | A reference that loads on first use, without a `SELECT`   |

```boxlang
ann = User::getOrFail( 1 );
```

## Finding and counting

| Method                             | Returns                                                     |
| ---------------------------------- | ----------------------------------------------------------- |
| `findWhere( filter )`              | The one entity matching the filter, or `null`               |
| `findWhereOrFail( filter )`        | Like `findWhere()`, but no match is an `orm.notFound` error |
| `findAllWhere( [filter], [sort] )` | An array of the matching entities                           |
| `first( [filter], [sort] )`        | The first matching entity, or `null`                        |
| `exists( idOrFilter )`             | `true` when a match exists                                  |
| `count( [filter] )`                | The number of matching entities                             |
| `list( [options] )`                | The entities, with `max`, `offset` and `sort`               |

```boxlang title="app.bxs"
// One match, or null. Two matches is an orm.query.nonUnique error.
ann = User::findWhere( { email : "ann@example.com" } );

// Everyone called Cy, sorted
cys = User::findAllWhere( { name : "Cy" }, "email" );

// Page 1, 25 per page
page = User::list( { max : 25, offset : 0, sort : "email" } );

if ( User::exists( { email : "bob@example.com" } ) ) {
    println( "Bob is here" );
}
```

## Creating

| Method                                  | Returns                                  |
| --------------------------------------- | ---------------------------------------- |
| `new( [properties] )`                   | A new, unsaved entity                    |
| `firstOrNew( filter, [properties] )`    | The match, or a new unsaved entity       |
| `firstOrCreate( filter, [properties] )` | The match, or a new entity that is saved |

`firstOrCreate()` is perfect for tags: you want "the tag called boxlang", whether or not it exists yet.

```boxlang title="app.bxs"
transaction {
    boxlangTag = Tag::firstOrCreate( { name : "boxlang" } );
}
```

Two requests can both find nothing and both insert. The `@unique` on `Tag.name` makes the database reject the second one.

## Bulk updates and deletes

`updateWhere()` and `deleteWhere()` change many rows with **one** SQL statement, without loading them:

```boxlang title="app.bxs"
transaction {
    renamed = User::updateWhere( { name : "Cy" }, { name : "Cyrus" } );
    removed = Tag::deleteWhere( { name : "draft" } );
}
println( "#renamed# renamed, #removed# removed" );
```

They return the number of rows changed. Because they skip the entities, no events or cascades fire, and entities already loaded keep their old values.

They also refuse an empty filter, since it would hit every row:

```text
orm.argument: Tag::deleteWhere() needs a non-empty filter; an empty one would affect every row.
```

When you really mean every row, say so with a criteria query: `Tag::criteria().deleteAll()`. Lesson 7 covers criteria.

## Instances can call them too

BoxLang lets an instance call its class's static methods, so `ann.count()` works as well. And if you write your own static method with the same name on the entity, yours wins and BxORM leaves it alone.

## Try it

- Rewrite the loads from lesson 4 with static helpers. Which version reads better to you?
- Use `User::list()` to print the users two at a time, page by page.
- Call `Tag::deleteWhere( {} )` and read the error.
- Add a static method `findByEmail( email )` to `User` that calls `findWhere()`.

## Learn more

- [Static entity methods](https://bxorm.ortusbooks.com/bxorm-2.x/usage/static-methods)
- [Working with entities](https://bxorm.ortusbooks.com/bxorm-2.x/usage/working-with-entities)

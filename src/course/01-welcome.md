---
title: Welcome to BxORM
summary: What an ORM does, what BxORM adds on top of Hibernate 7, and the blog you will build in this course.
icon: phosphor-duotone:rocket-launch
tags: [course]
---

Most applications keep their data in a relational database: tables, rows and columns. Most application code thinks in objects: a user, a post, a tag. An **ORM** (object-relational mapper) connects the two. You describe a class once, and the ORM turns rows into objects when you load them and objects into rows when you save them.

BxORM is the ORM for BoxLang. It runs on Hibernate 7, the most widely used ORM on the JVM, and wraps it in a framework built for a dynamic language.

## What BxORM adds on top of Hibernate

Hibernate on its own expects Java classes, XML mappings and a lot of casting. BxORM gives you:

- **Classes as tables.** A BoxLang class with `@persistent` is an entity. No XML, no Java.
- **Generated methods.** Getters, setters and relationship helpers like `addPosts()` are generated for you.
- **Static helpers.** `User::get( 1 )`, `User::findWhere( { email : "ann@example.com" } )` and `User::count()` on every entity.
- **A fluent criteria builder.** Conditions, joins, projections and paging, always parameterized.
- **No casting.** BoxLang values are converted to the right JDBC type and back.
- **Errors written for humans.** A typo in an entity name says `There is no entity named [Usr]. Did you mean [User]?`
- **A boot cache.** Large models start much faster in production.

Here is a taste. This loads a user, finds their published posts and turns them into JSON-ready structs:

```boxlang title="app.bxs"
user  = User::getOrFail( 1 );
posts = Post::criteria()
    .isEq( "author", user )
    .isTrue( "published" )
    .order( "createdDate", "desc" )
    .list();

println( entityToStruct( posts ) );
```

## What you will build

Over the course you build a small blog with three entities:

| Entity | Table   | What it holds                                         |
| ------ | ------- | ----------------------------------------------------- |
| `User` | `users` | An email, a name and the user's posts                 |
| `Post` | `posts` | A title, a body, a published flag, an author and tags |
| `Tag`  | `tags`  | A unique name                                         |

Every lesson adds to the same app, so keep the folder you create in the next lesson.

## How the course works

The first twelve lessons are the essentials:

1. Welcome (this lesson)
2. [Install and configure](02-install-and-configure.md)
3. [Your first entity](03-first-entity.md)
4. [Save, load and delete](04-save-load-delete.md)
5. [Static helpers](05-static-helpers.md)
6. [Relationships](06-relationships.md)
7. [Criteria queries](07-criteria.md)
8. [HQL, structs and queries](08-hql-structs-queries.md)
9. [Transactions and the session](09-transactions.md)
10. [Events, soft delete and timestamps](10-events-soft-delete.md)
11. [Errors and observability](11-errors-observability.md)
12. [Ship it](12-ship-it.md)

Then five lessons go further, in any order: [inheritance](13-inheritance.md), [testing](14-testing.md), [cborm](15-cborm.md), [building with AI](16-building-with-ai.md) and [coming from CFML](17-coming-from-cfml.md).

## Try it

- Think of an app you have built. Which of its tables would become entities?
- Pick one table and list its columns. Which would be a plain property, and which point at another table?

## Learn more

- [BxORM documentation](https://bxorm.ortusbooks.com/bxorm-2.x/)
- [What's new in 2.0](https://bxorm.ortusbooks.com/bxorm-2.x/release-history/whats-new-2.0.0)

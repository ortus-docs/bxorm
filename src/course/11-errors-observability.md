---
title: Errors and observability
summary: Read and catch ORM errors, inspect the ORM with ormDiagnostics(), and watch your SQL in BxLens to find N+1 queries.
icon: phosphor-duotone:pulse
tags: [course]
---

Things go wrong: a duplicate email, a typo in a property name, a page that suddenly runs forty queries. BxORM is built to make these easy to see and fix.

## Errors written for humans

Every ORM error has a `type` that starts with `orm`, and a message that says what happened and how to fix it:

```text
orm.entity.notFound: There is no entity named [Usr]. Did you mean [User]?
orm.property.unknown: User has no property [emial]. Did you mean [email]?
orm.notFound: No [Post] with id [99] was found.
orm.argument: Tag::deleteWhere() needs a non-empty filter; an empty one would affect every row.
```

A few of the most common types:

| Type                     | When                                                 |
| ------------------------ | ---------------------------------------------------- |
| `orm.notFound`           | An `OrFail` load matched nothing                     |
| `orm.query.nonUnique`    | A "one result" load matched several rows             |
| `orm.property.unknown`   | A property name that does not exist                  |
| `orm.constraint.unique`  | A unique constraint rejected the change              |
| `orm.constraint.notNull` | A required value is missing                          |
| `orm.lazy.noSession`     | A lazy relationship was read after its session ended |

## Catching errors

BoxLang matches `catch` types by dotted prefix, so you can catch one exact type, a family, or every ORM error:

```boxlang title="register.bxs"
try {
    transaction {
        entitySave( entityNew( "User", { email : form.email, name : form.name } ) );
    }
} catch ( "orm.constraint.unique" e ) {
    message = "That email address is already registered.";
} catch ( "orm" e ) {
    rethrow;
}
```

## ormDiagnostics()

When something looks wrong, ask the ORM about itself. `ormDiagnostics()` never throws:

```boxlang
d = ormDiagnostics();
println( d.status );           // running
println( d.entityCount );      // 3
println( d.hibernateVersion ); // 7.4.x
```

It also holds the last startup error, the entities per datasource, the settings that explain most surprises, and the current session's state.

## Listening to the ORM

BxORM announces events that tools can listen to, at no cost when nothing listens:

| Event            | Fires                    |
| ---------------- | ------------------------ |
| `onORMQuery`     | After each SQL statement |
| `onORMFlush`     | After each session flush |
| `onORMException` | When a statement fails   |

A small interceptor can log slow SQL:

```boxlang title="SlowSql.bx"
class {
    function onORMQuery( data ) {
        if ( data.elapsedNanos > 100000000 ) { // 100 ms
            writeLog( text = "Slow ORM #data.kind#: #data.sql#", type = "warning" );
        }
    }
}
```

```boxlang
boxRegisterInterceptor( interceptor : new SlowSql(), points : [ "onORMQuery" ] );
```

## BxLens: see every query

[BxLens](https://bxlens.boxlang.io) is BoxLang's observability tool, and it listens to these events for you. Install it next to BxORM:

```bash
bx-module install bx-lens
```

ORM is a BxLens integration, off until you turn it on: an admin switches it on from the console (Modules page, Integrations, or the ORM page), or sets `collectors.orm.enabled` to `true`. Then:

- **Queries panel (free).** Each ORM statement appears with the request's other queries: its SQL, time, rows and the BoxLang line that ran it, labelled ORM. Slow query and **N+1 detection** apply to it.
- **ORM page (BoxLang+).** Totals per datasource, flushes, recent failures and Hibernate statistics.

Open the bar on any page, or the console at `/~bxlens/index.bxm`.

## Fixing an N+1

Here is the blog's home page, listing posts with their author:

```boxlang title="home.bxs"
posts = entityLoad( "Post", { published : true }, "createdDate desc" );
for ( p in posts ) {
    println( "#p.getTitle()# by #p.getAuthor().getName()#" );
}
```

`author` is lazy, so each `getAuthor().getName()` runs one more query: 1 query for the posts, plus N for the authors. BxLens flags it as N+1. When you only need a few fields, select them in one query with a criteria projection:

```boxlang title="home.bxs"
rows = entityCriteria( "Post" )
    .isTrue( "published" )
    .orderByDesc( "createdDate" )
    .asStruct( "id,title,author.name" )
    .list();

for ( row in rows ) {
    println( "#row.title# by #row.author.name#" );
}
```

## Try it

- Trigger three different ORM errors on purpose and read each message.
- Catch `orm.constraint.unique` when a second user signs up with Ann's email.
- Print `ormDiagnostics()` and find your `dbcreate` setting in it.
- Install BxLens, turn on the ORM integration and load the home page before and after the fix.

## Learn more

- [Errors and diagnostics](https://bxorm.ortusbooks.com/bxorm-2.x/usage/errors-and-diagnostics)
- [Observability](https://bxorm.ortusbooks.com/bxorm-2.x/usage/observability)
- [ORM in BxLens](https://bxlens.boxlang.io/lensbar/orm/)

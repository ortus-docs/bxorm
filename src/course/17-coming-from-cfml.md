---
title: Coming from CFML
summary: Move an existing CFML ORM app to BxORM: what carries over, which settings changed, and a step by step plan.
icon: phosphor-duotone:arrows-left-right
tags: [course]
---

Many teams arrive at BxORM with an ORM app already written in CFML. Good news: BxORM is designed to be compatible with existing CFML ORM code. Your persistent components, relationships and ORM functions carry over, and a short list of settings and defaults needs attention.

## Your entities carry over

A CFML persistent component in the attribute form keeps working:

```boxlang title="models/Post.cfc"
component persistent="true" table="posts" {

    property name="id" fieldtype="id" generator="native";
    property name="title" ormtype="string" notnull="true";
    property name="author" fieldtype="many-to-one" cfc="User" fkcolumn="userID" lazy="true";
}
```

The same entity in BoxLang, with annotations, is the style this course uses:

```boxlang title="models/Post.bx"
@persistent
@table( "posts" )
class {

    @fieldtype( "id" )
    @generator( "native" )
    property id;

    @ormtype( "string" )
    @notNull
    property title;

    @fieldtype( "many-to-one" )
    @cfc( "User" )
    @fkcolumn( "userID" )
    @lazy
    property author;
}
```

Both mean the same thing, and you can mix them in one app. Convert files when you touch them, not all at once.

To run `.cfc` and `.cfm` files on BoxLang, install the CFML compatibility module:

```bash
bx-module install bx-compat-cfml
```

## Renamed settings

| CFML setting       | BxORM setting       |
| ------------------ | ------------------- |
| `cfcLocation`      | `entityPaths`       |
| `skipCFCWithError` | `ignoreParseErrors` |

BxORM does not read the old names: a setting under its old name is ignored. Rename them.

## Changed defaults

| Setting             | CFML engines | BxORM               |
| ------------------- | ------------ | ------------------- |
| `ignoreParseErrors` | `true`       | `false`             |
| `autoManageSession` | `true`       | `false`             |
| `flushAtRequestEnd` | `true`       | `false`             |
| `proxyLazyLoading`  | `true`       | `false` (no effect) |

BxORM does not flush at the end of a request by default. Writes belong in `transaction {}` blocks (lesson 9). If your app relies on the old behavior while you migrate, set the old values explicitly.

Two more to check:

- **Events need `eventHandling : true`**, as on other CFML engines. Without it, no entity event method or global handler runs.
- **`useDBForMapping` is off.** If your entities leave out `ormtype` or their id and expect the database to fill them in, set `useDBForMapping : true`, or better, declare them.

## Functions that behave differently

Most ORM functions are identical. Two details:

- **`entityLoadByPK()` returns one entity**, not an array. A third `unique` argument is accepted and ignored.
- **`entityNew()` skips unknown keys** in its struct. A third argument (`ignoreExtras`) is accepted and ignored.

```boxlang
// Before: an array, so .first()
post = entityLoadByPK( "Post", 1 ).first();

// BxORM: the entity
post = entityLoadByPK( "Post", 1 );
```

## A step by step plan

1. **Install** BoxLang, `bx-orm`, your database driver module and `bx-compat-cfml`.
2. **Rename** `cfcLocation` and `skipCFCWithError` in your ORM settings.
3. **Set the defaults** your app relies on (`flushAtRequestEnd`, `autoManageSession`, `eventHandling`) explicitly.
4. **Boot** with `dbcreate : "none"` against a copy of your database. BxORM checks every entity at startup and reports all problems in one error, each with a suggestion.
5. **Search** for `entityLoadByPK(` calls that expect an array.
6. **Run your tests** (lesson 14), then fix what fails.
7. **Wrap writes** in `transaction {}`, one feature at a time, then turn `flushAtRequestEnd` back off.
8. **Enjoy the extras**: static helpers, criteria queries, readable errors and the boot cache.

Already on BxORM 1.x? The upgrade to 2.0 has its own short guide, linked below. Your function calls keep working.

## Try it

- Take one entity from an existing CFML app and convert it to the annotation form.
- Boot an existing app on BxORM against a copy of its database and read the startup report.
- Find every `entityLoadByPK()` in a codebase and check how its result is used.

## Learn more

- [Migration guide](https://bxorm.ortusbooks.com/bxorm-2.x/getting-started/migration-from-cfml)
- [Upgrading to BxORM 2.0](https://bxorm.ortusbooks.com/bxorm-2.x/release-history/upgrading-to-2.0.0)
- [What's new in 2.0](https://bxorm.ortusbooks.com/bxorm-2.x/release-history/whats-new-2.0.0)

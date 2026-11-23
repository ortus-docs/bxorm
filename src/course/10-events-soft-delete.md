---
title: Events, soft delete and timestamps
summary: React to inserts, updates and deletes, keep deleted posts in the table, and let BxORM stamp dates for you.
icon: phosphor-duotone:bell-ringing
tags: [course]
---

Real apps need rules around their data: stamp the edit time, never delete a published post, send an email once a post is really saved. BxORM gives you three tools for this: automatic timestamps, entity events and soft delete.

## Automatic timestamps

You have used these since lesson 3. `@autoTimestamp` fills a date property when the entity is written:

```boxlang title="models/Post.bx"
@ormtype( "timestamp" )
@autoTimestamp( "create" )
property createdDate;

@ormtype( "timestamp" )
@autoTimestamp( "update" )
property updatedDate;
```

| Value    | When the property is set                         |
| -------- | ------------------------------------------------ |
| `create` | Once, when the entity is inserted                |
| `update` | When the entity is inserted, and on every update |

No event handler is needed. Bulk statements such as `updateAll()` skip entities, so they don't set these.

## Entity events

With `eventHandling : true` in your ORM settings (lesson 2), BxORM calls methods on the entity at each step of its life:

| Method                    | When                             |
| ------------------------- | -------------------------------- |
| `postNew`                 | `entityNew()` created the entity |
| `preLoad`, `postLoad`     | Around a load from the database  |
| `preInsert`, `postInsert` | Around an insert                 |
| `preUpdate`, `postUpdate` | Around an update                 |
| `preDelete`, `postDelete` | Around a delete                  |
| `postCommit`              | After the write is committed     |

Changes you make in `preInsert` and `preUpdate` are saved with the row:

```boxlang title="models/Post.bx"
function preInsert( entity ) {
    setTitle( trim( getTitle() ) );
}
```

Without `eventHandling : true`, no event fires at all.

## Vetoing a delete

Return `false` from `preInsert`, `preUpdate` or `preDelete` to cancel the operation. Published posts are never deleted:

```boxlang title="models/Post.bx"
function preDelete( entity ) {
    return !getPublished();
}
```

Only an explicit `false` vetoes, so a handler that returns nothing lets the operation continue. One limit: an entity whose id comes from the database (like our `native` ids on MySQL) cannot veto its own insert, because Hibernate needs the `INSERT` to get the id.

## After the commit

`postCommit` fires once the write is really committed, and never for a rollback. It is the place for side effects such as emails or cache clearing:

```boxlang title="models/Post.bx"
function postCommit( entity, action ) {
    if ( action == "insert" ) {
        println( "New post saved: #getTitle()#" );
    }
}
```

`action` is `insert`, `update` or `delete`.

## A global event handler

To react to every entity in one place, point the `eventHandler` setting at a class:

```boxlang title="Application.bx"
this.ormSettings = {
    entityPaths   : [ "/blog/models" ],
    eventHandling : true,
    eventHandler  : "blog.models.OrmEvents"
};
```

The class defines the same method names. They receive the entity first, so one handler can serve every entity.

## Soft delete

Deleting a post loses it for good. With `@softDelete` on the class, `entityDelete()` marks the row deleted instead, and every load skips it:

```boxlang title="models/Post.bx"
@persistent
@table( "posts" )
@softDelete
class {
    // ...
}
```

```boxlang title="app.bxs"
transaction {
    entityDelete( entityLoadByPKOrFail( "Post", 3 ) ); // an UPDATE, not a DELETE
}
println( isNull( entityLoadByPK( "Post", 3 ) ) ); // true
```

BxORM adds the column for you (don't declare a property for it). Pick the style:

| Value                        | Column                | Meaning                        |
| ---------------------------- | --------------------- | ------------------------------ |
| `@softDelete`                | `deleted` (boolean)   | `true` once deleted            |
| `@softDelete( "active" )`    | `active` (boolean)    | `false` once deleted           |
| `@softDelete( "timestamp" )` | `deleted` (timestamp) | The deletion time once deleted |

Deleted rows are still in the table, so an admin screen can list or restore them with plain SQL (`queryExecute()`).

## Try it

- Add `@softDelete` to `Post`, delete a post and look at the `posts` table.
- Add the `preDelete` veto, publish a post and try to delete it.
- Write a `postCommit` that prints the action, then save and roll back a post. Which events print?
- Move the `preInsert` title trimming into a global event handler.

## Learn more

- [Events](https://bxorm.ortusbooks.com/bxorm-2.x/working-with-entities/events)
- [Soft delete](https://bxorm.ortusbooks.com/bxorm-2.x/modeling/entities#soft-delete)
- [Automatic timestamps](https://bxorm.ortusbooks.com/bxorm-2.x/modeling/properties#automatic-timestamps)

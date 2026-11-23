---
title: BxORM with cborm
summary: Use BxORM inside a ColdBox app with cborm 6: entity services, virtual services, active entities and the same criteria builder.
icon: phosphor-duotone:puzzle-piece
tags: [course]
---

Building the blog with [ColdBox](https://coldbox.org)? **cborm** is the ColdBox module for the ORM. Version 6 is built on BxORM: it adds service layers, injection and active entities, and its criteria builder **is** BxORM's `entityCriteria()`, with the same method names. Everything you learned so far still applies.

## Install

cborm 6 needs BoxLang 1.18 or later, ColdBox 8 or later, and BxORM 2:

```bash
box install cborm
```

While cborm 6 is in pre-release, ask for a version, for example `box install cborm@6.0.0-beta.3`.

Point the ORM at cborm's event handler, so ColdBox interception points such as `ORMPostLoad` fire:

```boxlang title="Application.bx"
this.ormSettings = {
    entityPaths   : [ "models" ],
    dbcreate      : "update",
    eventHandling : true,
    eventHandler  : "cborm.models.EventHandler"
};
```

The ORM starts before ColdBox, so add a mapping for cborm in `Application.bx` as well:

```boxlang title="Application.bx"
this.mappings[ "/cborm" ] = COLDBOX_APP_ROOT_PATH & "modules/cborm";
```

## Virtual entity services

Inject a service for any entity, with no code, using the `entityService` WireBox DSL:

```boxlang title="handlers/Posts.bx"
class {

    property name="postService" inject="entityService:Post";

    function index( event, rc, prc ) {
        prc.posts = postService.list(
            criteria  : { published : true },
            sortOrder : "createdDate desc",
            offset    : ( rc.page ?: 0 ) * 10,
            max       : 10
        );
    }

    function show( event, rc, prc ) {
        prc.post = postService.getOrFail( rc.id );
    }
}
```

The service has the methods you would expect: `get()`, `getOrFail()`, `getAll()`, `list()`, `count()`, `exists()`, `findWhere()`, `findAllWhere()`, `firstOrCreate()`, `new()`, `save()`, `delete()`, `deleteWhere()` and more.

## Your own service

When a service needs methods of its own, extend `VirtualEntityService` and keep every built-in method:

```boxlang title="models/PostService.bx"
class extends="cborm.models.VirtualEntityService" singleton {

    function init() {
        super.init( entityName : "Post" );
        return this;
    }

    function search( string q = "", numeric page = 1 ) {
        return newCriteria()
            .isTrue( "published" )
            .when( len( q ), ( c ) => c.ilike( "title", "%#q#%" ) )
            .orderByDesc( "createdDate" )
            .paginate( page = page, maxRows = 10 );
    }
}
```

`newCriteria()` returns a BxORM criteria query bound to the service's entity, so `search()` is the same code as lesson 7.

## Active entities

Prefer the methods on the entity itself? Extend `ActiveEntity`:

```boxlang title="models/Post.bx"
@persistent
@table( "posts" )
class extends="cborm.models.ActiveEntity" {
    // ... the same properties as before
}
```

```boxlang title="handlers/Posts.bx"
post = new models.Post();
recent = post.findAllWhere( { published : true }, "createdDate desc" );

draft = post.new( { title : "Hello cborm" } );
draft.save();
```

`save()` and `delete()` act on the entity, and with the ColdBox validation module installed you also get `isValid()` and `getValidationResults()`.

## Dynamic finders

cborm also reads method names as queries:

```boxlang
post = postService.findByTitle( "Hello BxORM" );
drafts = postService.findAllByPublished( false );
total = postService.countByPublished( true );
```

## Same criteria, everywhere

Because cborm's criteria is BxORM's `entityCriteria()`, cborm-style names work in both places: `isEq`, `like`, `between`, `isIn`, `joinTo`, `withProjections`, `c.restrictions`, `list`, `count`, `get` and `getOrFail`. You can move a query between a cborm service and plain BxORM code without changing it.

## Try it

- Inject `entityService:Post` in a handler and render the newest ten published posts.
- Move `searchPosts()` from lesson 7 into a `PostService` and call it from a handler.
- Turn `Tag` into an `ActiveEntity` and create a tag with `new models.Tag().new( { name : "cborm" } ).save()`.

## Learn more

- [cborm documentation](https://coldbox-orm.ortusbooks.com/)
- [cborm on GitHub](https://github.com/coldbox-modules/cborm)
- [BxORM criteria queries](https://bxorm.ortusbooks.com/bxorm-2.x/working-with-entities/criteria)

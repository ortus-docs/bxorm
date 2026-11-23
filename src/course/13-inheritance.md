---
title: Inheritance
summary: Share columns with a mapped superclass, and model "kinds of" entities with single-table or joined inheritance.
icon: phosphor-duotone:stack
tags: [course]
---

Look at the blog's three entities: each one declares an `id`, and `Post` has `createdDate` and `updatedDate`. As an app grows, you want those shared pieces in one place. And sometimes one entity really is several kinds of thing: a media item that is either an image or a video. Inheritance handles both.

## A base entity with a mapped superclass

A **mapped superclass** is a parent class that is not an entity itself. Its properties are copied into every entity that extends it:

```boxlang title="models/BaseEntity.bx"
@mappedSuperClass
class {

    @fieldtype( "id" )
    @generator( "native" )
    property id;

    @ormtype( "timestamp" )
    @autoTimestamp( "create" )
    property createdDate;

    @ormtype( "timestamp" )
    @autoTimestamp( "update" )
    property updatedDate;
}
```

```boxlang title="models/Tag.bx"
@persistent
@table( "tags" )
class extends="BaseEntity" {

    @ormtype( "string" )
    @unique
    property name;
}
```

The `tags` table now has `id`, `createdDate`, `updatedDate` and `name`. There is no `BaseEntity` table: with a mapped superclass, every column lives in each entity's own table. Do the same for `User` and `Post` and you delete a dozen lines.

## One entity, several kinds

Say the blog gets media: images with alt text, and videos with a length. They share a URL, and you want to list all media together. Make `Media` the parent entity and `Image` and `Video` its subclasses. There are two ways to store them.

## Single table

All kinds share one table. A **discriminator column** records which kind each row is:

```boxlang title="models/Media.bx"
@persistent
@table( "media" )
@discriminatorColumn( "mediaType" )
class {

    @fieldtype( "id" )
    @generator( "native" )
    property id;

    @ormtype( "string" )
    property url;
}
```

```boxlang title="models/Image.bx"
@persistent
@table( "media" )
@discriminatorValue( "image" )
class extends="Media" {

    @ormtype( "string" )
    property altText;
}
```

```boxlang title="models/Video.bx"
@persistent
@table( "media" )
@discriminatorValue( "video" )
class extends="Media" {

    @ormtype( "integer" )
    property seconds;
}
```

Each subclass names the parent's table, so its columns are added to `media`:

```text
id  mediaType  url     altText  seconds
1   image      a.png   A        NULL
2   video      b.mp4   NULL     42
```

Single table is fast (no joins), but subclass columns must allow `NULL`.

## Joined tables

Each kind gets its own table for its own columns, joined to the parent's row by id:

```boxlang title="models/Image.bx"
@persistent
@table( "images" )
@joinColumn( "mediaID" )
class extends="Media" {

    @ormtype( "string" )
    property altText;
}
```

Leave `@discriminatorColumn` off `Media` for this style. `media` holds `id` and `url`, and `images` holds `mediaID` and `altText`. Joined tables keep columns tidy and `NOT NULL`-friendly, at the cost of a join.

## Querying a hierarchy

Load the parent and you get the right subclass for each row:

```boxlang title="app.bxs"
transaction {
    entitySave( entityNew( "Image", { url : "a.png", altText : "A" } ) );
    entitySave( entityNew( "Video", { url : "b.mp4", seconds : 42 } ) );
}

for ( m in entityLoad( "Media" ) ) {
    println( entityGetName( m ) & ": " & m.getUrl() ); // Image: a.png, then Video: b.mp4
}

println( entityCriteria( "Media" ).isEq( "url", "b.mp4" ).count() ); // 1
```

## Which one?

| You want                                       | Use               |
| ---------------------------------------------- | ----------------- |
| Shared columns, no shared queries              | Mapped superclass |
| Several kinds, few extra columns, fast queries | Single table      |
| Several kinds, many extra columns              | Joined tables     |

If you use `@softDelete` in a hierarchy, put it on the root entity only. Subclasses inherit it.

## Try it

- Move `id` and the timestamps of `User`, `Post` and `Tag` into `BaseEntity`.
- Build `Media`, `Image` and `Video` with a single table, then switch to joined tables and compare the schema.
- Add a `media` relationship to `Post` (one-to-many to `Media`) and attach an image and a video to a post.

## Learn more

- [Entities: mapped superclass](https://bxorm.ortusbooks.com/bxorm-2.x/modeling/entities)
- [Identifiers](https://bxorm.ortusbooks.com/bxorm-2.x/modeling/identifiers)

---
title: Relationships
summary: Connect users, posts and tags with many-to-one, one-to-many and many-to-many relationships.
icon: phosphor-duotone:tree-structure
tags: [course]
---

A blog is more than users. A user writes posts, and a post has tags. In this lesson you add the `Post` and `Tag` entities and connect all three.

## The Post and Tag entities

```boxlang title="models/Tag.bx"
@persistent
@table( "tags" )
class {

    @fieldtype( "id" )
    @generator( "native" )
    property id;

    @ormtype( "string" )
    @unique
    property name;
}
```

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

    @ormtype( "text" )
    property body;

    @ormtype( "boolean" )
    @default( false )
    property published;

    // Many posts, one author
    @fieldtype( "many-to-one" )
    @cfc( "User" )
    @fkcolumn( "userID" )
    @lazy
    property author;

    // Many posts, many tags, stored in the posts_tags link table
    @fieldtype( "many-to-many" )
    @cfc( "Tag" )
    @linktable( "posts_tags" )
    @fkcolumn( "postID" )
    @inversejoincolumn( "tagID" )
    property tags;

    @ormtype( "timestamp" )
    @autoTimestamp( "create" )
    property createdDate;

    @ormtype( "timestamp" )
    @autoTimestamp( "update" )
    property updatedDate;
}
```

And the other side of the author relationship, on `User`:

```boxlang title="models/User.bx"
// One user, many posts
@fieldtype( "one-to-many" )
@cfc( "Post" )
@fkcolumn( "userID" )
@inverse
@lazy
@cascade( "all-delete-orphan" )
property posts;
```

## The three kinds

| Kind           | Example       | Where the link lives                       |
| -------------- | ------------- | ------------------------------------------ |
| `many-to-one`  | `Post.author` | A `userID` column on `posts`               |
| `one-to-many`  | `User.posts`  | The same `userID` column, seen from `User` |
| `many-to-many` | `Post.tags`   | The `posts_tags` link table                |

`@cfc( "Post" )` names the related entity, and `@fkcolumn` names the foreign key column.

## Who owns the link?

`Post.author` and `User.posts` describe the **same** foreign key from both sides. Only one side should write it, or Hibernate updates the column twice. `@inverse` on `User.posts` says "the other side owns this". For a one-to-many and many-to-one pair, mark the collection side inverse.

## Generated methods

For each relationship, BxORM generates helpers on the entity:

| Method                | What it does                               | On                        |
| --------------------- | ------------------------------------------ | ------------------------- |
| `hasPosts()`          | `true` when the relationship has any items | All relationships         |
| `addPosts( post )`    | Adds an entity to the collection           | one-to-many, many-to-many |
| `removePosts( post )` | Removes an entity from the collection      | one-to-many, many-to-many |

The name follows the property, so `Post.tags` gets `hasTags()`, `addTags()` and `removeTags()`.

Prefer singular names for one item? Add `@singularName( "tag" )` to the property: the methods become `hasTag()`, `addTag()` and `removeTag()` (the plural ones are not generated then).

## Saving related entities

Set both sides of a bidirectional relationship, so the objects in memory match the database:

```boxlang title="app.bxs"
import blog.models.User;
import blog.models.Tag;

transaction {
    ann    = User::findWhereOrFail( { email : "ann@example.com" } );
    ormTag = Tag::firstOrCreate( { name : "orm" } );

    post = entityNew( "Post", { title : "Relationships", author : ann } );
    post.addTags( ormTag );
    ann.addPosts( post );

    // The cascade on User.posts saves the new post too
    entitySave( ann );
}
```

`@cascade( "all-delete-orphan" )` passes saves and deletes from a user to their posts, and deletes a post that is removed from `ann.posts`:

```boxlang
transaction {
    ann.removePosts( post ); // the post is deleted when the transaction ends
}
```

That also means a post still inside a loaded user's `posts` collection cannot simply be deleted with `entityDelete()`: the cascade saves it again. Remove it from the collection instead.

## Lazy loading

`@lazy` means "load this when I first use it". Loading a user does not load their posts. Calling `ann.getPosts()` runs one more query, the first time:

```boxlang
ann = User::get( 1 );          // select from users
println( ann.getPosts().len() ); // now: select from posts where userID = 1
```

Lazy is the right default for collections. Watch out for loops that touch a lazy relationship once per row: that is the N+1 problem, and lesson 11 shows how to spot and fix it.

## Try it

- Create two posts for Ann, each with two tags, then print each post's title and tag names.
- Load a post and print its author's name. Watch the SQL: when does the user query run?
- Remove one post from `ann.posts` in a transaction and check the `posts` table.
- Add a `posts` relationship to `Tag` (many-to-many, inverse) so a tag can list its posts.

## Learn more

- [Relationships](https://bxorm.ortusbooks.com/bxorm-2.x/modeling/relationships)
- [Properties: relationship modifiers](https://bxorm.ortusbooks.com/bxorm-2.x/modeling/properties)

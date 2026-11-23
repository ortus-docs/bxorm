---
title: Your first entity
summary: Turn a BoxLang class into a table with @persistent, then give it an id and typed properties.
icon: phosphor-duotone:cube
tags: [course]
---

An **entity** is a BoxLang class that BxORM maps to a table. Each instance is a row, and each persistent property is a column. In this lesson you write the blog's `User` entity.

## The User entity

Create `models/User.bx`:

```boxlang title="models/User.bx"
@persistent
@table( "users" )
class {

    @fieldtype( "id" )
    @generator( "native" )
    property id;

    @ormtype( "string" )
    @unique
    @notNull
    property email;

    @ormtype( "string" )
    property name;

    @ormtype( "timestamp" )
    @autoTimestamp( "create" )
    property createdDate;
}
```

Run `boxlang app.bxs` from the previous lesson. With `dbcreate : "update"`, BxORM creates the `users` table, and `entityNameList()` now prints `User`.

## Reading the annotations

Every annotation sits on its own line, right above the class or property it configures.

| Annotation                   | What it does                                                    |
| ---------------------------- | --------------------------------------------------------------- |
| `@persistent`                | Makes the class an entity                                       |
| `@table( "users" )`          | The table name. Without it, the table is named after the entity |
| `@fieldtype( "id" )`         | Marks the primary key                                           |
| `@generator( "native" )`     | Lets the database generate the id (auto increment on MySQL)     |
| `@ormtype( "string" )`       | The column's data type                                          |
| `@unique`, `@notNull`        | Database constraints on the column                              |
| `@autoTimestamp( "create" )` | Sets the value when the row is inserted                         |

## Switches without a value

`@persistent`, `@unique` and `@notNull` are **switches**. A switch written without a value is on, so `@unique` is the same as `@unique( true )`. Write `( false )` to turn one off:

```boxlang
@persistent( false )
property scratchValue;
```

A property with `@persistent( false )` stays a normal class property but never becomes a column.

The class switches are `persistent`, `readOnly`, `dynamicInsert`, `dynamicUpdate`, `mappedSuperClass` and `softDelete`. The property switches are `persistent`, `unique`, `notNull`, `insert`, `update`, `optimisticLock`, `inverse`, `constrained`, `missingRowIgnored` and `lazy`.

Switches without a value need a bx-orm build later than `2.0.0-beta.8`. On `2.0.0-beta.8` and earlier, write `@persistent( true )`.

## Ids and generators

The `generator` decides where a new id comes from:

| Generator   | The id comes from                                   |
| ----------- | --------------------------------------------------- |
| `native`    | The database's own mechanism (identity or sequence) |
| `increment` | BxORM, by counting up from the highest id           |
| `uuid`      | A generated UUID string                             |
| `assigned`  | You: set the id yourself before saving              |

The docs recommend `@update( false )` on id properties, so an id never changes after insert.

## No casting

The database wants exact types. BoxLang is dynamic. BxORM converts between the two based on each property's `ormtype`, so you never cast:

```boxlang title="app.bxs"
// The Post entity you build in lesson 6 has a boolean "published" column
post = entityNew( "Post", { title : "Hello" } );
post.setPublished( "yes" );   // saved as true
```

Dates work the same way: a date string or a BoxLang date set on a `timestamp` property is saved as a timestamp, and it comes back as a BoxLang date.

The common `ormtype` values are `string`, `text`, `integer`, `long`, `big_decimal`, `boolean`, `timestamp`, `date` and `time`.

## Generated methods

You did not write `getEmail()` or `setEmail()`. BxORM generates a getter and a setter for every property at startup. Write your own methods next to them whenever you need one:

```boxlang title="models/User.bx"
function getDisplayName() {
    return len( getName() ) ? getName() : getEmail();
}
```

## Try it

- Add a `bio` property with `@ormtype( "text" )`, run the script, and look at the new column in your database.
- Add a property with `@persistent( false )` and check that no column appears.
- Change the generator to `uuid` on a copy of the entity. What column type does the id get?

## Learn more

- [Entities](https://bxorm.ortusbooks.com/bxorm-2.x/modeling/entities)
- [Properties](https://bxorm.ortusbooks.com/bxorm-2.x/modeling/properties)
- [Identifiers](https://bxorm.ortusbooks.com/bxorm-2.x/modeling/identifiers)
- [Type conversion](https://bxorm.ortusbooks.com/bxorm-2.x/modeling/type-conversion)

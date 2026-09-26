---
description: Turn entities into structs for JSON APIs and views, with or without loading them
---

# Entities as Structs

JSON APIs and views usually need plain structs, not entities. bx-orm builds them three ways, with the same rules and the same output:

| Use | When |
| --- | --- |
| [entityToStruct( entityOrArray, [options] )](../reference/built-in-functions/orm/EntityToStruct.md) | You already have the entities |
| [entityLoadAsStruct( entityName, idOrFilter, [includes], [options] )](../reference/built-in-functions/orm/EntityLoadAsStruct.md) | Load by id or filter straight into structs, without loading entities |
| [`asStruct( includes, [options] )`](criteria.md#structs-with-includes) on `entityCriteria()` | Any criteria query, straight into structs |

```js
user  = entityToStruct( entityLoadByPK( "User", 42 ), { includes : "role.name" } );
user  = entityLoadAsStruct( "User", 42, "role.name" );
users = entityCriteria( "User" ).isEq( "active", true ).asStruct( "role.name" ).list();
```

The rules follow [mementifier](https://forgebox.io/view/mementifier), so an entity's existing `this.memento` works as is.

## What goes in the struct

`entityToStruct()` reads each value through the entity's getter when it has one, else from the entity's variables scope. BoxLang gives every persistent property an implicit getter, so a getter you write yourself (for example `getEmail()` returning `lcase( variables.email )`) replaces it and shapes the output.

By default a struct holds the entity's id and its plain properties (columns, version and timestamp properties), not its associations. The options change that:

| Option | Meaning |
| --- | --- |
| `includes` | What to add, as a list or an array: property names, getter names (without `get`), or dotted association paths such as `role.name`. `"lastLoginTime:lastLogin"` writes the value under another key. `"*"` stands for every plain property |
| `excludes` | What to leave out, also with dotted paths: `"passwordHash,orders.notes"` |
| `mappers` | A struct of key to `( value, memento ) => newValue`. See [Mappers](#mappers) |
| `defaults` | A struct of key to the value to use when the value is null |
| `ignoreDefaults` | Ignore the entity's `this.memento` default includes and excludes |
| `profile` | Use one of the entity's `this.memento.profiles` |

`entityLoadAsStruct()` takes `includes` as its own argument and the rest in its options.

Other rules:

* A null value becomes the matching `defaults` entry, otherwise an empty string. A null collection becomes an empty array.
* Dates are ISO 8601 strings, so every struct serializes the same way: date-times as `yyyy-MM-ddTHH:mm:ss` plus the offset (`2024-03-05T10:20:30Z`), dates as `yyyy-MM-dd` and times as `HH:mm:ss`.
* An include that is neither a property, a getter nor a mapper key is an `orm.property.unknown` error that suggests the right name. (mementifier skips it silently.)

## Associations

An association is written as a struct (to-one) or an array of structs (to-many):

```js
entityToStruct( author, { includes : "posts" } );
// { id : 901, firstName : "Ann", ..., posts : [ { id : 901, title : "First" }, { id : 902, title : "Second" } ] }

entityToStruct( post, { includes : "author.firstName" } );
// { id : 902, title : "Second", author : { firstName : "Ann" } }
```

* An association included on its own (`"posts"`) uses the associated entity's own defaults (its `this.memento`, or its id and plain properties).
* With paths below it (`"author.firstName"`), only those fields are written.
* Paths can go deeper: `"orders.items.product.name"`.
* Excludes work the same way: `"posts.title"` leaves the title out of each post.
* An entity that is already being written higher up the same branch is written as its id, so cycles end: `entityToStruct( author, { includes : "posts.author" } )` writes each post's `author` as `901`.

## Mappers

A mapper is called with the value and the struct being built, and returns the new value. Mappers run last, once every key is filled, on the keys the struct holds:

```js
entityToStruct( user, {
    mappers : {
        email : ( value ) => lcase( value ),
        name  : ( value, memento ) => memento.firstName & " " & memento.lastName
    },
    includes : "name"
} );
```

An include that is neither a property nor a getter, but has a mapper, is a computed key: the mapper builds it (above, `name`).

The caller's `mappers` and `defaults` apply to the top-level entity. Associated entities use their own `this.memento`.

## `this.memento`

An entity describes its default struct with mementifier's `this.memento`:

```js
class persistent="true" table="authors" {
    property name="id" fieldtype="id" generator="increment";
    property name="firstName";
    property name="lastName";
    property name="nickName";
    property name="passwordHash";
    property name="joined" ormType="timestamp";
    property name="posts" fieldtype="one-to-many" cfc="Post" fkcolumn="author_id" inverse="true";

    this.memento = {
        defaultIncludes : [ "id", "firstName", "lastName", "nickName", "fullName", "joined", "initials" ],
        defaultExcludes : [],
        neverInclude    : [ "passwordHash" ],
        defaults        : { nickName : "none" },
        mappers         : {
            lastName : ( value, memento ) => ucase( value ),
            initials : ( value, memento ) => left( memento.firstName, 1 ) & left( memento.lastName, 1 )
        },
        profiles        : {
            export : { defaultIncludes : [ "id", "lastName" ], mappers : {} }
        }
    };

    function getFullName() {
        return getFirstName() & " " & getLastName();
    }
}
```

```js
entityToStruct( author );
// { id : 901, firstName : "Ann", lastName : "BAKER", nickName : "none", fullName : "Ann Baker",
//   joined : "2024-03-05T10:20:30Z", initials : "AB" }
```

| Key | Meaning |
| --- | --- |
| `defaultIncludes` | What the struct holds by default. Without it: the id and plain properties, and the caller's `includes` add to them |
| `defaultExcludes` | What is left out by default |
| `neverInclude` | What is never written, even when the caller includes it |
| `defaults` | Values for nulls |
| `mappers` | Mappers, as above. The caller's mappers replace one for the same key |
| `profiles` | Named variations, see below |

The caller's `includes` and `excludes` add to the defaults. `ignoreDefaults : true` drops `defaultIncludes` and `defaultExcludes` (`neverInclude` still applies).

### Profiles

A profile is a named set of `this.memento` keys. With `{ profile : "export" }`, the keys the profile defines replace the base ones, and the other base keys stay. The profile applies down the whole graph, to every associated entity that defines it:

```js
entityToStruct( author, { profile : "export" } );
// { id : 901, lastName : "Baker" }   (the profile's mappers are empty, so lastName is not upper-cased)
```

## Without loading entities

`entityLoadAsStruct()` and criteria `asStruct( includes )` read the structs with projection queries, so no entity is loaded into the session:

* One query reads the plain values of the root entity and of every to-one association in the includes (left joins, so a missing association is written as its default, an empty string).
* Each to-many association is one more query, limited to the ids just read, and its rows are grouped back into their parents. Collections come back in id order.

The output matches `entityToStruct()` for the same includes, except where a getter shapes a value: without an entity there is no getter to call, so a property whose getter you overrode comes back as its column value. Use `entityToStruct()`, or a mapper, when a getter transforms the value. What cannot be read without an entity:

* **Getters**: a getter listed in the entity's `this.memento` defaults is left out; a getter you include yourself is an `orm.argument` error. Compute the key with a mapper instead, or use `entityToStruct()`.
* **Value collections** (`fieldtype="collection"`) and **entities with a composite id** are `orm.argument` errors.

```js
// by id: a struct, or null
user = entityLoadAsStruct( "User", 42, "role.name,orders" );

// by filter: an array of structs
users = entityLoadAsStruct( "User", { active : true }, "", { sortOrder : "lastName", maxResults : 20, offset : 40 } );

// by filter, one struct (several matches: orm.query.nonUnique)
user = entityLoadAsStruct( "User", { email : "ann@example.com" }, "", { unique : true } );

// any criteria query: list(), get(), first() or paginate()
page = entityCriteria( "User" )
    .isEq( "active", true )
    .order( "lastName" )
    .asStruct( "role.name", { profile : "list" } )
    .paginate( page = 2, maxRows = 25 );
```

`asStruct()` without arguments is different: it returns the plain columns of each row (or the projections), with ISO 8601 dates, and does not use `this.memento`.

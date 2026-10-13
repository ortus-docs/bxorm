---
description: >-
  All about entity identifiers, from primary keys, and generators to composite
  keys and field types.
icon: key
---

# Identifiers

Identifier properties are denoted via `fieldtype="id"`.

We highly recommend disabling updates on identifier properties via `update="false"`:

```js
property name      = "id"
         fieldtype = "id"
         ormtype   = "string"
         generator = "assigned"
         update    = "false";
```

## Common Generator Types

### Assigned Generator

The Assigned generator is the default identifier generator type, and simply allows the application (your boxlang code) to assign identifier values prior to insertion. You can think of this as `generator=none`.

The application must set the id before the entity is saved.

```js
property name      = "id"
         fieldtype = "id"
         generator = "assigned"
         update    = "false";
```

Assigned generators will commonly use [a `preInsert()` event listener](../usage/events.md#entity-event-handler) to assign the identifer value:

```js
function preInsert( entity ){
    setId( createUUID() );
}
```

### Select Generator

A select generator will attempt to select the next identifier value from the specified `selectKey` column:

Use it when a database trigger assigns the primary key. After the insert, Hibernate selects the row by a unique key and reads its primary key.

```js
property name      = "userID"
         fieldtype = "id"
         generator = "select"
         selectKey = "ssn"
         update    = "false";
```

### UUID Generator

The UUID generator uses Hibernate's uuid generator under the hood. The id is a string of 32 hexadecimal characters, so use a string id column. `uuid2` and `guid` work the same way in bx-orm 2.0.

```js
property name      = "userID"
         fieldtype = "id"
         generator = "uuid"
         update    = "false";
```

### Increment Generator

The Increment generator uses a simple incrementing value to create identifiers. Do not use in concurrent applications, as the values may no longer be unique.

The ids are numbers. They are unique only when no other process inserts rows into the same table, so do not use it in a cluster.

```js
property name      = "userID"
         fieldtype = "id"
         generator = "increment"
         update    = "false";
```

#### Other Valid Generator Types

There are several lesser-known identifier generator types, including:

* `foreign` - use a specific property from a foreign entity
* `sequence` - use a database sequence (name it with the `sequence` attribute); replaces the legacy `seqhilo` generator name
* `sequence-identity` - use a database sequence, then retrieve the generated value via `INSERT ... RETURNING` (supported databases only)
* `identity` - use an identity column from the database (auto-increment)
* `native` - the database's own strategy: an identity column on MySQL, MariaDB, SQL Server and Derby, and a sequence on PostgreSQL and Oracle. The sequence is the shared `hibernate_sequence` with an increment of 1, as in bx-orm 1.x, or the one named by the `sequence` attribute
* `select` - select the next value from the column denoted in `selectKey`
* `uuid`, `uuid2` and `guid` - a UUID as a 32-character hexadecimal string

The full list of built-in generator names is: `assigned`, `foreign`, `guid`, `identity`, `increment`, `native`, `select`, `sequence`, `sequence-identity`, `uuid`, `uuid2`. Any other value is used as the fully-qualified Java class name of a custom generator. If no class with that name is on the classpath, the ORM does not start and raises an `orm.config` error.

{% hint style="warning" %}
The legacy CFML/Lucee generator name `seqhilo` is **not** a recognized built-in generator in bx-orm. Use `generator="sequence"` with a `sequence` attribute naming your database sequence instead.
{% endhint %}

{% hint style="info" %}
See the [Hibernate 7.4 User Guide](https://docs.hibernate.org/orm/7.4/userguide/html_single/Hibernate_User_Guide.html#identifiers-generators) for more information on identifier generators.
{% endhint %}

## Unsaved Value

Hibernate decides whether `entitySave()` inserts or updates an entity by looking at its id. If the id equals the property's **unsaved value**, the entity is new and gets inserted; any other id means it already exists and gets updated.

bx-orm sets this for you, to the value a new entity's id starts with:

* An id with a `default` uses that default, including an empty one: `default=""` on a uuid id means an id of `""` is new.
* Any other id, generated or `assigned`, uses `null`: an entity with no id yet is new.
* A `version` property uses `null`, or `undefined` when it has a `default` (then the id decides).

Because bx-orm always declares the unsaved value, the ORM never creates an entity while it starts. Your entity's `init()` only runs when your code creates the entity, so an `init()` that needs the application (for example one that reads `application.wirebox`) is safe.

Set `unsavedValue` yourself when an id is never null before its first save. For example, an assigned numeric id that starts at `0`:

```js
property name         = "id"
         fieldtype    = "id"
         ormtype      = "integer"
         generator    = "assigned"
         unsavedValue = "0";
```

Besides a literal id value, Hibernate accepts `null`, `any` (always insert), `none` (always update) and `undefined` (check the database).

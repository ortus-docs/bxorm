---
description: >-
  All about entity identifiers, from primary keys, and generators to composite
  keys and field types.
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

> lets the application assign an identifier to the object before save() is called. This is the default strategy if no element is specified. - [_Hibernate 3.3 mapping reference docs_](https://docs.jboss.org/hibernate/core/3.3/reference/en/html/mapping.html#mapping-declaration-id-generator)

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

> retrieves a primary key, assigned by a database trigger, by selecting the row by some unique key and retrieving the primary key value. - [_Hibernate 3.3 mapping reference docs_](https://docs.jboss.org/hibernate/core/3.3/reference/en/html/mapping.html#mapping-declaration-id-generator)

```js
property name      = "userID"
         fieldtype = "id"
         generator = "select"
         selectKey = "ssn"
         update    = "false";
```

### UUID Generator

The UUID generator uses Hibernate's uuid generator under the hood:

> uses a 128-bit UUID algorithm to generate identifiers of type string that are unique within a network (the IP address is used). The UUID is encoded as a string of 32 hexadecimal digits in length. - [_Hibernate 3.3 mapping reference docs_](https://docs.jboss.org/hibernate/core/3.3/reference/en/html/mapping.html#mapping-declaration-id-generator)

```js
property name      = "userID"
         fieldtype = "id"
         generator = "uuid"
         update    = "false";
```

### Increment Generator

The Increment generator uses a simple incrementing value to create identifiers. Do not use in concurrent applications, as the values may no longer be unique.

> Generates identifiers of type long, short or int that are unique only when no other process is inserting data into the same table. Do not use in a cluster. - [_Hibernate 3.3 mapping reference docs_](https://docs.jboss.org/hibernate/core/3.3/reference/en/html/mapping.html#mapping-declaration-id-generator)

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
* `native` - use identity, sequence, or an optimized algorithm depending on the underlying database capabilities
* `select` - select the next value from the column denoted in `selectKey`
* `uuid` / `uuid2` - use Hibernate's UUID generation
* `guid` - use the database's native GUID generation

The full list of built-in generator names is: `assigned`, `foreign`, `guid`, `identity`, `increment`, `native`, `select`, `sequence`, `sequence-identity`, `uuid`, `uuid2`. Any other value is treated as the fully-qualified Java class name of a custom generator on the classpath; an unrecognized value throws a `BoxRuntimeException` at mapping time.

{% hint style="warning" %}
The legacy CFML/Lucee generator name `seqhilo` is **not** a recognized built-in generator in bx-orm. Use `generator="sequence"` with a `sequence` attribute naming your database sequence instead.
{% endhint %}

{% hint style="info" %}
See the [Hibernate 3.3 Mapping Reference Documentation](https://docs.jboss.org/hibernate/core/3.3/reference/en/html/mapping.html#mapping-declaration-id-generator) for more information on these and other generator types.
{% endhint %}
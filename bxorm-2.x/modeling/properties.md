---
description: "Map entity properties to columns: types, defaults, constraints, automatic timestamps and formulas"
icon: list
---

# Properties

Entity properties are how we map table columns to boxlang object values. You can specify an entity property by setting `persistent="true"` on any `property` inside a persistent boxlang class:

```js
class persistent="true"{
    property name="name" type="string" persistent="true";
}
```

By default, all properties inside a `persistent=true` class are assumed to be persistent as well. Thus, we can skip the `persistent=true` annotation for brevity:

```js
class persistent="true"{
    property name="name" type="string";
}
```

## Common Property Annotations

| Attribute    | Type      | Description                                                                                                                 |
| ------------ | --------- | --------------------------------------------------------------------------------------------------------------------------- |
| `persistent` | `boolean` | Define this property as a persistent property. If `false`, this property will be completely ignored from an orm standpoint. |
| `name`       | `string`  | Property name                                                                                                               |
| `default`    | `string`  | Default value for the property. This only reaches the boxlang engine, and *does not affect creation of the entity table.*   |
| `column`     | `string`  | Table column where the property value is stored.                                                                            |
| `dbDefault`  | `string`  | Set the default value for the property.                                                                                     |

Make sure you quote datetime `dbdefault` values to avoid invalid date errors in MySQL:

```js
property
    name     ="createdOn"
    ormtype  ="datetime"
    dbdefault="'2016-10-10'";
```

## Automatic Timestamps

The `autoTimestamp` annotation fills a date property for you when the entity is written:

```js
class persistent="true" {
    property name="id" fieldtype="id" generator="increment";
    property name="createdDate" ormType="timestamp" autoTimestamp="create";
    property name="updatedDate" ormType="timestamp" autoTimestamp="update";
}
```

| Value                                 | When the property is set                         |
| ------------------------------------- | ------------------------------------------------ |
| `create` (also `created` or `insert`) | Once, when the entity is inserted                |
| `update` (also `updated`)             | When the entity is inserted, and on every update |

The value comes from the JVM clock when the session flushes. These are Hibernate's `@CreationTimestamp` and `@UpdateTimestamp`, so no event handler is needed (and `eventHandling` does not have to be on). Any other value stops the ORM from starting with an `orm.config` error.

{% hint style="warning" %}
Bulk statements such as the criteria [`updateAll()`](../usage/criteria.md#bulk-updates-and-deletes) bypass entities, so they do not set `autoTimestamp` properties.
{% endhint %}


## Property Types

There are several "type" concepts and annotations you may need to use to keep the proper format when persisting or retrieving table data. While these may look similar, they are not equivalent.

| Attribute   | Examples                     | Description                                                                            |
| ----------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| `type`      | `date`,`numeric`             | Boxlang data type                                                                      |
| `fieldtype` | `column`,`id`, `one-to-many` | Denote a special type of field, like an identifier or relationship field.              |
| `ormType`   | `big_decimal`,`timestamp`    | Data type for the database value.                                                      |
| `sqlType`   | `nvarchar`                   | A vendor-specific SQL type used for table creation only. This can normally be ignored. |

## Field Type

The `fieldtype` attribute allows you to define the behavior and purpose of this property:

```js
property
    name="userID"
    fieldtype="id"
    type="string";
```

There are several options for the `fieldtype` value:

* `column` - By far the most common, this is the default behavior of every field.
* `id` - Notes this field as the primary key or part of the a composite key.
* `collection` - Denote a collection of items - this could represent a struct, an array
* `version` - Denote a version field, useful for [optimistic locking](https://en.wikipedia.org/wiki/Optimistic_concurrency_control) on an entity
* `timestamp` - Denote a timestamp field
* `one-to-one` - Denote a [one-to-one relationship](relationships.md#one-to-one)
* `one-to-many` - Denote a [one-to-many relationship](relationships.md#one-to-many)
* `many-to-one` - Denote a [many-to-one relationship](relationships.md#many-to-one)
* `many-to-many` - Denote a [many-to-many relationship](relationships.md#many-to-many)

Any other value, such as the old `primary`, stops the ORM from starting with an `orm.config` error.

## ORM Type

The `ormType` attribute allows you to define the database type of the property. This is important for ensuring that data is properly converted when being persisted or retrieved from the database. The `ormType` values are based on Hibernate types, and are documented in the [Hibernate 7.4 User Guide](https://docs.hibernate.org/orm/7.4/userguide/html_single/Hibernate_User_Guide.html#basic).

While not an exhaustive list, here are some of the more common `ormType` values:

* blob
* bit
* tinyint
* yesno
* truefalse
* bigdecimal
* biginteger
* integer
* numeric
* date
* datetime
* char
* nchar
* text

See [Type Conversion](type-conversion.md) for exactly how each `ormType` value is bridged to a JDBC column type.

## Generator Annotations

| Attribute   | Type               | Description                                                                                                                                                                                                                                           |
| ----------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `generator` | `string`           | One of the built-in generators: `assigned`, `foreign`, `guid`, `identity`, `increment`, `native`, `select`, `sequence`, `sequence-identity`, `uuid`, `uuid2`. Any other value is treated as a fully-qualified Java class name for a custom generator. |
| `params`    | `struct`, `string` | Generator parameters, as a struct or a JSON string: `'{ "table" : "uuid_table", "column" : "uuid_value_column" }'`                                                                                                                                    |
| `sequence`  | `string`           | Specify the database sequence key name to use for value generation. Use with `generator="sequence"`                                                                                                                                                   |
| `selectkey` | `string`           | Only used with `generator=select`. Specify the select key to use when selecting sequence values from the database.                                                                                                                                    |
| `property`  | `string`           | Only used with `generator="foreign"`. The property whose related entity provides the id.                                                                                                                                                              |
| `generated` | `string`           | Only applies on an id property, where it is passed to the generator as a parameter. One of `always`, `insert`, `never`.                                                                                                                               |

```js
property name      = "userID"
         fieldtype = "id"
         generator = "sequence"
         sequence  = "userIDGenerator";
```

{% hint style="warning" %}
The legacy CFML/Lucee generator name `seqhilo` is **not** a recognized built-in generator in bx-orm. Use `generator="sequence"` instead. See [Identifiers](identifiers.md) for the full list of built-in generators.
{% endhint %}

{% hint style="info" %}
See [Identifiers and Generators](identifiers.md#common-generator-types) for more information on generated value properties.
{% endhint %}

## Validation

| Attribute        | Type      | Description                                                                                                                                                                     |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `notnull`        | `boolean` | Specify a not-null constraint.                                                                                                                                                  |
| `insert`         | `boolean` | Allow inserting values to new rows.                                                                                                                                             |
| `update`         | `boolean` | Allow value updates on existing rows.                                                                                                                                           |
| `uniquekey`      | `string`  | A name for a unique constraint. Properties with the same name form one multi-column constraint. Takes a comma-separated list of names. Works on `many-to-one` foreign keys too. |
| `unique`         | `boolean` | Specify a unique constraint. Default `false`.                                                                                                                                   |
| `validateParams` | `string`  | *Not currently supported*                                                                                                                                                       |
| `validate`       | `string`  | *Not currently supported*                                                                                                                                                       |

## Collection Modifiers

These property annotations are used when setting `fieldtype="collection"` and `collectiontype` is either `struct` or `map`.

| Attribute          | Type     | Description                                                                                                           |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `structkeycolumn`  | `string` | Specify the column name to use as the key in the collection struct.                                                   |
| `structkeytype`    | `string` | Specify the ORM type of the key column.                                                                               |
| `structKeyFormula` | `string` | A SQL formula for the struct key, used in place of the `structkeycolumn` column. `structkeycolumn` is still required. |
| `elementcolumn`    | `string` | Specify the column name to use as the value in the collection struct.                                                 |
| `elementtype`      | `string` | Specify the value type of the collection values.                                                                      |

```js
property name            = "yearlyEarnings"
         class           = "Earnings"
         fieldtype       = "collection"
         collectiontype  = "struct"
         structkeycolumn = "year"
         structkeytype   = "integer"
         elementcolumn   = "totalEarnings"
         elementtype     = "bigdecimal";
```

## Relationship Modifiers

| Attribute           | Type                | Description                                                                                                                                                                                                                    |
| ------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `table`             | `string`            | Define the table where the foreign items are stored.                                                                                                                                                                           |
| `lazy`              | `boolean`, `string` | Define a lazy association retrieval type. One of `true`, `false`, `proxy`, `no-proxy` or `extra` (same as `true`).                                                                                                             |
| `inverse`           | `boolean`           | Specify that the association "owner" is referenced and managed on the opposite entity - not this current entity.                                                                                                               |
| `inversejoincolumn` | `string`            | Specify the join column on the associated entity. For `inverse` associations only.                                                                                                                                             |
| `linkschema`        | `string`            | Specify the schema name of the link table                                                                                                                                                                                      |
| `linkcatalog`       | `string`            | Specify the catalog name of the link table                                                                                                                                                                                     |
| `linktable`         | `string`            | Specify the name of the link table                                                                                                                                                                                             |
| `missingRowIgnored` | `boolean`           | Do not throw an error if a foreign key has no match in the foreign entity                                                                                                                                                      |
| `fkcolumn`          | `string`            | Specify the foreign key column in the link table referencing this entity's primary key                                                                                                                                         |
| `orderby`           | `string`            | Specify the order by clause for the association                                                                                                                                                                                |
| `fetch`             | `string`            | Specify the fetch strategy for the association. One of `join`, `select`.                                                                                                                                                       |
| `cascade`           | `string`            | Specify the cascade operation(s) to use upon manipulation of this entity or association. One of `all`,`none`,`save-update`,`delete`,`all-delete-orphan`,`delete-orphan`,`create`,`merge`,`lock`,`refresh`,`evict`,`replicate`. |
| `constrained`       | `boolean`           | Only valid for `one-to-one` relationships. [See the Hibernate 7.4 User Guide](https://docs.hibernate.org/orm/7.4/userguide/html_single/Hibernate_User_Guide.html#associations-one-to-one)                                      |
| `mappedby`          | `string`            | Specify the property on the association that maps to this entity.                                                                                                                                                              |
| `class`             | `string`            | Specify the location of the foreign entity.                                                                                                                                                                                    |
| `cfc`               | `string`            | Alias of `class`.                                                                                                                                                                                                              |
| `where`             | `string`            | Arbitrary SQL where clause for the relation.                                                                                                                                                                                   |
| `singularname`      | `string`            | Singular name to use when generating accessor methods for the relationship: `addPost()`, `removePost()`                                                                                                                        |

```js
property name         = "posts"
         singularName = "post"
         fieldtype    = "one-to-many"
         class        = "Post"
         lazy         = "true"
         fkcolumn     = "author_id";
```

{% hint style="info" %}
See [Modeling Relationships](relationships.md) for more details on modeling an ORM entity relationship.
{% endhint %}

## Other

| Attribute          | Type      | Description                                                                                                                                                                               |
| ------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scale`            | `integer` | Decimal scale                                                                                                                                                                             |
| `precision`        | `integer` | Decimal precision                                                                                                                                                                         |
| `length`           | `integer` | String length                                                                                                                                                                             |
| `formula`          | `string`  | Define this property as a computed property by using a SQL query to determine the property value. Formula properties cannot be modified.                                                  |
| `index`            | `string`  | A name for an index on this property's column. Properties with the same name form one multi-column index. Takes a comma-separated list of names. Works on `many-to-one` foreign keys too. |
| `unSavedValue`     | `string`  | On the id property: the id value that marks a new (unsaved) entity. See [Unsaved Value](identifiers.md#unsaved-value).                                                                    |
| `autoTimestamp`    | `string`  | Set the property to the current time on insert (`create`) or on every insert and update (`update`). See [Automatic Timestamps](#automatic-timestamps).                                    |
| `optimisticLock`   | `boolean` | Set to `false` to leave this property's column out of the version check. Default `true`.                                                                                                  |
| `datatype`         | `string`  | On a `version` property: the version type, such as `integer` or `timestamp`. Same as `ormType`.                                                                                           |

## Formula Property

```js
property name="totalPosts"
    ormType="integer"
    formula="(
        SELECT COUNT(*)
        FROM posts
        WHERE posts.FK_user = id
    )";
```

## Unsupported Attributes

These property annotations are read, but have no effect in bx-orm 2.0:

* `cacheUse`, `cacheName` and `cacheInclude`: only entity-level caching is supported. See [Caching](../usage/caching.md).
* `foreignKey` and `foreignKeyName`: the foreign key constraint name is not applied.
* `readOnly`: a property cannot be made read-only. Use `insert="false"` and `update="false"` instead.

`joinColumn` is not read on a property. Use `fkcolumn` to name the foreign key column.

{% hint style="info" %}
Looking for better support of a specific persistent attribute? [Contact our Support team to consider sponsoring this feature](https://boxlang.io/plans).
{% endhint %}

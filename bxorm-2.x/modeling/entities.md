---
description: Turn BoxLang classes into ORM entities, with tables, row filters, default sorting and soft delete
icon: cube
---

# Entities

A persistent entity is a boxlang class that is marked as a database entity via the `persistent` annotation upon the class definition:

```js
@persistent
class {

}
```

## Annotation Styles

Entities are configured with BoxLang annotations, such as `@persistent` and `@table( "authors" )`. Each annotation goes on its own line before the class or property it configures:

```js
@persistent
@table( "authors" )
class {

    @fieldtype( "id" )
    @generator( "native" )
    property id;

    @unique
    @notNull
    property email;
}
```

A switch annotation written without a value is on: `@persistent` is the same as `@persistent( true )`. Write `( false )` to turn it off, as in `@lazy( false )`. These are the switch annotations:

* On a class: `persistent`, `readOnly`, `dynamicInsert`, `dynamicUpdate`, `mappedSuperClass` and `softDelete`. `softDelete` also takes `"active"` or `"timestamp"`, as in `@softDelete( "timestamp" )`.
* On a property: `persistent`, `unique`, `notNull`, `insert`, `update`, `optimisticLock`, `inverse`, `constrained`, `missingRowIgnored` and `lazy`. `lazy` also takes `"extra"`, `"proxy"` or `"no-proxy"`.

Switches without a value need a bx-orm build later than `2.0.0-beta.8`; on `2.0.0-beta.8` and earlier, write `@persistent( true )`.

The CFML attribute form and doc-comment annotations still work and mean the same thing, so existing entities need no change. For example, `class persistent="true" table="authors" {` is the same class as the one above.

## Entity Name and Table

By default, the entity name will be the boxlang class file name - minus the file extension, of course. We can modify the entity name via the `entityname` annotation:

```js
@persistent
@entityName( "Author" )
class {

}
```

The `entity` annotation does both in one step. It marks the class as persistent, and a value sets the entity name:

```js
@entity
class {

}
```

```js
@entity( "Author" )
class {

}
```

With no value, the entity name is the class file name.

And the table name via the `table` annotation:

```js
@persistent
@entityName( "Author" )
@table( "authors" )
class {

}
```

Here's the full list of available annotations for a persistent class:

| Annotation            | Type      | Default | Description                                                                                                                                                            |
| --------------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `persistent`          | `boolean` | `false` | Mark this class as an ORM entity                                                                                                                                       |
| `entity`              | `string`  |         | Mark this class as an ORM entity, like `@persistent`. A value also sets the entity name, and wins over `entityname`.                                                   |
| `entityname`          | `string`  |         | Set a custom entity name which is different than the boxlang class name                                                                                                |
| `table`               | `string`  |         | Specify the database table name                                                                                                                                        |
| `schema`              | `string`  |         | Specify the database schema name.                                                                                                                                      |
| `catalog`             | `string`  |         | Specify the database catalog name.                                                                                                                                     |
| `dynamicinsert`       | `boolean` | `false` | Generate the `INSERT` at runtime with only the columns that are not null.                                                                                              |
| `dynamicupdate`       | `boolean` | `false` | Generate the `UPDATE` at runtime with only the columns that changed.                                                                                                   |
| `readonly`            | `boolean` | `false` | Specify whether the table is read-only.                                                                                                                                |
| `selectbeforeupdate`  | `boolean` |         | No effect: Hibernate 7 has no select-before-update. bx-orm logs a warning when it is set.                                                                              |
| `optimisticlock`      | `string`  |         | Determines the locking strategy: `all`, `dirty`, `version`, or `none`.                                                                                                 |
| `batchsize`           | `integer` |         | Number of records to retrieve at a single instance.                                                                                                                    |
| `discriminatorColumn` | `string`  |         | Define the discriminator column used in inheritance mapping.                                                                                                           |
| `discriminatorValue`  | `string`  |         | Define the discriminator value used in inheritance mapping.                                                                                                            |
| `joinColumn`          | `string`  |         | Define a join column for inheritance mapping.                                                                                                                          |
| `mappedSuperClass`    | `boolean` | `false` | Mark a non-persistent parent class as a mapped superclass. Its properties are folded into each persistent subclass's table.                                            |
| `cacheUse`            | `string`  |         | Caching strategy: `read-only`, `nonstrict-read-write`, `read-write`, or `transactional`.                                                                               |
| `cacheName`           | `string`  |         | Specify the name of the secondary cache.                                                                                                                               |
| `cacheInclude`        | `string`  | `all`   | Set to `non-lazy` to exclude lazy-loaded properties from the secondary cache entry.                                                                                    |
| `datasource`          | `string`  |         | Name a specific datasource to persist this entity to.                                                                                                                  |
| `where`               | `string`  |         | A raw SQL condition added to every query and load of this entity. See [Filtering rows with `where`](#filtering-rows-with-where).                                       |
| `defaultSort`         | `string`  |         | The order `entityLoad()` and `entityCriteria()` return rows in when no order is given, e.g. `lastName, firstName desc`. See [Default sort order](#default-sort-order). |
| `softDelete`          | `string`  |         | Mark rows deleted instead of removing them: `true` (also `yes` or `deleted`), `active` or `timestamp`. See [Soft delete](#soft-delete).                                |
| `softDeleteColumn`    | `string`  |         | The column `softDelete` uses. Defaults to `deleted` (`active` for `@softDelete( "active" )`).                                                                          |

## Sharing Properties with `mappedSuperClass`

Use `mappedSuperClass` when you want several entities to share a set of properties (like audit columns) without those properties living in their own database table:

```js
// BaseEntity.bx - not persistent itself
@mappedSuperClass
class {
    @ormtype( "timestamp" )
    property createdDate;

    @ormtype( "timestamp" )
    property modifiedDate;
}

// Author.bx
@persistent
class extends="BaseEntity" {
    @fieldtype( "id" )
    property authorID;

    @ormtype( "string" )
    property name;
    // createdDate and modifiedDate columns are added to the "Author" table
}
```

This differs from `joinColumn`/`discriminatorValue` inheritance, where subclasses share rows through a join or a discriminator column in a single parent table. With `mappedSuperClass`, there is no parent table at all: every property is copied into each subclass's own table.

## Filtering rows with `where`

The `where` annotation adds a raw SQL condition (not HQL) to every query and load of the entity: `entityLoad()`, `entityLoadByPK()`, HQL and criteria queries. Rows that do not match are invisible to the ORM.

```js
@persistent
@table( "notes" )
@where( "is_active = 1" )
class {
    @fieldtype( "id" )
    @generator( "increment" )
    property id;

    property title;

    @column( "is_active" )
    @ormtype( "boolean" )
    property isActive;
}
```

```js
entityLoadByPK( "Note", idOfAnInactiveNote ); // null
```

Use column names, not property names, since the condition is SQL. In an inheritance hierarchy, only the root entity's `where` is used. To filter only one collection instead of the whole entity, put `where` on the one-to-many or many-to-many property. See [Filtering Collections](relationships.md#filtering-collections-where).

## Default sort order

`defaultSort` sets the order rows come back in when the caller gives none. It is a comma-separated list of properties, each optionally followed by `asc` (the default) or `desc`:

```js
@persistent
@table( "people" )
@defaultSort( "lastName, firstName desc" )
class {
    @fieldtype( "id" )
    @generator( "increment" )
    property id;

    property firstName;
    property lastName;
}
```

```js
entityLoad( "Person" );                          // by lastName, then firstName descending
entityLoad( "Person", { lastName : "Baker" } );  // same order
entityLoad( "Person", {}, "id desc" );           // an explicit order wins
entityCriteria( "Person" ).list();               // same order
entityCriteria( "Person" ).order( "id" ).list(); // an explicit order wins
```

* It applies to `entityLoad()` (all rows and the filter forms) and to `entityCriteria()` `list()`, `get()`, `first()` and `paginate()`. It is not used by `count()`, and criteria `each()` and `chunk()` without an order still go by id.
* Use plain properties of the entity itself (no association paths).
* A subclass entity inherits its parent entity's `defaultSort` unless it declares its own.
* An unknown property or a direction other than `asc` or `desc` stops the ORM from starting with an `orm.config` error that suggests the right name.

## Soft delete

With `softDelete`, `entityDelete()` runs an `UPDATE` that marks the row deleted instead of a `DELETE`, and every load (`entityLoadByPK()`, `entityLoad()`, HQL, criteria queries and collections) skips deleted rows. This is Hibernate's `@SoftDelete`.

```js
@persistent
@table( "notes" )
@softDelete
class {
    @fieldtype( "id" )
    @generator( "increment" )
    property id;

    property title;
}
```

```js
entityDelete( note );                 // an UPDATE that sets deleted to true, not a DELETE
entityLoadByPK( "Note", note.getId() ); // null
```

Hibernate maps the column itself, so do not declare a property for it. Like any other column, it must exist in the table (`dbcreate` creates it).

| Value                      | Column                | Meaning                                                     |
| -------------------------- | --------------------- | ----------------------------------------------------------- |
| `true`, `yes` or `deleted` | `deleted` (boolean)   | `false` while the row is live, `true` once deleted          |
| `active`                   | `active` (boolean)    | `true` while the row is live, `false` once deleted          |
| `timestamp`                | `deleted` (timestamp) | Empty while the row is live, the deletion time once deleted |

`softDeleteColumn` renames the column:

```js
@persistent
@table( "notes" )
@softDelete( "timestamp" )
@softDeleteColumn( "archived_at" )
class {
    // ...
}
```

A criteria [`deleteAll()`](../usage/criteria.md#bulk-updates-and-deletes) on a soft-delete entity also marks the rows deleted.

{% hint style="warning" %}
Declare `softDelete` on the root entity of an inheritance hierarchy only; its subclasses inherit it. A subclass that declares it, or an unknown `softDelete` value, stops the ORM from starting with an `orm.config` error.
{% endhint %}

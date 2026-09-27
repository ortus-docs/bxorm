---
description: Turn BoxLang classes into ORM entities, with tables, row filters, default sorting and soft delete
icon: cube
---

# Entities

A persistent entity is a boxlang class that is marked as a database entity via the `persistent` annotation upon the class definition:

```js
class persistent="true"{

}
```

By default, the entity name will be the boxlang class file name - minus the file extension, of course. We can modify the entity name via the `entityname` annotation:

```js
class persistent="true" entityname="Author" {

}
```

And the table name via the `table` annotation:

```js
class persistent="true" entityname="Author" table="authors" {

}
```

Here's the full list of available annotations for a persistent class:

|Attribute|Type|Default|Description|
|---|---|---|---|
|`persistent`|`boolean`|`false`|Mark this class as an ORM entity|
|`entityname`|`string`||Set a custom entity name which is different than the boxlang class name|
|`table`|`string`||Specify the database table name|
|`schema`|`string`||Specify the database schema name.|
|`catalog`|`string`||Specify the database catalog name.|
|`dynamicinsert`|`boolean`|`false`|Specifies whether INSERT SQL is generated at runtime. Only columns whose values are not null are included in the SQL.|
|`dynamicupdate`|`boolean`|`false`|Specifies whether UPDATE SQL is generated at runtime. Only columns whose values are not null are included in the SQL.|
|`readonly`|`boolean`|`false`|Specify whether the table is read-only.|
|`selectbeforeupdate`|`boolean`||Specify whether Hibernate should perform an SQL `UPDATE` only when an object is actually modified.|
|`optimisticlock`|`string`||Determines the locking strategy: `all`, `dirty`, `version`, or `none`.|
|`batchsize`|`integer`||Number of records to retrieve at a single instance.|
|`lazy`|`boolean`|`true`|Whether loading is done lazily.|
|`rowid`|`string`||Specify the row ID.|
|`discriminatorColumn`|`string`||Define the discriminator column used in inheritance mapping.|
|`discriminatorValue`|`string`||Define the discriminator value used in inheritance mapping.|
|`joinColumn`|`string`||Define a join column for inheritance mapping.|
|`mappedSuperClass`|`boolean`|`false`|Mark a non-persistent parent class as a mapped superclass. Its properties are folded into each persistent subclass's table.|
|`embedded`|`boolean`||Mark the class as embedded so its properties are persisted with the parent's data.|
|`cacheUse`|`string`||Caching strategy: `read-only`, `nonstrict-read-write`, `read-write`, or `transactional`.|
|`cacheName`|`string`||Specify the name of the secondary cache.|
|`cacheInclude`|`string`|`all`|Set to `non-lazy` to exclude lazy-loaded properties from the secondary cache entry.|
|`datasource`|`string`||Name a specific datasource to persist this entity to.|
|`where`|`string`||A raw SQL condition added to every query and load of this entity. See [Filtering rows with `where`](#filtering-rows-with-where).|
|`defaultSort`|`string`||The order `entityLoad()` and `entityCriteria()` return rows in when no order is given, e.g. `lastName, firstName desc`. See [Default sort order](#default-sort-order).|
|`softDelete`|`string`||Mark rows deleted instead of removing them: `true` (also `yes` or `deleted`), `active` or `timestamp`. See [Soft delete](#soft-delete).|
|`softDeleteColumn`|`string`||The column `softDelete` uses. Defaults to `deleted` (`active` for `softDelete="active"`).|

## Sharing Properties with `mappedSuperClass`

Use `mappedSuperClass` when you want several entities to share a set of properties (like audit columns) without those properties living in their own database table:

```js
// BaseEntity.bx - not persistent itself
class mappedSuperClass="true" {
    property name="createdDate" ormType="timestamp";
    property name="modifiedDate" ormType="timestamp";
}

// Author.bx
class persistent="true" extends="BaseEntity" {
    property name="authorID" fieldtype="id";
    property name="name" ormType="string";
    // createdDate and modifiedDate columns are added to the "Author" table
}
```

This differs from `joinColumn`/`discriminatorValue` inheritance, where subclasses share rows through a join or a discriminator column in a single parent table. With `mappedSuperClass`, there is no parent table at all: every property is copied into each subclass's own table.

## Filtering rows with `where`

The `where` annotation adds a raw SQL condition (not HQL) to every query and load of the entity: `entityLoad()`, `entityLoadByPK()`, HQL and criteria queries. Rows that do not match are invisible to the ORM.

```js
class persistent="true" table="notes" where="is_active = 1" {
    property name="id" fieldtype="id" generator="increment";
    property name="title";
    property name="isActive" column="is_active" ormType="boolean";
}
```

```js
entityLoadByPK( "Note", idOfAnInactiveNote ); // null
```

Use column names, not property names, since the condition is SQL. In an inheritance hierarchy, only the root entity's `where` is used. To filter only one collection instead of the whole entity, put `where` on the one-to-many or many-to-many property. See [Filtering Collections](relationships.md#filtering-collections-where).

## Default sort order

`defaultSort` sets the order rows come back in when the caller gives none. It is a comma-separated list of properties, each optionally followed by `asc` (the default) or `desc`:

```js
class persistent="true" table="people" defaultSort="lastName, firstName desc" {
    property name="id" fieldtype="id" generator="increment";
    property name="firstName";
    property name="lastName";
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
class persistent="true" table="notes" softDelete="true" {
    property name="id" fieldtype="id" generator="increment";
    property name="title";
}
```

```js
entityDelete( note );                 // an UPDATE that sets deleted to true, not a DELETE
entityLoadByPK( "Note", note.getId() ); // null
```

Hibernate maps the column itself, so do not declare a property for it. Like any other column, it must exist in the table (`dbcreate` creates it).

| Value | Column | Meaning |
| --- | --- | --- |
| `true`, `yes` or `deleted` | `deleted` (boolean) | `false` while the row is live, `true` once deleted |
| `active` | `active` (boolean) | `true` while the row is live, `false` once deleted |
| `timestamp` | `deleted` (timestamp) | Empty while the row is live, the deletion time once deleted |

`softDeleteColumn` renames the column:

```js
class persistent="true" table="notes" softDelete="timestamp" softDeleteColumn="archived_at" {
    // ...
}
```

A criteria [`deleteAll()`](../usage/criteria.md#bulk-updates-and-deletes) on a soft-delete entity also marks the rows deleted.

{% hint style="warning" %}
Declare `softDelete` on the root entity of an inheritance hierarchy only; its subclasses inherit it. A subclass that declares it, or an unknown `softDelete` value, stops the ORM from starting with an `orm.config` error.
{% endhint %}

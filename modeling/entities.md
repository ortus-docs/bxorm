---
description: Learn the basics of modeling ORM entities
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
|`dynamicinsert`|||Specifies whether INSERT SQL is generated at runtime. Only columns whose values are not null are included in the SQL.|
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
|`saveMapping`|`boolean`|`false`|Save the generated Hibernate mapping file as `{class name}.hbm.xml` beside the BoxLang class.|
|`datasource`|`string`||Name a specific datasource to persist this entity to.|

### Sharing Properties with `mappedSuperClass`

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

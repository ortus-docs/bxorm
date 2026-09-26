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

<table data-full-width="true">
    <thead>
        <tr>
            <th width="235">Attribute</th>
            <th width="111">Type</th>
            <th width="107">Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>persistent</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Mark this class as an ORM entity</td>
        </tr>
        <tr>
            <td><code>entityname</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Set a custom entity name which is different than the boxlang class name</td>
        </tr>
        <tr>
            <td><code>table</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Specify the database table name</td>
        </tr>
        <tr>
            <td><code>schema</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Specify the database schema name.</td>
        </tr>
        <tr>
            <td><code>catalog</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Specify the database catalog name.</td>
        </tr>
        <tr>
            <td><code>dynamicinsert</code></td>
            <td></td>
            <td></td>
            <td>Specifies whether INSERT SQL is to be generated at runtime. Only those columns whose values are not null
                are included in the SQL.</td>
        </tr>
        <tr>
            <td><code>dynamicinsert</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Specifies whether INSERT SQL is to be generated at runtime. Only those columns whose values are not null
                are included in the SQL.</td>
        </tr>
        <tr>
            <td><code>dynamicupdate</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Specifies whether UPDATE SQL is to be generated at runtime. Only those columns whose values are not null
                are included in the SQL.</td>
        </tr>
        <tr>
            <td><code>readonly</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Specify whether table is readonly or not</td>
        </tr>
        <tr>
            <td><code>selectbeforeupdate</code></td>
            <td><code>boolean</code></td>
            <td></td>
            <td>Specify whether Hibernate should never perform an SQL UPDATE unless it is certain that an object is
                actually modified. In cases when a transient object is associated with a new session using update(),
                Hibernate performs an extra SQL SELECT to determine if an UPDATE is actually required.</td>
        </tr>
        <tr>
            <td><code>optimisticlock</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Determines the locking strategy. It can be any one of:
                <code>all</code>,<code>dirty</code>,<code>version</code>,<code>none</code></td>
        </tr>
        <tr>
            <td><code>batchsize</code></td>
            <td><code>integer</code></td>
            <td></td>
            <td>An integer value that specifies the number of records to be retrieved at a single instance.</td>
        </tr>
        <tr>
            <td><code>lazy</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Whether loading is to be done lazily or not.</td>
        </tr>
        <tr>
            <td><code>rowid</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Specify the row id</td>
        </tr>
        <tr>
            <td><code>discriminatorColumn</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Use this attribute to define the discriminator column to be used in inheritance mapping</td>
        </tr>
        <tr>
            <td><code>discriminatorValue</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Use this attribute to define the discriminator value to be used in inheritance mapping</td>
        </tr>
        <tr>
            <td><code>joinColumn</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Define a join column for inheritance mapping</td>
        </tr>
        <tr>
            <td><code>mappedSuperClass</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Mark a non-persistent parent class as a mapped superclass. Its properties are folded directly into
                each persistent subclass's own table, rather than requiring a <code>joinColumn</code> or
                <code>discriminatorValue</code>-based inheritance strategy. Useful for sharing common properties
                (e.g. <code>createdDate</code>, <code>modifiedDate</code>) across unrelated entities.</td>
        </tr>
        <tr>
            <td><code>embedded</code></td>
            <td><code>boolean</code></td>
            <td></td>
            <td>Marks class as embedded, used when a class has an embedded object which also needs to be persisted along
                with the parent's data</td>
        </tr>
        <tr>
            <td><code>cacheUse</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Specify the caching strategy to be used for caching this entity's data in the secondary cache. One of
                <code>read-only</code>, <code>nonstrict-read-write</code>, <code>read-write</code>, or <code>transactional</code></td>
        </tr>
        <tr>
            <td><code>cacheName</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Specify the name of the secondary cache</td>
        </tr>
        <tr>
            <td><code>cacheInclude</code></td>
            <td><code>string</code></td>
            <td><code>all</code></td>
            <td>Set to <code>non-lazy</code> to exclude lazy-loaded properties from the secondary cache entry</td>
        </tr>
        <tr>
            <td><code>saveMapping</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Specifies whether the generated Hibernate mapping file has to be saved to disk. If you set the value to
                true, the Hibernate mapping XML file is saved as <code>{class name}.hbm.xml</code> in the same directory
                as the boxlang class.</td>
        </tr>
        <tr>
            <td><code>datasource</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Name a specific datasource to persist this entity to.</td>
        </tr>
        <tr>
            <td><code>where</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>A raw SQL condition added to every query and load of this entity. See <a href="#filtering-rows-with-where">Filtering rows with <code>where</code></a>.</td>
        </tr>
        <tr>
            <td><code>softDelete</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>Mark rows deleted instead of removing them: <code>true</code> (also <code>yes</code> or <code>deleted</code>), <code>active</code> or <code>timestamp</code>. See <a href="#soft-delete">Soft delete</a>.</td>
        </tr>
        <tr>
            <td><code>softDeleteColumn</code></td>
            <td><code>string</code></td>
            <td></td>
            <td>The column <code>softDelete</code> uses. Defaults to <code>deleted</code> (<code>active</code> for <code>softDelete="active"</code>).</td>
        </tr>
    </tbody>
</table>

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

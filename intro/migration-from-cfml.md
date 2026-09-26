---
description: Migrating to BoxLang ORM from Adobe ColdFusion and Lucee
---

# BX-ORM Migration Guide

BoxLang ORM is designed to be compatible with existing CFML ORM code, but there are some differences and considerations when migrating from Adobe ColdFusion (ACF) or Lucee.

## Configuration Differences

There are several ORM settings which have been renamed OR the default value changed in `bx-orm`. You will need to either rename these in your configuration, or install `bx-compat-cfml` to provide compatibility with the old settings names.

### Renamed Settings

| Setting name (ACF/Lucee) | Setting name (BoxLang) |
|--------------------------|------------------------|
| `skipCFCWithError` | `ignoreParseErrors` |
| `cfcLocation` | `entityPaths` |

Both of these settings are supported in `bx-compat-cfml` for compatibility with existing code, but you should update your configuration to use the new names to avoid confusion and ensure future compatibility.

### Changed Defaults

| Setting | Lucee Default | ACF Default | BoxLang Default |
|---------|---------------|-------------|-----------------|
| `ignoreParseErrors` (formerly `skipCFCWithError`) | `true` | `true` | `false` |
| `autoManageSession` | `true` | `true` | `false` |
| `flushAtRequestEnd` | `true` | `true` | `false` |
| `proxyLazyLoading` | `true` | `true` | `false` |

Again, each of these settings are reverted to the ACF/Lucee defaults in `bx-compat-cfml`.

### Database Inspection (`useDBForMapping`)

Adobe ColdFusion inspects the database by default to complete entity mappings. In BoxLang, `useDBForMapping` is `false` by default, so every entity must declare what it needs. If your entities leave out their `ormtype` or their id and rely on the table to fill them in, set it:

```js
this.ormSettings = {
    useDBForMapping : true
};
```

BoxLang then reads each existing table at startup and fills in the `ormtype` of untyped properties (from the column type) and the id of a root entity that declares none (from the primary key). Unlike Adobe ColdFusion, it does not infer foreign keys: declare relationships with their `fkcolumn`. See [Using the Database for Mapping](configuration.md#using-the-database-for-mapping).

### Event Handling

As in Adobe ColdFusion and Lucee, ORM events only fire when `eventHandling` is `true`. With the default (`false`), neither entity event methods, the global `eventHandler`, nor `postNew` run. Earlier bx-orm versions fired events even without this setting, so set `eventHandling: true` if your application uses ORM events:

```js
this.ormSettings = {
    eventHandling : true,
    eventHandler  : "models.ORMEventHandler"
};
```

## Built-in Function Differences

Most of the built-in functions (BIFs) from other CFML engines are functionally identical in BoxLang. A few notable exceptions:

### `EntityLoadByPK()`

In ACF/Lucee, this BIF returns an array of entities by default, and you must pass a `unique=true` argument to return a single entity. In BoxLang, a single entity is returned by default. A boolean third argument (Lucee's `unique`) is accepted and ignored; in BoxLang the third argument is a struct of load options (`lock`, `timeout`, `skipLocked`, `readOnly`). To return an array of entities in BoxLang, use the `entityLoad` BIF instead, or pass an array of ids: `entityLoadByPK( "Automobile", [ id1, id2 ] )` returns an array in the order of the ids.

```js
// Lucee/ACF returns an array
var myAuto = entityLoadByPK( "Automobile", "1HGCM82633A123456" ).first();
// BoxLang returns a single item
var myAuto = entityLoadByPK( "Automobile", "1HGCM82633A123456" );
```

### `EntityNew()`

In ACF, a third argument `ignoreExtras` is implemented which allows you to ignore struct keys that do not match properties on the entity. In Lucee, this argument is called `ignoreNotExisting` but is not properly implemented and is always `true`. In BoxLang, this argument is not supported and any extra keys will cause an error. To achieve similar functionality in BoxLang, you can filter the struct of values before passing it to `EntityNew` to remove any keys that do not match properties on the entity.

ACF, Lucee, and BoxLang will all error if you attempt to set a property that does not exist on the entity:

```js
var entityProps = { nonExistentKey: "Blue" };
var myNewEntity = entityNew( "Automobile", entityProps );
```

ACF does allow ignoring keys that do not match an entity property:

```js
var entityProps = { nonExistentKey: "Blue" };
var myNewEntity = entityNew( "Automobile", entityProps, true );
```
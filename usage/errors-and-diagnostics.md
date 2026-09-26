---
description: What bx-orm errors look like, how to catch them, what each one means, and how to inspect the ORM with ormDiagnostics().
---

# Errors and Diagnostics

Every error bx-orm raises is written for BoxLang developers:

* **`message`** says what went wrong, using your entity and property names.
* **`detail`** says how to fix it.
* **`extendedInfo`** is a struct with the context: the entity, property, HQL, parameters, generated SQL, constraint name and the original Hibernate message.
* Misspelled entity, property, field type and ORM type names get a suggestion: `Did you mean [name]?`

```
[orm.property.unknown] Manufacturer has no property [nmae]. Did you mean [name]?
                       HQL: from Manufacturer where nmae = 'x'
detail: Properties: id, name, address, vehicles
```

## Catching ORM errors

Every error has a `type` that starts with `orm`. BoxLang matches `catch` types on a dotted prefix, so you can catch all ORM errors, one family, or one exact type:

```js
try {
    entitySave( user );
    ormFlush();
} catch ( "orm.constraint.unique" e ) {
    // the email is already taken
    flash.put( "error", "That email address is already registered." );
} catch ( "orm.constraint" e ) {
    // any other constraint (not null, foreign key, check)
    log.error( e.message, e.extendedInfo );
} catch ( "orm" e ) {
    // any other ORM error
    rethrow;
}
```

The context is in `e.extendedInfo`:

```js
catch ( "orm.query" e ) {
    writeDump( e.extendedInfo.hql );      // the HQL that failed
    writeDump( e.extendedInfo.params );   // the parameters you passed
}
```

## Error catalog

| Type | When it happens | How to fix it |
| --- | --- | --- |
| `orm.notEnabled` | An ORM function runs in an application without `this.ormEnabled = true`. | Enable the ORM in `Application.bx`. |
| `orm.notReady` | The ORM failed to start (the message repeats the startup error) or has not started. | Fix the startup error, then call `ormReload()` or restart the app. |
| `orm.config` | Invalid ORM settings or entities found at startup: missing entity folder, unknown `fieldtype` or `ormtype`, relationship to a missing `cfc`, unknown datasource, two entities with the same name, an unknown `softDelete` or `autoTimestamp` value, `softDelete` on a subclass entity. | Follow the message; it names the entity, property or setting. |
| `orm.boot` | Hibernate refused the generated mapping. | The message names the entity; check its mapping annotations. |
| `orm.entity.notFound` | An entity name that does not exist, in a BIF or in HQL. | Use the suggested name; `detail` lists the known entities. |
| `orm.property.unknown` | A property that does not exist, in HQL, an `entityLoad()` filter or its sort order. | Use the suggested name; `detail` lists the entity's properties. |
| `orm.property.type` | A property holds a value that cannot be stored in its column (e.g. `"abc"` in an integer), or an association was set to something that is not an entity. | Set values that fit each property's `ormtype`; set associations to entity instances. |
| `orm.argument` | A BIF received the wrong kind of value, e.g. a struct instead of an entity, or an id of the wrong type. Also a lock taken outside `transaction{}`, an unknown lock mode, or lock mode `force` on an entity without a version property. | Pass what the message asks for. |
| `orm.query.syntax` | HQL that cannot be parsed. The message gives the line, column and token; `detail` lists what was expected. | Fix the HQL at that position. |
| `orm.query.semantic` | HQL that parses but is not valid (bad function or path). | Check the HQL against your entities. |
| `orm.query.parameter` | A named parameter without a value, too few positional values, named vs positional mixed up, a value of the wrong type, or an empty string for a non-text value. | Pass one value per parameter, of the right type. Pass `null` (not `""`) for "no value". |
| `orm.query.nonUnique` | A `unique` query or `entityLoad()` matched more than one row. | Narrow the query, or pass `{ uniqueFirst : true }` to take the first row. |
| `orm.notFound` | `getOrFail()` or `firstOrFail()` of [entityCriteria()](criteria.md), `entityLoadOrFail()` or `entityLoadByPKOrFail()` matched no row. | Use `get()`, `first()`, `entityLoad()` or `entityLoadByPK()` to receive null instead, or check the id or conditions. |
| `orm.lazy.noSession` | A lazy association was read after the session that loaded it was closed or cleared (`ormClearSession()`, `ormCloseSession()`, a finished request). | Reload the entity in the current session (`entityLoadByPK()`, `entityReload()`), or map the association with `lazy="false"`. |
| `orm.transient` | A saved entity points to an entity that was never saved, or `entityLock()` received an entity that is not in the session. | Save the other entity first, or add `cascade="save-update"` (or `"all"`) to the association. For `entityLock()`, load the entity first. |
| `orm.id.missing` | An entity with an assigned id (`generator="assigned"`) was saved without one. | Set the id before `entitySave()`, or give the id a generator. |
| `orm.session.duplicate` | Two different objects for the same row are in one session. | Use `entityMerge()`, or keep working with the instance you loaded. |
| `orm.stale` | Optimistic locking: the row changed or was deleted after you loaded it. | Reload the entity and apply your change again. |
| `orm.event.veto` | A `preInsert` handler returned `false` for an entity whose id comes from the database (`generator="identity"`); that insert cannot be skipped. | Decide before `entitySave()`, or throw an error from `preInsert`. See [Events](events.md#vetoing-an-operation). |
| `orm.constraint.unique` | A unique constraint rejected the change. | Another row already has this value. |
| `orm.constraint.notNull` | A required property (`notnull="true"`) or column has no value. | Set it before saving. |
| `orm.constraint.foreignKey` | A foreign key rejected the change: it points to a missing row, or deletes a row still referenced. | Save or keep the referenced row, or add a cascade. |
| `orm.constraint.check` | A check constraint rejected the change. | See the database message in `detail`. |
| `orm.sql` | The database rejected the SQL for another reason. | `extendedInfo.sql` has the generated SQL. |
| `orm` | Anything else ORM-related. | The message has Hibernate's explanation, with your entity names. |

Errors that are not caused by the ORM, such as an exception thrown by your own event handler, are passed through unchanged.

## Unique results

`unique=true` means exactly one result. If more than one row matches, bx-orm raises `orm.query.nonUnique` instead of silently dropping the others:

```js
// Error if several users share the email
user = ormExecuteQuery( "from User where email = :email", { email : rc.email }, true );

// Take the first row on purpose
latest = ormExecuteQuery( "from Post order by publishedDate desc", {}, true, { uniqueFirst : true } );
post   = entityLoad( "Post", { status : "draft" }, true, { uniqueFirst : true } );
```

## Inspecting the ORM with `ormDiagnostics()`

`ormDiagnostics()` returns a snapshot of the ORM for the current application. It never throws, so it is the first thing to call when something looks wrong.

```js
writeDump( ormDiagnostics() );
```

| Key | What it holds |
| --- | --- |
| `status` | `running`, `failed` (startup failed), `notStarted` or `notEnabled` |
| `applicationName`, `hibernateVersion` | The application and the Hibernate version |
| `startupError` | `{ at, type, message, detail }` of the last failed startup or `ormReload()` |
| `defaultDatasource`, `datasources` | Entity names per datasource |
| `entityCount`, `warnings` | How many entities, and warnings such as unknown `ormtype` values |
| `settings` | The settings that most often explain surprises: `dbcreate`, `dialect`, `entityPaths`, `flushAtRequestEnd`, `autoManageSession`, … |
| `sessions` | This request's open sessions per datasource: `open`, `entityCount`, `collectionCount`, `dirty` (unsaved changes) |

When `ormReload()` fails, the application keeps running on the ORM it had, and `ormDiagnostics().startupError` shows why the reload failed.

## Startup checks

Before Hibernate starts, bx-orm checks your entities and reports every problem it finds in one error:

* Two entities with the same name on one datasource (both classes are named).
* An entity folder in `entityPaths` that does not exist.
* An unknown `fieldtype`, with the valid list and a suggestion.
* A relationship `cfc` that does not exist.
* An `ormtype` bx-orm does not recognize is logged as a warning, and named as the likely cause (with a suggestion) if Hibernate then fails to start.

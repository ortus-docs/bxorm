---
description: How do Hibernate logs work in bx-orm?
---

# Logging

There are several categories of logs generated during normal use of a bx-orm application:

1. `bx-orm` logs
2. SQL logs
3. Hibernate logs

## bx-orm logs

Logging statements generated from bx-orm itself will be output to the `orm.log` file located in the boxlang runtime `logs/` directory.

This log file may look something like the below when DEBUG mode is enabled:

```
[2025-04-25T09:50:34,965] [Test worker] [DEBUG] [ORM] beforeApplicationListenerLoad fired; checking for ORM configuration 
[2025-04-25T09:50:34,972] [Test worker] [DEBUG] [ORM] ORMEnabled, starting up ORM app for [myApp] 
[2025-04-25T09:50:34,979] [Test worker] [DEBUG] [ORM] ORMApp created for application: [myapp_1428735748] 
[2025-04-25T09:50:35,001] [Test worker] [DEBUG] [ORM] Found more than 20 entities; parallelizing metadata introspection 
[2025-04-25T09:50:35,006] [Test worker] [DEBUG] [ORM] Loading metadata for class /app/models/cms/Author.bx 
[2025-04-25T09:50:35,007] [Test worker] [DEBUG] [ORM] Parsing class file: [/app/models/cms/Author.bx] 
...
```

For more information on configuring loggers, see the [Boxlang Logging](https://boxlang.ortusbooks.com/getting-started/configuration/logging) documentation.

## SQL Logs

bx-orm has the ability to log every SQL statement generated from ORM code. For example, firing `entityDelete( myEntity )` will generate a `DELETE` SQL statement for deleting the entity (table row) in question from the entity table.

A quick example might be this log, generated after firing `entityNew( "Manufacturer", properties )`:

```
[2025-04-25T09:50:46,264] [Test worker] [DEBUG] [org.hibernate.SQL] 
    /* insert Manufacturer
        */ insert 
        into
            manufacturers
            (name, address, id) 
        values
            (?, ?, ?) 
```

To enable this behavior, set `this.ormSettings.logSQL` to `true` in your `Application.bx`:

```js
this.ormSettings={
	"logSQL" : "true"
	// ...
}
```

These SQL statements will also log to the `orm.log` file located in `${boxlang-home}/logs`.

## Hibernate-native logs

Hibernate-native logging statements will also be captured in the `orm.log` file located in `${boxlang-home}/logs`.
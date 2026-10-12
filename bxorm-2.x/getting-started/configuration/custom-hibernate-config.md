---
description: Pass raw Hibernate settings with a properties file or an inline struct
icon: sliders
---

# Custom Hibernate Config

Sometimes bx-orm doesn't have a dedicated setting for a Hibernate property you need. There are two ways to set arbitrary Hibernate properties directly: a `hibernate.properties` file via `ormconfig`, or an inline struct via `hibernateProperties`.

## ormConfig: A Properties File

Point `ormconfig` at a flat, standard Java `hibernate.properties`-formatted file:

```js
this.ormSettings = {
    // ...
    ormconfig : "./config/hibernate.properties"
};
```

The file is a simple list of `key=value` pairs, one Hibernate property per line:

```properties
# hibernate.properties
hibernate.use_sql_comments=true
hibernate.jdbc.batch_size=25
```

{% hint style="warning" %}
Only the flat `key=value` properties file format is supported. The XML `hibernate.cfg.xml` format is not yet implemented.
{% endhint %}

## hibernateProperties: An Inline Struct

For settings you'd rather keep alongside the rest of your ORM config instead of in a separate file, use the `hibernateProperties` struct:

```js
this.ormSettings = {
    // ...
    hibernateProperties = {
        "hibernate.use_sql_comments" = "true",
        "hibernate.jdbc.batch_size" = "25"
    }
};
```

Every entry is applied directly to the Hibernate configuration, giving you an escape hatch for tuning any Hibernate setting bx-orm doesn't expose a dedicated setting for.

## Precedence

Both settings are applied **after** bx-orm's own internal defaults, so either can override bx-orm's hardcoded Hibernate settings (e.g. flush and auto-close behavior). When using both together:

1. `ormconfig` (the file) is applied first.
2. `hibernateProperties` (the inline struct) is applied second, so it wins on a conflicting key.

{% hint style="info" %}
A few settings that bx-orm needs to work are re-applied internally *after* `ormconfig` and `hibernateProperties`. You cannot override them:

* the JDBC connection provider
* the connection handling mode
* the classloaders
* the session context class
* identifier quoting (use the `quoteIdentifiers` setting)
{% endhint %}

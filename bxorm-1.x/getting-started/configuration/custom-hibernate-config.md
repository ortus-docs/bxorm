# Custom Hibernate Config

Sometimes bx-orm doesn't have a dedicated setting for a Hibernate property you need. There are two ways to set arbitrary Hibernate properties directly: a `hibernate.properties` file via `ormconfig`, or an inline struct via `hibernateProperties`.

### ormConfig: A Properties File

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
hibernate.connection.release_mode=on_close
hibernate.use_sql_comments=true
```

{% hint style="warning" %}
Only the flat `key=value` properties file format is supported. The XML `hibernate.cfg.xml` format is not yet implemented.
{% endhint %}

### hibernateProperties: An Inline Struct

For settings you'd rather keep alongside the rest of your ORM config instead of in a separate file, use the `hibernateProperties` struct:

```js
this.ormSettings = {
    // ...
    hibernateProperties = {
        "hibernate.connection.release_mode" = "on_close",
        "hibernate.use_sql_comments" = "true"
    }
};
```

Every entry is applied directly to the Hibernate configuration, giving you an escape hatch for tuning any Hibernate setting bx-orm doesn't expose a dedicated setting for.

### Precedence

Both settings are applied **after** bx-orm's own internal defaults, so either can override bx-orm's hardcoded Hibernate settings (e.g. flush and auto-close behavior). When using both together:

1. `ormconfig` (the file) is applied first.
2. `hibernateProperties` (the inline struct) is applied second, so it wins on a conflicting key.

{% hint style="info" %}
A handful of settings that are load-bearing for bx-orm's own correctness (JDBC connection provider wiring, classloaders, session context class, identifier quoting, and entity mode) are re-applied internally *after* `ormconfig` and `hibernateProperties` are processed, so neither can break those specific things no matter what you set.
{% endhint %}

### Example: Fixing Cross-Database "Statement Is Closed" Errors

If your app runs against multiple database engines (e.g. MySQL, MSSQL, PostgreSQL) you may see Hibernate `"statement is closed"` errors on MSSQL or Postgres, caused by stale JDBC statements after per-save transaction commits. Setting `hibernate.connection.release_mode` per-app resolves this:

```js
this.ormSettings = {
    // ...
    hibernateProperties = {
        "hibernate.connection.release_mode" = "on_close"
    }
};
```

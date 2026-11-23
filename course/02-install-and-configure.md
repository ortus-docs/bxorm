---
title: Install and configure
summary: Install BxORM, point it at a database and run your first ORM script.
icon: phosphor-duotone:download-simple
tags: [course]
---

In this lesson you install the module, create the blog's folder and tell BxORM which database to use. By the end, `boxlang app.bxs` starts the ORM against your database.

## Install the module

BxORM ships as the `bx-orm` module. Install it together with the JDBC driver module for your database. The course uses MySQL:

```bash
bx-module install bx-orm bx-mysql
```

Using CommandBox instead? Install the same modules into your project:

```bash
box install bx-orm bx-mysql
```

Then create an empty database called `blog`:

```sql
CREATE DATABASE blog;
```

## Create the app

Make a folder for the blog with a `models` folder inside it:

```text
blog/
├── Application.bx
├── app.bxs
└── models/
```

`Application.bx` configures the app: its name, its datasource and the ORM.

```boxlang title="Application.bx"
class {

    this.name = "blog";

    // The app's own folder, so entity paths and imports work from scripts and web requests alike
    this.mappings[ "/blog" ] = getDirectoryFromPath( getCurrentTemplatePath() );

    this.datasources = {
        blog : {
            driver   : "mysql",
            host     : "localhost",
            port     : 3306,
            database : "blog",
            username : "root",
            password : ""
        }
    };
    this.datasource = "blog";

    this.ormEnabled  = true;
    this.ormSettings = {
        // Where your entities live
        entityPaths   : [ "/blog/models" ],
        // Create and update tables from your entities (development only)
        dbcreate      : "update",
        // Fire entity events such as preInsert()
        eventHandling : true,
        // Print the SQL while you learn
        logSQL        : true
    };
}
```

A few things to notice:

- `this.ormEnabled = true` turns the ORM on for this application.
- `entityPaths` tells BxORM where to look for entities. Listing it also avoids scanning the whole app at startup.
- `dbcreate : "update"` creates and alters tables to match your entities. It is handy while you learn. Use `"none"` in production.
- `logSQL : true` prints every SQL statement, so you can see what the ORM does.

## Run a script

BoxLang runs a script with the `Application.bx` in its folder, so the ORM starts for scripts too. Put this in `app.bxs`:

```boxlang title="app.bxs"
println( "Entities: " & entityNameList() );
```

Run it from the `blog` folder:

```bash
boxlang app.bxs
```

There are no entities yet, so the list is empty. That changes in the next lesson.

The same `Application.bx` works for a web app. Run your app server (for example the BoxLang MiniServer or CommandBox) from the `blog` folder and the ORM starts on the first request.

## Naming strategies

By default, a table or column name is exactly the name you write. A **naming strategy** changes that everywhere at once:

```boxlang title="Application.bx"
this.ormSettings = {
    entityPaths    : [ "/blog/models" ],
    dbcreate       : "update",
    // userProfile becomes USER_PROFILE
    namingstrategy : "smart"
};
```

| Value     | What it does                                                                |
| --------- | --------------------------------------------------------------------------- |
| `default` | No conversion. Names are used as written                                    |
| `smart`   | Uppercase, with camelCase split by underscores                              |
| A class   | Your own class, with methods such as `getTableName()` and `getColumnName()` |

The blog keeps `default`, so the tables are named exactly as the entities say.

## Try it

- Run `boxlang app.bxs` and check that it prints no errors.
- Change the database name in the datasource to one that does not exist and run the script again. Read the error, then change it back.
- Look up two other settings in the configuration docs and decide whether the blog needs them.

## Learn more

- [Installation](https://bxorm.ortusbooks.com/bxorm-2.x/getting-started/installation)
- [Configuration](https://bxorm.ortusbooks.com/bxorm-2.x/getting-started/configuration)
- [Naming strategies](https://bxorm.ortusbooks.com/bxorm-2.x/getting-started/configuration/naming-strategies)

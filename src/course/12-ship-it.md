---
title: Ship it
summary: Production settings, the boot cache and the bxorm CLI for fast starts, and the second-level cache for fast reads.
icon: phosphor-duotone:flag-checkered
tags: [course]
---

The blog works. Before it goes live, three things change: the schema stops changing itself, the ORM boots from a cache, and hot data gets cached between requests.

## Production settings

`dbcreate : "update"` is great while you learn, but in production your schema should only change through migrations you control. Turn it off, and stop printing SQL:

```boxlang title="Application.bx"
this.ormSettings = {
    entityPaths   : [ "/blog/models" ],
    dbcreate      : "none",
    eventHandling : true,
    logSQL        : false,
    // "auto" on your machine and in CI, "trust" in production
    ormManifest   : getSystemSetting( "ORM_MANIFEST", "auto" )
};
```

## The boot cache

At startup, BxORM discovers your entities, reads their annotations and generates the Hibernate mappings and entity classes. The **boot cache** saves all of that in a `.bxorm/` folder, so later boots can skip it. The `ormManifest` setting picks the mode:

| Mode    | At startup                                           | Use it for  |
| ------- | ---------------------------------------------------- | ----------- |
| `off`   | Discover, parse and map every entity (the default)   | Anything    |
| `auto`  | Boot normally, then write the cache. Reload on edits | Development |
| `trust` | Boot straight from the cache                         | Production  |

The gain grows with your model: on large models, `trust` cuts boot time by about a third to a half.

A `trust` boot **fails closed**. If an entity, a key setting or the bx-orm version changed since the cache was written, it refuses to start and says what changed:

```text
ORM manifest mode is [trust] but the manifest at [.bxorm/manifest-blog.json] is stale:
entity [Tag] source changed: /blog/models/Tag.bx. Regenerate it with `boxlang module:orm generate`
```

## The bxorm CLI

You don't need to boot the app to build the cache. From the app folder:

```bash
boxlang module:orm generate
```

```text
Wrote the ORM boot cache for [blog]: 3 entities in 450ms
   blog/.bxorm/manifest-blog.json
   blog/.bxorm/facades-blog.jar
```

It reads your `Application.bx` settings without starting the app or opening a database, so it runs in a Docker build or a CI step. Other verbs:

| Verb            | What it does                                        |
| --------------- | --------------------------------------------------- |
| `info`          | The cache header: versions, entity count, integrity |
| `validate`      | Checks each manifest. Exits with `1` on a problem   |
| `entities`      | The entities in the cache                           |
| `entity <name>` | One entity, with its mapping XML                    |
| `clear`         | Deletes the cache files                             |

`validate` fits a CI step that guards your deploys:

```bash
boxlang module:orm generate
boxlang module:orm validate
```

If your server defines mappings or datasources in `boxlang.json` instead of `Application.bx`, pass the same file: `boxlang --bx-config runtime/boxlang.json module:orm generate`. Deploy the `.bxorm/` folder with the app and set `ORM_MANIFEST=trust`.

## The second-level cache

The session caches entities only until it ends. The **second-level cache** keeps them across requests, in BoxLang's own BoxCache. Tags rarely change, so they are a good fit:

```boxlang title="Application.bx"
this.ormSettings = {
    // ...
    secondaryCacheEnabled : true
};
```

```boxlang title="models/Tag.bx"
@persistent
@table( "tags" )
@cacheuse( "read-write" )
@cachename( "tags" )
class {
    // ...
}
```

Now `entityLoadByPK( "Tag", 1 )` reads from the `tags` cache after the first load, in any request. Criteria queries can cache their results too, with `.cache()`.

## Try it

- Run `boxlang module:orm generate`, then `info` and `validate`.
- Switch to `ormManifest : "trust"`, edit an entity and start the app. Read the error, then regenerate.
- Cache `Tag` and load the same tag in two requests. With `logSQL` on, how many selects run?

## Learn more

- [Performance and the boot cache](https://bxorm.ortusbooks.com/bxorm-2.x/getting-started/performance)
- [CLI tools](https://bxorm.ortusbooks.com/bxorm-2.x/reference/cli-tools)
- [Caching](https://bxorm.ortusbooks.com/bxorm-2.x/usage/caching)

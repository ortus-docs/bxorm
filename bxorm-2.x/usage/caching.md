---
description: Cache entities, collections and queries in BoxLang's BoxCache with Hibernate's second-level cache.
icon: memory
---

# Caching

Every Hibernate session already caches the entities it loads (the first-level cache), but only until the session ends.
The **second-level cache** keeps entities, collections and query results across sessions and requests, so repeated reads
skip the database.

In bx-orm 2 the second-level cache is **BoxLang's own BoxCache**. Each cache region Hibernate uses is a normal BoxLang
cache. There is no EHCache or other cache library to install, and you can tune, inspect and replace those caches like any
other BoxLang cache.

## Quick Start

1. Turn the second-level cache on (it is off by default):

    ```js
    this.ormSettings = {
        secondaryCacheEnabled : true
    };
    ```

2. Mark the entities to cache with `cacheUse`, and give each one a region name with `cacheName`:

    ```js
    class persistent="true" cacheUse="read-write" cacheName="users" {
        property name="id" fieldtype="id" generator="native";
        property name="name";
    }
    ```

That's it. `entityLoadByPK( "User", 1 )` now reads from the `users` cache after the first load, in any request.

## How It Works

Hibernate splits the second-level cache into **regions**: one per cached entity, one per cached collection, and regions
for query results. bx-orm stores each region in a BoxLang cache with the same name, found or created the first time the
region is used:

1. **Your own cache:** if a BoxLang cache with the region's name already exists, for example one you defined in
   `boxlang.json`, bx-orm uses it as is, with its own provider and settings.
2. **Created for you:** otherwise bx-orm creates the cache with the `cacheProvider` setting (BoxCache by default) and the
   properties `cacheConfig` gives that region.

```text
entityLoadByPK( "User", 1 )
  -> Hibernate region "users" (from cacheName="users")
     -> BoxLang cache "users": your own cache if it exists, else a new BoxCache tuned by cacheConfig
```

## Cache Strategies

`cacheUse` picks how Hibernate keeps the cache consistent with the database:

| `cacheUse`             | Use it for                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `read-only`            | Data that never changes after it is inserted (lookups, countries). Fastest. Updates throw. |
| `nonstrict-read-write` | Data that changes rarely, where a short window of stale reads is fine.                     |
| `read-write`           | Data that changes and must not be read stale. Uses soft locks around updates.              |
| `transactional`        | Not supported: the regions bx-orm builds reject it at startup. Use `read-write`.           |

`cacheInclude` decides whether lazy properties are cached with the entity: `all` (the default) or `non-lazy`.

## What You Can Cache

### Entities

Add `cacheUse`, and preferably `cacheName`, to the entity class:

```js
class persistent="true" table="countries" cacheUse="read-only" cacheName="countries" {
    property name="code" fieldtype="id" generator="assigned";
    property name="name";
}
```

Without `cacheName`, the region is named after the entity's internal Hibernate class name, which is long and
application-specific. Set `cacheName` so the region is easy to tune and find.

### Collections

Put `cacheUse` (and optionally `cacheName`) on a `one-to-many`, `many-to-many` or `collection` property to cache the ids
of its elements:

```js
class persistent="true" cacheUse="read-write" cacheName="users" {
    property name="id" fieldtype="id" generator="native";
    property name="roles" fieldtype="many-to-many" cfc="Role" linktable="user_roles"
             cacheUse="read-write" cacheName="userRoles";
}
```

A cached collection stores element ids, so cache the element entity too (here `Role`), or each element is still loaded
from the database.

### Queries

Cache the results of a query with the `cacheable` and `cacheName` options:

```js
// default query region
active = ormExecuteQuery( "from User where active = true", [], false, { cacheable : true } );

// a named query region; a cacheName alone also turns caching on
active = ormExecuteQuery( "from User where active = true", [], false, { cacheName : "activeUsers" } );
users  = entityLoad( "User", { active : true }, "name", { cacheName : "activeUsers" } );

// criteria
users = entityCriteria( "User" ).isTrue( "active" ).cacheable( true ).list();
```

The query cache stores the ids of the results, so it works best together with entity caching. Hibernate drops a cached
query's results when any table it reads is changed through the ORM.

## Tuning the Caches with `cacheConfig`

`cacheConfig` sets the BoxCache properties of the caches bx-orm creates. Keys at the top level apply to every region;
the `regions` struct overrides them for specific regions:

```js
this.ormSettings = {
    secondaryCacheEnabled : true,
    cacheConfig           : {
        // every region
        maxObjects     : 1000,
        defaultTimeout : 3600,
        // per region, by name
        regions        : {
            "countries" : { maxObjects : 300, defaultTimeout : 0 },
            "users"     : { maxObjects : 10000, defaultLastAccessTimeout : 600 }
        }
    }
};
```

A region's final properties are BoxCache's defaults, then the top-level keys, then its `regions` entry. Region names are
matched without regard to case. A configured name also matches a region whose name ends with `.` plus that name, so
`"User"` matches the default region of the `User` entity even without a `cacheName`; when several match, the longest
wins.

The BoxCache properties you will use most (times are in seconds):

| Property                   | Default           | Meaning                                                                  |
| -------------------------- | ----------------- | ------------------------------------------------------------------------ |
| `maxObjects`               | `1000`            | The most entries the cache holds before it evicts.                       |
| `defaultTimeout`           | `3600`            | How long an entry lives. `0` means it never expires.                     |
| `defaultLastAccessTimeout` | `1800`            | How long an entry lives without being read. `0` means no idle timeout.   |
| `evictionPolicy`           | `LRU`             | Which entries go first when the cache is full: `LRU`, `LFU`, `FIFO`, ... |
| `objectStore`              | `ConcurrentStore` | Where entries are kept.                                                  |
| `reapFrequency`            | `120`             | How often expired entries are removed.                                   |

See the BoxLang caching documentation for every BoxCache property.

### From a File

`cacheConfig` can also be the path of a file. A path that does not exist as written is expanded like `expandPath()`.

**A JSON file** has the same shape as the struct:

```json
{
    "maxObjects" : 1000,
    "regions" : {
        "countries" : { "maxObjects" : 300, "defaultTimeout" : 0 }
    }
}
```

**An `ehcache.xml`** from an Adobe ColdFusion or Lucee application keeps working: bx-orm reads it and maps its settings to
BoxCache properties. EHCache itself is not used.

| EHCache 2 (`<defaultCache>`, `<cache name>`)        | EHCache 3 (`<cache alias>`, `<cache-template>`) | BoxCache property          |
| --------------------------------------------------- | ----------------------------------------------- | -------------------------- |
| `maxEntriesLocalHeap` or `maxElementsInMemory`      | `<heap unit="entries">`                         | `maxObjects`               |
| `timeToLiveSeconds`                                 | `<expiry><ttl unit="...">`                      | `defaultTimeout`           |
| `timeToIdleSeconds`                                 | `<expiry><tti unit="...">`                      | `defaultLastAccessTimeout` |
| `eternal="true"`                                    | `<expiry><none/>`                               | both timeouts `0`          |
| `memoryStoreEvictionPolicy` (`CLOCK` becomes `LRU`) |                                                 | `evictionPolicy`           |

In EHCache 2 files `<defaultCache>` becomes the top-level properties and each `<cache name="...">` a region. In EHCache 3
files each `<cache alias="...">` is a region, with `uses-template` values applied first. Disk stores, listeners and
clustering settings are ignored.

```js
this.ormSettings = {
    secondaryCacheEnabled : true,
    cacheConfig           : "config/ehcache.xml"
};
```

## Using Your Own BoxLang Caches

Because every region is a BoxLang cache, you can put a region on any cache you define, with any provider. Name the cache
after the region (the entity's `cacheName`) in `boxlang.json`:

```json
{
    "caches" : {
        "users" : {
            "provider"   : "BoxCacheProvider",
            "properties" : { "maxObjects" : 20000, "defaultTimeout" : 7200 }
        }
    }
}
```

bx-orm finds the `users` cache and uses it for the `users` region, ignoring `cacheConfig` for it. This is also how you
share a region with other code, or put it on a distributed cache.

To put **every** region bx-orm creates on another BoxLang provider, for example one added by a Redis or Couchbase module,
set `cacheProvider` to that provider's registered name. `cacheConfig` then holds that provider's properties:

```js
this.ormSettings = {
    secondaryCacheEnabled : true,
    cacheProvider         : "MyRedisProvider",
    cacheConfig           : { /* properties of that provider */ }
};
```

`BoxCacheProvider` is the default. `ConcurrentHashMap`, `HashTable` and `ehcache` are accepted as aliases for it, for
compatibility with older applications. An unknown provider name raises an error the first time a region is used.

{% hint style="info" %}
Regions are BoxLang caches, and BoxLang caches are shared by the whole runtime. If several applications in one server
cache the same entity names, give their `cacheName`s an application prefix so they do not share regions.
{% endhint %}

## Evicting

Hibernate keeps the cache in step with changes made through the ORM. When data changes outside the ORM (another
application, `queryExecute()`), evict what is stale:

| Function                                                                                                | Evicts                                  |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [`ormEvictEntity( "User" [, id] )`](../reference/built-in-functions/ormevictentity.md)                  | One entity, or every cached `User`.     |
| [`ormEvictCollection( "User", "roles" [, id] )`](../reference/built-in-functions/ormevictcollection.md) | One owner's collection, or all of them. |
| [`ormEvictQueries( [cacheName] )`](../reference/built-in-functions/ormevictqueries.md)                  | A query region, or the default one.     |

You can also clear a region's BoxLang cache directly, for example `cache( "users" ).clearAll()`.

---
description: Turn on the second-level cache and pick where its regions live
icon: layer-group
---

# Secondary Caches

The second-level cache keeps entities, collections and query results across sessions and requests. In bx-orm 2 it is
backed by BoxLang's own BoxCache: every cache region is a BoxLang cache. See [Caching](../../usage/caching.md) for the full
guide, including strategies, collection and query caching, and tuning each region.

## Settings

| Setting                 | Default              | Description                                                                                                                                                                               |
| ----------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `secondaryCacheEnabled` | `false`              | Turns the second-level cache on.                                                                                                                                                          |
| `cacheProvider`         | `"BoxCacheProvider"` | The BoxLang cache provider for the caches bx-orm creates. `ConcurrentHashMap`, `HashTable` and `ehcache` are aliases for BoxCache; any other value must be a registered BoxLang provider. |
| `cacheConfig`           | *empty*              | BoxCache properties for the regions: a struct (top-level keys for every region, `regions` for one region), or the path of a JSON file or an EHCache 2 or 3 `ehcache.xml`.                 |

```js
this.ormSettings = {
    secondaryCacheEnabled : true,
    cacheConfig           : {
        maxObjects : 1000,
        regions    : { "countries" : { defaultTimeout : 0 } }
    }
};
```

A BoxLang cache that already exists with a region's name (for example one defined in `boxlang.json`) is used for that
region as is. See [Using Your Own BoxLang Caches](../../usage/caching.md#using-your-own-boxlang-caches).

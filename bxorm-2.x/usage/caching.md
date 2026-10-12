---
description: Improve your database performance with secondary caching in Hibernate ORM.
icon: memory
---

# Caching

## Secondary Cache

A secondary cache provider is a class which manages a level of caching that is secondary to Hibernate's main caching context - the Hibernate session. A secondary cache enables longer-running cache contexts, more fine-grained control over cache busting, and other performance-related benefits.

The only setting necessary to enable secondary caching is the `secondaryCacheEnabled` setting:

```js
this.ormSettings = {
    secondaryCacheEnabled : true
};
```

Each cache region is backed by a BoxLang cache. To set the properties of those caches, pass a struct in `cacheConfig`. The struct is used when `cacheProvider` names a registered BoxLang cache provider:

```js
this.ormSettings = {
    secondaryCacheEnabled : true,
    cacheProvider         : "myProvider",
    cacheConfig           : { maxObjects : 5000, evictionPolicy : "LRU" }
};
```

{% hint style="warning" %}
`cacheConfig` also accepts a file path, for compatibility. The path is passed to the cache provider, but the file is not read. EHCache XML files (`ehcache.xml`) have no effect in bx-orm 2.0.
{% endhint %}

## Configure Each Entity Cache

Turn on caching per entity with the `cacheUse` annotation. `cacheName` sets the cache region, and `cacheInclude` (`all` or `non-lazy`) sets whether lazy properties are cached too:

```js
class persistent="true" cacheUse="read-write" cacheName="autos" {
    // persistent properties...
}
```

Only entity-level caching is supported. The `cacheUse`, `cacheName` and `cacheInclude` annotations on a property are read, but not applied.

### How the Cache Provider Setting Works

bx-orm bridges Hibernate's JCache (JSR-107) SPI to BoxLang's own `CacheService`, rather than depending on a specific third-party cache library. This means `cacheProvider` selects a **BoxLang cache provider by name**, not a Hibernate/EHCache implementation:

```js
this.ormSettings = {
    secondaryCacheEnabled : true,
    // use the "userCache" provider registered in your CacheBox/CacheService config
    cacheProvider : "userCache"
};
```

- The default, `"BoxCacheProvider"`, uses BoxLang's built-in in-memory cache.
- `"ConcurrentHashMap"` and `"HashTable"` are legacy aliases kept for CFML/Lucee compatibility; both simply resolve to the default BoxLang cache provider.
- Any other value must be the name of a cache provider already registered with BoxLang's `CacheService` (e.g. via CacheBox).
- The provider is resolved the first time a cache region is used, not at startup. An unknown provider name raises an error at that point.

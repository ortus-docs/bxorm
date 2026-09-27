---
description: Inspect the boot cache and generate entity mappings from the command line
icon: terminal
---

# CLI Tools

bx-orm ships two command-line tools:

* [`bxorm`](#bxorm-boot-cache-cli): inspect, validate and clear the `.bxorm/` [boot cache](../usage/performance.md#boot-cache).
* [`GenerateMappings`](#generatemappings): generate each entity's Hibernate mapping without booting an application.

## bxorm: Boot Cache CLI

`bxorm` reads the `.bxorm/` boot cache on disk. It never boots Hibernate or your application.

```bash
boxlang module:orm <verb> [--dir=<path>]
```

The module also declares a `bxorm` executable, so `bxorm <verb>` works where module executables are on the path.

| Verb | What it does |
| --- | --- |
| `info` (default) | The cache header: format and ORM versions, settings fingerprint, entity count, integrity, and whether `facades.jar` is present. |
| `validate` | Integrity and format check. Exits with `1` when the cache is missing, corrupt or edited, so it fits a CI step. |
| `entities` | The entities in the cache, with their class and datasource. |
| `entity <name>` | One entity: class, datasource, source file fingerprint and its mapping XML. The name is case-insensitive. |
| `mappings` | Every entity's Hibernate mapping XML. |
| `clear` | Delete the `.bxorm/` folder. |
| `version` | The module version and the cache format versions. |
| `help` | Usage. Also `-h` and `--help`; `version` also answers to `-v` and `--version`. |

The CLI looks for `.bxorm/` in the current directory. If your application sets `ormManifestLocation`, point the CLI at that folder with `--dir=<path>`.

```text
$ boxlang module:orm info
📦 ORM manifest [/app/.bxorm]
  format version   : 1
  built by ORM     : 2.0.0
  config fingerprint: 20ccab44a96d
  entities         : 2
  integrity        : ✅ checksummed
  facades.jar      : ➖ absent

$ boxlang module:orm validate
✅ ORM manifest at [/app/.bxorm] is valid (2 entities, format 1).

$ boxlang module:orm entities
📦 Entities in the ORM manifest (2):
  • Person  [models.Person]  datasource=appDB
  • Passport  [models.Passport]  datasource=appDB
```

There is no `generate` verb: booting the application with `ormManifest : "auto"` writes the cache.

## GenerateMappings

`GenerateMappings` is a standalone command-line tool for generating Hibernate `.orm.xml` mapping files from your entity classes, without booting a full BoxLang application or web request. It's most useful for:

* Debugging why an entity fails to generate a mapping, in isolation from your application's startup process
* Pre-generating and committing `.orm.xml` files to disk so you can set `generateMappings = false` in production (see [Performance](../usage/performance.md))

It runs the same `MappingGenerator` used internally at ORM startup, so its output matches what your application generates automatically.

### Usage

Run it with both `boxlang.jar` and the bx-orm module jar on the classpath:

```bash
java -cp "boxlang.jar:bx-orm-2.0.0.jar" ortus.boxlang.modules.orm.cli.GenerateMappings --path models
```

This generates a `{entityName}.orm.xml` file alongside each entity class file found under `models`.

### Options

| Option | Description |
| -------- | ------------- |
| `--path PATH` | **Required** (repeatable). Relative path to a directory of entity files to scan. Pass it multiple times to scan more than one directory. |
| `--mapping NAME:PATH` | Registers a BoxLang module/directory mapping (equivalent to a runtime mapping) before scanning, so entity paths that reference it resolve correctly. Repeatable. |
| `--failFast` | Abort mapping generation on the first entity that fails to parse. Without this flag, unparseable entities are skipped (equivalent to `ignoreParseErrors = true`). |
| `--debug` | Enable debug-level logging for the `orm` log category. |

### Example

```bash
java -cp "boxlang.jar:bx-orm-2.0.0.jar" ortus.boxlang.modules.orm.cli.GenerateMappings \
    --path models \
    --path modules/contentbox/models \
    --failFast \
    --debug
```

{% hint style="warning" %}
This tool is intended for local debugging and CI mapping-generation checks. It always generates mappings with `saveMapping = true`, writing `.orm.xml` files directly next to your entity source files.
{% endhint %}

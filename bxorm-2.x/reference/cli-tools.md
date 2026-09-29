---
description: Inspect the boot cache and generate entity mappings from the command line
icon: terminal
---

# CLI Tools

bx-orm ships two command-line tools:

* [`bxorm`](#bxorm-boot-cache-cli): inspect, validate and clear the `.bxorm/` [boot cache](../getting-started/performance.md#boot-cache).
* [`GenerateMappings`](#generatemappings): generate each entity's Hibernate mapping without booting an application.

## bxorm: Boot Cache CLI

`bxorm` reads the `.bxorm/` boot cache on disk. It never boots Hibernate or your application.

```bash
boxlang module:orm <verb> [args] [--app=<name>] [--dir=<path>]
```

The module also declares a `bxorm` executable, so `bxorm <verb>` works where module executables are on the path.

| Verb             | What it does                                                                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `info` (default) | The cache header of each application: format and ORM versions, settings fingerprint, entity count, integrity, and whether the facade jar is present. |
| `validate`       | Integrity and format check of each application's manifest. Exits with `1` when any is missing, corrupt or edited, so it fits a CI step.              |
| `entities`       | The entities in the cache, with their class and datasource.                                                                                          |
| `entity <name>`  | One entity: class, datasource, source file fingerprint and its mapping XML. The name is case-insensitive.                                            |
| `mappings`       | Every entity's Hibernate mapping XML.                                                                                                                |
| `clear`          | Delete an application's cache files. `clear --all` deletes the whole `.bxorm/` folder.                                                               |
| `version`        | The module version and the cache format versions.                                                                                                    |
| `help`           | Usage. Also `-h` and `--help`; `version` also answers to `-v` and `--version`.                                                                       |

| Option         | What it does                                                                                                                                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--app=<name>` | The application to work on: its `this.name` or its slug (`--app="My Shop"` and `--app=my-shop` are the same). Needed when the folder holds [several applications](../getting-started/performance.md#several-applications-in-one-folder). |
| `--all`        | With `clear`: remove every application's cache.                                                                                                                                                                                          |
| `--dir=<path>` | The folder that holds `.bxorm/`. Defaults to the current directory.                                                                                                                                                                      |

The CLI looks for `.bxorm/` in the current directory. If your application sets `ormManifestLocation`, point the CLI at that folder with `--dir=<path>`.

When the folder holds one application, every verb uses it. When it holds several, `info` and `validate` cover all of them, and the other verbs ask you to pick one with `--app`:

```text
$ boxlang module:orm info
📦 ORM manifest [admin] in [/app/.bxorm]
  format version   : 1
  built by ORM     : 2.0.0
  config fingerprint: 20ccab44a96d
  entities         : 2
  integrity        : ✅ checksummed
  facade jar       : ➖ absent

📦 ORM manifest [shop] in [/app/.bxorm]
  format version   : 1
  built by ORM     : 2.0.0
  config fingerprint: 20ccab44a96d
  entities         : 2
  integrity        : ✅ checksummed
  facade jar       : ➖ absent

$ boxlang module:orm validate
✅ ORM manifest [admin] at [/app/.bxorm] is valid (2 entities, format 1).
✅ ORM manifest [shop] at [/app/.bxorm] is valid (2 entities, format 1).

$ boxlang module:orm entities
❌ The ORM boot cache at [/app/.bxorm] holds several applications: admin, shop. Pick one with --app=<name>.

$ boxlang module:orm entities --app=shop
📦 Entities in the ORM manifest [shop] (2):
  • Person  [models.Person]  datasource=appDB
  • Passport  [models.Passport]  datasource=appDB

$ boxlang module:orm clear --app=shop
🧹 Cleared the ORM boot cache of application [shop] at [/app/.bxorm].
```

There is no `generate` verb: booting the application with `ormManifest : "auto"` writes the cache.

## GenerateMappings

`GenerateMappings` is a standalone command-line tool for generating Hibernate `.orm.xml` mapping files from your entity classes, without booting a full BoxLang application or web request. It's most useful for:

* Debugging why an entity fails to generate a mapping, in isolation from your application's startup process
* Pre-generating and committing `.orm.xml` files to disk so you can set `generateMappings = false` in production (see [Performance](../getting-started/performance.md))

It runs the same `MappingGenerator` used internally at ORM startup, so its output matches what your application generates automatically.

### Usage

Run it with both `boxlang.jar` and the bx-orm module jar on the classpath:

```bash
java -cp "boxlang.jar:bx-orm-2.0.0.jar" ortus.boxlang.modules.orm.cli.GenerateMappings --path models
```

This generates a `{entityName}.orm.xml` file alongside each entity class file found under `models`.

### Options

| Option                | Description                                                                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--path PATH`         | **Required** (repeatable). Relative path to a directory of entity files to scan. Pass it multiple times to scan more than one directory.                          |
| `--mapping NAME:PATH` | Registers a BoxLang module/directory mapping (equivalent to a runtime mapping) before scanning, so entity paths that reference it resolve correctly. Repeatable.  |
| `--failFast`          | Abort mapping generation on the first entity that fails to parse. Without this flag, unparseable entities are skipped (equivalent to `ignoreParseErrors = true`). |
| `--debug`             | Enable debug-level logging for the `orm` log category.                                                                                                            |

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

---
description: Inspect the boot cache and generate entity mappings from the command line
icon: terminal
---

# CLI Tools

bx-orm ships two command-line tools:

* [`bxorm`](#bxorm-boot-cache-cli): build, inspect, validate and clear the `.bxorm/` [boot cache](../getting-started/performance.md#boot-cache).
* [`GenerateMappings`](#generatemappings): generate each entity's Hibernate mapping without booting an application.

## bxorm: Boot Cache CLI

`bxorm` builds and reads the `.bxorm/` boot cache on disk. It never boots Hibernate or starts your application.

```bash
boxlang module:orm <verb> [args] [--app=<name>] [--dir=<path>]
```

The module also declares a `bxorm` executable, so `bxorm <verb>` works where module executables are on the path.

| Verb             | What it does                                                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `generate`       | Build the cache (manifest and facade jar) from your `Application.bx` or `Application.cfc`, with no server, database or application start. See [generate](#generate). |
| `info` (default) | The cache header of each application: format and ORM versions, settings fingerprint, entity count, integrity, and whether the facade jar is present.                 |
| `validate`       | Integrity and format check of each application's manifest. Exits with `1` when any is missing, corrupt or edited, so it fits a CI step.                              |
| `entities`       | The entities in the cache, with their class and datasource.                                                                                                          |
| `entity <name>`  | One entity: class, datasource, source file fingerprint and its mapping XML. The name is case-insensitive.                                                            |
| `mappings`       | Every entity's Hibernate mapping XML.                                                                                                                                |
| `clear`          | Delete an application's cache files. `clear --all` deletes the whole `.bxorm/` folder.                                                                               |
| `version`        | The module version and the cache format versions.                                                                                                                    |
| `help`           | Usage. Also `-h` and `--help`; `version` also answers to `-v` and `--version`.                                                                                       |

| Option         | What it does                                                                                                                                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--app=<name>` | The application to work on: its `this.name` or its slug (`--app="My Shop"` and `--app=my-shop` are the same). Needed when the folder holds [several applications](../getting-started/performance.md#several-applications-in-one-folder). |
| `--all`        | With `clear`: remove every application's cache.                                                                                                                                                                                          |
| `--dir=<path>` | Your application root, the folder that holds `Application.bx` and, by default, `.bxorm/`. Defaults to the current directory.                                                                                                             |

The CLI looks for `.bxorm/` in the current directory. If your application sets `ormManifestLocation`, `generate` writes there on its own (it reads your settings), and the other verbs need `--dir=<path>` pointing at that folder.

Every verb exits with `0` on success and `1` on failure, so any of them can gate a build step.

When the folder holds one application, every verb uses it. When it holds several, `info` and `validate` cover all of them, and the other verbs ask you to pick one with `--app`:

```text
$ boxlang module:orm info
📦 ORM manifest [admin] in [/app/.bxorm]
  format version   : 2
  built by ORM     : 2.0.0
  config fingerprint: 20ccab44a96d
  entities         : 2
  integrity        : ✅ checksummed
  facade jar       : ➖ absent

📦 ORM manifest [shop] in [/app/.bxorm]
  format version   : 2
  built by ORM     : 2.0.0
  config fingerprint: 20ccab44a96d
  entities         : 2
  integrity        : ✅ checksummed
  facade jar       : ➖ absent

$ boxlang module:orm validate
✅ ORM manifest [admin] at [/app/.bxorm] is valid (2 entities, format 2).
✅ ORM manifest [shop] at [/app/.bxorm] is valid (2 entities, format 2).

$ boxlang module:orm entities
❌ The ORM boot cache at [/app/.bxorm] holds several applications: admin, shop. Pick one with --app=<name>.

$ boxlang module:orm entities --app=shop
📦 Entities in the ORM manifest [shop] (2):
  • Person  [models.Person]  datasource=appDB
  • Passport  [models.Passport]  datasource=appDB

$ boxlang module:orm clear --app=shop
🧹 Cleared the ORM boot cache of application [shop] at [/app/.bxorm].
```

### generate

`generate` writes the same cache an `ormManifest : "auto"` boot writes, without a server, a database or an application start. Use it in a Docker build or a CI step, so the image ships a cache that `ormManifest : "trust"` boots from:

```bash
cd /app
boxlang --bx-config runtime/boxlang.json module:orm generate
```

```text
✅ Wrote the ORM boot cache for [My Shop]: 40 entities in 2415ms
   /app/.bxorm/manifest-my-shop.json
   /app/.bxorm/facades-my-shop.jar
```

What it does:

1. Loads your `Application.bx` (or `Application.cfc`) and runs its pseudo-constructor, so `this.name`, `this.mappings` and `this.ormSettings` are read exactly as on the server. It never calls `onApplicationStart()`, so your framework does not start and no datasource is opened.
2. Discovers and parses your entities, and writes `manifest-{app}.json` and its checksum.
3. Generates the entity facade classes and writes `facades-{app}.jar`. They are built from your entity metadata only, so no database is needed.

Things to know:

* **Pass the server's runtime config.** Mappings, datasources and modules defined in `boxlang.json` instead of `Application.bx` only exist when the CLI loads the same file: `--bx-config path/to/boxlang.json`.
* **`--dir` is your web root.** While the cache is built, the `/` mapping points at it, as it does on the server.
* **Web scopes are empty.** There is no request, so `cgi`, `url`, `form` and `cookie` exist but are empty. Code in your pseudo-constructor that reads them (`findNoCase( "/api/", cgi.path_info )`) works and sees empty values.
* **Paths are portable.** Entity sources are recorded as BoxLang paths (`/models/Task.cfc`), never as the build machine's folders. A cache built in one place still detects a changed entity wherever it is deployed.

A Docker build step:

```dockerfile
COPY . /app
WORKDIR /app
RUN box install --production \
	&& boxlang --bx-config runtime/boxlang.json module:orm generate
```

Run `generate` again whenever an entity, an ORM setting or the bx-orm version changes; a `trust` boot refuses a stale cache and says what changed.

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

This generates an `.orm.xml` file alongside each entity class file found under `models`, named after the source file (`User.bx` gives `User.orm.xml`).

### Options

| Option                | Description                                                                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--path PATH`         | **Required** (repeatable). Relative path to a directory of entity files to scan. Pass it multiple times to scan more than one directory.                          |
| `--mapping NAME:PATH` | Registers a BoxLang module/directory mapping (equivalent to a runtime mapping) before scanning, so entity paths that reference it resolve correctly. Repeatable.  |
| `--failFast`          | Abort mapping generation on the first entity that fails to parse. Without this flag, unparseable entities are skipped (equivalent to `ignoreParseErrors = true`). |
| `--debug`             | Print the ORM's debug logging (entity scanning and mapping generation details) while the command runs.                                                            |

### Example

```bash
java -cp "boxlang.jar:bx-orm-2.0.0.jar" ortus.boxlang.modules.orm.cli.GenerateMappings \
    --path models \
    --path modules/contentbox/models \
    --failFast
```

{% hint style="warning" %}
This tool is intended for local debugging and CI mapping-generation checks. It always generates mappings with `saveMapping = true`, writing `.orm.xml` files directly next to your entity source files.
{% endhint %}

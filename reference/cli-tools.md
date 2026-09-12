---
description: Command-line tooling for debugging entity mapping generation
---

# CLI Tools

## GenerateMappings

`GenerateMappings` is a standalone command-line tool for generating Hibernate `.hbm.xml` mapping files from your entity classes, without booting a full BoxLang application or web request. It's most useful for:

* Debugging why an entity fails to generate a mapping, in isolation from your application's startup process
* Pre-generating and committing `.hbm.xml` files to disk so you can set `generateMappings = false` in production (see [Performance](../usage/performance.md))

It runs the same `MappingGenerator` used internally at ORM startup, so its output matches what your application generates automatically.

### Usage

Run it with both `boxlang.jar` and the bx-orm module jar on the classpath:

```bash
java -cp "boxlang.jar:bx-orm-1.6.8.jar" ortus.boxlang.modules.orm.cli.GenerateMappings --path models
```

This generates a `{entityName}.hbm.xml` file alongside each entity class file found under `models`.

### Options

| Option | Description |
|--------|-------------|
| `--path PATH` | **Required** (repeatable). Relative path to a directory of entity files to scan. Pass it multiple times to scan more than one directory. |
| `--mapping NAME:PATH` | Registers a BoxLang module/directory mapping (equivalent to a runtime mapping) before scanning, so entity paths that reference it resolve correctly. Repeatable. |
| `--failFast` | Abort mapping generation on the first entity that fails to parse. Without this flag, unparseable entities are skipped (equivalent to `ignoreParseErrors = true`). |
| `--debug` | Enable debug-level logging for the `orm` log category. |

### Example

```bash
java -cp "boxlang.jar:bx-orm-1.6.8.jar" ortus.boxlang.modules.orm.cli.GenerateMappings \
    --path models \
    --path modules/contentbox/models \
    --failFast \
    --debug
```

{% hint style="warning" %}
This tool is intended for local debugging and CI mapping-generation checks. It always generates mappings with `saveMapping = true`, writing `.hbm.xml` files directly next to your entity source files.
{% endhint %}

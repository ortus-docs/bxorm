---
description: Install bx-orm with CommandBox or the BoxLang module installer
icon: download
---

# Installation

## Requirements

* BoxLang 1.18.0 or later
* Java 21 or later
* A JDBC driver module for your database (for example `bx-mysql`, `bx-postgresql` or `bx-derby`)

## CommandBox

If you're using CommandBox to manage your BoxLang server, it's as easy as running `install bx-orm`:

```
box install bx-orm
```

You may need to install `bx-compat-cfml` as well for backwards-compatible ORM behaviors:

```
box install bx-orm bx-compat-cfml
```

## install-bx-module

For miniserver usage outside of CommandBox, use the `install-bx-module` CLI command:

```
install-bx-module bx-orm
```

## Staying on 1.x

bx-orm 2.0 is a major upgrade. To keep an application on the 1.x line, pin the major version:

```bash
box install bx-orm@1
```

Read [Upgrading to 2.0.0](../release-history/upgrading-to-2.0.0.md) before you move to 2.0.

Future pre-releases are published from the `next` branch.

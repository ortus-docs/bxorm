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

Note that bx-orm currently only supports the web runtime.

## Trying a Pre-Release

Before 2.0.0 is final, pre-releases are published for testing: `2.0.0-beta.1`, `2.0.0-beta.2`, and so on (later `2.0.0-rc.1`). A plain `install bx-orm` keeps installing the latest stable release, so you only get a pre-release by asking for its version:

```bash
# CommandBox
box install bx-orm@2.0.0-beta.1

# BoxLang module installer
install-bx-module bx-orm@2.0.0-beta.1
```

The list of pre-releases, with their release notes, is on the [GitHub releases page](https://github.com/ortus-boxlang/bx-orm/releases). Pre-releases are for testing, not production. Please report what you find on the [issue tracker](https://ortussolutions.atlassian.net/browse/BLMODULES), and read [Upgrading to 2.0.0](../release-history/upgrading-to-2.0.0.md) before you start.

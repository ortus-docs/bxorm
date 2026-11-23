---
description: Get up and running in seconds!
---

# Installation

### CommandBox

If you're using CommandBox to manage your BoxLang server, it's as easy as running `install bx-orm`:

```
box install bx-orm
```

You may need to install `bx-compat-cfml` as well for backwards-compatible ORM behaviors:

```
box install bx-orm bx-compat-cfml
```

### bx-module

For the BoxLang runtime or MiniServer outside of CommandBox, use the `bx-module` command from the BoxLang installer:

```
bx-module install bx-orm
```

Note that bx-orm currently only supports the web runtime.

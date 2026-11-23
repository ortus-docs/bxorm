---
title: Building with AI
summary: Teach your AI coding assistant how BxORM really works with the seven BxORM skills and the docs MCP server, then build a feature from a prompt.
icon: phosphor-duotone:robot
tags: [course]
---

AI coding assistants know Hibernate and a lot of CFML, but BxORM 2 is newer than most of what they learned from. Ask one for an entity and you may get an old attribute style, a setting that was renamed, or a function that doesn't exist. **Skills** fix that. A skill is a short, focused guide the assistant loads when your request needs it.

## The seven BxORM skills

| Skill                  | It teaches the assistant                                                 |
| ---------------------- | ------------------------------------------------------------------------ |
| `bx-orm-configuration` | `ormSettings`, datasources, `dbcreate`, dialects, naming, the boot cache |
| `bx-orm-entities`      | Entity annotations, tables, ids, soft delete, static entity methods      |
| `bx-orm-relationships` | One-to-one to many-to-many, inverse, lazy loading, cascades              |
| `bx-orm-querying`      | The `entityLoad` family, HQL with `ormExecuteQuery()`, paging            |
| `bx-orm-criteria`      | `entityCriteria()`: conditions, joins, projections, bulk changes         |
| `bx-orm-transactions`  | `transaction {}`, flushing, mixing ORM and `queryExecute()`              |
| `bx-orm-observability` | `onORMQuery` and friends, slow SQL, statistics, `ormDiagnostics()`       |

Browse them at [skills.boxlang.io](https://skills.boxlang.io), or read the source in [ortus-boxlang/skills](https://github.com/ortus-boxlang/skills).

## Install them

Pick the tool you already use.

**The skills CLI** works with most assistants (Claude Code, Cursor, Codex, Copilot and more):

```bash
# All seven BxORM skills
npx skills add ortus-boxlang/skills/boxlang-modules/bx-orm

# Or just one
npx skills add ortus-boxlang/skills/boxlang-modules/bx-orm/bx-orm-criteria
```

**Claude Code** gets every BoxLang skill as one plugin:

```bash
claude plugin marketplace add ortus-boxlang/skills
claude plugin install boxlang-agent-skills@boxlang-agent-skills
```

**Codex** works the same way:

```bash
codex plugin marketplace add ortus-boxlang/skills
codex plugin add boxlang-agent-skills@boxlang-agent-skills
```

**ColdBox CLI** sets up a whole ColdBox project for AI, then adds skills:

```bash
# Guidelines, agent files and documentation MCP servers
coldbox ai install agent=claude,copilot

# Pick the bx-orm-* skills from a list
coldbox ai skills install --list

# Or one skill by its full path
coldbox ai skills install ortus-boxlang/skills/boxlang-modules/bx-orm/bx-orm-criteria

# The cborm skill (added for you when cborm is in box.json)
coldbox ai skills install coldbox/skills/modules/cborm
```

## Add the docs MCP server

Skills carry the essentials. For everything else, give your assistant the full BxORM documentation through its MCP server:

```text
https://bxorm.ortusbooks.com/~gitbook/mcp
```

Add it in your assistant's MCP settings, or with the ColdBox CLI:

```bash
coldbox ai mcp add name=bxorm url=https://bxorm.ortusbooks.com/~gitbook/mcp
```

## Build a feature from a prompt

With the skills installed, describe what you want in plain words. Some prompts for the blog, and the skill that answers each:

| Prompt                                                                                     | Skill                                     |
| ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| "Add a Comment entity: a post has many comments, a comment has an author, soft delete on." | `bx-orm-entities`, `bx-orm-relationships` |
| "Page the published posts tagged orm, ten at a time, newest first, as JSON."               | `bx-orm-criteria`                         |
| "Publish a post and write an audit row in the same transaction."                           | `bx-orm-transactions`                     |
| "Build the boot cache in our Dockerfile and trust it in production."                       | `bx-orm-configuration`                    |
| "Why is the home page running forty queries?"                                              | `bx-orm-observability`                    |

## Good habits

- **Read what it wrote.** Check the annotations against lesson 3 and the relationships against lesson 6. You know enough now to spot a wrong one.
- **Run it.** Start the app with `dbcreate : "update"` and `logSQL : true`, and look at the tables and the SQL.
- **Test it.** Ask for a spec too, in the style of lesson 14, and run it.
- **Keep the skills current.** Skills improve with each release, so update them now and then (`npx skills update`, or re-install the plugin).

## Try it

- Install the BxORM skills in the blog project with the tool you use.
- Ask your assistant for the `Comment` entity above. Review it, run it and fix anything that is off.
- Add the docs MCP server, then ask a question the skills don't cover, such as "how do I register a named SQL function?"

## Learn more

- [BxORM skills on skills.boxlang.io](https://skills.boxlang.io)
- [ortus-boxlang/skills on GitHub](https://github.com/ortus-boxlang/skills)
- [BxORM documentation](https://bxorm.ortusbooks.com/bxorm-2.x/)

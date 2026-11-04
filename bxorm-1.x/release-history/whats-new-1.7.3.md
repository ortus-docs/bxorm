---
description: What's new in bx-orm 1.7.3, HQL through the query component and typed values from forms and URLs
icon: wand-magic-sparkles
---

# What's New in 1.7.3

bx-orm 1.7.3 is a fix release for the 1.x line (Hibernate 5). It lets the query component and `queryExecute()` run HQL, and stops typed properties from failing when their value arrives as a string, such as an id from a form or a URL. There are no breaking changes. Update the module and your code keeps working.

```bash
box install bx-orm@1.7.3
```

## HQL in the Query Component and queryExecute()

[BLMODULES-306](https://ortussolutions.atlassian.net/browse/BLMODULES-306)

`<bx:query>` (`<cfquery>` in CFML templates) and `queryExecute()` now run HQL when you set `dbtype="hql"`. They return the same result as [ORMExecuteQuery](../reference/built-in-functions/ormexecutequery.md): an array of entities, or an array of rows for a projection. Before 1.7.3 the `dbtype` was ignored, so the HQL ran as SQL against the default datasource and returned a query or a SQL error.

```html
<bx:query name="toyotas" dbtype="hql">
    FROM Auto WHERE make = <bx:queryparam value="#form.make#" sqltype="varchar">
</bx:query>
```

```js
var toyotas = queryExecute(
    "FROM Auto WHERE make = :make",
    { make: "Toyota" },
    { dbtype: "hql" }
);
```

* `<bx:queryparam>` (`<cfqueryparam>`) in the body binds a positional parameter. With a `sqltype` (`cfsqltype`) the value is cast first, and `list="true"` binds a list for `IN ( ... )`.
* `params` binds named (struct) or positional (array) parameters, as in `ORMExecuteQuery()`.
* `ormoptions` takes the `ORMExecuteQuery()` [options](../usage/querying.md#options), such as `maxResults`, `offset`, `readOnly` and `unique`. `maxrows`, `timeout` and `datasource` apply too.
* `result` gets a struct with `sql` (the HQL), `recordCount`, `executionTime` and `cached`.

Without `dbtype="hql"`, both run SQL exactly as before. See [HQL in the Query Component](../usage/querying.md#hql-in-the-query-component-and-queryexecute).

## Typed Values from Forms and URLs

[BLMODULES-307](https://ortussolutions.atlassian.net/browse/BLMODULES-307)

Form and URL values are always strings, and BoxLang arithmetic produces decimals. Before 1.7.3, binding one of them to a typed property failed, because Hibernate 5 binds values as they are:

```text
class java.lang.String cannot be cast to class java.lang.Integer
```

bx-orm now converts each value to the property's mapped type before Hibernate binds it, so this code works:

```js
// A string id from the URL
var user = entityLoad( "User", { id: url.id }, true );

// Named, positional and list parameters
var users  = ormExecuteQuery( "FROM User WHERE id = :id", { id: url.id } );
var admins = ormExecuteQuery( "FROM User WHERE id IN (:ids)", { ids: listToArray( form.ids ) } );
```

```html
<!--- An untyped queryparam in an HQL query --->
<bx:query name="user" dbtype="hql">
    FROM User WHERE id = <bx:queryparam value="#url.id#">
</bx:query>
```

The conversion covers `entityLoad()` filters and every HQL parameter: `ORMExecuteQuery()`, `dbtype="hql"` queries, untyped `<bx:queryparam>` and list parameters.

| Property type | Accepted values |
| --- | --- |
| Whole numbers (`integer`, `long`, `short`, `biginteger`) | Numbers and numeric strings with no fractional part: `"1"`, `" 1 "`, `"1.0"`, `1.0` |
| Decimals (`double`, `float`, `bigdecimal`) | Numbers and numeric strings: `"2.5"` |
| `boolean` | Booleans, numbers and boolean strings: `"true"`, `"yes"`, `0` |
| `string` | Numbers and booleans |

A value that does not fit the type is passed to Hibernate unchanged and fails as before. For example, `"1.5"` is never truncated to `1` for an integer property, and `"abc"` still fails. `entityLoadByPK()` and a `<bx:queryparam>` with a `sqltype` already converted their values and work as before.

## Also in 1.7

If you are coming from an earlier 1.x release, these arrived earlier in the 1.7 line:

* **1.7.2**:
  * value collections with `fieldtype="collection"` (arrays and structs of simple values in their own table);
  * ORM observability events (`onORMQuery`, `onORMFlush`, `onORMException`) and Hibernate statistics. See [Observability](../usage/observability.md).
* **1.7.1**: `entityToQuery()` no longer adds always-`null` columns for relationship properties. See [Entities as Queries](../usage/queries.md).
* **1.7.0**:
  * [EntityIsAttached](../reference/built-in-functions/entityisattached.md);
  * raw Hibernate properties through `hibernateProperties` and `ormConfig`. See [Custom Hibernate Config](../getting-started/configuration/custom-hibernate-config.md);
  * SQLite support;
  * the `uuid2` generator.

The full list is in the [1.x release notes](1x.md).

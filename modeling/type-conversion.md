---
description: How BoxLang's dynamic types are bridged to JDBC column types
---

# Type Conversion

BoxLang is dynamically typed, but JDBC and Hibernate expect a specific Java type for every column. bx-orm bridges the two using a set of built-in JPA `AttributeConverter` classes, applied automatically based on each property's `ormType`.

## How It Works

When bx-orm generates the Hibernate mapping XML for a property, it normalizes the property's `ormType` value (folding aliases like `big_decimal`/`bigdecimal`, or `date`/`datetime`, down to a canonical name) and, for most properties, wires up a matching converter:

| `ormType` values (aliases folded) | Canonical type | Converter used |
|---|---|---|
| `string`, `varchar`, `nvarchar` | `string` | `StringConverter` |
| `bigdecimal`, `big_decimal`, `big-decimal` | `bigdecimal` | `BigDecimalConverter` |
| `biginteger`, `big_integer`, `big-integer`, `bigint` | `biginteger` | `BigIntegerConverter` |
| `integer`, `int` | `integer` | `IntegerConverter` |
| `long` | `long` | `LongConverter` |
| `tinyint`, `tinyinteger` | `short` | `ShortConverter` |
| `numeric`, `number`, `decimal` | `double` | `DoubleConverter` |
| `float` | `float` | `FloatConverter` |
| `bit`, `bool` | `boolean` | `BooleanConverter` |
| `yes-no`, `yesno`, `yes_no` | `yes_no` | `BooleanConverter` |
| `true-false`, `truefalse`, `true_false` | `true_false` | `BooleanConverter` |
| `eurodate`, `usdate`, `date`, `datetime` | `timestamp` | `DateTimeConverter` |
| `time` | `time` | `TimeConverter` |
| `blob`, `byte[]` | `binary` | *(none - stored as raw binary)* |
| `char`, `nchar` | `character` | *(none - stored as a single character)* |
| `clob` | `text` | *(none - stored as text)* |

Each converter's job is to translate a BoxLang dynamic value into the JDBC type Hibernate expects on the way into the database, and back into a BoxLang-friendly value on the way out - using BoxLang's own type casters (e.g. `DateTimeCaster`, so a `DateTime` object round-trips correctly regardless of what dynamic type was assigned to the property in memory).

{% hint style="info" %}
**Identifier and version properties skip converters.** A property with `fieldtype="id"` or `fieldtype="version"` is written using its plain Hibernate basic type, not one of the converters above. This keeps primary key and optimistic-locking columns on Hibernate's native type handling.
{% endhint %}

## Custom Converters

There is currently no supported mechanism for registering your own `AttributeConverter` for a property - the converters above are applied automatically based on `ormType` and cover the standard Hibernate basic types. If you need a database column type not covered here, use `sqlType` to control the generated DDL, or reach for a [custom Hibernate config](../intro/configuration/custom-hibernate-config.md) / `hibernateProperties` for engine-level tuning.

See [Properties](properties.md#orm-type) for the full list of `ormType` values you can set on a property.

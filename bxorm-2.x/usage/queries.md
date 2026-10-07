---
description: Turn entities into a BoxLang query for reports, grids and exports
icon: table
---

# Entities as Queries

When code expects a BoxLang `Query` object (a report, a data grid, a CSV export, `queryExecute()`-style helpers), convert your entities with [entityToQuery()](../reference/built-in-functions/entitytoquery.md):

```js
vehicles    = entityLoad( "Vehicle", { make : "Ford" } );
qryVehicles = entityToQuery( vehicles );

// one entity gives a one-row query
qryVehicle = entityToQuery( entityLoadByPK( "Vehicle", "1HGCM82633A123456" ) );
```

## What goes in the query

One row per entity, one column per **plain persistent property**:

| Included                                                                  | Not included                                                              |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| The id property                                                           | Relationships: `one-to-one`, `one-to-many`, `many-to-one`, `many-to-many` |
| Column properties                                                         | Non-persistent properties (`persistent="false"`)                          |
| Version and timestamp properties                                          |                                                                           |
| Properties inherited from a persistent parent entity or mapped superclass |                                                                           |

{% hint style="warning" %}
**The result query will not contain any relation data.** Relationship properties do not appear as columns at all, not even as empty ones, and no association is loaded. This matches Adobe ColdFusion and Lucee.
{% endhint %}

Given this entity:

```js
class persistent="true" entityName="Vehicle" {
    property name="vin" fieldtype="id" generator="assigned";
    property name="make";
    property name="model";
    property name="manufacturer" fieldtype="many-to-one" cfc="Manufacturer" fkcolumn="FK_manufacturer";
    property name="features" fieldtype="many-to-many" cfc="Feature" linktable="vehicle_features";
}
```

`entityToQuery( vehicles )` returns the columns `vin`, `make` and `model`. There is no `manufacturer` or `features` column.

## Arrays and the entity name

* An array becomes one row per entity. All entities in the array must be of the same type.
* The entity name is read from the first entity. Pass it as the second argument to skip that lookup, or to pick the entity whose columns you want with inheritance mappings.
* An empty array with an entity name gives an empty query with that entity's columns. Without a name it gives an empty query with a single `id` column.

```js
qry = entityToQuery( entityLoad( "Vehicle", { make : "Honda" } ), "Vehicle" );
qry = entityToQuery( [], "Vehicle" ); // 0 rows, columns vin, make, model
```

## Need related data?

Use a projection query instead, and select the related values as columns. [entityCriteria()](criteria.md) joins dotted paths for you and returns a query with `asQuery()`:

```js
qry = entityCriteria( "Vehicle" )
    .isEq( "make", "Ford" )
    .project( ( p ) => p.property( "vin" ).property( "model" ).property( "manufacturer.name", "manufacturer" ) )
    .asQuery()
    .list();
```

For JSON and views that need nested relationships, use [Entities as Structs](structs.md): `entityToStruct()` and `entityLoadAsStruct()` take `includes` such as `"manufacturer.name,features"`.

## Related

* [entityToQuery()](../reference/built-in-functions/entitytoquery.md)
* [Entities as Structs](structs.md)
* [Criteria Queries](criteria.md)
* [Querying](querying.md)

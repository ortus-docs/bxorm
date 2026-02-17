# Naming Strategies

Boxlang ORM provides flexible naming strategies to control how entity and property names are mapped to database tables and columns. This allows you to easily customize schema, table, column and other physical names to match your database conventions without having to change your source code.

## Predefined Naming Strategies

Boxlang ORM includes the following built-in naming strategies:

- **default**: No conversion is performed. Entity and property names are mapped to table and column names exactly as defined in your code.

- **smart**: Applies a smart conversion:
  - All names are forced to uppercase.
  - camelCase names are automatically separated with underscores. For example, `userProfile` becomes `USER_PROFILE`.

## Custom Naming Strategies

Need something else? Try a custom naming strategy. This allows you to implement your own logic for converting entity and property names to table and column names.

```js
this.ormSettings = {
	// ...
	namingStrategy : "models.orm.UnderscoreNamingStrategy"
}
```

The naming strategy may implement [the `INamingStrategy` interface](https://github.com/ortus-boxlang/bx-orm/blob/development/src/main/bx/models/INamingStrategy.bx#L23), or you may omit the declaration and simply provide a class with the appropriate methods. The following methods are supported:

* `public string function getTableName( string tableName )`
* `public string function getColumnName( string columnName )`
* `public string function getCatalogName( string catalogName )`
* `public string function getSchemaName( string schemaName )`
* `public string function getSequenceName( string sequenceName )`
---
description: Build your first entity and save, load, query and delete it in five minutes
icon: bolt
---

# Quick Start

This page takes you from an empty application to saving, loading and querying your first entity. Each step links to the page that covers it in depth.

## 1. Install the Module

Install bx-orm and the JDBC driver module for your database. This guide uses MySQL:

```bash
box install bx-orm bx-mysql
```

See [Installation](installation.md) for other ways to install.

## 2. Configure the Application

Define a datasource and turn on the ORM in your `Application.bx`:

```js
class {

    this.name = "quickstart";

    this.datasources = {
        appDB : {
            driver   : "mysql",
            host     : "localhost",
            port     : 3306,
            database : "quickstart",
            username : "root",
            password : ""
        }
    };
    this.datasource = "appDB";

    this.ormEnabled  = true;
    this.ormSettings = {
        // Where your entities live
        entityPaths   : [ "models" ],
        // Create and update tables from your entities (development only)
        dbcreate      : "update",
        // Fire entity events such as preInsert()
        eventHandling : true
    };
}
```

`dbcreate : "update"` creates the tables for you, which is handy while you learn. See [Configuration](configuration.md) for every setting.

## 3. Create an Entity

An entity is a BoxLang class marked `persistent="true"`. Each property is a column. Create `models/User.bx`:

```js
class persistent="true" table="users" defaultSort="lastName" {

    property name="id"          fieldtype="id" generator="native" ormtype="integer";
    property name="firstName"   ormtype="string";
    property name="lastName"    ormtype="string";
    property name="email"       ormtype="string" unique="true";
    property name="createdDate" ormtype="timestamp" autoTimestamp="create";

    function getFullName(){
        return getFirstName() & " " & getLastName();
    }
}
```

bx-orm generates the getters and setters (`getEmail()`, `setEmail()`, ...) for you. See [Entities](../modeling/entities.md) and [Properties](../modeling/properties.md).

## 4. Save

Create entities with `entityNew()` and save them with `entitySave()` inside a `transaction`. The transaction commits the insert when it ends:

```js
transaction {
    var ann = entityNew( "User", {
        firstName : "Ann",
        lastName  : "Lee",
        email     : "ann@example.com"
    } );
    entitySave( ann );
}

println( ann.getId() ); // the id the database generated
```

## 5. Load

```js
// By primary key: null when there is no such row
var user = entityLoadByPK( "User", 1 );

// By primary key, or throw orm.notFound
var user = entityLoadByPKOrFail( "User", 1 );

// All users, in the entity's defaultSort order
var users = entityLoad( "User" );

// A filter, a sort and paging
var lees = entityLoad( "User", { lastName : "Lee" }, "firstName asc", { maxResults : 10 } );
```

## 6. Query

For anything beyond a simple filter, use `entityCriteria()`:

```js
var recent = entityCriteria( "User" )
    .like( "email", "%@example.com" )
    .isGt( "createdDate", dateAdd( "d", -7, now() ) )
    .order( "lastName" )
    .list();
```

Or write HQL, Hibernate's object query language, with `ormExecuteQuery()`:

```js
var total = ormExecuteQuery( "select count(*) from User where lastName = :name", { name : "Lee" }, true );
```

See [Criteria Queries](../usage/criteria.md) and [Queries and HQL](../usage/querying.md).

## 7. Return It as JSON

`entityToStruct()` turns entities into plain structs, ready for an API response:

```js
return entityToStruct( users, { includes : "fullName" } );
// [ { id : 1, firstName : "Ann", lastName : "Lee", email : "ann@example.com", createdDate : "2026-09-27T10:20:30Z", fullName : "Ann Lee" } ]
```

See [Entities as Structs](../usage/structs.md).

## 8. Update and Delete

A loaded entity is watched by the ORM: change it inside a transaction and the change is saved when the transaction commits.

```js
transaction {
    var user = entityLoadByPKOrFail( "User", 1 );
    user.setEmail( "ann.lee@example.com" );
}

transaction {
    entityDelete( entityLoadByPK( "User", 1 ) );
}
```

## Next Steps

* [Working with Entities](../usage/working-with-entities.md): every way to create, load, save and delete.
* [Relationships](../modeling/relationships.md): connect entities to each other.
* [Transactions](../usage/transactions.md): how the ORM shares BoxLang's `transaction{}`.
* [Events](../usage/events.md): react when entities are inserted, updated or deleted.
* [Errors and Diagnostics](../usage/errors-and-diagnostics.md): read ORM errors and check the ORM's state.

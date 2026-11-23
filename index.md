---
title: BxORM
order: 1
description: BxORM is the ORM framework for BoxLang. Map BoxLang classes to tables and work with rows as objects, on Hibernate 7.
icon: phosphor-duotone:database
toc: false
layout: home
---

BxORM is a whole framework on top of Hibernate 7, built for a dynamic language. Write a BoxLang class, get a table, then save, load and query rows as objects with static helpers, fluent criteria, automatic type conversion and errors written for humans. No XML, no Java classes, no casting.

```js
// models/User.bx
@persistent
@table( "users" )
class {

    @fieldtype( "id" )
    @generator( "native" )
    property id;

    @ormtype( "string" )
    @unique
    @notNull
    property email;

    @ormtype( "timestamp" )
    @autoTimestamp( "create" )
    property createdDate;
}
```

- [Read the docs](https://bxorm.ortusbooks.com/bxorm-2.x/)
- [Quick start](https://bxorm.ortusbooks.com/bxorm-2.x/getting-started/quick-start)
- [Learn BxORM, the free course](course/index.md)

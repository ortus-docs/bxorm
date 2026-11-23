---
title: Testing ORM code
summary: Test your entities and queries with TestBox, against a test database that resets itself, with every spec rolled back.
icon: phosphor-duotone:test-tube
tags: [course]
---

ORM code talks to a database, so its tests should too. In this lesson you set up [TestBox](https://testbox.ortusbooks.com) for the blog, with a test database of its own and specs that leave no data behind.

## Install TestBox

```bash
box install testbox --saveDev
```

This puts TestBox in a `testbox` folder in your project.

## A test application

Tests get their own `Application.bx` in a `tests` folder. It loads the blog's entities but points at a **separate database**, so tests never touch real data:

```text
blog/
├── Application.bx
├── models/
├── testbox/
└── tests/
    ├── Application.bx
    ├── runner.bxm
    └── specs/
        └── PostSpec.bx
```

```boxlang title="tests/Application.bx"
class {

    this.name = "blogTests";

    // The tests folder, and the blog app one folder up
    variables.testsDir = getDirectoryFromPath( getCurrentTemplatePath() );
    this.mappings[ "/tests" ]   = testsDir;
    this.mappings[ "/blog" ]    = testsDir & "../";
    this.mappings[ "/testbox" ] = testsDir & "../testbox/";

    this.datasources = {
        blog : {
            driver   : "mysql",
            host     : "localhost",
            port     : 3306,
            database : "blog_tests",
            username : "root",
            password : ""
        }
    };
    this.datasource = "blog";

    this.ormEnabled  = true;
    this.ormSettings = {
        entityPaths   : [ "/blog/models" ],
        // A fresh schema every time the test app starts
        dbcreate      : "dropcreate",
        eventHandling : true
    };
}
```

`dbcreate : "dropcreate"` rebuilds the tables from your entities when the test app starts, so the schema always matches your code.

Copy TestBox's runner into the tests folder:

```bash
cp testbox/tests/runner.bxm tests/runner.bxm
```

## A first spec

```boxlang title="tests/specs/PostSpec.bx"
class extends="testbox.system.BaseSpec" {

    function run() {
        describe( "Posts", () => {

            beforeEach( () => {
                // Start each spec with an empty session
                ormClearSession();
            } );

            it( "saves a post with its author", () => {
                transaction {
                    var author = entityNew( "User", { email : "spec@example.com", name : "Spec" } );
                    entitySave( author );
                    var entry = entityNew( "Post", { title : "From a spec", author : author } );
                    entitySave( entry );
                    ormFlush();

                    expect( entry.getId() ).toBeNumeric();
                    expect( entityCriteria( "Post" ).isEq( "author", author ).count() ).toBe( 1 );

                    // Leave the database as it was
                    transactionRollback();
                }
            } );

            it( "refuses a duplicate email", () => {
                // A new email on every run, since this user is committed
                var email = "dup-#createUUID()#@example.com";
                transaction {
                    entitySave( entityNew( "User", { email : email, name : "First" } ) );
                }
                expect( () => {
                    transaction {
                        entitySave( entityNew( "User", { email : email, name : "Copy" } ) );
                    }
                } ).toThrow( "orm.constraint.unique" );
            } );
        } );
    }
}
```

Three habits make ORM specs reliable:

- **`ormClearSession()` before each spec.** Every spec starts with no loaded entities, so one spec's objects never leak into the next.
- **`ormFlush()` before you assert.** It sends the SQL now, inside the transaction, so constraints and generated ids are real.
- **`transactionRollback()` at the end.** The spec sees its data, and the database forgets it.

`toThrow( "orm.constraint.unique" )` works because every ORM error has a precise type (lesson 11).

## Run the specs

The runner runs inside your app, so start a server from the `blog` folder, for example the BoxLang MiniServer:

```bash
boxlang-miniserver --port 8080
```

Then open `http://localhost:8080/tests/runner.bxm`, or ask for plain text:

```bash
curl "http://localhost:8080/tests/runner.bxm?reporter=text"
```

```text
( √ ) Posts
    ( √ ) saves a post with its author
    ( √ ) refuses a duplicate email

[Passed: 2] [Failed: 0] [Errors: 0] [Skipped: 0]
```

## What to test

- **Mappings.** Save and reload each entity once. A wrong annotation fails fast here.
- **Your queries.** Criteria and HQL in your services, with a few rows of known data.
- **Rules.** Events, vetoes and soft delete, since they change what is saved.

Skip testing Hibernate itself. You don't need a spec proving that `entitySave()` saves.

## Try it

- Add a spec for `searchPosts()` from lesson 7: save three posts, search, and check the count.
- Add a spec proving a published post cannot be deleted (lesson 10).
- Remove `transactionRollback()` from a spec, run it twice, and see why it matters.

## Learn more

- [TestBox documentation](https://testbox.ortusbooks.com)
- [Transactions](https://bxorm.ortusbooks.com/bxorm-2.x/working-with-entities/transactions)
- [Errors and diagnostics](https://bxorm.ortusbooks.com/bxorm-2.x/advanced/errors-and-diagnostics)

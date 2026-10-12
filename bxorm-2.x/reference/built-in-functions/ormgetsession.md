---
description: Get the Hibernate Session for a datasource
---

# ORMGetSession

Retrieve the Hibernate Session configured for this datasource or default datasource.

{% hint style="info" %}
The returned Session is a wrapper that knows about BoxLang entities. You can pass BoxLang entity names and instances to its Hibernate API, such as `detach()`, `evict()`, `contains()` and `get()`. The API is Hibernate 7, not Hibernate 5.

A call on an entity the session does not hold still throws `org.hibernate.TransientObjectException`, as Hibernate 5 did, so existing code that checks for new entities keeps working.
{% endhint %}

## Method Signature

```
ORMGetSession(datasource=[String])
```

### Arguments


| Argument     | Type     | Required | Description                                                                                                             | Default |
| ------------ | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ------- |
| `datasource` | `String` | `false`  | The name of the datasource to retrieve the Session for. If not specified, the Application's default datasource is used. |         |

## Examples

Retrieve the ORM session for the default datasource:

```java
session = ormGetSession();
```

Retrieve the ORM session for the "admin" datasource:

```java
session = ormGetSession( "admin" );
```

## Related

* [EntityCriteria](entitycriteria.md)
* [EntityDelete](entitydelete.md)
* [EntityEvict](entityevict.md)
* [EntityGetDatasource](entitygetdatasource.md)
* [EntityGetDirtyProperties](entitygetdirtyproperties.md)
* [EntityGetId](entitygetid.md)
* [EntityGetMetadata](entitygetmetadata.md)
* [EntityGetName](entitygetname.md)
* [EntityGetReference](entitygetreference.md)
* [EntityIsAttached](entityisattached.md)
* [EntityIsDirty](entityisdirty.md)
* [EntityLoad](entityload.md)
* [EntityLoadAsStruct](entityloadasstruct.md)
* [EntityLoadByExample](entityloadbyexample.md)
* [EntityLoadByPK](entityloadbypk.md)
* [EntityLoadByPKOrFail](entityloadbypkorfail.md)
* [EntityLoadOrFail](entityloadorfail.md)
* [EntityLoadOrNew](entityloadornew.md)
* [EntityLoadOrSave](entityloadorsave.md)
* [EntityLoadReadOnly](entityloadreadonly.md)
* [EntityLock](entitylock.md)
* [EntityMerge](entitymerge.md)
* [EntityNameArray](entitynamearray.md)
* [EntityNameList](entitynamelist.md)
* [EntityNew](entitynew.md)
* [EntityReload](entityreload.md)
* [EntitySave](entitysave.md)
* [EntityToQuery](entitytoquery.md)
* [EntityToStruct](entitytostruct.md)
* [ORMClearSession](ormclearsession.md)
* [ORMCloseAllSessions](ormcloseallsessions.md)
* [ORMCloseSession](ormclosesession.md)
* [ORMDiagnostics](ormdiagnostics.md)
* [ORMEvictCollection](ormevictcollection.md)
* [ORMEvictEntity](ormevictentity.md)
* [ORMEvictQueries](ormevictqueries.md)
* [ORMExecuteQuery](ormexecutequery.md)
* [ORMFlush](ormflush.md)
* [ORMFlushAll](ormflushall.md)
* [ORMGetHibernateVersion](ormgethibernateversion.md)
* [ORMGetSQLFunctions](ormgetsqlfunctions.md)
* [ORMGetSessionFactory](ormgetsessionfactory.md)
* [ORMGetSessionStatistics](ormgetsessionstatistics.md)
* [ORMIsSessionDirty](ormissessiondirty.md)
* [ORMReadOnly](ormreadonly.md)
* [ORMReload](ormreload.md)

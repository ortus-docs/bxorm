---
description: Easily run actions on entity insertion, update, and more with event listeners
---

# Events

Hibernate ORM allows reacting to various events in the session lifecycle such as `onPreInsert`, `onPostUpdate`, `onFlush`, etc. You can enable event handling in bx-orm by setting `eventHandling` to `true` in your `this.ormSettings` struct:

```js
this.ormSettings = {
    eventHandling: true
};
```

{% hint style="warning" %}
`eventHandling: true` is required. It defaults to `false`, and with `false` no ORM event fires: not the event methods on your entities, not the global `eventHandler` (even when it is set), and not `postNew`. Earlier bx-orm versions fired events regardless of this setting, so an application that relied on events without setting `eventHandling: true` must now set it. Adobe ColdFusion and Lucee also require it.
{% endhint %}

This will enable two different event listener types for listening to Hibernate events:

* Listen to all events across all entities via the [global event handler](#global-event-handler)
* Listen to specific events on a specific entity via [entity event handler](#entity-event-handler) methods

## Global Event Handler

To use a global event handler, you must set a path to the global event handler using the `eventHandler` setting:

```js
this.ormSettings = {
    eventHandling: true,
    eventHandler : "path/to/global/EventHandler.bx"
};
```

The `EventHandler.bx` must then contain function definitions matching the ORM events you wish to listen for.

Currently, the available event names are:

* `postNew`
* `onFlush`
* `preLoad`
* `postLoad`
* `preInsert`
* `postInsert`
* `preUpdate`
* `postUpdate`
* `preDelete`
* `onDelete`
* `postDelete`
* `postCommit` (see [postCommit](#postcommit-after-the-commit))
* `onEvict`
* `onClear`
* `onDirtyCheck`
* `onAutoFlush`

Here's an example of an EventHandler configured for all events:

```js
class {

	public class function init(){
		return this;
	}

	function onFlush( entity ) {
		// Do something upon function call
	}

	function preLoad( entity ){
		// Do something upon function call
	}
	function postLoad( entity ){
		// Do something upon function call
	}

	function preInsert( entity ){
		// Do something upon function call
	}
	function postInsert( entity ){
		// Do something upon function call
	}

	function preUpdate( entity, Struct oldData  ){
		// Do something upon function call
	}
	function postUpdate( entity ){
		// Do something upon function call
	}

	function preDelete( entity ){
		// Do something upon function call
	}	
	function onDelete( entity ) {
		// Do something upon function call
	}
	function postDelete( entity ) {
		// Do something upon function call
	}
	function postCommit( entity, entityName, action ) {
		// Do something once the write is committed
	}

	function onEvict() {
		// Do something upon function call
	}
	function onClear( entity ) {
		// Do something upon function call
	}
	function onDirtyCheck( entity ) {
		// Do something upon function call
	}
	function onAutoFlush( entity ) {
		// Do something upon function call
	}
}
```

## Entity Event Handler

You can also listen to events on a specific entity at the entity level by adding methods to the entity (class) itself:

```js
class persistent="true"{
	function preInsert( entity ){
		setDateCreated( now() );
	}
	function preUpdate( entity ){
		setDateModified( now() );
	}
}
```

{% hint style="info" %}
Note that only events related to a specific entity will fire upon that entity. For example, you cannot listen to `onFlush` in an entity event handler because a flush is not tied to any one entity.
{% endhint %}

Here is the full list of event types which can be listened to in entity event listeners:

* `postNew`
* `preLoad`
* `postLoad`
* `preInsert`
* `postInsert`
* `preUpdate`
* `postUpdate`
* `preDelete`
* `postDelete`
* `postCommit`

{% hint style="info" %}
`postNew` is not a Hibernate event: it fires when `entityNew()` creates an entity (and when `entityLoadOrNew()` or `entityLoadOrSave()` create one), not when an entity is loaded. Use `postLoad` for loads.
{% endhint %}

{% hint style="info" %}
`onDelete` is only available in the [global event handler](#global-event-handler), not as an entity-level method - it fires once per delete operation, before Hibernate has resolved which entity persister to use.
{% endhint %}

{% hint style="info" %}
Changes you make to the entity inside `preInsert` or `preUpdate` (either globally or at the entity level) are written back into the values Hibernate persists - these are the two events where mutating the entity actually affects what gets saved.
{% endhint %}

## Vetoing an operation

A `preInsert`, `preUpdate` or `preDelete` handler cancels the operation by returning `false`. This works in the entity's own method and in the global event handler. Both handlers are always called, and either one can veto.

```js
class persistent="true" {
	property name="id" fieldtype="id" generator="increment";
	property name="status";

	function preDelete( entity ) {
		// published posts are never deleted
		return getStatus() != "published";
	}
}
```

Only an explicit `false` vetoes. A handler that returns nothing, or any other value, lets the operation continue, so existing handlers are not affected.

What happens after a veto:

| Event | Result |
| --- | --- |
| `preInsert` | No row is written. The entity stays in the session: remove it with [entityEvict( entity )](../reference/built-in-functions/orm/EntityEvict.md) or `ormClearSession()` before changing it, or the next flush tries to update a row that does not exist (`orm.stale`). |
| `preUpdate` | Nothing is written and the entity keeps its changes. It stays dirty, so the update, and your `preUpdate`, run again on every flush. Call `entityReload( entity )` to discard the change. |
| `preDelete` | The row stays. The entity leaves the session. |

{% hint style="warning" %}
An entity whose id is generated by the database (`generator="identity"`) cannot veto its insert: Hibernate needs the `INSERT` to get the id. Returning `false` from `preInsert` there raises an `orm.event.veto` error. Decide before calling `entitySave()`, or throw an error from `preInsert`.
{% endhint %}

## postCommit: after the commit

`postCommit` fires once a write is committed to the database, so it is the place for side effects that must only happen for data that is really saved: sending an email, clearing a cache, publishing a message. It is never fired for a write that is rolled back.

It is called on the entity's `postCommit()` method and on the global event handler's, with these arguments:

| Argument | Value |
| --- | --- |
| `entity` | The entity that was written |
| `entityName` | The entity name |
| `action` | `insert`, `update` or `delete` |

```js
// On the entity
class persistent="true" {
	function postCommit( entity, action ) {
		if ( action == "insert" ) {
			mailService.sendWelcome( this );
		}
	}
}

// In the global event handler
function postCommit( entity, entityName, action ) {
	cacheRemove( "#entityName#-#entityGetId( entity )#" );
}
```

When it fires:

* **Inside `transaction{}`**: after BoxLang commits the transaction, when the transaction ends, in the order the writes happened. Writes that are rolled back (an error, or `transactionRollback()`) get no event.
* **Outside a transaction**: each statement commits on its own, so the event fires when the flush that wrote the row ends (`ormFlush()`, for example), or at once for a write made outside a flush, such as the insert of an entity whose id comes from the database (`generator="identity"`).

Like every ORM event, `postCommit` needs `eventHandling: true`. See also [Transactions](transactions.md#after-the-commit).

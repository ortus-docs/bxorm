/* BxORM homepage (layout: home): theme toggle, code tabs, quick start steps and copy buttons. */
( function () {
	var root = document.documentElement;

	var themeBtn = document.getElementById( "themebtn" );
	if ( themeBtn ) {
		themeBtn.addEventListener( "click", function () {
			var next = root.getAttribute( "data-theme" ) === "dark" ? "light" : "dark";
			root.setAttribute( "data-theme", next );
			try { localStorage.setItem( "bxsites-theme", next ); } catch ( e ) {}
		} );
	}

	document.querySelectorAll( ".tabs button" ).forEach( function ( b ) {
		b.addEventListener( "click", function () {
			b.parentElement.querySelectorAll( "button" ).forEach( function ( x ) {
				x.classList.toggle( "on", x === b );
				x.setAttribute( "aria-selected", x === b ? "true" : "false" );
				var panel = document.getElementById( x.dataset.t );
				if ( panel ) panel.hidden = x !== b;
			} );
		} );
	} );

	var names = { s1: "terminal", s2: "Application.bx", s3: "models/User.bx", s4: "app.bxs" };
	var steps = document.querySelectorAll( ".step" );
	steps.forEach( function ( b ) {
		b.addEventListener( "click", function () {
			steps.forEach( function ( x ) { x.classList.toggle( "on", x === b ); } );
			Object.keys( names ).forEach( function ( id ) {
				var panel = document.getElementById( id );
				if ( panel ) panel.hidden = id !== b.dataset.s;
			} );
			var label = document.getElementById( "stepname" );
			if ( label ) label.textContent = names[ b.dataset.s ];
		} );
	} );

	document.querySelectorAll( "button[data-copy]" ).forEach( function ( b ) {
		b.addEventListener( "click", function () {
			var text = b.getAttribute( "data-copy" );
			var done = function () {
				var old = b.textContent;
				b.textContent = "Copied";
				setTimeout( function () { b.textContent = old; }, 1500 );
			};
			if ( navigator.clipboard ) {
				navigator.clipboard.writeText( text ).then( done, function () {} );
			}
		} );
	} );
} )();

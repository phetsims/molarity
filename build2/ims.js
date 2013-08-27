
var fs = require( 'fs' );

[ 'images/reset_button_disabled.png',
  'images/reset_button_down.png',
  'images/reset_button_over.png',
  'images/reset_button_up.png',
  'images/joist/phet-logo-short.png' ].forEach( function( file ) {
  fs.readFile( file, function(err, data) {
     var base64data = new Buffer(data).toString('base64');
     fs.writeFile( file + '.base64', 'data:image/png;base64,' + base64data, function() {} );
  });
} );

[ 'images/joist/phet-logo-short.svg',
  'images/joist/phet-logo-loading.svg' ].forEach( function( file ) {
  fs.readFile( file, function(err, data) {
     var base64data = new Buffer(data).toString('base64');
     fs.writeFile( file + '.base64', 'data:image/svg+xml;base64,' + base64data, function() {} );
  });
} );

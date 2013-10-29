// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Molarity' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var MolarityScreen = require( 'MOLARITY/molarity/MolarityScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!MOLARITY/molarity.name' );

  //TODO i18n, see joist#66
  var simOptions = {
    credits: 'PhET Development Team -\n' +
             'Lead Design: Julia Chamberlain\n' +
             'Software Development: Chris Malley\n' +
             'Design Team: Kelly Lancaster, Robert Parson, Kathy Perkins'
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new MolarityScreen() ], simOptions );
    sim.start();
  } );
} );
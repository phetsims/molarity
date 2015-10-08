// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Molarity' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var MolarityScreen = require( 'MOLARITY/molarity/MolarityScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!MOLARITY/molarity.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Julia Chamberlain',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Kelly Lancaster, Robert Parson, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Elise Morgan, Oliver Orejola, Bryan Yoelin'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new MolarityScreen() ], simOptions );
    sim.start();
  } );
} );
// Copyright 2013-2015, University of Colorado Boulder

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
  var molarityTitleString = require( 'string!MOLARITY/molarity.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Julia Chamberlain',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Kelly Lancaster, Robert Parson, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Elise Morgan, Oliver Orejola, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( molarityTitleString, [ new MolarityScreen() ], simOptions );
    sim.start();
  } );
} );
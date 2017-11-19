// Copyright 2013-2017, University of Colorado Boulder

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
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var molarityTitleString = require( 'string!MOLARITY/molarity.title' );

  // constants
  var tandem = Tandem.rootTandem;

  var options = {
    credits: {
      leadDesign: 'Julia Chamberlain',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Kelly Lancaster, Robert Parson, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Alex Dornan, Ethan Johnson, Elise Morgan, Oliver Orejola, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {
    var screens = [ new MolarityScreen( tandem.createTandem( 'molarityScreen' ) ) ];
    var sim = new Sim( molarityTitleString, screens, options );
    sim.start();
  } );
} );
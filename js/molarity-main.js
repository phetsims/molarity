// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main entry point for the 'Molarity' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const MolarityKeyboardHelpContent = require( 'MOLARITY/molarity/view/MolarityKeyboardHelpContent' );
  const MolarityScreen = require( 'MOLARITY/molarity/MolarityScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const molarityTitleString = require( 'string!MOLARITY/molarity.title' );

  // constants
  const tandem = Tandem.rootTandem;

  // help content to describe keyboard interactions
  const keyboardHelpContent = new MolarityKeyboardHelpContent();

  const options = {
    credits: {
      leadDesign: 'Julia Chamberlain',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Kelly Lancaster, Robert Parson, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Alex Dornan, Ethan Johnson, Elise Morgan, Oliver Orejola, Bryan Yoelin'
    },
    keyboardHelpNode: keyboardHelpContent,
    supportsSound: true,
    accessibility: true
  };

  SimLauncher.launch( function() {
    const screens = [ new MolarityScreen( tandem.createTandem( 'molarityScreen' ) ) ];
    const sim = new Sim( molarityTitleString, screens, options );
    sim.start();
  } );
} );
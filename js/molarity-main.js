// Copyright 2013-2020, University of Colorado Boulder

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
  const tandem = Tandem.ROOT;

  // help content to describe keyboard interactions
  const keyboardHelpContent = new MolarityKeyboardHelpContent();

  const options = {
    credits: {
      leadDesign: 'Julia Chamberlain',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.), John Blanco, Michael Kauzmann, Taylor Want',
      team: 'Kelly Lancaster, Emily B. Moore, Matthew Moore, Robert Parson, Kathy Perkins, Taliesin Smith, Brianna Tomlinson',
      soundDesign: 'Ashton Morris',
      qualityAssurance: 'Jaspe Arias, Logan Bray, Steele Dalton, Alex Dornan, Ethan Johnson, Megan Lai, Elise Morgan, Liam Mulhall, Oliver Orejola, Jacob Romero, Kathryn Woessner, Bryan Yoelin'
    },
    keyboardHelpNode: keyboardHelpContent,
    accessibility: true
  };

  SimLauncher.launch( function() {
    const screens = [ new MolarityScreen( tandem.createTandem( 'molarityScreen' ) ) ];
    const sim = new Sim( molarityTitleString, screens, options );
    sim.start();
  } );
} );
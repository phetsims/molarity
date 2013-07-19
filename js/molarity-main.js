// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Molarity' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require( [ 'JOIST/SimLauncher', 'JOIST/Sim', 'molarity/MolarityTab', 'molarity/MStrings', 'molarity/MImages' ],
  function( SimLauncher, Sim, MolarityTab, MStrings, MImages ) {
    'use strict';

    //TODO i18n?
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

    SimLauncher.launch( MImages, function() {
      var sim = new Sim( MStrings.molarity, [ new MolarityTab() ], simOptions );
      sim.start();
    } );

  } );

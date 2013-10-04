// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Molarity' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require( [ 'JOIST/SimLauncher', 'JOIST/Sim', 'MOLARITY/molarity/MolarityScreen', 'string!MOLARITY/molarity.name' ],
  function( SimLauncher, Sim, MolarityScreen, simTitle ) {
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

    SimLauncher.launch( function() {
      var sim = new Sim( simTitle, [ new MolarityScreen() ], simOptions );
      sim.start();
    } );

  } );

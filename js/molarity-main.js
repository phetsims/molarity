// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the "Molarity" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require( [ "JOIST/SimLauncher", "JOIST/Sim", "molarity/MolarityTab", "molarity/MStrings" ],
  function( SimLauncher, Sim, MolarityTab, MStrings ) {
    "use strict";

    SimLauncher.launch( "beaker.png", function() {
      var sim = new Sim( MStrings.molarity, [ new MolarityTab() ] );
      sim.start();
    } );

  } );

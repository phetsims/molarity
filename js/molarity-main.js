// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the "Molarity" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require( [ "JOIST/SimLauncher", "JOIST/Sim", "molarity/MolarityTab", "molarity/MStrings", "molarity/MImages" ],
  function( SimLauncher, Sim, MolarityTab, MStrings, MImages ) {
    "use strict";

    SimLauncher.launch( MImages, function() {
      var sim = new Sim( MStrings.molarity, [ new MolarityTab() ] );
      sim.start();
    } );

  } );

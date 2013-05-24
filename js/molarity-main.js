// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the "Molarity" sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
require(
    [
      "JOIST/Sim",
      "PHETCOMMON/util/ImagesLoader",
      "molarity/MolarityTab",
      "SCENERY/util/Util",
      "molarity/MStrings",
      "molarity/MImages"
    ],
    function( Sim, ImagesLoader, MolarityTab, Util, MStrings, MImages ) {
      "use strict";

      var loader = new ImagesLoader( function( loader ) {
        MImages.getImage = loader.getImage;
        new Sim( MStrings.molarity, [ new MolarityTab() ] ).start();
      } );
    } );

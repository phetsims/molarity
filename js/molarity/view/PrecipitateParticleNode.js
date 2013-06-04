// Copyright 2002-2013, University of Colorado

/**
 * Visual representation of a precipitate particle.
 * We use the same basic representation for all solutes, but vary the color, size and orientation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {Solute} solute
   * @constructor
   */
  function PrecipitateParticleNode( solute ) {
    Rectangle.call( this,
                    0, 0, solute.particleSize, solute.particleSize,
                    { fill: solute.particleColor, stroke: solute.particleColor.darkerColor() } );
    this.rotate( Math.random() * 2 * Math.PI );
  }

  inherit( PrecipitateParticleNode, Rectangle );

  return PrecipitateParticleNode;
} );
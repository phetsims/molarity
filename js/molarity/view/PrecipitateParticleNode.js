// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of a precipitate particle.
 * We use the same basic representation for all solutes, but vary the color, size and orientation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Number} length particles are square, this is the length of one side
   * @param {Color} color
   * @constructor
   */
  function PrecipitateParticleNode( length, color ) {
    Rectangle.call( this, 0, 0, length, length, { fill: color, stroke: color.darkerColor() } );
    this.rotate( Math.random() * 2 * Math.PI );
  }

  inherit( Rectangle, PrecipitateParticleNode );

  return PrecipitateParticleNode;
} );
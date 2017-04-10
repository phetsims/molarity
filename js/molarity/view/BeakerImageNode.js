// Copyright 2013-2015, University of Colorado Boulder

/**
 * This class encapsulates the beaker image, including "points of interest" in that image.
 * The image was built around the 2D projection of a 3D cylinder.
 * Methods are provided to access the points of interest, allowing client code to construct
 * a shape that looks like solution inside the beaker cylinder.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var molarity = require( 'MOLARITY/molarity' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var beakerImage = require( 'image!MOLARITY/beaker.png' );

  // points of interest in the image file
  var CYLINDER_UPPER_LEFT = new Vector2( 98, 192 );
  var CYLINDER_LOWER_RIGHT = new Vector2( 526, 644 );
  var CYLINDER_END_BACKGROUND = new Vector2( 210, 166 );
  var CYLINDER_END_FOREGROUND = new Vector2( 210, 218 );

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function BeakerImageNode( tandem, options ) {

    options = options || {};
    assert && assert( !options.tandem );
    options.tandem = tandem;

    Image.call( this, beakerImage, options );
  }

  molarity.register( 'BeakerImageNode', BeakerImageNode );

  return inherit( Image, BeakerImageNode, {

    // @public Gets the cylinder dimensions.
    getCylinderSize: function() {
      var pUpperLeft = this.localToParentPoint( CYLINDER_UPPER_LEFT );
      var pLowerRight = this.localToParentPoint( CYLINDER_LOWER_RIGHT );
      return new Dimension2( pLowerRight.x - pUpperLeft.x, pLowerRight.y - pUpperLeft.y );
    },

    // @public Gets the offset of the cylinder from the upper-left corner of the image.
    getCylinderOffset: function() {
      return this.localToParentPoint( CYLINDER_UPPER_LEFT );
    },

    // @public Gets the 2D height of the cylinder's end cap.
    getCylinderEndHeight: function() {
      return this.localToParentPoint( CYLINDER_END_FOREGROUND ).y - this.localToParentPoint( CYLINDER_END_BACKGROUND ).y;
    }
  } );
} );


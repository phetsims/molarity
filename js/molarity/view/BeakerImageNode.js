// Copyright 2002-2013, University of Colorado

/**
 * This class encapsulates knowledge about points in the beaker image.
 * The image was built around the 2D projection of a 3D cylinder,
 * and we can programmatically fill that cylinder with solution.
 * Methods are provided to access points of interest in the image file.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // import
  var Dimension2 = require( "DOT/Dimension2" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var MImages = require( "molarity/MImages" );
  var Vector2 = require( "DOT/Vector2" );

  // points of interest in the image file
  var CYLINDER_UPPER_LEFT = new Vector2( 98, 192 );
  var CYLINDER_LOWER_RIGHT = new Vector2( 526, 644 );
  var CYLINDER_END_BACKGROUND = new Vector2( 210, 166 );
  var CYLINDER_END_FOREGROUND = new Vector2( 210, 218 );

  function BeakerImageNode() {
    Image.call( this, MImages.getImage( "beaker.png" ) );
  }

  inherit( Image, BeakerImageNode, {

    // Gets the cylinder dimensions.
    getCylinderSize: function() {
      var pUpperLeft = this._getTransformedPoint( CYLINDER_UPPER_LEFT );
      var pLowerRight = this._getTransformedPoint( CYLINDER_LOWER_RIGHT );
      return new Dimension2( pLowerRight.x - pUpperLeft.x, pLowerRight.y - pUpperLeft.y );
    },

    // Gets the offset of the cylinder from the upper-left corner of the image.
    getCylinderOffset: function() {
      return this._getTransformedPoint( CYLINDER_UPPER_LEFT );
    },

    // Gets the 2D height of the cylinder's end cap.
    getCylinderEndHeight: function() {
      return this._getTransformedPoint( CYLINDER_END_FOREGROUND ).y - this._getTransformedPoint( CYLINDER_END_BACKGROUND ).y;
    },

    _getTransformedPoint: function( p ) {
      return this.getTransform().transformPosition2( p );
    }
  } );

  return BeakerImageNode;
} );


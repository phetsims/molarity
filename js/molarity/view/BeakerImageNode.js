// Copyright 2013-2021, University of Colorado Boulder

/**
 * This class encapsulates the beaker image, including "points of interest" in that image.
 * The image was built around the 2D projection of a 3D cylinder.
 * Methods are provided to access the points of interest, allowing client code to construct
 * a shape that looks like solution inside the beaker cylinder.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Image } from '../../../../scenery/js/imports.js';
import beaker_png from '../../../images/beaker_png.js';
import molarity from '../../molarity.js';

// points of interest in the image file
const CYLINDER_UPPER_LEFT = new Vector2( 98, 192 );
const CYLINDER_LOWER_RIGHT = new Vector2( 526, 644 );
const CYLINDER_END_BACKGROUND = new Vector2( 210, 166 );
const CYLINDER_END_FOREGROUND = new Vector2( 210, 218 );

class BeakerImageNode extends Image {
  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem, options ) {

    options = options || {};
    assert && assert( !options.tandem, 'tandem is passed via constructor parameter' );
    options.tandem = tandem;

    super( beaker_png, options );
  }

  // @public Gets the cylinder dimensions.
  getCylinderSize() {
    const pUpperLeft = this.localToParentPoint( CYLINDER_UPPER_LEFT );
    const pLowerRight = this.localToParentPoint( CYLINDER_LOWER_RIGHT );
    return new Dimension2( pLowerRight.x - pUpperLeft.x, pLowerRight.y - pUpperLeft.y );
  }

  // @public Gets the offset of the cylinder from the upper-left corner of the image.
  getCylinderOffset() {
    return this.localToParentPoint( CYLINDER_UPPER_LEFT );
  }

  // @public Gets the 2D height of the cylinder's end cap.
  getCylinderEndHeight() {
    return this.localToParentPoint( CYLINDER_END_FOREGROUND ).y - this.localToParentPoint( CYLINDER_END_BACKGROUND ).y;
  }
}

molarity.register( 'BeakerImageNode', BeakerImageNode );
export default BeakerImageNode;
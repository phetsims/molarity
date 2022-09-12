// Copyright 2013-2022, University of Colorado Boulder

/**
 * A label that is switchable between 2 representations: qualitative and quantitative.
 * When property valueVisible is true, the quantitative label is displayed; otherwise the qualitative label is displayed.
 * X-coordinate of the origin is adjusted to be in the center, to simplify layout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import molarity from '../../molarity.js';

// constants
const DEBUG_BOUNDS = false;

class DualLabelNode extends Node {
  /**
   * @param {string} quantitativeValue
   * @param {string} qualitativeValue
   * @param {Property.<boolean>} isQuantitativeProperty
   * @param {Font} font
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( quantitativeValue, qualitativeValue, isQuantitativeProperty, font, tandem, options ) {

    super();

    const quantitativeText = new Text( quantitativeValue, {
      font: font,
      tandem: tandem.createTandem( 'quantitativeText' )
    } );
    this.addChild( quantitativeText );

    const qualitativeText = new Text( qualitativeValue, {
      font: font,
      center: quantitativeText.center,
      tandem: tandem.createTandem( 'qualitativeText' )
    } );
    this.addChild( qualitativeText );

    // add an invisible rectangle so that bounds don't change
    const boundsNode = new Rectangle( this.left, this.top, this.width, this.height );
    if ( DEBUG_BOUNDS ) {
      boundsNode.stroke = 'red';
    }
    this.addChild( boundsNode );

    // switch between qualitative and quantitative
    isQuantitativeProperty.link( isQuantitative => {
      quantitativeText.setVisible( isQuantitative );
      qualitativeText.setVisible( !isQuantitative );
    } );

    this.mutate( options );
  }
}

molarity.register( 'DualLabelNode', DualLabelNode );

export default DualLabelNode;
// Copyright 2013-2020, University of Colorado Boulder

/**
 * A label that is switchable between 2 representations: qualitative and quantitative.
 * When property valueVisible is true, the quantitative label is displayed; otherwise the qualitative label is displayed.
 * X-coordinate of the origin is adjusted to be in the center, to simplify layout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
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

    const quantitativeNode = new Text( quantitativeValue, {
      font: font,
      tandem: tandem.createTandem( 'quantitativeNode' )
    } );
    this.addChild( quantitativeNode );

    const qualitativeNode = new Text( qualitativeValue, {
      font: font,
      center: quantitativeNode.center,
      tandem: tandem.createTandem( 'qualitativeNode' )
    } );
    this.addChild( qualitativeNode );

    // add an invisible rectangle so that bounds don't change
    const boundsNode = new Rectangle( this.left, this.top, this.width, this.height );
    if ( DEBUG_BOUNDS ) {
      boundsNode.stroke = 'red';
    }
    this.addChild( boundsNode );

    // switch between qualitative and quantitative
    isQuantitativeProperty.link( isQuantitative => {
      quantitativeNode.setVisible( isQuantitative );
      qualitativeNode.setVisible( !isQuantitative );
    } );

    this.mutate( options );
  }
}

molarity.register( 'DualLabelNode', DualLabelNode );

export default DualLabelNode;
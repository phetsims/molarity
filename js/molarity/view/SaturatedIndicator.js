// Copyright 2013-2020, University of Colorado Boulder

/**
 * Indicator that the solution is saturated.
 * This consists of 'Saturated!' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import molarity from '../../molarity.js';
import molarityStrings from '../../molarityStrings.js';

const saturatedString = molarityStrings.saturated;

class SaturatedIndicator extends Node {
  /**
   * @param {MacroSolution} solution
   * @param {Tandem} tandem
   */
  constructor( solution, tandem ) {

    super( { tandem: tandem } );

    const textNode = new Text( saturatedString, {
      font: new PhetFont( 22 ),
      maxWidth: 200,
      tandem: tandem.createTandem( 'textNode' )
    } );

    // translucent light-gray background, so this shows up on all solution colors
    const backgroundNode = new Rectangle( 0, 0, 1.2 * textNode.width, 1.2 * textNode.height, 8, 8, {
      fill: 'rgba( 240, 240, 240, 0.6 )',
      tandem: tandem.createTandem( 'backgroundNode' )
    } );

    // rendering order
    this.addChild( backgroundNode );
    this.addChild( textNode );

    // layout
    textNode.center = backgroundNode.center;

    // make this node visible when the solution is saturated
    solution.precipitateAmountProperty.link( () => {
      this.visible = solution.isSaturated();
    } );
  }
}

molarity.register( 'SaturatedIndicator', SaturatedIndicator );

export default SaturatedIndicator;
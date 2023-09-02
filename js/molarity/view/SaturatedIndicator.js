// Copyright 2013-2023, University of Colorado Boulder

/**
 * Indicator that the solution is saturated.
 * This consists of 'Saturated!' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import molarity from '../../molarity.js';
import MolarityStrings from '../../MolarityStrings.js';

const saturatedString = MolarityStrings.saturated;

class SaturatedIndicator extends Node {
  /**
   * @param {MacroSolution} solution
   * @param {Tandem} tandem
   */
  constructor( solution, tandem ) {

    super( { tandem: tandem } );

    const text = new Text( saturatedString, {
      font: new PhetFont( 22 ),
      maxWidth: 200,
      tandem: tandem.createTandem( 'text' )
    } );

    // translucent light-gray background, so this shows up on all solution colors
    const backgroundNode = new Rectangle( 0, 0, 1.2 * text.width, 1.2 * text.height, 8, 8, {
      fill: 'rgba( 240, 240, 240, 0.6 )',
      tandem: tandem.createTandem( 'backgroundNode' )
    } );

    // rendering order
    this.addChild( backgroundNode );
    this.addChild( text );

    // layout
    text.center = backgroundNode.center;

    // make this node visible when the solution is saturated
    solution.precipitateAmountProperty.link( () => {
      this.visible = solution.isSaturated();
    } );
  }
}

molarity.register( 'SaturatedIndicator', SaturatedIndicator );

export default SaturatedIndicator;
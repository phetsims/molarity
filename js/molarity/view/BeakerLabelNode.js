// Copyright 2013-2023, University of Colorado Boulder

/**
 * Label that appears on the beaker in a frosty, translucent frame.
 * Displays solute formula. Origin at top center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import molarity from '../../molarity.js';
import MolaritySymbols from '../MolaritySymbols.js';

// constants
const LABEL_SIZE = new Dimension2( 180, 80 );
const LABEL_FONT = new PhetFont( { size: 28, weight: 'bold' } );

class BeakerLabelNode extends Node {
  /**
   * @param {MacroSolution} solution
   * @param {Tandem} tandem
   */
  constructor( solution, tandem ) {

    super( { tandem: tandem } );

    const text = new RichText( '?', {
      font: LABEL_FONT,
      maxWidth: 0.9 * LABEL_SIZE.width,
      tandem: tandem.createTandem( 'text' )
    } );

    const backgroundNode = new Rectangle( -LABEL_SIZE.width / 2, 0, LABEL_SIZE.width, LABEL_SIZE.height, 10, 10, {
      fill: new Color( 255, 255, 255, 0.6 ), stroke: Color.LIGHT_GRAY,
      tandem: tandem.createTandem( 'backgroundNode' )
    } );

    this.addChild( backgroundNode );
    this.addChild( text );

    // label on the beaker
    const beakerLabelStringProperty = new DerivedStringProperty( [ solution.soluteProperty, solution.volumeProperty, solution.concentrationProperty ],
      ( solute, volume, concentration ) => {
        let label;
        if ( volume === 0 ) {
          label = '';
        }
        else if ( concentration === 0 ) {
          label = MolaritySymbols.WATER;
        }
        else {
          label = solute.formula;
        }
        return label;
      }, {
        tandem: tandem.createTandem( 'beakerLabelStringProperty' )
      } );

    // update the label
    beakerLabelStringProperty.link( label => {
      text.string = label;
      // center formula in background
      text.centerX = backgroundNode.centerX;
      text.centerY = backgroundNode.centerY;
    } );
  }
}

molarity.register( 'BeakerLabelNode', BeakerLabelNode );

export default BeakerLabelNode;
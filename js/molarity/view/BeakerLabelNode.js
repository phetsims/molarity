// Copyright 2013-2019, University of Colorado Boulder

/**
 * Label that appears on the beaker in a frosty, translucent frame.
 * Displays solute formula. Origin at top center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import molarity from '../../molarity.js';
import MolaritySymbols from '../MolaritySymbols.js';

// constants
const LABEL_SIZE = new Dimension2( 180, 80 );
const LABEL_FONT = new PhetFont( { size: 28, weight: 'bold' } );

/**
 * @param {Solution} solution
 * @param {Tandem} tandem
 * @constructor
 */
function BeakerLabelNode( solution, tandem ) {

  Node.call( this, { tandem: tandem } );

  const textNode = new RichText( '?', {
    font: LABEL_FONT,
    maxWidth: 0.9 * LABEL_SIZE.width,
    tandem: tandem.createTandem( 'textNode' )
  } );

  const backgroundNode = new Rectangle( -LABEL_SIZE.width / 2, 0, LABEL_SIZE.width, LABEL_SIZE.height, 10, 10, {
    fill: new Color( 255, 255, 255, 0.6 ), stroke: Color.LIGHT_GRAY,
    tandem: tandem.createTandem( 'backgroundNode' )
  } );

  this.addChild( backgroundNode );
  this.addChild( textNode );

  // label on the beaker
  const beakerLabelProperty = new DerivedProperty( [ solution.soluteProperty, solution.volumeProperty, solution.concentrationProperty ],
    function( solute, volume, concentration ) {
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
      tandem: tandem.createTandem( 'beakerLabelProperty' ),
      phetioType: DerivedPropertyIO( StringIO )
    } );

  // update the label
  beakerLabelProperty.link( function( label ) {
    textNode.text = label;
    // center formula in background
    textNode.centerX = backgroundNode.centerX;
    textNode.centerY = backgroundNode.centerY;
  } );
}

molarity.register( 'BeakerLabelNode', BeakerLabelNode );

inherit( Node, BeakerLabelNode );
export default BeakerLabelNode;
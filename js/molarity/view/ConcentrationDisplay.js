// Copyright 2013-2020, University of Colorado Boulder

/**
 * Vertical bar that displays the concentration of a solution.
 * The display can be switched between quantitative and qualitative.
 * The bar is colored using a gradient that corresponds to the solute's color.
 * A pointer to the right of the bar indicates the concentration on the scale.
 * The pointer is color corresponds to its position on the bar.
 * Origin is at the upper-left corner of the bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MultiLineText from '../../../../scenery-phet/js/MultiLineText.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import molarity from '../../molarity.js';
import molarityStrings from '../../molarityStrings.js';
import MolarityConstants from '../MolarityConstants.js';
import DualLabelNode from './DualLabelNode.js';

const highString = molarityStrings.high;
const molarityLabelString = molarityStrings.molarity.label;
const pattern0Value1UnitsString = molarityStrings.pattern[ '0value' ][ '1units' ];
const patternParentheses0TextString = molarityStrings.pattern.parentheses[ '0text' ];
const solutionConcentrationString = molarityStrings.solutionConcentration;
const unitsMolarityString = molarityStrings.units.molarity;
const zeroString = molarityStrings.zero;

// constants
const TITLE_FONT = new PhetFont( { size: 24, weight: 'bold' } );
const SUBTITLE_FONT = new PhetFont( 22 );
const RANGE_FONT = new PhetFont( 20 );
const VALUE_FONT = new PhetFont( 20 );
const ARROW_LENGTH = 55;
const ARROW_HEAD_HEIGHT = 0.6 * ARROW_LENGTH;
const ARROW_HEAD_WIDTH = 0.7 * ARROW_LENGTH;
const ARROW_TAIL_WIDTH = 0.4 * ARROW_LENGTH;

class ConcentrationDisplay extends Node {
  /**
   * @param {MacroSolution} solution
   * @param {Range} concentrationRange
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Dimension2} barSize
   * @param {Tandem} tandem
   */
  constructor( solution, concentrationRange, valuesVisibleProperty, barSize, tandem ) {

    super( {
      pickable: false,
      tandem: tandem
    } );

    // nodes
    const maxTextWidth = 175; // constrain width for i18n, determined empirically

    const titleNode = new MultiLineText( solutionConcentrationString, {
      align: 'center',
      font: TITLE_FONT,
      maxWidth: maxTextWidth,
      tandem: tandem.createTandem( 'titleNode' )
    } );

    const subtitleNode = new Text( StringUtils.format( patternParentheses0TextString, molarityLabelString ), {
      font: SUBTITLE_FONT,
      maxWidth: maxTextWidth,
      tandem: tandem.createTandem( 'subtitleNode' )
    } );

    const maxNode = new DualLabelNode( Utils.toFixed( concentrationRange.max, MolarityConstants.RANGE_DECIMAL_PLACES ),
      highString, valuesVisibleProperty, RANGE_FONT, tandem.createTandem( 'maxNode' ),
      { maxWidth: maxTextWidth } );

    const minNode = new DualLabelNode( Utils.toFixed( concentrationRange.min,
      concentrationRange.min === 0 ? 0 : MolarityConstants.RANGE_DECIMAL_PLACES ), zeroString,
      valuesVisibleProperty, RANGE_FONT, tandem.createTandem( 'minNode' ),
      { maxWidth: maxTextWidth } );

    const barNode = new Rectangle( 0, 0, barSize.width, barSize.height, {
      stroke: 'black',
      tandem: tandem.createTandem( 'barNode' )
    } );

    const saturatedBarNode = new Rectangle( 0, 0, barSize.width, barSize.height, {
      stroke: 'black',
      fill: Color.LIGHT_GRAY,
      tandem: tandem.createTandem( 'saturatedBarNode' )
    } );

    const pointerNode = new PointerNode( solution, concentrationRange, barSize, valuesVisibleProperty,
      tandem.createTandem( 'pointerNode' ) );

    // rendering order
    this.addChild( titleNode );
    this.addChild( subtitleNode );
    this.addChild( maxNode );
    this.addChild( minNode );
    this.addChild( barNode );
    this.addChild( saturatedBarNode );
    this.addChild( pointerNode );

    // layout
    barNode.x = 0;
    barNode.y = 0;
    saturatedBarNode.x = barNode.x;
    saturatedBarNode.y = barNode.y;
    maxNode.centerX = barNode.centerX;
    maxNode.bottom = barNode.top - 5;
    minNode.centerX = barNode.centerX;
    minNode.top = barNode.bottom + 5;
    subtitleNode.centerX = barNode.centerX;
    subtitleNode.bottom = maxNode.top - 8;
    titleNode.centerX = barNode.centerX;
    titleNode.bottom = subtitleNode.top - 5;

    // when the solute changes...
    solution.soluteProperty.link( solute => {

      // Color the bar using a gradient that corresponds to the solute's color range.
      const concentrationScale = Math.min( 1, solute.saturatedConcentration / concentrationRange.max );
      const y = barSize.height - ( barSize.height * concentrationScale );
      if ( y < 0 ) {
        console.log( 'solute.saturatedConcentration=' + solute.saturatedConcentration + ' concentrationRange.max=' + concentrationRange.max );
      }
      barNode.fill = new LinearGradient( 0, y, 0, barSize.height )
        .addColorStop( 0, solute.maxColor )
        .addColorStop( 1, solute.minColor );

      // Cover the saturated portion of the range with a gray rectangle.
      saturatedBarNode.visible = ( solute.saturatedConcentration < concentrationRange.max );
      saturatedBarNode.setRect( 0, 0, barSize.width, y );
    } );
  }
}

molarity.register( 'ConcentrationDisplay', ConcentrationDisplay );

class PointerNode extends Node {
  /**
   * @param {MacroSolution} solution
   * @param {Range} concentrationRange
   * @param {Dimension2} barSize
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Tandem} tandem
   */
  constructor( solution, concentrationRange, barSize, valuesVisibleProperty, tandem ) {

    super( { tandem: tandem } );

    const valueNode = new Text( '?', {
      font: VALUE_FONT,
      maxWidth: 75,
      tandem: tandem.createTandem( 'valueNode' )
    } );

    const x = barSize.width;
    const y = 0;
    const arrowShape = new Shape()
      .moveTo( x, y )
      .lineTo( x + ARROW_HEAD_HEIGHT, y - ( ARROW_HEAD_WIDTH / 2 ) )
      .lineTo( x + ARROW_HEAD_HEIGHT, y - ( ARROW_TAIL_WIDTH / 2 ) )
      .lineTo( x + ARROW_LENGTH, y - ( ARROW_TAIL_WIDTH / 2 ) )
      .lineTo( x + ARROW_LENGTH, y + ( ARROW_TAIL_WIDTH / 2 ) )
      .lineTo( x + ARROW_HEAD_HEIGHT, y + ( ARROW_TAIL_WIDTH / 2 ) )
      .lineTo( x + ARROW_HEAD_HEIGHT, y + ( ARROW_HEAD_WIDTH / 2 ) )
      .close();

    // @private
    this.arrowNode = new Path( arrowShape, {
      stroke: 'black',
      tandem: tandem.createTandem( 'arrowNode' )
    } );

    // rendering order
    this.addChild( valueNode );
    this.addChild( this.arrowNode );

    // show/hide value
    valuesVisibleProperty.link( visible => {
      valueNode.setVisible( visible );
    } );

    // when the concentration or solute changes...
    const update = concentration => {

      // update the arrow
      this.arrowNode.y = barSize.height - Utils.linear( concentrationRange.min, concentrationRange.max, 0, barSize.height, concentration );
      this.arrowNode.fill = solution.getColor();

      // update the value
      valueNode.text = StringUtils.format( pattern0Value1UnitsString, Utils.toFixed( concentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES ), unitsMolarityString );
      valueNode.left = this.arrowNode.right + 5;
      valueNode.centerY = this.arrowNode.centerY;
    };
    solution.concentrationProperty.link( concentration => {
      update( concentration );
    } );
    solution.soluteProperty.link( () => {
      update( solution.concentrationProperty.value );
    } );
  }
}

export default ConcentrationDisplay;
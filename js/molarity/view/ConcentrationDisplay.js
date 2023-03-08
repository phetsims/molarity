// Copyright 2013-2023, University of Colorado Boulder

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
import { Shape } from '../../../../kite/js/imports.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, LinearGradient, Node, Path, Rectangle, RichText, Text } from '../../../../scenery/js/imports.js';
import molarity from '../../molarity.js';
import MolarityStrings from '../../MolarityStrings.js';
import MolarityConstants from '../MolarityConstants.js';
import DualLabelNode from './DualLabelNode.js';

const highString = MolarityStrings.high;
const molarityLabelString = MolarityStrings.molarity.label;
const pattern0Value1UnitsString = MolarityStrings.pattern[ '0value' ][ '1units' ];
const patternParentheses0TextString = MolarityStrings.pattern.parentheses[ '0text' ];
const solutionConcentrationString = MolarityStrings.solutionConcentration;
const unitsMolarityString = MolarityStrings.units.molarity;
const zeroString = MolarityStrings.zero;

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

    const titleText = new RichText( solutionConcentrationString, {
      replaceNewlines: true,
      align: 'center',
      font: TITLE_FONT,
      maxWidth: maxTextWidth,
      tandem: tandem.createTandem( 'titleText' )
    } );

    const subtitleText = new Text( StringUtils.format( patternParentheses0TextString, molarityLabelString ), {
      font: SUBTITLE_FONT,
      maxWidth: maxTextWidth,
      tandem: tandem.createTandem( 'subtitleText' )
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
    this.addChild( titleText );
    this.addChild( subtitleText );
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
    subtitleText.centerX = barNode.centerX;
    subtitleText.bottom = maxNode.top - 8;
    titleText.centerX = barNode.centerX;
    titleText.bottom = subtitleText.top - 5;

    // when the solute changes...
    solution.soluteProperty.link( solute => {

      // Color the bar using a gradient that corresponds to the solute's color range.
      const concentrationScale = Math.min( 1, solute.saturatedConcentration / concentrationRange.max );
      const y = barSize.height - ( barSize.height * concentrationScale );
      if ( y < 0 ) {
        console.log( `solute.saturatedConcentration=${solute.saturatedConcentration} concentrationRange.max=${concentrationRange.max}` );
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

    const valueText = new Text( '?', {
      font: VALUE_FONT,
      maxWidth: 75,
      tandem: tandem.createTandem( 'valueText' )
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
    this.addChild( valueText );
    this.addChild( this.arrowNode );

    // show/hide value
    valuesVisibleProperty.link( visible => {
      valueText.setVisible( visible );
    } );

    // when the concentration or solute changes...
    const update = concentration => {

      // update the arrow
      this.arrowNode.y = barSize.height - Utils.linear( concentrationRange.min, concentrationRange.max, 0, barSize.height, concentration );
      this.arrowNode.fill = solution.getColor();

      // update the value
      valueText.string = StringUtils.format( pattern0Value1UnitsString, Utils.toFixed( concentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES ), unitsMolarityString );
      valueText.left = this.arrowNode.right + 5;
      valueText.centerY = this.arrowNode.centerY;
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
// Copyright 2013-2019, University of Colorado Boulder

/**
 * Vertical bar that displays the concentration of a solution.
 * The display can be switched between quantitative and qualitative.
 * The bar is colored using a gradient that corresponds to the solute's color.
 * A pointer to the right of the bar indicates the concentration on the scale.
 * The pointer is color corresponds to its location on the bar.
 * Origin is at the upper-left corner of the bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const DualLabelNode = require( 'MOLARITY/molarity/view/DualLabelNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const MolarityConstants = require( 'MOLARITY/molarity/MolarityConstants' );
  const molarity = require( 'MOLARITY/molarity' );
  const MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  // strings
  const highString = require( 'string!MOLARITY/high' );
  const molarityString = require( 'string!MOLARITY/molarity' );
  const pattern0Value1UnitsString = require( 'string!MOLARITY/pattern.0value.1units' );
  const patternParentheses0TextString = require( 'string!MOLARITY/pattern.parentheses.0text' );
  const solutionConcentrationString = require( 'string!MOLARITY/solutionConcentration' );
  const unitsMolarityString = require( 'string!MOLARITY/units.molarity' );
  const zeroString = require( 'string!MOLARITY/zero' );

  // constants
  var TITLE_FONT = new PhetFont( { size: 24, weight: 'bold' } );
  var SUBTITLE_FONT = new PhetFont( 22 );
  var RANGE_FONT = new PhetFont( 20 );
  var VALUE_FONT = new PhetFont( 20 );
  var ARROW_LENGTH = 55;
  var ARROW_HEAD_HEIGHT = 0.6 * ARROW_LENGTH;
  var ARROW_HEAD_WIDTH = 0.7 * ARROW_LENGTH;
  var ARROW_TAIL_WIDTH = 0.4 * ARROW_LENGTH;

  /**
   * @param {Solution} solution
   * @param {Range} concentrationRange
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Dimension2} barSize
   * @param {Tandem} tandem
   * @constructor
   */
  function ConcentrationDisplay( solution, concentrationRange, valuesVisibleProperty, barSize, tandem ) {

    Node.call( this, {
      pickable: false,
      tandem: tandem
    } );

    // nodes
    var maxTextWidth = 175; // constrain width for i18n, determined empirically

    var titleNode = new MultiLineText( solutionConcentrationString, {
      align: 'center',
      font: TITLE_FONT,
      maxWidth: maxTextWidth,
      tandem: tandem.createTandem( 'titleNode' )
    } );

    var subtitleNode = new Text( StringUtils.format( patternParentheses0TextString, molarityString ), {
      font: SUBTITLE_FONT,
      maxWidth: maxTextWidth,
      tandem: tandem.createTandem( 'subtitleNode' )
    } );

    var maxNode = new DualLabelNode( Util.toFixed( concentrationRange.max, MolarityConstants.RANGE_DECIMAL_PLACES ),
      highString, valuesVisibleProperty, RANGE_FONT, tandem.createTandem( 'maxNode' ),
      { maxWidth: maxTextWidth } );

    var minNode = new DualLabelNode( Util.toFixed( concentrationRange.min,
      concentrationRange.min === 0 ? 0 : MolarityConstants.RANGE_DECIMAL_PLACES ), zeroString,
      valuesVisibleProperty, RANGE_FONT, tandem.createTandem( 'minNode' ),
      { maxWidth: maxTextWidth } );

    var barNode = new Rectangle( 0, 0, barSize.width, barSize.height, {
      stroke: 'black',
      tandem: tandem.createTandem( 'barNode' )
    } );

    var saturatedBarNode = new Rectangle( 0, 0, barSize.width, barSize.height, {
      stroke: 'black',
      fill: Color.LIGHT_GRAY,
      tandem: tandem.createTandem( 'saturatedBarNode' )
    } );

    var pointerNode = new PointerNode( solution, concentrationRange, barSize, valuesVisibleProperty,
      tandem.createTandem( 'pointerNode') );

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
    solution.soluteProperty.link( function( solute ) {

      // Color the bar using a gradient that corresponds to the solute's color range.
      var concentrationScale = Math.min( 1, solute.saturatedConcentration / concentrationRange.max );
      var y = barSize.height - ( barSize.height * concentrationScale );
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

  molarity.register( 'ConcentrationDisplay', ConcentrationDisplay );

  /**
   * @param {Solution} solution
   * @param {Range} concentrationRange
   * @param {Dimension2} barSize
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Tandem} tandem
   */
  function PointerNode( solution, concentrationRange, barSize, valuesVisibleProperty, tandem ) {

    Node.call( this, { tandem: tandem } );

    var valueNode = new Text( '?', {
      font: VALUE_FONT,
      maxWidth: 75,
      tandem: tandem.createTandem( 'valueNode' )
    } );

    var x = barSize.width;
    var y = 0;
    var arrowShape = new Shape()
      .moveTo( x, y )
      .lineTo( x + ARROW_HEAD_HEIGHT, y - (ARROW_HEAD_WIDTH / 2) )
      .lineTo( x + ARROW_HEAD_HEIGHT, y - (ARROW_TAIL_WIDTH / 2) )
      .lineTo( x + ARROW_LENGTH, y - (ARROW_TAIL_WIDTH / 2) )
      .lineTo( x + ARROW_LENGTH, y + (ARROW_TAIL_WIDTH / 2) )
      .lineTo( x + ARROW_HEAD_HEIGHT, y + (ARROW_TAIL_WIDTH / 2) )
      .lineTo( x + ARROW_HEAD_HEIGHT, y + (ARROW_HEAD_WIDTH / 2) )
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
    valuesVisibleProperty.link( function( visible ) {
      valueNode.setVisible( visible );
    } );

    // when the concentration or solute changes...
    var self = this;
    var update = function( concentration ) {

      // update the arrow
      self.arrowNode.y = barSize.height - Util.linear( concentrationRange.min, concentrationRange.max, 0, barSize.height, concentration );
      self.arrowNode.fill = solution.getColor();

      // update the value
      valueNode.text = StringUtils.format( pattern0Value1UnitsString, Util.toFixed( concentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES ), unitsMolarityString );
      valueNode.left = self.arrowNode.right + 5;
      valueNode.centerY = self.arrowNode.centerY;
    };
    solution.concentrationProperty.link( function( concentration ) {
      update( concentration );
    } );
    solution.soluteProperty.link( function() {
      update( solution.concentrationProperty.value );
    } );
  }

  inherit( Node, PointerNode );

  return inherit( Node, ConcentrationDisplay );
} );

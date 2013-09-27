// Copyright 2002-2013, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );
  var DualLabelNode = require( 'MOLARITY/molarity/view/DualLabelNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var strings = require( 'MOLARITY/molarity-strings' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // constants
  var TITLE_FONT = new PhetFont( { size: 24, weight: 'bold' } );
  var SUBTITLE_FONT = new PhetFont( 22 );
  var RANGE_FONT = new PhetFont( 20 );
  var VALUE_FONT = new PhetFont( 20 );
  var ARROW_LENGTH = 55;
  var ARROW_HEAD_HEIGHT = 0.6 * ARROW_LENGTH;
  var ARROW_HEAD_WIDTH = 0.7 * ARROW_LENGTH;
  var ARROW_TAIL_WIDTH = 0.4 * ARROW_LENGTH;
  var RANGE_DECIMAL_PLACES = 1;
  var VALUE_DECIMAL_PLACES = 2;

  /**
   * @param {Solution} solution
   * @param {Range} concentrationRange
   * @param {Dimension2} barSize
   * @param {Property<Boolean>} valuesVisibleProperty
   */
  function Pointer( solution, concentrationRange, barSize, valuesVisibleProperty ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var valueNode = new Text( '?', { font: VALUE_FONT } );
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
    thisNode.arrowNode = new Path( arrowShape, {stroke: 'black' } );

    // rendering order
    this.addChild( valueNode );
    this.addChild( thisNode.arrowNode );

    var updateValuePosition = function() {
      if ( valueNode.visible ) {
        valueNode.left = thisNode.arrowNode.right + 5;
        valueNode.centerY = thisNode.arrowNode.centerY;
      }
    };

    // show/hide value
    valuesVisibleProperty.link( function( visible ) {
      valueNode.setVisible( visible );
      updateValuePosition();
    } );

    // when the concentration or solute changes...
    var update = function( concentration ) {

      // update the arrow
      thisNode.arrowNode.y = barSize.height - Util.linear( concentrationRange.min, concentrationRange.max, 0, barSize.height, concentration );
      thisNode.arrowNode.fill = solution.getColor();

      // update the value
      valueNode.text = StringUtils.format( strings.pattern_0value_1units, concentration.toFixed( VALUE_DECIMAL_PLACES ), strings.units_molarity );
      updateValuePosition();
    };
    solution.concentrationProperty.link( function( concentration ) {
      update( concentration );
    } );
    solution.soluteProperty.link( function() {
      update( solution.concentration );
    } );
  }

  inherit( Node, Pointer );

  function ConcentrationDisplay( solution, concentrationRange, valuesVisibleProperty, barSize ) {

    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    // nodes
    var title = new MultiLineText( strings.solutionConcentration, { align: 'center', font: TITLE_FONT } );
    var subtitle = new Text( StringUtils.format( strings.pattern_parentheses_0text, strings.molarity ), { font: SUBTITLE_FONT } );
    var maxNode = new DualLabelNode( concentrationRange.max.toFixed( RANGE_DECIMAL_PLACES ), strings.high, valuesVisibleProperty, RANGE_FONT );
    var minNode = new DualLabelNode( concentrationRange.min.toFixed( concentrationRange.min === 0 ? 0 : RANGE_DECIMAL_PLACES ), strings.zero, valuesVisibleProperty, RANGE_FONT );
    var barNode = new Rectangle( 0, 0, barSize.width, barSize.height, { stroke: 'black' } );
    var saturatedBarNode = new Rectangle( 0, 0, barSize.width, barSize.height, { stroke: 'black', fill: Color.LIGHT_GRAY } );
    var pointerNode = new Pointer( solution, concentrationRange, barSize, valuesVisibleProperty );

    // rendering order
    thisNode.addChild( title );
    thisNode.addChild( subtitle );
    thisNode.addChild( maxNode );
    thisNode.addChild( minNode );
    thisNode.addChild( barNode );
    thisNode.addChild( saturatedBarNode );
    thisNode.addChild( pointerNode );

    // layout
    barNode.x = 0;
    barNode.y = 0;
    saturatedBarNode.x = barNode.x;
    saturatedBarNode.y = barNode.y;
    maxNode.centerX = barNode.centerX;
    maxNode.bottom = barNode.top - 5;
    minNode.centerX = barNode.centerX;
    minNode.top = barNode.bottom + 5;
    subtitle.centerX = barNode.centerX;
    subtitle.bottom = maxNode.top - 8;
    title.centerX = barNode.centerX;
    title.bottom = subtitle.top - 5;

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

  inherit( Node, ConcentrationDisplay );

  return ConcentrationDisplay;
} );

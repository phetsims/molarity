// Copyright 2018, University of Colorado Boulder

/**
 * Vertical sliders in the Molarity simulation.
 * Can be switched between qualitative and quantitative display of range and value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DualLabelNode = require( 'MOLARITY/molarity/view/DualLabelNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MConstants = require( 'MOLARITY/molarity/MConstants' );
  var molarity = require( 'MOLARITY/molarity' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VSlider = require( 'SUN/VSlider' );

  // strings
  var pattern0Value1UnitsString = require( 'string!MOLARITY/pattern.0value.1units' );

  // constants
  var RANGE_FONT = new PhetFont( 20 );
  var THUMB_NORMAL_COLOR = new Color( 89, 156, 212 );
  var THUMB_HIGHLIGHT_COLOR = THUMB_NORMAL_COLOR.brighterColor();
  var MAX_TEXT_WIDTH = 120; // constrain text for i18n, determined empirically

  /**
   * @param {string} title
   * @param {string} subtitle
   * @param {string} minLabel
   * @param {string} maxLabel
   * @param {Dimension2} trackSize
   * @param {Property.<number>} property
   * @param {Range} range
   * @param {number} decimalPlaces
   * @param {string} units
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function VerticalSlider( title, subtitle, minLabel, maxLabel, trackSize, property, range,
                           decimalPlaces, units, valuesVisibleProperty, tandem ) {

    var titleNode = new MultiLineText( title, {
      font: new PhetFont( { size: 24, weight: 'bold' } ),
      maxWidth: MAX_TEXT_WIDTH,
      tandem: tandem.createTandem( 'titleNode' )
    } );

    var subtitleNode = new Text( subtitle, {
      font: new PhetFont( 22 ),
      maxWidth: MAX_TEXT_WIDTH,
      tandem: tandem.createTandem( 'subtitleNode' )
    } );

    var minNode = new DualLabelNode( Util.toFixed( range.min, range.min === 0 ? 0 : MConstants.RANGE_DECIMAL_PLACES ),
      minLabel, valuesVisibleProperty, RANGE_FONT, tandem.createTandem( 'minNode' ),
      { maxWidth: MAX_TEXT_WIDTH } );

    var maxNode = new DualLabelNode( Util.toFixed( range.max, MConstants.RANGE_DECIMAL_PLACES ),
      maxLabel, valuesVisibleProperty, RANGE_FONT, tandem.createTandem( 'maxNode' ),
      { maxWidth: MAX_TEXT_WIDTH } );

    var sliderNode = new VSlider( property, range, {
      trackSize: new Dimension2( trackSize.height, trackSize.width ), // swap dimensions
      trackFillEnabled: 'black',
      trackStroke: 'rgb( 200, 200, 200 )',
      trackLineWidth: 7,
      trackCornerRadius: 10,
      thumbSize: new Dimension2( 30, 68 ), // in horizontal orientation!
      thumbFillEnabled: THUMB_NORMAL_COLOR,
      thumbFillHighlighted: THUMB_HIGHLIGHT_COLOR,
      tandem: tandem.createTandem( 'sliderNode' ),

      // a11y
      shiftKeyboardStep: Math.pow( 10, decimalPlaces * -1 )
    } );

    var valueNode = new Text( '?', {
      font: new PhetFont( 20 ),
      maxWidth: 90, // constrain for i18n, determined empirically
      tandem: tandem.createTandem( 'valueNode' )
    } );

    // layout
    var centerX = sliderNode.centerX;
    maxNode.centerX = sliderNode.centerX;
    maxNode.bottom = sliderNode.top;
    minNode.centerX = maxNode.centerX;
    minNode.top = sliderNode.bottom;
    subtitleNode.centerX = centerX;
    subtitleNode.bottom = maxNode.top - 5;
    titleNode.centerX = centerX;
    titleNode.bottom = subtitleNode.top - 5;
    valueNode.left = sliderNode.right + 5;

    Node.call( this, {
      children: [ titleNode, subtitleNode, minNode, maxNode, sliderNode, valueNode ],
      tandem: tandem
    } );

    // Update the value display, and position it relative to the track, so it's to the right of the slider thumb.
    var trackMinY = sliderNode.centerY - ( trackSize.height / 2 );
    property.link( function( value ) {
      valueNode.text = StringUtils.format( pattern0Value1UnitsString, Util.toFixed( value, decimalPlaces ), units );
      valueNode.centerY = trackMinY + Util.linear( range.min, range.max, trackSize.height, 0, value );
    } );

    // switch between quantitative and qualitative display
    valuesVisibleProperty.link( function( visible ) {
      valueNode.setVisible( visible );
    } );
  }

  molarity.register( 'VerticalSlider', VerticalSlider );

  return inherit( Node, VerticalSlider );
} );
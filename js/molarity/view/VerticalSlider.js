// Copyright 2013-2019, University of Colorado Boulder

/**
 * Vertical sliders in the Molarity simulation.
 * Can be switched between qualitative and quantitative display of range and value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const DualLabelNode = require( 'MOLARITY/molarity/view/DualLabelNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MConstants = require( 'MOLARITY/molarity/MConstants' );
  const molarity = require( 'MOLARITY/molarity' );
  const MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VSlider = require( 'SUN/VSlider' );

  // strings
  const pattern0Value1UnitsString = require( 'string!MOLARITY/pattern.0value.1units' );

  // constants
  const RANGE_FONT = new PhetFont( 20 );
  const THUMB_NORMAL_COLOR = new Color( 89, 156, 212 );
  const THUMB_HIGHLIGHT_COLOR = THUMB_NORMAL_COLOR.brighterColor();
  const MAX_TEXT_WIDTH = 120; // constrain text for i18n, determined empirically

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
   * @param {string} accessibleName - a11y
   * @param {string} helpText - a11y
   * @param {function} getOnFocusAriaValueText - a11y
   * @param {function} getOnChangeAriaValueText - a11y
   * @param {function} setInitialAlert - a11y: used to trigger the alert read out right after slider is focused
   * @param {Property} soluteProperty
   * @constructor
   */
  function VerticalSlider( title, subtitle, minLabel, maxLabel, trackSize, property, range,
                           decimalPlaces, units, valuesVisibleProperty, tandem, accessibleName, helpText,
                           getOnFocusAriaValueText, getOnChangeAriaValueText, setInitialAlert, soluteProperty ) {

    const titleNode = new MultiLineText( title, {
      font: new PhetFont( { size: 24, weight: 'bold' } ),
      maxWidth: MAX_TEXT_WIDTH,
      tandem: tandem.createTandem( 'titleNode' )
    } );

    const subtitleNode = new Text( subtitle, {
      font: new PhetFont( 22 ),
      maxWidth: MAX_TEXT_WIDTH,
      tandem: tandem.createTandem( 'subtitleNode' )
    } );

    const minNode = new DualLabelNode( Util.toFixed( range.min, range.min === 0 ? 0 : MConstants.RANGE_DECIMAL_PLACES ),
      minLabel, valuesVisibleProperty, RANGE_FONT, tandem.createTandem( 'minNode' ),
      { maxWidth: MAX_TEXT_WIDTH } );

    const maxNode = new DualLabelNode( Util.toFixed( range.max, MConstants.RANGE_DECIMAL_PLACES ),
      maxLabel, valuesVisibleProperty, RANGE_FONT, tandem.createTandem( 'maxNode' ),
      { maxWidth: MAX_TEXT_WIDTH } );

    // @public (read-only) {string|null} - what, if anything, is currently dragging the thumb, null if nothing
    this.draggingPointerType = null;

    const sliderNode = new VSlider( property, range, {
      trackSize: new Dimension2( trackSize.height, trackSize.width ), // swap dimensions
      trackFillEnabled: 'black',
      trackStroke: 'rgb( 200, 200, 200 )',
      trackLineWidth: 7,
      trackCornerRadius: 10,
      thumbSize: new Dimension2( 30, 68 ), // in horizontal orientation!
      thumbFill: THUMB_NORMAL_COLOR,
      thumbFillHighlighted: THUMB_HIGHLIGHT_COLOR,
      tandem: tandem.createTandem( 'sliderNode' ),

      // a11y
      shiftKeyboardStep: Math.pow( 10, decimalPlaces * -1 ),
      accessibleName: accessibleName,
      helpText: helpText,
      appendDescription: true,
      keyboardStep: 0.050,
      a11yCreateOnFocusAriaValueText: getOnFocusAriaValueText,
      a11yCreateValueChangeAriaValueText: getOnChangeAriaValueText,
      containerTagName: 'div', // for fixing layout in a11y-view with aria-valuetext
      startDrag: event => {
        this.draggingPointerType = event.pointer.type;
      },
      endDrag: () => {
        this.draggingPointerType = null;
      }
    } );

    // a11y - sets the initial alert status of the describer to true (a special alert is read on initial slider change)
    sliderNode.addInputListener( {
      focus: setInitialAlert
    } );

    const valueNode = new Text( '?', {
      font: new PhetFont( 20 ),
      maxWidth: 90, // constrain for i18n, determined empirically
      tandem: tandem.createTandem( 'valueNode' )
    } );

    // layout
    const centerX = sliderNode.centerX;
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
    const trackMinY = sliderNode.centerY - ( trackSize.height / 2 );
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

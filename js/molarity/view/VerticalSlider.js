// Copyright 2013-2020, University of Colorado Boulder

/**
 * Vertical sliders in the Molarity simulation.
 * Can be switched between qualitative and quantitative display of range and value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const DualLabelNode = require( 'MOLARITY/molarity/view/DualLabelNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MolarityConstants = require( 'MOLARITY/molarity/MolarityConstants' );
  const merge = require( 'PHET_CORE/merge' );
  const molarity = require( 'MOLARITY/molarity' );
  const MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
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
   * @param {Property.<number>} property
   * @param {Range} range
   * @param {number} decimalPlaces
   * @param {string} units
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Property.<boolean>} useQuantitativeDescriptionsProperty -  whether quantitative or qualitative alerts and
   *                                                                    descriptions are used.
   * @param {MolarityAlertManager} alertManager
   * @param {SolutionQuantityDescriber} describer
   * @param {Object} [options]
   * @constructor
   */
  function VerticalSlider( title, subtitle, minLabel, maxLabel, property, range, decimalPlaces, units,
                           valuesVisibleProperty, useQuantitativeDescriptionsProperty, alertManager, describer, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED, // {Tandem}
      sliderOptions: {
        trackFillEnabled: 'black',
        trackStroke: 'rgb( 200, 200, 200 )',
        trackLineWidth: 7,
        trackCornerRadius: 10,
        thumbSize: new Dimension2( 68, 30 ),
        trackSize: new Dimension2( 10, 200 ),
        thumbFill: THUMB_NORMAL_COLOR,
        thumbFillHighlighted: THUMB_HIGHLIGHT_COLOR,

        // a11y
        shiftKeyboardStep: Math.pow( 10, decimalPlaces * -1 ),
        appendDescription: true,
        keyboardStep: 0.050,
        a11yDependencies: [],
        containerTagName: 'div' // for fixing layout in a11y-view with aria-valuetext
      }
    }, options );

    assert && assert( options.sliderOptions.tandem === undefined, 'VerticalSlider sets its own sliderOptions.tandem' );
    assert && assert( options.sliderOptions.startDrag === undefined, 'VerticalSlider sets its own sliderOptions.startDrag' );
    assert && assert( options.sliderOptions.endDrag === undefined, 'VerticalSlider sets its own sliderOptions.endDrag' );
    assert && assert( options.sliderOptions.a11yDependencies.indexOf( useQuantitativeDescriptionsProperty ) === -1,
      'VerticalSlider adds useQuantitativeDescriptionsProperty as an a11yDependency, no need to add it yourself.' );

    // aria-valuetext is also updated whenever useQuantitative Descriptions Property changes. Push this instead of adding
    // it as a default to support client passing in their own a11yDependencies.
    options.sliderOptions.a11yDependencies.push( useQuantitativeDescriptionsProperty );

    // options set by VerticalSlider
    options = merge( {
      sliderOptions: {
        tandem: options.tandem.createTandem( 'sliderNode' ),
        startDrag: event => {
          this.draggingPointerType = event.pointer.type;
        },
        endDrag: () => {
          this.draggingPointerType = null;
          alertManager.alertSolutionQuantityChanged( describer );
        }
      }
    }, options );

    const titleNode = new MultiLineText( title, {
      font: new PhetFont( { size: 24, weight: 'bold' } ),
      maxWidth: MAX_TEXT_WIDTH,
      tandem: options.tandem.createTandem( 'titleNode' )
    } );

    const subtitleNode = new Text( subtitle, {
      font: new PhetFont( 22 ),
      maxWidth: MAX_TEXT_WIDTH,
      tandem: options.tandem.createTandem( 'subtitleNode' )
    } );

    const minNode = new DualLabelNode( Utils.toFixed( range.min, range.min === 0 ? 0 : MolarityConstants.RANGE_DECIMAL_PLACES ),
      minLabel, valuesVisibleProperty, RANGE_FONT, options.tandem.createTandem( 'minNode' ),
      { maxWidth: MAX_TEXT_WIDTH } );

    const maxNode = new DualLabelNode( Utils.toFixed( range.max, MolarityConstants.RANGE_DECIMAL_PLACES ),
      maxLabel, valuesVisibleProperty, RANGE_FONT, options.tandem.createTandem( 'maxNode' ),
      { maxWidth: MAX_TEXT_WIDTH } );

    // @public (read-only) {string|null} - what, if anything, is currently dragging the thumb, null if nothing
    this.draggingPointerType = null;

    const sliderNode = new VSlider( property, range, options.sliderOptions );

    const valueNode = new Text( '?', {
      font: new PhetFont( 20 ),
      maxWidth: 90, // constrain for i18n, determined empirically
      tandem: options.tandem.createTandem( 'valueNode' )
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
      tandem: options.tandem
    } );

    // Update the value display, and position it relative to the track, so it's to the right of the slider thumb.
    const trackMinY = sliderNode.centerY - ( options.sliderOptions.trackSize.height / 2 );
    property.link( function( value ) {
      valueNode.text = StringUtils.format( pattern0Value1UnitsString, Utils.toFixed( value, decimalPlaces ), units );
      valueNode.centerY = trackMinY + Utils.linear( range.min, range.max, options.sliderOptions.trackSize.height, 0, value );
    } );

    // switch between quantitative and qualitative display
    valuesVisibleProperty.link( function( visible ) {
      valueNode.setVisible( visible );
    } );
  }

  molarity.register( 'VerticalSlider', VerticalSlider );

  return inherit( Node, VerticalSlider );
} );

// Copyright 2013-2023, University of Colorado Boulder

/**
 * Vertical sliders in the Molarity simulation.
 * Can be switched between qualitative and quantitative display of range and value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Node, RichText, Text } from '../../../../scenery/js/imports.js';
import VSlider from '../../../../sun/js/VSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import molarity from '../../molarity.js';
import MolarityStrings from '../../MolarityStrings.js';
import MolarityConstants from '../MolarityConstants.js';
import DualLabelNode from './DualLabelNode.js';

const pattern0Value1UnitsString = MolarityStrings.pattern[ '0value' ][ '1units' ];

// constants
const RANGE_FONT = new PhetFont( 20 );
const THUMB_NORMAL_COLOR = new Color( 89, 156, 212 );
const THUMB_HIGHLIGHT_COLOR = THUMB_NORMAL_COLOR.brighterColor();
const MAX_TEXT_WIDTH = 120; // constrain text for i18n, determined empirically

class VerticalSlider extends Node {
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
   */
  constructor( title, subtitle, minLabel, maxLabel, property, range, decimalPlaces, units, valuesVisibleProperty,
               useQuantitativeDescriptionsProperty, alertManager, describer, options ) {

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

        // Turn off default sound generation, since this does its own.
        soundGenerator: null,

        // pdom
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
    assert && assert( options.constrainValue === undefined, 'VerticalSlider sets its own constrainValue' );
    assert && assert( options.sliderOptions.a11yDependencies.indexOf( useQuantitativeDescriptionsProperty ) === -1,
      'VerticalSlider adds useQuantitativeDescriptionsProperty as an a11yDependency, no need to add it yourself.' );

    // aria-valuetext is also updated whenever useQuantitative Descriptions Property changes. Push this instead of adding
    // it as a default to support client passing in their own a11yDependencies.
    options.sliderOptions.a11yDependencies.push( useQuantitativeDescriptionsProperty );

    // model values are constrained to the number of decimal places supported by the slider so that resultant molarity
    // values are calculated without discrepancies due to precision
    options.sliderOptions.constrainValue = value => Utils.toFixedNumber( value, decimalPlaces );

    // options set by VerticalSlider
    options = merge( {
      sliderOptions: {
        tandem: options.tandem.createTandem( 'slider' ),
        startDrag: event => {
          this.draggingPointerType = event.pointer.type;
        },
        endDrag: () => {
          this.draggingPointerType = null;
          alertManager.alertSolutionQuantityChanged( describer );
        }
      }
    }, options );

    const titleText = new RichText( title, {
      replaceNewlines: true,
      align: 'center',
      font: new PhetFont( { size: 24, weight: 'bold' } ),
      maxWidth: MAX_TEXT_WIDTH,
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    const subtitleText = new Text( subtitle, {
      font: new PhetFont( 22 ),
      maxWidth: MAX_TEXT_WIDTH,
      tandem: options.tandem.createTandem( 'subtitleText' )
    } );

    const minNode = new DualLabelNode( Utils.toFixed( range.min, range.min === 0 ? 0 : MolarityConstants.RANGE_DECIMAL_PLACES ),
      minLabel, valuesVisibleProperty, RANGE_FONT, options.tandem.createTandem( 'minNode' ),
      { maxWidth: MAX_TEXT_WIDTH } );

    const maxNode = new DualLabelNode( Utils.toFixed( range.max, MolarityConstants.RANGE_DECIMAL_PLACES ),
      maxLabel, valuesVisibleProperty, RANGE_FONT, options.tandem.createTandem( 'maxNode' ),
      { maxWidth: MAX_TEXT_WIDTH } );

    const sliderNode = new VSlider( property, range, options.sliderOptions );

    const valueText = new Text( '?', {
      font: new PhetFont( 20 ),
      maxWidth: 90, // constrain for i18n, determined empirically
      tandem: options.tandem.createTandem( 'valueText' )
    } );

    // layout
    const centerX = sliderNode.centerX;
    maxNode.centerX = sliderNode.centerX;
    maxNode.bottom = sliderNode.top;
    minNode.centerX = maxNode.centerX;
    minNode.top = sliderNode.bottom;
    subtitleText.centerX = centerX;
    subtitleText.bottom = maxNode.top - 5;
    titleText.centerX = centerX;
    titleText.bottom = subtitleText.top - 5;
    valueText.left = sliderNode.right + 5;

    super( {
      children: [ titleText, subtitleText, minNode, maxNode, sliderNode, valueText ],
      tandem: options.tandem
    } );

    // @public (read-only) {string|null} - what, if anything, is currently dragging the thumb, null if nothing
    this.draggingPointerType = null;

    // Update the value display, and position it relative to the track, so it's to the right of the slider thumb.
    const trackMinY = sliderNode.centerY - ( options.sliderOptions.trackSize.height / 2 );
    property.link( value => {
      valueText.string = StringUtils.format( pattern0Value1UnitsString, Utils.toFixed( value, decimalPlaces ), units );
      valueText.centerY = trackMinY + Utils.linear( range.min, range.max, options.sliderOptions.trackSize.height, 0, value );
    } );

    // switch between quantitative and qualitative display
    valuesVisibleProperty.link( visible => {
      valueText.setVisible( visible );
    } );
  }
}

molarity.register( 'VerticalSlider', VerticalSlider );

export default VerticalSlider;
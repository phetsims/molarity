// Copyright 2013-2017, University of Colorado Boulder

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
  var FillHighlightListener = require( 'SCENERY_PHET/input/FillHighlightListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MConstants = require( 'MOLARITY/molarity/MConstants' );
  var molarity = require( 'MOLARITY/molarity' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TandemSimpleDragHandler = require( 'TANDEM/scenery/input/TandemSimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var pattern0Value1UnitsString = require( 'string!MOLARITY/pattern.0value.1units' );

  // constants
  var TITLE_FONT = new PhetFont( { size: 24, weight: 'bold' } );
  var SUBTITLE_FONT = new PhetFont( 22 );
  var RANGE_FONT = new PhetFont( 20 );
  var VALUE_FONT = new PhetFont( 20 );
  var THUMB_SIZE = new Dimension2( 68, 30 );
  var THUMB_NORMAL_COLOR = new Color( 89, 156, 212 );
  var THUMB_HIGHLIGHT_COLOR = THUMB_NORMAL_COLOR.brighterColor();
  var THUMB_STROKE_COLOR = Color.BLACK;
  var THUMB_CENTER_LINE_COLOR = Color.WHITE;
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

    Node.call( this, { tandem: tandem } );

    var titleNode = new MultiLineText( title, {
      font: TITLE_FONT,
      maxWidth: MAX_TEXT_WIDTH,
      tandem: tandem.createTandem( 'titleNode' )
    } );

    var subtitleNode = new Text( subtitle, {
      font: SUBTITLE_FONT,
      maxWidth: MAX_TEXT_WIDTH,
      tandem: tandem.createTandem( 'subtitleNode' )
    } );

    var minNode = new DualLabelNode( Util.toFixed( range.min, range.min === 0 ? 0 : MConstants.RANGE_DECIMAL_PLACES ),
      minLabel, valuesVisibleProperty, RANGE_FONT, tandem.createTandem( 'minNode' ),
      { maxWidth: MAX_TEXT_WIDTH } );

    var maxNode = new DualLabelNode( Util.toFixed( range.max, MConstants.RANGE_DECIMAL_PLACES ),
      maxLabel, valuesVisibleProperty, RANGE_FONT, tandem.createTandem( 'maxNode' ),
      { maxWidth: MAX_TEXT_WIDTH } );

    var trackNode = new TrackNode( trackSize, property, range, decimalPlaces, tandem.createTandem( 'trackNode' ) );

    var xMargin = 7;
    var yMargin = 7;
    var cornerRadius = 10;

    var trackBackgroundNode = new Rectangle( -xMargin, -yMargin, trackSize.width + ( 2 * xMargin ), trackSize.height + ( 2 * yMargin ), {
      fill: new Color( 200, 200, 200, 140 ),
      cornerRadius: cornerRadius,
      tandem: tandem.createTandem( 'trackBackgroundNode' )
    } );

    var thumbNode = new ThumbNode( THUMB_SIZE, property, range, decimalPlaces,
      new RangeWithValue( 0, trackSize.height ), tandem.createTandem( 'thumbNode' ) );

    var valueNode = new Text( '?', {
      font: VALUE_FONT,
      maxWidth: 90, // constrain for i18n, determined empirically
      tandem: tandem.createTandem( 'valueNode' )
    } );

    // rendering order
    this.addChild( titleNode );
    this.addChild( subtitleNode );
    this.addChild( minNode );
    this.addChild( maxNode );
    this.addChild( trackBackgroundNode );
    this.addChild( trackNode );
    this.addChild( thumbNode );
    this.addChild( valueNode );

    // layout
    var centerX = trackBackgroundNode.centerX;
    maxNode.centerX = centerX;
    maxNode.bottom = trackBackgroundNode.top - ( thumbNode.height / 2 );
    minNode.centerX = centerX;
    minNode.top = trackBackgroundNode.bottom + ( thumbNode.height / 2 );
    subtitleNode.centerX = centerX;
    subtitleNode.bottom = maxNode.top - 5;
    titleNode.centerX = centerX;
    titleNode.bottom = subtitleNode.top - 5;
    thumbNode.centerX = trackNode.centerX;
    thumbNode.centerY = trackNode.centerY;

    var updateValuePosition = function() {
      if ( valueNode.visible ) {
        valueNode.left = thumbNode.right + 5;
        valueNode.centerY = thumbNode.centerY;
      }
    };

    // move the slider thumb to reflect the model value
    property.link( function( value ) {
      // move the thumb
      var y = Util.linear( range.min, range.max, trackSize.height, 0, value );
      thumbNode.y = Util.clamp( y, 0, trackSize.height );
      // update the value
      valueNode.text = StringUtils.format( pattern0Value1UnitsString, Util.toFixed( value, decimalPlaces ), units );
      updateValuePosition();
    } );

    // switch between quantitative and qualitative display
    valuesVisibleProperty.link( function( visible ) {
      valueNode.setVisible( visible );
      updateValuePosition();
    } );
  }

  molarity.register( 'VerticalSlider', VerticalSlider );

  /**
   * Track that the thumb moves in, origin at upper left.
   * Clicking in the track changes the value, continue dragging if desired.
   * @param {Dimension2} size
   * @param {Property.<number>} property
   * @param {Range} range
   * @param {number} decimalPlaces
   * @param {Tandem} tandem
   * @constructor
   */
  function TrackNode( size, property, range, decimalPlaces, tandem ) {

    var self = this;

    Rectangle.call( this, 0, 0, size.width, size.height, { fill: 'black', cursor: 'pointer' } );

    var handleEvent = function( event ) {
      var y = self.globalToLocalPoint( event.pointer.point ).y;
      var value = Util.linear( 0, size.height, range.max, range.min, y );
      property.value = Util.toFixedNumber( Util.clamp( value, range.min, range.max ), decimalPlaces );
    };

    var trackDragHandler = new TandemSimpleDragHandler( {

      tandem: tandem.createTandem( 'trackDragHandler' ),

      allowTouchSnag: true,

      start: function( event ) { handleEvent( event ); },

      drag: function( event ) { handleEvent( event ); }
    } );

    this.addInputListener( trackDragHandler );
  }

  molarity.register( 'VerticalSlider.TrackNode', TrackNode );

  inherit( Rectangle, TrackNode );

  /**
   * The slider thumb, a rounded rectangle with a horizontal line through its center.
   * Origin is at the thumb's geometric center.
   * @param {Dimension2} size
   * @param {Property.<number>} property
   * @param {Range} valueRange
   * @param {number} decimalPlaces
   * @param {Range} positionRange
   * @param {Tandem} tandem
   * @constructor
   */
  function ThumbNode( size, property, valueRange, decimalPlaces, positionRange, tandem ) {

    var self = this;
    Node.call( this );

    var rectangleNode = new Rectangle( -size.width / 2, -size.height / 2, size.width, size.height, {
      cornerRadius: 10,
      fill: THUMB_NORMAL_COLOR,
      stroke: THUMB_STROKE_COLOR,
      lineWidth: 1,
      tandem: tandem.createTandem( 'rectangleNode' )
    } );

    // horizontal center line
    var lineNode = new Path( Shape.lineSegment( -( size.width / 2 ) + 3, 0, ( size.width / 2 ) - 3, 0 ), {
      stroke: THUMB_CENTER_LINE_COLOR,
      pickable: false,
      tandem: tandem.createTandem( 'lineNode' )
    } );

    // rendering order
    self.addChild( rectangleNode );
    self.addChild( lineNode );

    // touch area
    var touchXMargin = 0; // thumb seems wide enough, so zero for now
    var touchYMargin = 1 * rectangleNode.height; // expand height since thumb is not very tall and drag direction is vertical
    rectangleNode.touchArea = Shape.rectangle( rectangleNode.left - touchXMargin, rectangleNode.top - touchYMargin,
      rectangleNode.width + ( 2 * touchXMargin ), rectangleNode.height + ( 2 * touchYMargin ) );

    // interactivity
    self.cursor = 'pointer';
    self.addInputListener( new ThumbDragHandler( self, property, valueRange, decimalPlaces, positionRange,
      tandem.createTandem( 'thumbDragHandler' ) ) );

    // Ignore this for phet-io instrumentation
    rectangleNode.addInputListener( new FillHighlightListener( THUMB_NORMAL_COLOR, THUMB_HIGHLIGHT_COLOR ) );
  }

  molarity.register( 'VerticalSlider.ThumbNode', ThumbNode );

  inherit( Node, ThumbNode );

  /**
   * Drag handler for the slider thumb.
   * @param {Node} dragNode
   * @param {Property.<number>} property
   * @param {Range} valueRange
   * @param {number} decimalPlaces
   * @param {Range} positionRange
   * @param {Tandem} tandem
   * @constructor
   */
  function ThumbDragHandler( dragNode, property, valueRange, decimalPlaces, positionRange, tandem ) {

    var clickYOffset; // y-offset between initial click and thumb's origin

    TandemSimpleDragHandler.call( this, {

      tandem: tandem,

      start: function( event ) {
        clickYOffset = dragNode.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
      },

      drag: function( event ) {
        var y = dragNode.globalToParentPoint( event.pointer.point ).y - clickYOffset;
        var value = Util.linear( positionRange.min, positionRange.max, valueRange.max, valueRange.min, y );
        property.value = Util.toFixedNumber( Util.clamp( value, valueRange.min, valueRange.max ), decimalPlaces );
      }
    } );
  }

  molarity.register( 'VerticalSlider.ThumbDragHandler', ThumbDragHandler );

  inherit( TandemSimpleDragHandler, ThumbDragHandler );

  return inherit( Node, VerticalSlider );
} );
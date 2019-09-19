// Copyright 2013-2019, University of Colorado Boulder

/**
 * Visual representation of a beaker.
 * 3D perspective is provided by an image (see BeakerImageNode).
 * Other elements (ticks, label, ...) are added programmatically.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BeakerImageNode = require( 'MOLARITY/molarity/view/BeakerImageNode' );
  const BeakerLabelNode = require( 'MOLARITY/molarity/view/BeakerLabelNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Color = require( 'SCENERY/util/Color' );
  const inherit = require( 'PHET_CORE/inherit' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const MolarityBeakerDescriptionNode = require( 'MOLARITY/molarity/view/MolarityBeakerDescriptionNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const pattern0Value1UnitsString = require( 'string!MOLARITY/pattern.0value.1units' );
  const unitsLitersString = require( 'string!MOLARITY/units.liters' );

  // a11y strings
  var beakerHeaderString = MolarityA11yStrings.beakerHeader.value;

  // constants
  var DEBUG_SHAPES = false;
  var TICK_COLOR = Color.GRAY;
  var MINOR_TICK_SPACING = 0.1; // L
  var MINOR_TICKS_PER_MAJOR_TICK = 5;
  var MAJOR_TICK_LABELS = [ '\u00bd', '1' ]; // 1/2L, 1L
  var TICK_LABEL_FONT = new PhetFont( 20 );
  var TICK_LABEL_COLOR = Color.DARK_GRAY;
  var TICK_LABEL_X_SPACING = 8;

  /**
   * @param {Solution} solution
   * @param {number} maxVolume
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Tandem} tandem
   * @param {SoluteDescriber} soluteDescriber - a11y
   * @param {SoluteAmountDescriber} soluteAmountDescriber - a11y
   * @param {VolumeDescriber} volumeDescriber - a11y
   * @param {concentrationDescriber} concentrationDescriber - a11y
   * @param {Property.<boolean>} useQuantitativeDescriptionsProperty - a11y
   * @constructor
   */
  function BeakerNode( solution, maxVolume, valuesVisibleProperty, tandem, soluteDescriber, soluteAmountDescriber,
                       volumeDescriber, concentrationDescriber, useQuantitativeDescriptionsProperty ) {

    Node.call( this, {
      pickable: false,
      tandem: tandem,
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: beakerHeaderString
    } );

    // @private the glass beaker
    this.beakerImageNode = new BeakerImageNode( tandem.createTandem( 'beakerImageNode' ), { scale: 0.75 } );
    var cylinderSize = this.beakerImageNode.getCylinderSize();
    var cylinderOffset = this.beakerImageNode.getCylinderOffset();
    var cylinderEndHeight = this.beakerImageNode.getCylinderEndHeight();
    this.beakerImageNode.translation = new Vector2( -cylinderOffset.x, -cylinderOffset.y );

    // inside bottom line
    var bottomShape = new Shape().ellipticalArc( cylinderSize.width / 2, cylinderSize.height,
      cylinderSize.width / 2, cylinderEndHeight / 2,
      0, Util.toRadians( 0 ), Util.toRadians( 180 ), true );
    var bottomNode = new Path( bottomShape, {
      stroke: new Color( 150, 150, 150, 100 ),
      lineWidth: 2,
      tandem: tandem.createTandem( 'bottomNode' )
    } );

    // label on the beaker
    var labelNode = new BeakerLabelNode( solution, tandem.createTandem( 'labelNode' ) );
    labelNode.x = cylinderSize.width / 2;
    labelNode.y = 0.15 * cylinderSize.height;

    // parents for tick marks and labels
    var tickMarksParent = new Node( { tandem: tandem.createTandem( 'tickMarksParent' ) } );
    var tickLabelsParent = new Node( { tandem: tandem.createTandem( 'tickLabelsParent' ) } );

    // rendering order
    this.addChild( bottomNode );
    this.addChild( this.beakerImageNode );
    this.addChild( tickMarksParent );
    this.addChild( tickLabelsParent );
    this.addChild( labelNode );

    // tick marks, arcs that wrap around the edge of the beaker's cylinder
    var numberOfTicks = Util.roundSymmetric( maxVolume / MINOR_TICK_SPACING );
    var bottomY = cylinderSize.height; // don't use bounds or position will be off because of stroke width
    var deltaY = cylinderSize.height / numberOfTicks;

    // vars used inside the for-loop
    var y;
    var tickMarkShape;
    var tickMarkNode;
    var tickLabelIndex;
    var tickLabel;
    var tickLabelNode;

    var tickMarkNodeGroupTandem = tandem.createGroupTandem( 'tickMarkNode' );
    var tickLabelNodeGroupTandem = tandem.createGroupTandem( 'tickLabelNode' );

    for ( var i = 1; i <= numberOfTicks; i++ ) {
      y = bottomY - ( i * deltaY );
      if ( i % MINOR_TICKS_PER_MAJOR_TICK === 0 ) {

        // major tick mark
        tickMarkShape = new Shape().ellipticalArc( cylinderSize.width / 2, y, cylinderSize.width / 2, cylinderEndHeight / 2, 0, Util.toRadians( 165 ), Util.toRadians( 135 ), true );
        tickMarkNode = new Path( tickMarkShape, {
          stroke: TICK_COLOR,
          lineWidth: 2,
          tandem: tickMarkNodeGroupTandem.createNextTandem()
        } );
        tickMarksParent.addChild( tickMarkNode );

        // major tick label
        tickLabelIndex = ( i / MINOR_TICKS_PER_MAJOR_TICK ) - 1;
        if ( tickLabelIndex < MAJOR_TICK_LABELS.length ) {
          tickLabel = StringUtils.format( pattern0Value1UnitsString, MAJOR_TICK_LABELS[ tickLabelIndex ], unitsLitersString );
          tickLabelNode = new Text( tickLabel, {
            font: TICK_LABEL_FONT,
            stroke: TICK_LABEL_COLOR,
            maxWidth: 100,
            tandem: tickLabelNodeGroupTandem.createNextTandem()
          } );
          tickLabelsParent.addChild( tickLabelNode );
          tickLabelNode.left = tickMarkNode.right + TICK_LABEL_X_SPACING;
          tickLabelNode.centerY = tickMarkNode.bottom;
        }
      }
      else {

        // minor tick mark, no label
        tickMarkShape = new Shape().ellipticalArc( cylinderSize.width / 2, y, cylinderSize.width / 2, cylinderEndHeight / 2, 0, Util.toRadians( 165 ), Util.toRadians( 150 ), true );
        tickMarkNode = new Path( tickMarkShape, {
          stroke: TICK_COLOR,
          lineWidth: 2,
          tandem: tickMarkNodeGroupTandem.createNextTandem()
        } );
        tickMarksParent.addChild( tickMarkNode );
      }
    }

    if ( DEBUG_SHAPES ) {
      // draw the cylinder that represents the beaker's interior
      this.addChild( new Rectangle( 0, 0, cylinderSize.width, cylinderSize.height, { stroke: 'red' } ) );
      // draw a circle at the origin
      this.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    valuesVisibleProperty.link( function( visible ) {
      tickLabelsParent.visible = visible;
    } );

    // a11y - adds the description node that holds the PDOM summary of the beaker.
    this.addChild( new MolarityBeakerDescriptionNode( solution, useQuantitativeDescriptionsProperty, soluteDescriber,
      concentrationDescriber, soluteAmountDescriber, volumeDescriber ) );

  }

  molarity.register( 'BeakerNode', BeakerNode );

  return inherit( Node, BeakerNode, {

    // @public
    getCylinderSize: function() {
      return this.beakerImageNode.getCylinderSize();
    },

    // @public
    getCylinderEndHeight: function() {
      return this.beakerImageNode.getCylinderEndHeight();
    }
  } );
} );
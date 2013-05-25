// Copyright 2002-2013, University of Colorado

/**
* Visual representation of a beaker.
* 3D perspective is provided by an image (see BeakerImageNode).
* Other elements (ticks, label, ...) are added programmatically.
*
* @author Chris Malley (PixelZoom, Inc.)
*/
define( function( require ) {

  // imports
  var BeakerImageNode = require( "molarity/view/BeakerImageNode" );
  var BeakerLabelNode = require( "molarity/view/BeakerLabelNode" );
  var Color = require( "SCENERY/util/Color" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var MFont = require( "molarity/MFont" );
  var MImages = require( "molarity/MImages" );
  var Node = require( "SCENERY/nodes/Node" );

  // tick mark properties
  var TICK_COLOR = Color.GRAY;
  var MINOR_TICK_SPACING = 0.1; // L
  var MINOR_TICKS_PER_MAJOR_TICK = 5;
//      var MAJOR_TICK_STROKE = new BasicStroke( 2f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL );
//      var MINOR_TICK_STROKE = new BasicStroke( 2f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL );

  // tick label properties
  var MAJOR_TICK_LABELS = [ "\u00bd", "1" ]; // 1/2L, 1L
  var TICK_LABEL_FONT = new MFont( 20 );
  var TICK_LABEL_COLOR = Color.DARK_GRAY;
  var TICK_LABEL_X_SPACING = 8;

  /**
   * @param {Solution} solution
   * @param {Number} maxVolume
   * @param {Property<Boolean>} valuesVisible
   * @constructor
   */
  function BeakerNode( solution, maxVolume, valuesVisible ) {

    var thisNode = this;
    Node.call( thisNode );

    // the glass beaker
    thisNode._beakerImageNode = new BeakerImageNode();
    thisNode._beakerImageNode.scale( 0.75, 0.75 );
    var cylinderSize = thisNode._beakerImageNode.getCylinderSize();
    var cylinderOffset = thisNode._beakerImageNode.getCylinderOffset();
    var cylinderEndHeight = thisNode._beakerImageNode.getCylinderEndHeight();
    thisNode._beakerImageNode.x = -cylinderOffset.x;
    thisNode._beakerImageNode.y = -cylinderOffset.y;

    // inside bottom line
//            PPath bottomNode = new PPath() {{
//                setPathTo( new Arc2D.Double( 0, cylinderSize.getHeight() - ( cylinderEndHeight / 2 ), cylinderSize.getWidth(), cylinderEndHeight,
//                                             5, 170, Arc2D.OPEN ) );
//                setStroke( new BasicStroke( 2f ) );
//                setStrokePaint( new Color( 150, 150, 150, 100 ) );
//            }};
//
//    thisNode.addChild( bottomNode );

    thisNode.addChild( thisNode._beakerImageNode );

    thisNode._tickLabelNodes = []; //XXX

    // label on the beaker
    var labelNode = new BeakerLabelNode( solution );
    thisNode.addChild( labelNode );
    labelNode.x = cylinderSize.width / 2;
    labelNode.y = 0.15 * cylinderSize.height;

    valuesVisible.addObserver( function( visible ) {
      thisNode._setValuesVisible( visible );
    } );

  }

  inherit( BeakerNode, Node );

  // Controls visibility of tick mark values
  BeakerNode.prototype._setValuesVisible = function( visible ) {
    for ( var i = 0; i < this._tickLabelNodes.length; i++ ) {
      this._tickLabelNodes[i].visible = visible;
    }
  };

  BeakerNode.prototype.getCylinderSize = function() {
    return this._beakerImageNode.getCylinderSize();
  };

  BeakerNode.prototype.getCylinderEndHeight = function() {
    return this._beakerImageNode.getCylinderEndHeight();
  };

  return BeakerNode;
} );

//        // tick marks, arcs that wrap around the edge of the beaker's cylinder
//        tickLabelNodes = new ArrayList<PText>();
//        PComposite ticksNode = new PComposite();
//        addChild( ticksNode );
//        int numberOfTicks = (int) Math.round( maxVolume / MINOR_TICK_SPACING );
//        final double bottomY = cylinderSize.getHeight(); // don't use bounds or position will be off because of stroke width
//        double deltaY = cylinderSize.getHeight() / numberOfTicks;
//        for ( int i = 1; i <= numberOfTicks; i++ ) {
//            final double y = bottomY - ( i * deltaY ) - ( cylinderEndHeight / 2 );
//            if ( i % MINOR_TICKS_PER_MAJOR_TICK == 0 ) {
//                // major tick
//                PPath tickNode = new PPath( new Arc2D.Double( 0, y, cylinderSize.getWidth(), cylinderEndHeight, 195, 30, Arc2D.OPEN ) ) {{
//                    setStroke( MAJOR_TICK_STROKE );
//                    setStrokePaint( TICK_COLOR );
//                }};
//                ticksNode.addChild( tickNode );
//
//                // major tick label
//                int labelIndex = ( i / MINOR_TICKS_PER_MAJOR_TICK ) - 1;
//                if ( labelIndex < MAJOR_TICK_LABELS.length ) {
//                    String label = MAJOR_TICK_LABELS[labelIndex] + volumeUnits;
//                    PText textNode = new PText( label ) {{
//                        setFont( TICK_LABEL_FONT );
//                        setTextPaint( TICK_LABEL_COLOR );
//                    }};
//                    ticksNode.addChild( textNode );
//                    textNode.setOffset( tickNode.getFullBounds().getMaxX() + TICK_LABEL_X_SPACING,
//                                        tickNode.getFullBounds().getMaxY() - ( textNode.getFullBoundsReference().getHeight() / 2 ) );
//                    tickLabelNodes.add( textNode );
//                }
//            }
//            else {
//                // minor tick, no label
//                PPath tickNode = new PPath( new Arc2D.Double( 0, y, cylinderSize.getWidth(), cylinderEndHeight, 195, 15, Arc2D.OPEN ) ) {{
//                    setStroke( MINOR_TICK_STROKE );
//                    setStrokePaint( TICK_COLOR );
//                }};
//                ticksNode.addChild( tickNode );
//            }
//        }
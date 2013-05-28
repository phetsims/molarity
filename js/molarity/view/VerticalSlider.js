// Copyright 2002-2013, University of Colorado

/**
* Vertical sliders in the Molarity simulation.
* Can be switched between qualitative and quantitative display of range and value.
*
* @author Chris Malley (PixelZoom, Inc.)
*/
define( function(require){

  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );

  function VerticalSlider( title, subtitle, minLabel, maxLabel, trackSize, modelValue, range, units, valuesVisible ) {
    var thisNode = this;
    Node.call( thisNode );
  }

  inherit( VerticalSlider, Node );

  return VerticalSlider;
});

//public class VerticalSliderNode extends PhetPNode {
//
//    private static final PDimension THUMB_SIZE = new PDimension( 45, 15 );
//
//    private final Function modelToView; // maps a model value to a track position
//    private final PNode trackNode;
//    private final ThumbNode thumbNode;
//
//    // Slider with a default track fill and background color.
//    public VerticalSliderNode( IUserComponent userComponent, String title, String subtitle, String minLabel, String maxLabel, final PDimension trackSize,
//                               final Property<Double> modelValue, DoubleRange range, String units, Property<Boolean> valuesVisible ) {
//        this( userComponent, title, subtitle, minLabel, maxLabel, trackSize, Color.BLACK, new Color( 200, 200, 200, 140 ), modelValue, range, units, valuesVisible );
//    }
//
//    /**
//     * Constructor
//     *
//     * @param userComponent        component identifier that will appear in data collection messages
//     * @param title                main title that appears above the title
//     * @param subtitle             subtitle that appear below the main title, in a less font
//     * @param minLabel             qualitative label for min
//     * @param maxLabel             qualitative label for max
//     * @param trackSize            size of the slider track
//     * @param trackPaint           color used to fill the track
//     * @param trackBackgroundPaint color used for the background that appears around the track
//     * @param modelValue           model value that the slider is attached to
//     * @param range                range of the slider
//     * @param units                units for the value
//     * @param valuesVisible        quantitative when true, qualitative when false
//     */
//    public VerticalSliderNode( IUserComponent userComponent, String title, String subtitle, String minLabel, String maxLabel,
//                               final PDimension trackSize, final Paint trackPaint, final Paint trackBackgroundPaint,
//                               final Property<Double> modelValue, DoubleRange range, String units, Property<Boolean> valuesVisible ) {
//
//        this.modelToView = new LinearFunction( range.getMin(), range.getMax(), trackSize.getHeight(), 0 );
//
//        // title & subtitle
//        PNode titleNode = new HTMLNode( title, Color.BLACK, MolarityConstants.TITLE_FONT );
//        PNode subtitleNode = new HTMLNode( subtitle, Color.BLACK, MolarityConstants.SUBTITLE_FONT );
//
//        // track that the thumb moves in
//        trackNode = new TrackNode( UserComponentChain.chain( userComponent, UserComponents.track ), trackSize, trackPaint, modelValue, range, modelToView.createInverse() );
//
//        // background that surrounds the track
//        PNode backgroundNode = new PPath() {{
//            final double xMargin = 7;
//            final double yMargin = 7;
//            setPathTo( new RoundRectangle2D.Double( -xMargin, -yMargin, trackSize.getWidth() + ( 2 * xMargin ), trackSize.getHeight() + ( 2 * yMargin ), 10, 10 ) );
//            setPaint( trackBackgroundPaint );
//            setStroke( null );
//
//        }};
//
//        // thumb that moves in the track
//        thumbNode = new ThumbNode( UserComponentChain.chain( userComponent, UserComponents.thumb ), THUMB_SIZE, this, trackNode, range, modelValue, units, valuesVisible );
//
//        // min and max labels
//        final PNode minNode = new DualLabelNode( MolarityConstants.RANGE_FORMAT.format( range.getMin() ), minLabel, valuesVisible, MolarityConstants.RANGE_FONT );
//        final PNode maxNode = new DualLabelNode( MolarityConstants.RANGE_FORMAT.format( range.getMax() ), maxLabel, valuesVisible, MolarityConstants.RANGE_FONT );
//
//        // rendering order
//        {
//            addChild( titleNode );
//            addChild( subtitleNode );
//            addChild( maxNode );
//            addChild( minNode );
//            addChild( backgroundNode );
//            addChild( trackNode );
//            addChild( thumbNode );
//        }
//
//        // layout
//        {
//            // max label centered above the bar
//            maxNode.setOffset( trackNode.getFullBoundsReference().getCenterX(),
//                               trackNode.getFullBoundsReference().getMinY() - ( thumbNode.getFullBoundsReference().getHeight() / 2 ) - maxNode.getFullBoundsReference().getHeight() - 1 );
//            // min label centered below the bar
//            minNode.setOffset( trackNode.getFullBoundsReference().getCenterX(),
//                               trackNode.getFullBoundsReference().getMaxY() + ( thumbNode.getFullBoundsReference().getHeight() / 2 ) + 1 );
//            // subtitle centered above max label
//            subtitleNode.setOffset( trackNode.getFullBoundsReference().getCenterX() - ( subtitleNode.getFullBoundsReference().getWidth() / 2 ),
//                                    maxNode.getFullBoundsReference().getMinY() - subtitleNode.getFullBoundsReference().getHeight() - 8 );
//            // title centered above subtitle
//            titleNode.setOffset( trackNode.getFullBoundsReference().getCenterX() - ( titleNode.getFullBoundsReference().getWidth() / 2 ),
//                                 subtitleNode.getFullBoundsReference().getMinY() - titleNode.getFullBoundsReference().getHeight() - 2 );
//            // thumb centered in track
//            thumbNode.setOffset( trackNode.getFullBoundsReference().getCenterX(),
//                                 trackNode.getFullBoundsReference().getCenterY() );
//        }
//
//        // move the slider thumb to reflect the model value
//        modelValue.addObserver( new VoidFunction1<Double>() {
//            public void apply( Double value ) {
//                thumbNode.setOffset( thumbNode.getXOffset(), modelToView.evaluate( value ) );
//            }
//        } );
//    }
//
//    // Track that the thumb moves in, origin at upper left. Clicking in the track changes the value.
//    private static class TrackNode extends PPath {
//
//        public TrackNode( final IUserComponent userComponent, PDimension trackSize, Paint trackPaint,
//                          final Property<Double> modelValue, final DoubleRange range, final Function viewToModel ) {
//
//            setPathTo( new Rectangle2D.Double( 0, 0, trackSize.getWidth(), trackSize.getHeight() ) );
//            setPaint( trackPaint );
//
//            addInputEventListener( new CursorHandler() );
//            addInputEventListener( new SimSharingDragHandler( userComponent, UserComponentTypes.slider ) {
//
//                // Clicking in the track changes the model to the corresponding value.
//                @Override protected void startDrag( PInputEvent event ) {
//                    super.startDrag( event );
//                    handleEvent( event );
//                }
//
//                // ... and after clicking in the track, you can continue to drag.
//                @Override public void drag( PInputEvent event ) {
//                    super.drag( event );
//                    handleEvent( event );
//                }
//
//                private void handleEvent( PInputEvent event ) {
//                    double trackPosition = event.getPositionRelativeTo( TrackNode.this ).getY();
//                    double value = Math.min( Math.max( viewToModel.evaluate( trackPosition ), range.getMin() ), range.getMax() );
//                    modelValue.set( value );
//                }
//            } );
//        }
//    }
//
//    // The slider thumb, a rounded rectangle with a horizontal line through its center. Origin is at the thumb's geometric center.
//    private static class ThumbNode extends PComposite {
//
//        private static final Stroke THUMB_STROKE = new BasicStroke( 1f );
//        private static final Color THUMB_NORMAL_COLOR = new Color( 89, 156, 212 );
//        private static final Color THUMB_HIGHLIGHT_COLOR = THUMB_NORMAL_COLOR.brighter();
//        private static final Color THUMB_STROKE_COLOR = Color.BLACK;
//        private static final Color THUMB_CENTER_LINE_COLOR = Color.WHITE;
//
//        private final PText valueNode; // value displayed to the right of the thumb
//
//        public ThumbNode( IUserComponent userComponent, final PDimension size, PNode relativeNode, PNode trackNode,
//                          DoubleRange range, final Property<Double> modelValue, final String units, Property<Boolean> valuesVisible ) {
//
//            PPath bodyNode = new PPath() {{
//                final double arcWidth = 0.25 * size.getWidth();
//                setPathTo( new RoundRectangle2D.Double( -size.getWidth() / 2, -size.getHeight() / 2, size.getWidth(), size.getHeight(), arcWidth, arcWidth ) );
//                setPaint( THUMB_NORMAL_COLOR );
//                setStroke( THUMB_STROKE );
//                setStrokePaint( THUMB_STROKE_COLOR );
//            }};
//
//            PPath centerLineNode = new PPath() {{
//                setPathTo( new Line2D.Double( -( size.getWidth() / 2 ) + 3, 0, ( size.getWidth() / 2 ) - 3, 0 ) );
//                setStrokePaint( THUMB_CENTER_LINE_COLOR );
//            }};
//
//            this.valueNode = new PText( "?" ) {{
//                setFont( MolarityConstants.VALUE_FONT );
//            }};
//            // value placed to the right of the thumb, vertically centered
//            valueNode.setOffset( bodyNode.getFullBoundsReference().getMaxX() + 5,
//                                 bodyNode.getFullBoundsReference().getCenterY() - ( valueNode.getFullBoundsReference().getHeight() / 2 ) );
//
//            // rendering order
//            addChild( bodyNode );
//            addChild( centerLineNode );
//            addChild( valueNode );
//
//            // switch between quantitative and qualitative display
//            valuesVisible.addObserver( new VoidFunction1<Boolean>() {
//                public void apply( Boolean visible ) {
//                    valueNode.setVisible( visible );
//                }
//            } );
//
//            // update the value to match the model
//            modelValue.addObserver( new VoidFunction1<Double>() {
//                public void apply( Double value ) {
//                    valueNode.setText( MessageFormat.format( Strings.PATTERN__0VALUE__1UNITS, MolarityConstants.VALUE_FORMAT.format( value ), units ) );
//                }
//            } );
//
//            addInputEventListener( new CursorHandler() );
//            addInputEventListener( new PaintHighlightHandler( bodyNode, THUMB_NORMAL_COLOR, THUMB_HIGHLIGHT_COLOR ) );
//            addInputEventListener( new ThumbDragHandler( userComponent, relativeNode, trackNode, this, range, modelValue ) );
//        }
//    }
//
//    // Drag handler for the slider thumb, with data collection support.
//    private static class ThumbDragHandler extends SliderThumbDragHandler {
//
//        private final Property<Double> modelValue;
//
//        public ThumbDragHandler( IUserComponent userComponent, PNode relativeNode, PNode trackNode, PNode thumbNode,
//                                 DoubleRange range, final Property<Double> modelValue ) {
//            super( userComponent, false, Orientation.VERTICAL, relativeNode, trackNode, thumbNode, range,
//                   new VoidFunction1<Double>() {
//                       public void apply( Double value ) {
//                           // limit precision so that student calculations are correct
//                           modelValue.set( new PrecisionDecimal( value, MolarityConstants.VALUE_DECIMAL_PLACES ).getValue() );
//                       }
//                   } );
//            this.modelValue = modelValue;
//        }
//
//        @Override protected ParameterSet getParametersForAllEvents( PInputEvent event ) {
//            return super.getParametersForAllEvents( event ).with( ParameterKeys.value, modelValue.get() );
//        }
//    }
//}

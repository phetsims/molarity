// Copyright 2013-2019, University of Colorado Boulder

/**
 * View for the 'Molarity' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BeakerNode = require( 'MOLARITY/molarity/view/BeakerNode' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Checkbox = require( 'SUN/Checkbox' );
  var ConcentrationDisplay = require( 'MOLARITY/molarity/view/ConcentrationDisplay' );
  var ControlAreaNode = require( 'SCENERY_PHET/accessibility/nodes/ControlAreaNode');
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MConstants = require( 'MOLARITY/molarity/MConstants' );
  var molarity = require( 'MOLARITY/molarity' );
  var MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings');
  var MolarityScreenSummaryNode = require( 'MOLARITY/molarity/view/MolarityScreenSummaryNode');
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayAreaNode = require( 'SCENERY_PHET/accessibility/nodes/PlayAreaNode');
  var PrecipitateNode = require( 'MOLARITY/molarity/view/PrecipitateNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SaturatedIndicator = require( 'MOLARITY/molarity/view/SaturatedIndicator' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shape = require( 'KITE/Shape' );
  var SoluteComboBox = require( 'MOLARITY/molarity/view/SoluteComboBox' );
  var SolutionNode = require( 'MOLARITY/molarity/view/SolutionNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalSlider = require( 'MOLARITY/molarity/view/VerticalSlider' );

  // strings
  var fullString = require( 'string!MOLARITY/full' );
  var litersString = require( 'string!MOLARITY/liters' );
  var lotsString = require( 'string!MOLARITY/lots' );
  var lowString = require( 'string!MOLARITY/low' );
  var molesString = require( 'string!MOLARITY/moles' );
  var noneString = require( 'string!MOLARITY/none' );
  var patternParentheses0TextString = require( 'string!MOLARITY/pattern.parentheses.0text' );
  var showValuesString = require( 'string!MOLARITY/showValues' );
  var soluteAmountString = require( 'string!MOLARITY/soluteAmount' );
  var solutionVolumeString = require( 'string!MOLARITY/solutionVolume' );
  var unitsLitersString = require( 'string!MOLARITY/units.liters' );
  var unitsMolesString = require( 'string!MOLARITY/units.moles' );

  // a11y strings
  var soluteAmountAccessibleNameString = MolarityA11yStrings.soluteAmountAccessibleName.value;
  var solutionVolumeAccessibleNameString = MolarityA11yStrings.solutionVolumeAccessibleName.value;

  // constants
  var SLIDER_TRACK_WIDTH = 12;

  /**
   * @param {MolarityModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function MolarityScreenView( model, tandem ) {

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 1100, 700 ),
      tandem: tandem,
      addScreenSummaryNode: true
    } );

    var valuesVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' )
    } );

    const molarityScreenSummaryNode = new MolarityScreenSummaryNode( model, valuesVisibleProperty );
    this.screenSummaryNode.addChild( molarityScreenSummaryNode );

    // beaker, with solution and precipitate inside of it
    var beakerNode = new BeakerNode( model.solution, MConstants.SOLUTION_VOLUME_RANGE.max, valuesVisibleProperty,
      tandem.createTandem( 'beakerNode' ) );
    var cylinderSize = beakerNode.getCylinderSize();
    var solutionNode = new SolutionNode( cylinderSize, beakerNode.getCylinderEndHeight(), model.solution,
      MConstants.SOLUTION_VOLUME_RANGE.max, tandem.createTandem( 'solutionNode' ) );
    var precipitateNode = new PrecipitateNode( model.solution, cylinderSize, beakerNode.getCylinderEndHeight(),
      model.maxPrecipitateAmount, tandem.createTandem( 'precipitateNode' ) );
    var saturatedIndicator = new SaturatedIndicator( model.solution, tandem.createTandem( 'saturatedIndicator' ) );

    // solute control
    var soluteComboBoxListParent = new Node( { maxWidth: 300 } );
    var soluteComboBox = new SoluteComboBox( model.solutes, model.solution.soluteProperty, soluteComboBoxListParent,
      tandem.createTandem( 'soluteComboBox' ), {
      maxWidth: 500
    } );

    // slider for controlling amount of solute
    var soluteAmountSlider = new VerticalSlider( soluteAmountString,
      StringUtils.format( patternParentheses0TextString, molesString ),
      noneString, lotsString,
      new Dimension2( SLIDER_TRACK_WIDTH, cylinderSize.height ),
      model.solution.soluteAmountProperty,
      MConstants.SOLUTE_AMOUNT_RANGE,
      MConstants.SOLUTE_AMOUNT_DECIMAL_PLACES,
      unitsMolesString,
      valuesVisibleProperty,
      tandem.createTandem( 'soluteAmountSlider' ), soluteAmountAccessibleNameString );

    // slider for controlling volume of solution, sized to match tick marks on the beaker
    var volumeSliderHeight = ( MConstants.SOLUTION_VOLUME_RANGE.getLength() / MConstants.SOLUTION_VOLUME_RANGE.max ) * cylinderSize.height;
    var solutionVolumeSlider = new VerticalSlider( solutionVolumeString,
      StringUtils.format( patternParentheses0TextString, litersString ),
      lowString, fullString,
      new Dimension2( SLIDER_TRACK_WIDTH, volumeSliderHeight ),
      model.solution.volumeProperty,
      MConstants.SOLUTION_VOLUME_RANGE,
      MConstants.SOLUTION_VOLUME_DECIMAL_PLACES,
      unitsLitersString,
      valuesVisibleProperty,
      tandem.createTandem( 'solutionVolumeSlider' ), solutionVolumeAccessibleNameString );

    // concentration display
    var concentrationBarSize = new Dimension2( 40, cylinderSize.height + 50 );
    var concentrationDisplay = new ConcentrationDisplay( model.solution, MConstants.CONCENTRATION_RANGE,
      valuesVisibleProperty, concentrationBarSize, tandem.createTandem( 'concentrationDisplay' ) );

    var playAreaNode= new PlayAreaNode();
    playAreaNode.accessibleOrder = [ soluteAmountSlider, solutionVolumeSlider, soluteComboBox ];

    // Show Values checkbox
    var showValuesLabel = new Text( showValuesString, {
      font: new PhetFont( 22 ),
      tandem: tandem.createTandem( 'showValuesText' )
    } );
    var showValuesCheckbox = new Checkbox( showValuesLabel, valuesVisibleProperty, {
      maxWidth: 175,
      tandem: tandem.createTandem( 'showValuesCheckbox' ),

      // a11y
      labelTagName: 'span',
      labelContent: showValuesString
    } );
    showValuesCheckbox.touchArea = Shape.rectangle( showValuesCheckbox.left, showValuesCheckbox.top - 15, showValuesCheckbox.width, showValuesCheckbox.height + 30 );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        valuesVisibleProperty.reset();
        model.reset();
      },
      scale: 1.32,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    var controlAreaNode = new ControlAreaNode();
    controlAreaNode.accessibleOrder = [ showValuesCheckbox, resetAllButton ];

    // layout for things that don't have a location in the model
    {
      soluteAmountSlider.left = 0;
      soluteAmountSlider.top = 0;
      // to the right of the Solute Amount slider
      solutionVolumeSlider.left = soluteAmountSlider.right + 5;
      solutionVolumeSlider.top = soluteAmountSlider.top;
      // to the right of the Solution Volume slider
      beakerNode.left = solutionVolumeSlider.right - 15;
      beakerNode.top = soluteAmountSlider.top - 11;
      // same coordinate frame as beaker
      solutionNode.x = beakerNode.x;
      solutionNode.y = beakerNode.y;
      // same coordinate frame as beaker
      precipitateNode.x = beakerNode.x;
      precipitateNode.y = beakerNode.y;
      // centered below beaker
      soluteComboBox.centerX = beakerNode.centerX;
      soluteComboBox.top = beakerNode.bottom + 50;
      // toward bottom of the beaker
      var saturatedIndicatorVisible = saturatedIndicator.visible; // so we can layout an invisible node
      saturatedIndicator.visible = true;
      saturatedIndicator.centerX = beakerNode.x + ( cylinderSize.width / 2 );
      saturatedIndicator.bottom = beakerNode.bottom - ( 0.2 * cylinderSize.height );
      saturatedIndicator.visible = saturatedIndicatorVisible;
      // right of beaker
      concentrationDisplay.left = beakerNode.right + 40;
      concentrationDisplay.bottom = beakerNode.bottom;
      // left of combo box
      showValuesCheckbox.right = soluteComboBox.left - 50;
      showValuesCheckbox.centerY = soluteComboBox.centerY;
      // right of combo box
      resetAllButton.left = Math.max( soluteComboBox.right + 10, concentrationDisplay.centerX - ( resetAllButton.width / 2 ) );
      resetAllButton.centerY = soluteComboBox.centerY;
    }

    // center everything on the screen
    this.addChild( new Node( {
      children: [
        solutionNode,
        beakerNode,
        precipitateNode,
        saturatedIndicator,
        soluteAmountSlider,
        solutionVolumeSlider,
        concentrationDisplay,
        showValuesCheckbox,
        resetAllButton,
        soluteComboBox,
        soluteComboBoxListParent,
        playAreaNode,
        controlAreaNode
      ],
      center: this.layoutBounds.center
    } ) );
  }

  molarity.register( 'MolarityScreenView', MolarityScreenView );

  return inherit( ScreenView, MolarityScreenView );
} );

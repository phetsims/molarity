// Copyright 2013-2017, University of Colorado Boulder

/**
 * View for the 'Molarity' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BeakerNode = require( 'MOLARITY/molarity/view/BeakerNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var CheckBox = require( 'SUN/CheckBox' );
  var ConcentrationDisplay = require( 'MOLARITY/molarity/view/ConcentrationDisplay' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MConstants = require( 'MOLARITY/molarity/MConstants' );
  var molarity = require( 'MOLARITY/molarity' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PrecipitateNode = require( 'MOLARITY/molarity/view/PrecipitateNode' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SaturatedIndicator = require( 'MOLARITY/molarity/view/SaturatedIndicator' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shape = require( 'KITE/Shape' );
  var SoluteComboBox = require( 'MOLARITY/molarity/view/SoluteComboBox' );
  var SolutionNode = require( 'MOLARITY/molarity/view/SolutionNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
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

  /**
   * @param {MolarityModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function MolarityScreenView( model, tandem ) {

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 1100, 700 ),
      tandem: tandem
    } );

    var valuesVisibleProperty = new Property( false );

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
      new Dimension2( 5, cylinderSize.height ),
      model.solution.soluteAmountProperty,
      MConstants.SOLUTE_AMOUNT_RANGE,
      MConstants.SOLUTE_AMOUNT_DECIMAL_PLACES,
      unitsMolesString,
      valuesVisibleProperty,
      tandem.createTandem( 'soluteAmountSlider' ) );

    // slider for controlling volume of solution, sized to match tick marks on the beaker
    var volumeSliderHeight = ( MConstants.SOLUTION_VOLUME_RANGE.getLength() / MConstants.SOLUTION_VOLUME_RANGE.max ) * cylinderSize.height;
    var solutionVolumeSlider = new VerticalSlider( solutionVolumeString,
      StringUtils.format( patternParentheses0TextString, litersString ),
      lowString, fullString,
      new Dimension2( 5, volumeSliderHeight ),
      model.solution.volumeProperty,
      MConstants.SOLUTION_VOLUME_RANGE,
      MConstants.SOLUTION_VOLUME_DECIMAL_PLACES,
      unitsLitersString,
      valuesVisibleProperty,
      tandem.createTandem( 'solutionVolumeSlider' ) );

    // concentration display
    var concentrationBarSize = new Dimension2( 40, cylinderSize.height + 50 );
    var concentrationDisplay = new ConcentrationDisplay( model.solution, MConstants.CONCENTRATION_RANGE,
      valuesVisibleProperty, concentrationBarSize, tandem.createTandem( 'concentrationDisplay' ) );

    // Show Values check box
    var showValuesCheckBox = CheckBox.createTextCheckBox( showValuesString, { font: new PhetFont( 22 ) }, valuesVisibleProperty, {
      maxWidth: 175,
      tandem: tandem.createTandem( 'showValuesCheckBox' )
    } );
    showValuesCheckBox.touchArea = Shape.rectangle( showValuesCheckBox.left, showValuesCheckBox.top - 15, showValuesCheckBox.width, showValuesCheckBox.height + 30 );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        valuesVisibleProperty.reset();
        model.reset();
      },
      scale: 1.32,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // layout for things that don't have a location in the model
    {
      soluteAmountSlider.left = 0;
      soluteAmountSlider.top = 0;
      // to the right of the Solute Amount slider
      solutionVolumeSlider.left = soluteAmountSlider.right + 5;
      solutionVolumeSlider.y = soluteAmountSlider.y;
      // to the right of the Solution Volume slider
      beakerNode.left = solutionVolumeSlider.right - 15;
      beakerNode.y = soluteAmountSlider.y;
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
      showValuesCheckBox.right = soluteComboBox.left - 50;
      showValuesCheckBox.centerY = soluteComboBox.centerY;
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
        showValuesCheckBox,
        resetAllButton,
        soluteComboBox,
        soluteComboBoxListParent
      ],
      center: this.layoutBounds.center
    } ) );
  }

  molarity.register( 'MolarityScreenView', MolarityScreenView );

  return inherit( ScreenView, MolarityScreenView );
} );

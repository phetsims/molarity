// Copyright 2002-2013, University of Colorado Boulder

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
  var MolarityModel = require( 'MOLARITY/molarity/model/MolarityModel' );
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
  var pattern_parentheses_0text = require( 'string!MOLARITY/pattern.parentheses.0text' );
  var showValuesString = require( 'string!MOLARITY/showValues' );
  var soluteAmountString = require( 'string!MOLARITY/soluteAmount' );
  var solutionVolumeString = require( 'string!MOLARITY/solutionVolume' );
  var units_litersString = require( 'string!MOLARITY/units.liters' );
  var units_molesString = require( 'string!MOLARITY/units.moles' );

  // constants
  var SOLUTE_AMOUNT_DECIMAL_PLACES = 2;
  var VOLUME_DECIMAL_PLACES = 2;

  /**
   * @param {MolarityModel} model
   * @constructor
   */
  function MolarityView( model ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg', layoutBounds: new Bounds2( 0, 0, 1100, 700 ) } );

    var valuesVisibleProperty = new Property( false );

    // beaker, with solution and precipitate inside of it
    var beakerNode = new BeakerNode( model.solution, MolarityModel.SOLUTION_VOLUME_RANGE.max, valuesVisibleProperty );
    var cylinderSize = beakerNode.getCylinderSize();
    var solutionNode = new SolutionNode( cylinderSize, beakerNode.getCylinderEndHeight(), model.solution, MolarityModel.SOLUTION_VOLUME_RANGE.max );
    var precipitateNode = new PrecipitateNode( model.solution, cylinderSize, beakerNode.getCylinderEndHeight(), model.maxPrecipitateAmount );
    var saturatedIndicator = new SaturatedIndicator( model.solution );

    // solute control
    var foregroundNode = new Node();
    var soluteComboBox = new SoluteComboBox( model.solutes, model.solution.soluteProperty, foregroundNode );

    // slider for controlling amount of solute
    var soluteAmountSlider = new VerticalSlider( soluteAmountString,
      StringUtils.format( pattern_parentheses_0text, molesString ),
      noneString, lotsString,
      new Dimension2( 5, cylinderSize.height ),
      model.solution.soluteAmountProperty,
      MolarityModel.SOLUTE_AMOUNT_RANGE,
      SOLUTE_AMOUNT_DECIMAL_PLACES,
      units_molesString,
      valuesVisibleProperty );

    // slider for controlling volume of solution, sized to match tick marks on the beaker
    var volumeSliderHeight = ( MolarityModel.SOLUTION_VOLUME_RANGE.getLength() / MolarityModel.SOLUTION_VOLUME_RANGE.max ) * cylinderSize.height;
    var solutionVolumeSlider = new VerticalSlider( solutionVolumeString,
      StringUtils.format( pattern_parentheses_0text, litersString ),
      lowString, fullString,
      new Dimension2( 5, volumeSliderHeight ),
      model.solution.volumeProperty,
      MolarityModel.SOLUTION_VOLUME_RANGE,
      VOLUME_DECIMAL_PLACES,
      units_litersString,
      valuesVisibleProperty );

    // concentration display
    var concentrationBarSize = new Dimension2( 40, cylinderSize.height + 50 );
    var concentrationDisplay = new ConcentrationDisplay( model.solution, MolarityModel.CONCENTRATION_DISPLAY_RANGE, valuesVisibleProperty, concentrationBarSize );

    // Show Values check box
    var showValuesCheckBox = CheckBox.createTextCheckBox( showValuesString, { font: new PhetFont( 22 ) }, valuesVisibleProperty );
    showValuesCheckBox.touchArea = Shape.rectangle( showValuesCheckBox.left, showValuesCheckBox.top - 15, showValuesCheckBox.width, showValuesCheckBox.height + 30 );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        valuesVisibleProperty.reset();
        model.reset();
      },
      scale: 1.32
    } );

    // rendering order
    this.addChild( solutionNode );
    this.addChild( beakerNode );
    this.addChild( precipitateNode );
    this.addChild( saturatedIndicator );
    this.addChild( soluteAmountSlider );
    this.addChild( solutionVolumeSlider );
    this.addChild( concentrationDisplay );
    this.addChild( showValuesCheckBox );
    this.addChild( resetAllButton );
    this.addChild( soluteComboBox );
    this.addChild( foregroundNode );

    // layout for things that don't have a location in the model
    {
      soluteAmountSlider.left = 35;
      soluteAmountSlider.top = 65;
      // to the right of the Solute Amount slider
      solutionVolumeSlider.left = soluteAmountSlider.right + 20;
      solutionVolumeSlider.y = soluteAmountSlider.y;
      // to the right of the Solution Volume slider
      beakerNode.left = solutionVolumeSlider.right + 20;
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
      concentrationDisplay.left = beakerNode.right + 50;
      concentrationDisplay.bottom = beakerNode.bottom;
      // left of combo box
      showValuesCheckBox.right = soluteComboBox.left - 50;
      showValuesCheckBox.centerY = soluteComboBox.centerY;
      // right of combo box
      resetAllButton.left = Math.max( soluteComboBox.right + 10, concentrationDisplay.centerX - ( resetAllButton.width / 2 ) );
      resetAllButton.centerY = soluteComboBox.centerY;
    }
  }

  return inherit( ScreenView, MolarityView );
} );

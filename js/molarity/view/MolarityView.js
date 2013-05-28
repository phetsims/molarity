// Copyright 2002-2013, University of Colorado

/**
 * View for the "Molarity" tab.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BeakerNode = require( "molarity/view/BeakerNode" );
  var Bounds2 = require( "DOT/Bounds2" );
  var CheckBox = require( "common/util/CheckBox" );
  var ConcentrationDisplay = require( "molarity/view/ConcentrationDisplay" );
  var Dimension2 = require( "DOT/Dimension2" );
  var inherit = require( "PHET_CORE/inherit" );
  var MFont = require( "molarity/MFont" );
  var MStrings = require( "molarity/MStrings" );
  var PrecipitateNode = require( "molarity/view/PrecipitateNode" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var ResetAllButton = require( "SCENERY_PHET/ResetAllButton" );
  var SaturatedIndicator = require( "molarity/view/SaturatedIndicator" );
  var SoluteComboBox = require( "molarity/view/SoluteComboBox" );
  var SolutionNode = require( "molarity/view/SolutionNode" );
  var TabView = require( "JOIST/TabView" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {MolarityModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function MolarityView( model, mvt ) {

    var thisView = this;
    TabView.call( thisView );

    var valuesVisible = new Property( true );

    // beaker, with solution and precipitate inside of it
    var beakerNode = new BeakerNode( model.solution, model.getSolutionVolumeRange().max, valuesVisible );
    var cylinderSize = beakerNode.getCylinderSize();
    var solutionNode = new SolutionNode( cylinderSize, beakerNode.getCylinderEndHeight(), model.solution, model.getSolutionVolumeRange().max );
    var precipitateNode = new PrecipitateNode( model.solution, cylinderSize, beakerNode.getCylinderEndHeight() );
    var saturatedIndicator = new SaturatedIndicator( model.solution );

    // solute control
    var soluteComboBox = new SoluteComboBox( model.solutes, model.solution.solute );

    // concentration display
    var concentrationBarSize = new Dimension2( 40, cylinderSize.height + 50 );
    var concentrationDisplay = new ConcentrationDisplay( model.solution, model.getConcentrationDisplayRange(), valuesVisible, concentrationBarSize );

    // Show Values check box
    var showValuesCheckBox = new CheckBox( new Text( MStrings.showValues, { font: new MFont( 22 ) } ), valuesVisible );

    // Reset All button
    var resetAllButton = new ResetAllButton( function() {
      valuesVisible.reset();
      model.reset();
    } );

    // rendering order
    this.addChild( solutionNode );
    this.addChild( beakerNode );
    this.addChild( precipitateNode );
    this.addChild( saturatedIndicator );
    this.addChild( concentrationDisplay );
    this.addChild( showValuesCheckBox );
    this.addChild( resetAllButton );
    this.addChild( soluteComboBox );

    // layout for things that don't have a location in the model
    {
      beakerNode.left = 300;
      beakerNode.top = 100;
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
      concentrationDisplay.top = beakerNode.top;
      // left of combo box
      showValuesCheckBox.right = soluteComboBox.left - 50;
      showValuesCheckBox.centerY = soluteComboBox.centerY;
      // right of combo box
      resetAllButton.left = soluteComboBox.right + 100;
      resetAllButton.centerY = showValuesCheckBox.centerY;
    }
  }

  inherit( MolarityView, TabView, { layoutBounds: new Bounds2( 0, 0, 1024, 700 ) } );

  return MolarityView;
} );

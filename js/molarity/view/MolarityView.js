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
  var Dimension2 = require( "DOT/Dimension2" );
  var inherit = require( "PHET_CORE/inherit" );
  var MFont = require( "molarity/MFont" );
  var MStrings = require( "molarity/MStrings" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var ResetAllButton = require( "SCENERY_PHET/ResetAllButton" );
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
    var solutionNode = new SolutionNode( beakerNode.getCylinderSize(), beakerNode.getCylinderEndHeight(), model.solution, model.getSolutionVolumeRange().max );

    // solute control
    var soluteComboBox = new SoluteComboBox( model.solutes, model.solution.solute );

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
    this.addChild( showValuesCheckBox );
    this.addChild( resetAllButton );
    this.addChild( soluteComboBox );

    // layout for things that don't have a location in the model
    {
      beakerNode.left = 100;
      beakerNode.top = 100;
      // same coordinate frame as beaker
      solutionNode.x = beakerNode.x;
      solutionNode.y = beakerNode.y;
      // centered below beaker
      soluteComboBox.centerX = beakerNode.centerX;
      soluteComboBox.top = beakerNode.bottom + 50;
      showValuesCheckBox.left = beakerNode.right + 50;
      showValuesCheckBox.top = beakerNode.top;
      resetAllButton.left = beakerNode.right + 50;
      resetAllButton.bottom = beakerNode.bottom;
    }
  }

  inherit( MolarityView, TabView, { layoutBounds: new Bounds2( 0, 0, 1024, 700 ) } );

  return MolarityView;
} );

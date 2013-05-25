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
  var Dimension2 = require( "DOT/Dimension2" );
  var inherit = require( "PHET_CORE/inherit" );
  var MFont = require( "molarity/MFont" );
  var MStrings = require( "molarity/MStrings" );
  var Property = require( "PHETCOMMON/model/property/Property" );
  var ResetAllButton = require( "SCENERY_PHET/ResetAllButton" );
  var TabView = require( "JOIST/TabView" );

  /**
   * @param {MolarityModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function MolarityView( model, mvt ) {

    var thisView = this;
    TabView.call( thisView );

    var valuesVisible = new Property( false );

    // beaker, with solution and precipitate inside of it
    var beakerNode = new BeakerNode( model.solution, model.getSolutionVolumeRange().max, valuesVisible );

    // Reset All button
    var resetAllButton = new ResetAllButton( function() {
      valuesVisible.reset();
      model.reset();
    } );

    // rendering order
    this.addChild( beakerNode );
    this.addChild( resetAllButton );

    // layout for things that don't have a location in the model
    {
      beakerNode.left = 100;
      beakerNode.top = 100;
      resetAllButton.left = beakerNode.right + 50;
      resetAllButton.bottom = beakerNode.bottom;
    }
  }

  inherit( MolarityView, TabView, { layoutBounds: new Bounds2( 0, 0, 1024, 700 ) } );

  return MolarityView;
} );

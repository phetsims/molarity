// Copyright 2002-2013, University of Colorado

/**
 * The "Molarity" tab. Conforms to the contract specified in joist/Tab
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var ModelViewTransform2 = require( "PHETCOMMON/view/ModelViewTransform2" );
  var MolarityModel = require( "molarity/model/MolarityModel" );
  var MolarityView = require( "molarity/view/MolarityView" );
  var MImages = require( "molarity/MImages" );
  var MStrings = require( "molarity/MStrings" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Vector2 = require( "DOT/Vector2" );

  function MolarityTab() {

    this.name = MStrings.molarity;
    this.icon = new Rectangle( 0, 0, 10, 10, { fill: "white" } );  //TODO joist#15, icon should not be required for sim-tab sims
    this.backgroundColor = "white";

    var mvt = ModelViewTransform2.createIdentity();

    this.createModel = function() {
      return new MolarityModel();
    };

    this.createView = function( model ) {
      return new MolarityView( model, mvt );
    };
  }

  return MolarityTab;
} );
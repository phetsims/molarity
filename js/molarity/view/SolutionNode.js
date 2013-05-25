// Copyright 2002-2011, University of Colorado

/**
 * Solution shown in a beaker.
 * Assumes that the beaker is represented as a cylinder, with elliptical top and bottom.
 * Origin is at the upper-left corner of this cylinder.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Color = require( "SCENERY/util/Color" );
  var DebugOriginNode = require( "common/util/DebugOriginNode" );
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Range = require( "DOT/Range" );
  var Shape = require( "KITE/Shape" );

  // constants
  var DEBUG_ORIGIN = false;

  function SolutionNode( cylinderSize, cylinderEndHeight, solution, maxVolume ) {

    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    var middleNode = new Path();
    var topNode = new Path( { lineWidth: 0.5, stroke: new Color( 0, 0, 0, 85 ) } );
    var bottomNode = new Path();

    thisNode.addChild( bottomNode );
    thisNode.addChild( middleNode );
    thisNode.addChild( topNode );

    // Creates the shape of the cylinder's top, so that the top can be stroked separately.
    var createTopShape = function( height ) {
      if ( height === 0 ) {
        return null;
      }
      else {
        return Shape.ellipse( cylinderSize.width / 2, cylinderSize.height - height, cylinderSize.width / 2, cylinderEndHeight / 2 );
      }
    };

    // Creates the rectangle middle part of the cylinder.
    var createMiddleShape = function( height ) {
      if ( height === 0 ) {
        return null;
      }
      else {
        return Shape.rect( 0, cylinderSize.height - height, cylinderSize.width, height );
      }
    };

    // Creates the bottom of the cylinder.
    var createBottomShape = function( height ) {
      if ( height === 0 ) {
        return null;
      }
      else {
        return Shape.ellipse( cylinderSize.width / 2, cylinderSize.height, cylinderSize.width / 2, cylinderEndHeight / 2 );
      }
    };

    // sync with model
    var update = function() {

      // color
      var color = solution.solvent.color;
      if ( solution.concentration.get() > 0 ) {
        // compute the color based on concentration
        var concentrationToColorScale = new LinearFunction( new Range( 0, solution.getSaturatedConcentration() ), new Range( 0, 1 ) );
        var colorScale = concentrationToColorScale.evaluate( solution.concentration.get() );
        color = solution.solute.get().solutionColor.interpolateLinear( colorScale );
      }
      topNode.fill = color;
      middleNode.fill = color;
      bottomNode.fill = color;

      // shape
      var volumeToHeight = new LinearFunction( new Range( 0, maxVolume ), new Range( 0, cylinderSize.height ) );
      var height = volumeToHeight.evaluate( solution.volume.get() );
      topNode.setShape( createTopShape( height ) );
      middleNode.setShape( createMiddleShape( height ) );
      bottomNode.setShape( createBottomShape( height ) );
    };
    solution.concentration.addObserver( update );
    solution.solute.addObserver( update );
    solution.volume.addObserver( update );

    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new DebugOriginNode() );
    }
  }

  inherit( SolutionNode, Node );

  return SolutionNode;
} );
// Copyright 2002-2013, University of Colorado

/**
 * This node manages the precipitate that forms on the bottom of the beaker when the solution is saturated.
 * It assumes that the beaker is represented as a cylinder, with elliptical top and bottom.
 * Origin is at the upper-left corner of this cylinder.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var MFont = require( "molarity/MFont" );
  var Node = require( "SCENERY/nodes/Node" );
  var PrecipitateParticleNode = require( "molarity/view/PrecipitateParticleNode" );
  var Text = require( "SCENERY/nodes/Text" );
  var Vector2 = require( "DOT/Vector2" );

  // constants
  var DEBUG = true; //TODO set this based on ?dev query parameter

  /**
   * @param {Solution} solution
   * @param {Dimension2} cylinderSize
   * @param {Number} cylinderEndHeight
   */
  function PrecipitateNode( solution, cylinderSize, cylinderEndHeight ) {

    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    thisNode.solution = solution;
    thisNode.cylinderSize = cylinderSize;
    thisNode.cylinderEndHeight = cylinderEndHeight;

    var particleNodes = [];

    var valueNode = new Text( "?", { font: new MFont( 12 ), fill: "red" } );

    if ( DEBUG ) {
      thisNode.addChild( valueNode );
    }

    var removeAllParticles = function() {
      console.log( "PrecipitateNode.removeAllParticles" );//XXX
      while ( particleNodes.length > 0 ) {
        thisNode.removeChild( particleNodes.pop() );
      }
    };

    // Updates the number of particles to match the saturation of the solution.
    var updateParticles = function() {
      var particleNode;
      var numberOfParticles = thisNode.getNumberOfParticles();
      if ( numberOfParticles === 0 ) {
        removeAllParticles();
      }
      else if ( numberOfParticles > particleNodes.length ) {
        // add particles
        var numberToAdd = numberOfParticles - particleNodes.length;
        for ( var i = 0; i < numberToAdd; i++ ) {
          console.log( "PrecipitateNode.updateParticles: numberOfParticles=" + numberOfParticles + " particleNodes.length=" + particleNodes.length );//XXX
          particleNode = new PrecipitateParticleNode( solution.solute.get() );
          thisNode.addChild( particleNode );
          particleNodes.push( particleNode );
          particleNode.translation = thisNode.getRandomOffset( particleNode );
        }
      }
      else {
        // remove particles
        while ( numberOfParticles < particleNodes.length ) {
          thisNode.removeChild( particleNodes.pop() );
        }
      }
    };

    // Updates the debug output to show how we're mapping saturation to number of particles.
    var updateValue = function() {
      var precipitateAmount = solution.precipitateAmount.get();
      var numberOfParticles = thisNode.getNumberOfParticles();
      // developer only, no i18n required
      valueNode.text = "dev: precipitate = " + precipitateAmount.toFixed( 4 ) + " mol, " + numberOfParticles + " particles";
    };

    // when the saturation changes, update the number of precipitate particles
    solution.precipitateAmount.addObserver( function() {
      updateParticles();
      updateValue();
    } );

    // when the solute changes, remove all particles and create new particles for the solute
    solution.solute.addObserver( function() {
      updateParticles();
      updateValue();
    } );

    // layout after value has been set
    valueNode.centerX = cylinderSize.width / 2;
    valueNode.top = cylinderSize.height + cylinderEndHeight + 5;
  }

  inherit( PrecipitateNode, Node );

  // Gets the number of particles used to represent the solution's saturation.
  PrecipitateNode.prototype.getNumberOfParticles = function() {
    var numberOfParticles = Math.floor( this.solution.solute.get().particlesPerMole * this.solution.precipitateAmount.get() );
    if ( numberOfParticles === 0 && this.solution.precipitateAmount.get() > 0 ) {
      numberOfParticles = 1;
    }
    return numberOfParticles;
  };

  // Gets a random offset for a particle on the bottom of the beaker.
  PrecipitateNode.prototype.getRandomOffset = function( particleNode ) {
    var xMargin = particleNode.width;
    var yMargin = particleNode.height;
    var angle = Math.random() * 2 * Math.PI;
    var p = PrecipitateNode.getRandomPointInsideEllipse( angle, this.cylinderSize.width - ( 2 * xMargin ), this.cylinderEndHeight - ( 2 * yMargin ) );
    var x = ( this.cylinderSize.width / 2 ) + p.x;
    var y = this.cylinderSize.height - p.y - ( yMargin / 2 );
    return new Vector2( x, y );
  };

  // Gets a random point inside an ellipse with origin at its center.
  PrecipitateNode.getRandomPointInsideEllipse = function( theta, width, height ) {

    // Generate a random point inside a circle of radius 1.
    // Since circle area is a function of radius^2, taking sqrt provides a uniform distribution.
    var x = Math.sqrt( Math.random() ) * Math.cos( theta );
    var y = Math.sqrt( Math.random() ) * Math.sin( theta );

    // Scale x and y to the dimensions of the ellipse
    return new Vector2( x * width / 2, y * height / 2 );
  };

  return PrecipitateNode;
} );
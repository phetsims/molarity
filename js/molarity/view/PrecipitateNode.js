// Copyright 2002-2013, University of Colorado Boulder

/**
 * This node manages the precipitate that forms on the bottom of the beaker when the solution is saturated.
 * It assumes that the beaker is represented as a cylinder, with elliptical top and bottom.
 * Origin is at the upper-left corner of this cylinder.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PrecipitateParticleNode = require( 'molarity/view/PrecipitateParticleNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SHOW_PARTICLE_COUNT = false; // for debugging

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

    var particlesParent = new Node();
    thisNode.addChild( particlesParent );

    var particleCountNode = new Text( '?', { font: new PhetFont( 12 ), fill: 'red' } );

    if ( SHOW_PARTICLE_COUNT ) {
      thisNode.addChild( particleCountNode );
    }

    var removeAllParticles = function() {
      particlesParent.removeAllChildren();
    };

    // Updates the number of particles to match the saturation of the solution.
    var updateParticles = function() {
      var particleNode;
      var numberOfParticles = getNumberOfParticles( solution );
      if ( numberOfParticles === 0 ) {
        removeAllParticles();
      }
      else if ( numberOfParticles > particlesParent.getChildrenCount() ) {
        // add particles
        var numberToAdd = numberOfParticles - particlesParent.getChildrenCount();
        for ( var i = 0; i < numberToAdd; i++ ) {
          particleNode = new PrecipitateParticleNode( solution.solute.particleLength, solution.solute.particleColor );
          particlesParent.addChild( particleNode );
          particleNode.translation = getRandomOffset( particleNode, thisNode.cylinderSize, thisNode.cylinderEndHeight );
        }
      }
      else {
        // remove particles
        var numberToRemove = particlesParent.getChildrenCount() - numberOfParticles;
        while ( numberToRemove > 0 ) {
          particlesParent.removeChild( particlesParent.getChildAt( particlesParent.getChildrenCount() - 1 ) );
          numberToRemove--;
        }
      }
    };

    // Updates the debug output to show how we're mapping saturation to number of particles.
    var updateValue = function() {
      var precipitateAmount = solution.precipitateAmount;
      var numberOfParticles = getNumberOfParticles( solution );
      // developer only, no i18n required
      particleCountNode.text = 'dev: precipitate = ' + precipitateAmount.toFixed( 4 ) + ' mol, ' + numberOfParticles + ' particles';
    };

    // when the saturation changes, update the number of precipitate particles
    solution.precipitateAmountProperty.link( function() {
      updateParticles();
      updateValue();
    } );

    // when the solute changes, remove all particles and create new particles for the solute
    solution.soluteProperty.link( function() {
      removeAllParticles();
      updateParticles();
      updateValue();
    } );

    // layout after value has been set
    particleCountNode.centerX = cylinderSize.width / 2;
    particleCountNode.top = cylinderSize.height + cylinderEndHeight + 5;
  }

  inherit( Node, PrecipitateNode );

  // Gets the number of particles used to represent the solution's saturation.
  var getNumberOfParticles = function( solution ) {
    var numberOfParticles = Math.floor( solution.solute.particlesPerMole * solution.precipitateAmount );
    if ( numberOfParticles === 0 && solution.precipitateAmount > 0 ) {
      numberOfParticles = 1;
    }
    return numberOfParticles;
  };

  // Gets a random offset for a particle on the bottom of the beaker.
  var getRandomOffset = function( particleNode, cylinderSize, cylinderEndHeight ) {
    var xMargin = particleNode.width;
    var yMargin = particleNode.height;
    var angle = Math.random() * 2 * Math.PI;
    var p = getRandomPointInsideEllipse( angle, cylinderSize.width - ( 2 * xMargin ), cylinderEndHeight - ( 2 * yMargin ) );
    var x = ( cylinderSize.width / 2 ) + p.x;
    var y = cylinderSize.height - p.y - ( yMargin / 2 );
    return new Vector2( x, y );
  };

  // Gets a random point inside an ellipse, with origin at its center.
  var getRandomPointInsideEllipse = function( theta, width, height ) {

    // Generate a random point inside a circle of radius 1.
    // Since circle area is a function of radius^2, taking sqrt provides a uniform distribution.
    var x = Math.sqrt( Math.random() ) * Math.cos( theta );
    var y = Math.sqrt( Math.random() ) * Math.sin( theta );

    // Scale x and y to the dimensions of the ellipse
    return new Vector2( x * width / 2, y * height / 2 );
  };

  return PrecipitateNode;
} );
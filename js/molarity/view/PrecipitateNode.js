// Copyright 2013-2019, University of Colorado Boulder

/**
 * This node manages the precipitate that forms on the bottom of the beaker when the solution is saturated.
 * It assumes that the beaker is represented as a cylinder, with elliptical top and bottom.
 * Origin is at the upper-left corner of this cylinder.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const molarity = require( 'MOLARITY/molarity' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Utils = require( 'DOT/Utils' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const DEBUG_OUTPUT = false;
  const PARTICLE_LENGTH = 5; // particles are square, this is the length of one side
  const PARTICLES_PER_MOLE = 200; // number of particles to show per mol of saturation

  /**
   * @param {Solution} solution
   * @param {Dimension2} cylinderSize
   * @param {number} cylinderEndHeight
   * @param {number} maxPrecipitateAmount moles
   * @param {Tandem} tandem
   * @constructor
   */
  function PrecipitateNode( solution, cylinderSize, cylinderEndHeight, maxPrecipitateAmount, tandem ) {

    Node.call( this, {
      pickable: false,
      tandem: tandem
    } );

    // Create the max number of particles that we'll need.
    const maxParticles = getNumberOfParticles( maxPrecipitateAmount );
    const particleNodes = [];
    for ( let i = 0; i < maxParticles; i++ ) {
      particleNodes[ i ] = new Rectangle( 0, 0, PARTICLE_LENGTH, PARTICLE_LENGTH, {
        rotation: phet.joist.random.nextDouble() * 2 * Math.PI
      } );
      this.addChild( particleNodes[ i ] );
    }
    if ( DEBUG_OUTPUT ) {
      console.log( 'PrecipitateNode: ' + Utils.toFixed( maxPrecipitateAmount, 4 ) + ' mol => ' + maxParticles + ' particles (max)' );
    }

    // Change color of all particles to match the solute, change position so it doesn't look predictable
    solution.soluteProperty.link( function( solute ) {
      const fill = solute.particleColor;
      const stroke = solute.particleColor.darkerColor();
      particleNodes.forEach( function( node ) {
        node.fill = fill;
        node.stroke = stroke;
        node.translation = getRandomOffset( node.width, node.height, cylinderSize, cylinderEndHeight );
      } );
    } );

    // Make particles visible to match the amount of precipitate.
    solution.precipitateAmountProperty.link( function( precipitateAmount ) {
      const numberOfParticles = getNumberOfParticles( precipitateAmount );
      assert && assert( numberOfParticles <= particleNodes.length );
      for ( let i = 0; i < particleNodes.length; i++ ) {
        particleNodes[ i ].visible = ( i < numberOfParticles );
      }
      if ( DEBUG_OUTPUT ) {
        console.log( 'PrecipitateNode: ' + Utils.toFixed( precipitateAmount, 4 ) + ' mol => ' + numberOfParticles + ' particles' );
      }
    } );
  }

  molarity.register( 'PrecipitateNode', PrecipitateNode );

  // Gets the number of particles that corresponds to some precipitate amount.
  var getNumberOfParticles = function( precipitateAmount ) {
    let numberOfParticles = Math.floor( PARTICLES_PER_MOLE * precipitateAmount );
    if ( numberOfParticles === 0 && precipitateAmount > 0 ) {
      numberOfParticles = 1;
    }
    return numberOfParticles;
  };

  // Gets a random offset for a particle on the bottom of the beaker (which is an ellipse).
  var getRandomOffset = function( particleWidth, particleHeight, cylinderSize, cylinderEndHeight ) {
    const xMargin = particleWidth;
    const yMargin = particleHeight;
    const angle = phet.joist.random.nextDouble() * 2 * Math.PI;
    const p = getRandomPointInsideEllipse( angle, cylinderSize.width - ( 2 * xMargin ), cylinderEndHeight - ( 2 * yMargin ) );
    const x = ( cylinderSize.width / 2 ) + p.x;
    const y = cylinderSize.height - p.y - ( yMargin / 2 );
    return new Vector2( x, y );
  };

  // Gets a random point inside an ellipse, with origin at its center.
  var getRandomPointInsideEllipse = function( theta, width, height ) {

    // Generate a random point inside a circle of radius 1.
    // Since circle area is a function of radius^2, taking sqrt provides a uniform distribution.
    const x = Math.sqrt( phet.joist.random.nextDouble() ) * Math.cos( theta );
    const y = Math.sqrt( phet.joist.random.nextDouble() ) * Math.sin( theta );

    // Scale x and y to the dimensions of the ellipse
    return new Vector2( x * width / 2, y * height / 2 );
  };

  return inherit( Node, PrecipitateNode );
} );
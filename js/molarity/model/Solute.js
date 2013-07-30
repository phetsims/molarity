// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a solute, an immutable data structure.
 * This model is immutable in the sense that you should not change any of its fields after construction,
 * since they do not provide change notification. If you do change any field values, you will hose yourself.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  /**
   * @param {String} name
   * @param {String} formula
   * @param {Number} saturatedConcentration M (moles/L)
   * @param {Color} minColor solution color for smallest non-zero concentration
   * @param {Color} maxColor solution color for saturated concentration
   * @param {*} options
   * @constructor
   */
  function Solute( name, formula, saturatedConcentration, minColor, maxColor, options ) {

    options = _.extend( {
      particleColor: maxColor, // the solute's color as a particle
      particleLength: 5,    // particles are square, this is the length of one side
      particlesPerMole: 200 // number of particles to show per mol of saturation
    }, options );

    this.name = name;
    this.formula = formula;
    this.saturatedConcentration = saturatedConcentration;
    this.minColor = minColor;
    this.maxColor = maxColor;
    this.particleColor = options.particleColor;
    this.particleLength = options.particleLength;
    this.particlesPerMole = options.particlesPerMole;
  }

  return Solute;
} );

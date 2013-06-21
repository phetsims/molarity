// Copyright 2002-2013, University of Colorado

/**
 * Model of a solute, an immutable data structure.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  /**
   * @param {String} name
   * @param {String} formula
   * @param {Number} saturatedConcentration M (moles/L)
   * @param {Color} minColor solution color for smallest non-zero concentration
   * @param {Color} maxColor solution color for saturated concentration
   * @param {Color} particleColor the solute's color as a particle, defaults to maxColor
   * @param {*} options
   * @constructor
   */
  function Solute( name, formula, saturatedConcentration, minColor, maxColor, particleColor, options ) {

    options = _.extend( {
      particleSize: 5,    // particles are square, this is the length of one side
      particlesPerMole: 200 // number of particles to show per mol of saturation
    }, options );

    this.name = name;
    this.formula = formula;
    this.saturatedConcentration = saturatedConcentration;
    this.minColor = minColor;
    this.maxColor = maxColor;
    this.particleColor = particleColor || maxColor;
    this.particleSize = options.particleSize;
    this.particlesPerMole = options.particlesPerMole;
  }

  return Solute;
} );

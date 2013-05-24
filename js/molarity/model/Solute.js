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
   * @param {ColorRange} solutionColor color range for a solution with non-zero concentration
   * @param {Color} particleColor the solute's color as a particle, defaults to solutionColor.max
   * @param {*} options
   * @constructor
   */
  function Solute( name, formula, saturatedConcentration, solutionColor, particleColor, options ) {

    options = _.extend(
        {
          particleSize: 5,    // particles are square, this is the length of one side
          particlesPerMole: 200 // number of particles to show per mol of saturation
        }, options );

    this.name = name;
    this.formula = formula;
    this.saturatedConcentration = saturatedConcentration;
    this.solutionColor = solutionColor;
    this.particleColor = particleColor || solutionColor.max;
    this.particleSize = options.particleSize;
    this.particlesPerMole = options.particlesPerMole;
  }

  return Solute;
} );

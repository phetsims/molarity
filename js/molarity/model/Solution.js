// Copyright 2002-2011, University of Colorado

/**
 * Simple model of a solution
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var property = require( "FORT/Fort" ).property;
  var Range = require( "DOT/Range" );
  var Util = require( "DOT/Util" );

  /**
   * @param {Solvent} solvent
   * @param {Solute} solute
   * @param {Number} soluteAmount moles
   * @param {Number} volume Liters
   * @constructor
   */
  function Solution( solvent, solute, soluteAmount, volume ) {

    var thisSolution = this;

    thisSolution.solvent = solvent;
    thisSolution.solute = property( solute );
    thisSolution.soluteAmount = property( soluteAmount );
    thisSolution.volume = property( volume );

    // derived properties
    thisSolution.concentration = property( 0 ); // molarity, moles/Liter (derived property)
    thisSolution.precipitateAmount = property( 0 ); // moles (derived property)
    var update = function() {
      if ( thisSolution.volume.value > 0 ) {
        thisSolution.concentration.value = Math.min( thisSolution.getSaturatedConcentration(), thisSolution.soluteAmount.value / thisSolution.volume.value ); // M = mol/L
        thisSolution.precipitateAmount.value = Math.max( 0, thisSolution.volume.value * ( ( thisSolution.soluteAmount.value / thisSolution.volume.value ) - thisSolution.getSaturatedConcentration() ) );
      }
      else {
        thisSolution.concentration.value = 0;
        thisSolution.precipitateAmount.value = thisSolution.soluteAmount.value;
      }
    };
    thisSolution.solute.link( update );
    thisSolution.soluteAmount.link( update );
    thisSolution.volume.link( update );
  }

  Solution.prototype.reset = function() {
    this.solute.reset();
    this.soluteAmount.reset();
    this.volume.reset();
    // concentration and precipitateAmount are derived
  };

  // Convenience method
  Solution.prototype.getSaturatedConcentration = function() {
    return this.solute.value.saturatedConcentration;
  };

  Solution.prototype.isSaturated = function() {
    return this.precipitateAmount.value !== 0;
  };

  Solution.prototype.getColor = function() {
    if ( this.concentration.value > 0 ) {
      var colorScale = Util.linear( 0, 0, this.getSaturatedConcentration(), 1, this.concentration.value );
      return this.solute.value.solutionColor.interpolateLinear( colorScale );
    }
    else {
      return this.solvent.color;
    }
  };

  return Solution;
} );
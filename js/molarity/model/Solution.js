// Copyright 2002-2011, University of Colorado

/**
 * Simple model of a solution.
 * <p>
 * Parameters required for constructor are:
 * @param {Solvent} solvent
 * @param {Solute} solute
 * @param {Number} soluteAmount moles
 * @param {Number} volume Liters
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var interpolateRBGA = require( "SCENERY/util/Color" ).interpolateRBGA;
  var Property = require( "PHETCOMMON/model/property/Property" );
  var Range = require( "DOT/Range" );
  var Util = require( "DOT/Util" );

  // constants
  var CONCENTRATION_DECIMALS = 2;

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
    thisSolution.solute = new Property( solute );
    thisSolution.soluteAmount = new Property( soluteAmount );
    thisSolution.volume = new Property( volume );

    var computeConcentration = function() {
      // M = moles/liter
      return Util.toFixed( thisSolution.volume.value > 0 ? Math.min( thisSolution.getSaturatedConcentration(), thisSolution.soluteAmount.value / thisSolution.volume.value ) : 0, CONCENTRATION_DECIMALS );
    };

    var computePrecipitateAmount = function() {
      return thisSolution.volume.value > 0 ? Math.max( 0, thisSolution.volume.value * ( ( thisSolution.soluteAmount.value / thisSolution.volume.value ) - thisSolution.getSaturatedConcentration() ) ) : thisSolution.soluteAmount.value;
    };

    // derived properties
    thisSolution.concentration = new Property( computeConcentration() ); // molarity, moles/Liter (derived property)
    thisSolution.precipitateAmount = new Property( computePrecipitateAmount() ); // moles (derived property)
    var update = function() {
      thisSolution.concentration.value = computeConcentration();
      thisSolution.precipitateAmount.value = computePrecipitateAmount();
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
      return interpolateRBGA( this.solute.value.minColor, this.solute.value.maxColor, colorScale );
    }
    else {
      return this.solvent.color;
    }
  };

  return Solution;
} );
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
      return Util.toFixed( thisSolution.volume.get() > 0 ? Math.min( thisSolution.getSaturatedConcentration(), thisSolution.soluteAmount.get() / thisSolution.volume.get() ) : 0, CONCENTRATION_DECIMALS );
    };

    var computePrecipitateAmount = function() {
      return thisSolution.volume.get() > 0 ? Math.max( 0, thisSolution.volume.get() * ( ( thisSolution.soluteAmount.get() / thisSolution.volume.get() ) - thisSolution.getSaturatedConcentration() ) ) : thisSolution.soluteAmount.get();
    };

    // derived properties
    thisSolution.concentration = new Property( computeConcentration() ); // molarity, moles/Liter (derived property)
    thisSolution.precipitateAmount = new Property( computePrecipitateAmount() ); // moles (derived property)
    var update = function() {
      thisSolution.concentration.set( computeConcentration() );
      thisSolution.precipitateAmount.set( computePrecipitateAmount() );
    };
    thisSolution.solute.addObserver( update );
    thisSolution.soluteAmount.addObserver( update );
    thisSolution.volume.addObserver( update );
  }

  Solution.prototype.reset = function() {
    this.solute.reset();
    this.soluteAmount.reset();
    this.volume.reset();
    // concentration and precipitateAmount are derived
  };

  // Convenience method
  Solution.prototype.getSaturatedConcentration = function() {
    return this.solute.get().saturatedConcentration;
  };

  Solution.prototype.isSaturated = function() {
    return this.precipitateAmount.get() !== 0;
  };

  Solution.prototype.getColor = function() {
    if ( this.concentration.get() > 0 ) {
      var colorScale = Util.linear( 0, 0, this.getSaturatedConcentration(), 1, this.concentration.get() );
      return interpolateRBGA( this.solute.get().minColor, this.solute.get().maxColor, colorScale );
    }
    else {
      return this.solvent.color;
    }
  };

  return Solution;
} );
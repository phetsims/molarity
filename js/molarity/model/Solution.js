// Copyright 2002-2011, University of Colorado

/**
 * Simple model of a solution
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Property = require( "PHETCOMMON/model/property/Property" );

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

    // derived properties
    thisSolution.concentration = new Property( 0 ); // molarity, moles/Liter (derived property)
    thisSolution.precipitateAmount = new Property( 0 ); // moles (derived property)
    var update = function() {
      if ( thisSolution.volume.get() > 0 ) {
        thisSolution.concentration.set( Math.min( thisSolution.getSaturatedConcentration(), thisSolution.soluteAmount.get() / thisSolution.volume.get() ) ); // M = mol/L
        thisSolution.precipitateAmount.set( Math.max( 0, thisSolution.volume.get() * ( ( thisSolution.soluteAmount.get() / thisSolution.volume.get() ) - thisSolution.getSaturatedConcentration() ) ) );
      }
      else {
        thisSolution.concentration.set( 0 );
        thisSolution.precipitateAmount.set( thisSolution.soluteAmount.get() );
      }
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

  return Solution;
} );
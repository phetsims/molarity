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
  var inherit = require( "PHET_CORE/inherit" );
  var interpolateRBGA = require( "SCENERY/util/Color" ).interpolateRBGA;
  var PropertySetB = require( "PHETCOMMON/model/property/PropertySetB" );
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

    PropertySetB.call( this, { solute: solute, soluteAmount: soluteAmount, volume: volume } );

    thisSolution.solvent = solvent;

    // M = moles/liter
    thisSolution.addDerivedProperty( 'concentration', ['solute', 'soluteAmount', 'volume'], function( solute, soluteAmount, volume ) {
      return Util.toFixed( volume > 0 ? Math.min( solute.saturatedConcentration, soluteAmount / volume ) : 0, CONCENTRATION_DECIMALS );
    } );

    thisSolution.addDerivedProperty( 'precipitateAmount', ['solute', 'soluteAmount', 'volume'], function( solute, soluteAmount, volume ) {
      return volume > 0 ? Math.max( 0, volume * ( ( soluteAmount / volume ) - thisSolution.solute.saturatedConcentration ) ) : soluteAmount;
    } );
  }

  inherit( Solution, PropertySetB );

  Solution.prototype.isSaturated = function() {
    return this.precipitateAmount !== 0;
  };

  Solution.prototype.getColor = function() {
    if ( this.concentration > 0 ) {
      var colorScale = Util.linear( 0, 0, this.solute.saturatedConcentration, 1, this.concentration );
      return interpolateRBGA( this.solute.minColor, this.solute.maxColor, colorScale );
    }
    else {
      return this.solvent.color;
    }
  };

  return Solution;
} );
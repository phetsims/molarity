// Copyright 2013-2015, University of Colorado Boulder

/**
 * Simple model of a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MConstants = require( 'MOLARITY/molarity/MConstants' );
  var molarity = require( 'MOLARITY/molarity' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Solvent} solvent
   * @param {Solute} solute
   * @param {number} soluteAmount moles
   * @param {number} volume Liters
   * @constructor
   */
  function Solution( solvent, solute, soluteAmount, volume ) {

    PropertySet.call( this, {

      // @public
      solute: solute,
      soluteAmount: soluteAmount,
      volume: volume
    } );

    this.solvent = solvent; // @public

    // @public derive the concentration: M = moles/liter
    this.addDerivedProperty( 'concentration', [ 'solute', 'soluteAmount', 'volume' ], function( solute, soluteAmount, volume ) {
      return Util.toFixedNumber( volume > 0 ? Math.min( solute.saturatedConcentration, soluteAmount / volume ) : 0, MConstants.CONCENTRATION_DECIMAL_PLACES );
    } );

    // @public derive the amount of precipitate
    this.addDerivedProperty( 'precipitateAmount', [ 'solute', 'soluteAmount', 'volume' ], function( solute, soluteAmount, volume ) {
      return Solution.computePrecipitateAmount( volume, soluteAmount, solute.saturatedConcentration );
    } );
  }

  molarity.register( 'Solution', Solution );

  return inherit( PropertySet, Solution, {

    // @public
    isSaturated: function() {
      return this.precipitateAmount !== 0;
    },

    // @public
    getColor: function() {
      if ( this.concentration > 0 ) {
        var colorScale = Util.linear( 0, this.solute.saturatedConcentration, 0, 1, this.concentration );
        return Color.interpolateRGBA( this.solute.minColor, this.solute.maxColor, colorScale );
      }
      else {
        return this.solvent.color;
      }
    }
  }, {

    // @pubic @static
    computePrecipitateAmount: function( volume, soluteAmount, saturatedConcentration ) {
      return volume > 0 ? Math.max( 0, volume * ( ( soluteAmount / volume ) - saturatedConcentration ) ) : soluteAmount;
    }
  } );
} );
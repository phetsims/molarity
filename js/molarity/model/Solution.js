// Copyright 2002-2011, University of Colorado

/**
 * Simple model of a solution
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Fort = require( "FORT/Fort" );
  var property = require( "FORT/Fort" ).property;
  var Range = require( "DOT/Range" );
  var Util = require( "DOT/Util" );

  var Solution = Fort.Model.extend(
      {
        //TODO why aren't these automatically promoted?
        defaults: {
          solvent: undefined,
          solute: undefined,
          soluteAmount: undefined,
          volume: undefined,
          concentration: undefined,
          precipitateAmount: undefined
        },

        /**
         * @param {Solvent} solvent
         * @param {Solute} solute
         * @param {Number} soluteAmount moles
         * @param {Number} volume Liters
         */
        init: function( solvent, solute, soluteAmount, volume ) {

          var thisSolution = this;

          thisSolution.solvent = solvent;
          thisSolution.solute = solute;
          thisSolution.soluteAmount = soluteAmount;
          thisSolution.volume = volume;

          // derived properties
          thisSolution.concentration = 0; // molarity, moles/Liter (derived property)
          thisSolution.precipitateAmount = 0; // moles (derived property)
          var update = function() {
            if ( thisSolution.volume > 0 ) {
              thisSolution.concentration = Math.min( thisSolution.getSaturatedConcentration(), thisSolution.soluteAmount / thisSolution.volume ); // M = mol/L
              thisSolution.precipitateAmount = Math.max( 0, thisSolution.volume * ( ( thisSolution.soluteAmount / thisSolution.volume ) - thisSolution.getSaturatedConcentration() ) );
            }
            else {
              thisSolution.concentration = 0;
              thisSolution.precipitateAmount = thisSolution.soluteAmount;
            }
          };
          thisSolution.link( 'solute', update );
          thisSolution.link( 'soluteAmount', update );
          thisSolution.link( 'volume', update );
        },

        getSaturatedConcentration: function() {
          return this.solute.saturatedConcentration;
        },

        isSaturated: function() {
          return this.precipitateAmount !== 0;
        },

        getColor: function() {
          if ( this.concentration > 0 ) {
            var colorScale = Util.linear( 0, 0, this.getSaturatedConcentration(), 1, this.concentration );
            return this.solute.solutionColor.interpolateLinear( colorScale );
          }
          else {
            return this.solvent.color;
          }
        }
      } );

  return Solution;
} );
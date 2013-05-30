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
  var Fort = require( "FORT/Fort" );
  var Range = require( "DOT/Range" );
  var Util = require( "DOT/Util" );

  var Solution = Fort.Model.extend(
      {
        init: function( ){

          var thisSolution = this;

          var computeConcentration = function() {
            return thisSolution.volume > 0 ? Math.min( thisSolution.getSaturatedConcentration(), thisSolution.soluteAmount / thisSolution.volume ) : 0;
          };

          var computePrecipitateAmount = function() {
            return thisSolution.volume > 0 ? Math.max( 0, thisSolution.volume * ( ( thisSolution.soluteAmount / thisSolution.volume ) - thisSolution.getSaturatedConcentration() ) ) : thisSolution.soluteAmount;
          };

          // derived properties
          this.set(
              {
                concentration: computeConcentration(), // molarity, moles/Liter (derived property)
                precipitateAmount: computePrecipitateAmount() // moles (derived property)
              } );

          thisSolution.on( 'change:solute change:soluteAmount change:volume', function() {
            thisSolution.concentration = computeConcentration();
            thisSolution.precipitateAmount = computePrecipitateAmount();
          } );
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
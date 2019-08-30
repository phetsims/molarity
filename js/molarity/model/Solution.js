// Copyright 2013-2019, University of Colorado Boulder

/**
 * Simple model of a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MolarityConstants = require( 'MOLARITY/molarity/MolarityConstants' );
  var molarity = require( 'MOLARITY/molarity' );
  var NumberIO = require( 'TANDEM/types/NumberIO' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var SoluteIO = require( 'MOLARITY/molarity/model/SoluteIO' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Solvent} solvent
   * @param {Solute} solute
   * @param {number} soluteAmount moles
   * @param {number} volume Liters
   * @param {Tandem} tandem
   * @constructor
   */
  function Solution( solvent, solute, soluteAmount, volume, tandem ) {

    // @public
    this.solvent = solvent;

    // @public
    this.soluteProperty = new Property( solute, {
      tandem: tandem.createTandem( 'soluteProperty' ),
      phetioType: PropertyIO( SoluteIO )
    } );

    // @public
    this.soluteAmountProperty = new NumberProperty( soluteAmount, {
      tandem: tandem.createTandem( 'soluteAmountProperty' ),
      units: 'moles',
      range: MolarityConstants.SOLUTE_AMOUNT_RANGE
    } );

    // @public
    this.volumeProperty = new NumberProperty( volume, {
      tandem: tandem.createTandem( 'volumeProperty' ),
      units: 'liters',
      range: MolarityConstants.SOLUTION_VOLUME_RANGE
    } );

    // @public derive the concentration: M = moles/liter
    this.concentrationProperty = new DerivedProperty( [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      function( solute, soluteAmount, volume ) {
        return Util.toFixedNumber( volume > 0 ? Math.min( solute.saturatedConcentration, soluteAmount / volume ) : 0, MolarityConstants.CONCENTRATION_DECIMAL_PLACES );
      }, {
        tandem: tandem.createTandem( 'concentrationProperty' ),
        units: 'moles/liter',
        // no range, since this is derived
        phetioType: DerivedPropertyIO( NumberIO )
      } );

    // @public derive the amount of precipitate
    this.precipitateAmountProperty = new DerivedProperty( [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      function( solute, soluteAmount, volume ) {
        return Solution.computePrecipitateAmount( volume, soluteAmount, solute.saturatedConcentration );
      }, {
        tandem: tandem.createTandem( 'precipitateAmountProperty' ),
        units: 'moles',
        phetioType: DerivedPropertyIO( NumberIO )
      } );
  }

  molarity.register( 'Solution', Solution );

  return inherit( Object, Solution, {

    // @public
    reset: function() {
      this.soluteProperty.reset();
      this.soluteAmountProperty.reset();
      this.volumeProperty.reset();
    },

    // @public
    isSaturated: function() {
      return this.precipitateAmountProperty.value !== 0;
    },

    // @public
    getColor: function() {
      if ( this.concentrationProperty.value > 0 ) {
        var solute = this.soluteProperty.get();
        var colorScale = Util.linear( 0, solute.saturatedConcentration, 0, 1, this.concentrationProperty.value );
        return Color.interpolateRGBA( solute.minColor, solute.maxColor, colorScale );
      }
      else {
        return this.solvent.color;
      }
    }
  }, {

    // @public @static
    computePrecipitateAmount: function( volume, soluteAmount, saturatedConcentration ) {
      return volume > 0 ? Math.max( 0, volume * ( ( soluteAmount / volume ) - saturatedConcentration ) ) : soluteAmount;
    }
  } );
} );
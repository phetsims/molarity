// Copyright 2013-2019, University of Colorado Boulder

/**
 * Simple model of a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MolarityConstants = require( 'MOLARITY/molarity/MolarityConstants' );
  const molarity = require( 'MOLARITY/molarity' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const SoluteIO = require( 'MOLARITY/molarity/model/SoluteIO' );
  const Util = require( 'DOT/Util' );

  /**
   * @param {{color:ColorDef, formula:string, colorStringPair:StringCasingPair}} solvent
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
        return Util.toFixedNumber( volume > 0 ? Math.min( solute.saturatedConcentration, soluteAmount / volume ) : 0,
          MolarityConstants.CONCENTRATION_DECIMAL_PLACES );
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

    /**
     * @public
     */
    reset: function() {
      this.soluteProperty.reset();
      this.soluteAmountProperty.reset();
      this.volumeProperty.reset();
    },

    /**
     * @public
     * @returns {boolean}
     */
    isSaturated: function() {
      return this.precipitateAmountProperty.value !== 0;
    },

    /**
     * @public
     * @returns {boolean}
     */
    atMaxConcentration: function() {
      return this.soluteProperty.value.saturatedConcentration === this.concentrationProperty.value;
    },

    /**
     * @public
     * @returns {boolean}
     */
    hasSolute: function() {
      return this.concentrationProperty.value > 0;
    },

    /**
     * @public
     * @returns {ColorDef}
     */
    getColor: function() {
      if ( this.concentrationProperty.value > 0 ) {
        const solute = this.soluteProperty.get();
        const colorScale = Util.linear( 0, solute.saturatedConcentration, 0, 1, this.concentrationProperty.value );
        return Color.interpolateRGBA( solute.minColor, solute.maxColor, colorScale );
      }
      else {
        return this.solvent.color;
      }
    }
  }, {

    /**
     * @public
     * @param {number} volume
     * @param {number} soluteAmount
     * @param {number} saturatedConcentration
     * @returns {number}
     */
    computePrecipitateAmount: function( volume, soluteAmount, saturatedConcentration ) {
      return volume > 0 ? Math.max( 0, volume * ( ( soluteAmount / volume ) - saturatedConcentration ) ) : soluteAmount;
    }
  } );
} );
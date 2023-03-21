// Copyright 2013-2023, University of Colorado Boulder

/**
 * Simple model of a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import { Color } from '../../../../scenery/js/imports.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import molarity from '../../molarity.js';
import MolarityConstants from '../MolarityConstants.js';
import Solute from './Solute.js';

class Solution {
  /**
   * @param {{color:ColorDef, formula:string, colorStringPair:StringCasingPair}} solvent
   * @param {Solute} solute
   * @param {number} soluteAmount moles
   * @param {number} volume Liters
   * @param {Tandem} tandem
   */
  constructor( solvent, solute, soluteAmount, volume, tandem ) {

    // @public
    this.solvent = solvent;

    // @public
    this.soluteProperty = new Property( solute, {
      tandem: tandem.createTandem( 'soluteProperty' ),

      // The description (view) in this sim needs to fire listeners after model listeners update this Property, see https://github.com/phetsims/molarity/issues/189
      hasListenerOrderDependencies: true,
      phetioValueType: Solute.SoluteIO
    } );

    // @public
    this.soluteAmountProperty = new NumberProperty( soluteAmount, {
      tandem: tandem.createTandem( 'soluteAmountProperty' ),
      units: 'mol',
      range: MolarityConstants.SOLUTE_AMOUNT_RANGE
    } );

    // @public
    this.volumeProperty = new NumberProperty( volume, {
      tandem: tandem.createTandem( 'volumeProperty' ),
      units: 'L',
      range: MolarityConstants.SOLUTION_VOLUME_RANGE
    } );

    // @public derive the concentration: M = moles/liter
    this.concentrationProperty = new DerivedProperty( [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      ( solute, soluteAmount, volume ) => Utils.toFixedNumber( volume > 0 ? Math.min( solute.saturatedConcentration, soluteAmount / volume ) : 0,
        MolarityConstants.CONCENTRATION_DECIMAL_PLACES ), {
        tandem: tandem.createTandem( 'concentrationProperty' ),
        units: 'mol/L',
        // no range, since this is derived
        phetioValueType: NumberIO
      } );

    // @public derive the amount of precipitate
    this.precipitateAmountProperty = new DerivedProperty( [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      ( solute, soluteAmount, volume ) => Solution.computePrecipitateAmount( volume, soluteAmount, solute.saturatedConcentration ), {
        tandem: tandem.createTandem( 'precipitateAmountProperty' ),
        units: 'mol',
        phetioValueType: NumberIO
      } );
  }


  /**
   * @public
   */
  reset() {
    this.soluteProperty.reset();
    this.soluteAmountProperty.reset();
    this.volumeProperty.reset();
  }

  /**
   * @public
   * @returns {boolean}
   */
  isSaturated() {
    return this.precipitateAmountProperty.value !== 0;
  }

  /**
   * @public
   * @returns {boolean}
   */
  atMaxConcentration() {
    return this.soluteProperty.value.saturatedConcentration === this.concentrationProperty.value;
  }

  /**
   * @public
   * @returns {boolean}
   */
  hasSolute() {
    return this.concentrationProperty.value > 0;
  }

  /**
   * @public
   * @returns {ColorDef}
   */
  getColor() {
    if ( this.concentrationProperty.value > 0 ) {
      const solute = this.soluteProperty.get();
      const colorScale = Utils.linear( 0, solute.saturatedConcentration, 0, 1, this.concentrationProperty.value );
      return Color.interpolateRGBA( solute.minColor, solute.maxColor, colorScale );
    }
    else {
      return this.solvent.color;
    }
  }

  /**
   * @public
   * @param {number} volume
   * @param {number} soluteAmount
   * @param {number} saturatedConcentration
   * @returns {number}
   */
  static computePrecipitateAmount( volume, soluteAmount, saturatedConcentration ) {
    return volume > 0 ? Math.max( 0, volume * ( ( soluteAmount / volume ) - saturatedConcentration ) ) : soluteAmount;
  }
}

molarity.register( 'Solution', Solution );

export default Solution;
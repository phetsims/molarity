// Copyright 2019, University of Colorado Boulder

/**
 * Manager for the alerts that are dynamically emitted in the simulation.
 * @author Taylor Want (PhET Interactive Simulations)
 */

let describer = null;

define( function( require ) {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // a11y strings
  const soluteChangedAlertPatternString = MolarityA11yStrings.soluteChangedAlertPattern.value;
  const sliderMovedAlertPatternString = MolarityA11yStrings.sliderMovedAlertPattern.value;
  const soluteAmountAccessibleNameString = MolarityA11yStrings.soluteAmountAccessibleName.value;
  const solutionVolumeAccessibleNameString = MolarityA11yStrings.solutionVolumeAccessibleName.value;
  const solutionConcentrationValuesVisiblePatternString = MolarityA11yStrings.solutionConcentrationValuesVisiblePattern.value;

  const raisesString = MolarityA11yStrings.raisesString.value;
  const lowersString = MolarityA11yStrings.lowersString.value;

  const increasesString = MolarityA11yStrings.increasesString.value;
  const decreasesString = MolarityA11yStrings.decreasesString.value;

  class MolarityAlertManager {

    constructor( model ) {
      this.model = model;
      this.model.solution.soluteProperty.lazyLink( () => {
        const utterance = StringUtils.fillIn( soluteChangedAlertPatternString, {
          solute: this.model.solution.soluteProperty.value.name,
          maxConcentration: this.model.solution.soluteProperty.value.saturatedConcentration
        } );
        utteranceQueue.addToBack( new Utterance( { alert: utterance, uniqueGroupId: 'stateOfSim' } ) );
      } );
    }

    /**
     * Describes the concentration level in the beaker in the play area.
     * param {Boolean} increasing - indicates whether the slider has moved up or down. true if up, false if down
     * @public
     * @returns {string}
     */
    getVolumeAlert( increasing ) {
      let raiseLower = raisesString;
      let increaseDecrease = decreasesString
      const concentrationClause = StringUtils.fillIn( solutionConcentrationValuesVisiblePatternString, {
        concentration: this.model.solution.concentrationProperty.value.toFixed( 3 )
      } );
      if ( increasing ) {
        raiseLower = lowersString;
        increaseDecrease = increasesString
      }
      return StringUtils.fillIn( sliderMovedAlertPatternString, {
        sliderName: solutionVolumeAccessibleNameString,
        increases: increaseDecrease,
        raises: raiseLower,
        concentrationClause: concentrationClause
      } );
    }

    /**
     * Describes the concentration level in the beaker in the play area.
     * param {Boolean} increasing - indicates whether the slider has moved up or down. true if up, false if down
     * @public
     * @returns {string}
     */
    getSoluteAmountAlert( increasing ) {
      let raiseLower = raisesString;
      let increaseDecrease = increasesString
      const concentrationClause = StringUtils.fillIn( solutionConcentrationValuesVisiblePatternString, {
        concentration: this.model.solution.concentrationProperty.value.toFixed( 3 )
      } );
      if ( !increasing ) {
        raiseLower = lowersString;
        increaseDecrease = decreasesString
      }
      return StringUtils.fillIn( sliderMovedAlertPatternString, {
        sliderName: soluteAmountAccessibleNameString,
        increases: increaseDecrease,
        raises: raiseLower,
        concentrationClause: concentrationClause
      } );
    }

    /**
     * Uses the singleton pattern to keep one instance of this describer for the entire lifetime of the sim.
     * @returns {SolutionDescriber}
     */
    static getDescriber() {
      assert && assert( describer, 'describer has not yet been initialized' );
      return describer;
    }

    /**
     * Initialize the describer singleton
     * @param {MolarityModel} model
     * @param {BooleanProperty} valuesVisibleProperty
     * @returns {SolutionDescriber}
     */
    static initialize( model ) {
      describer = new MolarityAlertManager( model );
      return describer;
    }

  };

  molarity.register( 'MolarityAlertManager', MolarityAlertManager );

  return MolarityAlertManager;
} );
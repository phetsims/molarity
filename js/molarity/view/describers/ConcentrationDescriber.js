// Copyright 2019, University of Colorado Boulder

/**
 * ConcentrationDescriber is responsible for formulating  strings about Solution.concentrationProperty. This includes
 * descriptions set in the PDOM, as well as context responses set through UtteranceQueue.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const MolarityConstants = require( 'MOLARITY/molarity/MolarityConstants' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const Util = require( 'DOT/Util' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const beakerQualitativeConcentrationPatternString = MolarityA11yStrings.beakerQualitativeConcentrationPattern.value;
  const colorChangePatternString = MolarityA11yStrings.colorChangePattern.value;
  const concentrationAndUnitString = MolarityA11yStrings.concentrationAndUnit.value;
  const concentrationChangePatternString = MolarityA11yStrings.concentrationChangePattern.value;
  const concentrationRangePatternString = MolarityA11yStrings.concentrationRangePattern.value;
  const qualitativeConcentrationStateClausePatternString = MolarityA11yStrings.qualitativeConcentrationStateClausePattern.value;
  const quantitativeConcentrationStatePatternString = MolarityA11yStrings.quantitativeConcentrationStatePattern.value;

  // Concentration region strings
  const zeroConcentrationString = MolarityA11yStrings.zeroConcentration.value;
  const lowConcentrationString = MolarityA11yStrings.lowConcentration.value;
  const slightlyConcentratedString = MolarityA11yStrings.slightlyConcentrated.value;
  const notVeryConcentratedString = MolarityA11yStrings.notVeryConcentrated.value;
  const veryConcentratedString = MolarityA11yStrings.veryConcentrated.value;
  const highlyConcentratedString = MolarityA11yStrings.highlyConcentrated.value;
  const maxConcentrationString = MolarityA11yStrings.maxConcentration.value;

  // Concentration active region strings
  const hasZeroConcentrationString = MolarityA11yStrings.hasZeroConcentration.value;
  const hasLowConcentrationString = MolarityA11yStrings.hasLowConcentration.value;
  const isSlightlyConcentratedString = MolarityA11yStrings.isSlightlyConcentrated.value;
  const isNotVeryConcentratedString = MolarityA11yStrings.isNotVeryConcentrated.value;
  const isVeryConcentratedString = MolarityA11yStrings.isVeryConcentrated.value;
  const isHighlyConcentratedString = MolarityA11yStrings.isHighlyConcentrated.value;
  const hasMaxConcentrationString = MolarityA11yStrings.hasMaxConcentration.value;

  // Change strings
  const lessCapitalizedString = MolarityA11yStrings.less.capitalized.value;
  const lessLowercaseString = MolarityA11yStrings.less.lowercase.value;
  const moreCapitalizedString = MolarityA11yStrings.more.capitalized.value;
  const moreLowercaseString = MolarityA11yStrings.more.lowercase.value;
  const lighterString = MolarityA11yStrings.lighter.value;
  const darkerString = MolarityA11yStrings.darker.value;

  // constants
  const ACTIVE_CONCENTRATION_STRINGS = [
    hasZeroConcentrationString,
    hasLowConcentrationString,
    isSlightlyConcentratedString,
    isNotVeryConcentratedString,
    isVeryConcentratedString,
    isHighlyConcentratedString,
    hasMaxConcentrationString
  ];

  const CONCENTRATION_STRINGS = [
    zeroConcentrationString,
    lowConcentrationString,
    slightlyConcentratedString,
    notVeryConcentratedString,
    veryConcentratedString,
    highlyConcentratedString,
    maxConcentrationString
  ];

  class ConcentrationDescriber {

    /**
     * @param {Solution} solution - from MolarityModel
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
     */
    constructor( solution, useQuantitativeDescriptionsProperty ) {

      // @private
      this.solution = solution;
      this.soluteProperty = solution.soluteProperty;
      this.concentrationProperty = solution.concentrationProperty;
      this.precipitateAmountProperty = solution.precipitateAmountProperty;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      // @public {boolean|null} - tracks whether the solution has most recently gone from saturated to unsaturated or
      // vice-versa.
      this.saturationStateChanged = null;

      // @private {boolean|null} - should only be updated and accessed when the concentrationProperty changes, so
      // while it will be null at some points, it will only be accessed when it holds boolean values (True if concentrationProperty
      // has increased, False if it has decreased)
      this.concentrationIncreased = this.concentrationProperty.value;

      // @public {boolean|null} - tracks whether the descriptive regions for concentrationProperty has changed
      // (since region changes trigger the different descriptive text in the aria-live alerts).
      this.concentrationRegionChanged = null;

      // @private {Number} - tracks the last calculated concentration region index.
      this.lastConcentrationIndex = this.getCurrentConcentrationIndex();

      // update fields (documented above) when concentrationProperty changes
      this.concentrationProperty.lazyLink( ( newValue, oldValue ) => {
        const newConcentrationIndex = concentrationToIndex( this.soluteProperty.value.saturatedConcentration,
          this.concentrationProperty.value );
        const previousSaturationState = oldValue > this.getCurrentSaturatedConcentration();
        const newSaturationState = this.solution.isSaturated();
        this.concentrationIncreased = newValue > oldValue;
        this.concentrationRegionChanged = newConcentrationIndex !== this.lastConcentrationIndex;
        this.lastConcentrationIndex = newConcentrationIndex;
        this.saturationStateChanged = newSaturationState !== previousSaturationState;
      } );

      // update saturationStateChanged field when precipitateAmountProperty changes. This is necessary because
      // concentrationProperty stops changing once the solution is saturated, which makes the detection of a change in
      // saturation not possible without also listening to changes in precipitateAmountProperty.
      this.precipitateAmountProperty.lazyLink( ( newValue, oldValue ) => {
        const previousSaturationState = oldValue !== 0;
        const newSaturationState = newValue !== 0;
        this.saturationStateChanged = newSaturationState !== previousSaturationState;
      } );
    }

    /**
     * Calculates the index of the current concentration region using the saturated concentration of the solute and
     * the current concentration
     * @public
     * @returns {Number} - index of the current concentration region
     * */
    getCurrentConcentrationIndex() {
      return concentrationToIndex( this.concentrationProperty.value, this.soluteProperty.value.saturatedConcentration );
    }

    /**
     * Gets the current value of concentration either quantitatively or quantitatively to plug into descriptions.
     * Qualitative description can be in active or passive voice depending on isPassive parameter.
     * @param {boolean} [isPassive] - ignored if using quantitative descriptions
     * @public
     * @returns {string} - description of current concentration (e.g. "1.500 Molar" or "is very concentrated")
     */
    getCurrentConcentrationClause( isPassive = false ) {
      const concentration = this.concentrationProperty.value;
      if ( this.useQuantitativeDescriptionsProperty.value ) {
        return StringUtils.fillIn( concentrationAndUnitString, {
          concentration: Util.toFixed( concentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES )
        } );
      }
      else {
        const index = concentrationToIndex( this.concentrationProperty.value, this.soluteProperty.value.saturatedConcentration );
        return isPassive ? CONCENTRATION_STRINGS[ index ] : ACTIVE_CONCENTRATION_STRINGS[ index ];
      }
    }

    /**
     * Creates a string describing the concentration range of the current solute.
     * @public
     * @returns {string} - description of concentration range (e.g. "concentration readout range 0 to 0.5 molar")
     */
    getCurrentConcentrationRangeClause() {

      const concentrationMin = MolarityConstants.CONCENTRATION_RANGE.min;
      const concentrationMax = MolarityConstants.CONCENTRATION_RANGE.max;
      const clampedConcentration = Util.clamp( this.getCurrentSaturatedConcentration(), concentrationMin, concentrationMax );

      // The described max concentration in this clause is the maximum of the displayed concentration range for solutes
      // with a max concentration larger than the displayed concentration range max, and is the solute's actual max
      // concentration if it is less than the displayed concentration range max.
      const displayedMaxConcentration = Util.toFixed( clampedConcentration, MolarityConstants.SOLUTE_AMOUNT_DECIMAL_PLACES );

      return StringUtils.fillIn( concentrationRangePatternString, {
        maxConcentration: Util.toFixed( displayedMaxConcentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES )
      } );
    }

    /**
     * Gets the saturated concentration level of the currently selected solute.
     * @private
     * @returns {number}
     */
    getCurrentSaturatedConcentration() {
      return this.soluteProperty.value.saturatedConcentration;
    }

    /**
     * Creates a string that describes the concentration of in the beaker
     * {Property.<boolean>} useQuantitativeDescriptionsProperty
     * @public
     * @returns {string} - e.g. "concentration 1.400 molar" or "is very concentrated"
     */
    getBeakerConcentrationString( useQuantitativeDescriptionsProperty ) {
      const concentrationString = useQuantitativeDescriptionsProperty.value ?
                                  quantitativeConcentrationStatePatternString :
                                  beakerQualitativeConcentrationPatternString;
      return StringUtils.fillIn( concentrationString, {
        concentration: this.getCurrentConcentrationClause()
      } );
    }

    /**
     * Creates a substring to describe how concentration has changed
     * @param [isCapitalized] {boolean}
     * @public
     * @returns {string} - example: "more concentrated"
     */
    getConcentrationChangeString( isCapitalized = false ) {
      assert && assert( !this.solution.isSaturated(), 'concentration cannot change when saturated' );

      let moreLessString = isCapitalized ? lessCapitalizedString : lessLowercaseString;
      if ( this.concentrationIncreased ) {
        moreLessString = isCapitalized ? moreCapitalizedString : moreLowercaseString;
      }
      return StringUtils.fillIn( concentrationChangePatternString, {
        moreLess: moreLessString
      } );
    }

    /**
     * Creates a substring to describe how the color of the solution has changed
     * @public
     * @returns {string} - example: "Solution lighter"
     */
    getColorChangeString() {
      assert && assert( !this.solution.isSaturated(), 'color cannot change when saturated' );

      return StringUtils.fillIn( colorChangePatternString, {
        lighterDarker: this.concentrationIncreased ? darkerString : lighterString
      } );
    }

    /**
     * Creates the qualitative substrings to describe the concentration "state" of the solution.
     * @public
     * @returns {string} - examples: "Concentration 0.600 Molar" or "Solution very concentrated".
     * */
    getQualitativeConcentrationState() {
      assert && assert( !this.useQuantitativeDescriptionsProperty.value, 'qualitative descriptions expected' );
      return StringUtils.fillIn( qualitativeConcentrationStateClausePatternString, {
        concentration: this.getCurrentConcentrationClause( true )
      } );
    }
  }

  /**
   * Calculates the which item to use from the CONCENTRATION_STRINGS array.
   * @param {number} currentConcentration
   * @param {number} saturatedConcentrationForSolute - the saturation point for a specific solute.
   * @returns {number} index to access a region from CONCENTRATION_STRINGS
   */
  const concentrationToIndex = ( currentConcentration, saturatedConcentrationForSolute ) => {

    // compare against un-rounded concentration since these two are single value regions
    // Handle single value region cases before iterating through evenly spaced regions.
    if ( currentConcentration === saturatedConcentrationForSolute ) {
      return CONCENTRATION_STRINGS.length - 1;
    }
    else if ( currentConcentration === MolarityConstants.CONCENTRATION_RANGE.min ) {
      return 0;
    }
    else {

      // Concentration regions are evenly spaced within the region from 0 to max concentration for a given solute except
      // for the lowest region (zero) and the highest region (max concentration) which are single value regions.
      const scaleIncrement = saturatedConcentrationForSolute / ( CONCENTRATION_STRINGS.length - 2 );
      const concentrationRounded = Util.toFixed( currentConcentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES );

      // don't count the first and last concentration string
      for ( let i = 1; i < CONCENTRATION_STRINGS.length - 2; i++ ) {
        if ( concentrationRounded <= ( i + 1 ) * scaleIncrement ) {
          return i;
        }
      }
    }
  };

  return molarity.register( 'ConcentrationDescriber', ConcentrationDescriber );
} );
// Copyright 2019, University of Colorado Boulder

/**
 * Node for the PDOM content to describe the beaker.
 * @author Taylor Want (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ChemUtils = require( 'NITROGLYCERIN/ChemUtils' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  const drinkMixString = require( 'string!MOLARITY/drinkMix' );

  // a11y strings
  const beakerDescriptionPatternString = MolarityA11yStrings.beakerDescriptionPattern.value;
  const hasZeroConcentrationString = MolarityA11yStrings.hasZeroConcentration.value;
  const pureWaterPatternString = MolarityA11yStrings.pureWaterPattern.value;
  const pureWaterString = MolarityA11yStrings.pureWater.value;
  const waterFormulaString = MolarityA11yStrings.waterFormula.value;

  class MolarityBeakerDescriptionNode extends Node {

    /**
     * @param {Solution} solution - from MolarityModel
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
     * @param {SoluteDescriber} soluteDescriber
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {SoluteAmountDescriber} soluteAmountDescriber
     * @param {VolumeDescriber} volumeDescriber
     */
    constructor( solution, useQuantitativeDescriptionsProperty, soluteDescriber, concentrationDescriber,
                 soluteAmountDescriber, volumeDescriber ) {

      super();

      // @private
      this.tagName = 'ul';
      this.solution = solution;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;
      this.concentrationDescriber = concentrationDescriber;
      this.soluteDescriber = soluteDescriber;
      this.soluteAmountDescriber = soluteAmountDescriber;
      this.volumeDescriber = volumeDescriber;

      // @private create the nodes to be used in the description list.
      this.saturationSummaryContainer = new Node();
      this.chemicalFormulaSummaryContainer = new Node();
      this.soluteAmountSummaryItem = new Node( { tagName: 'li' } );
      this.saturationSummaryItem = new Node( { tagName: 'li' } );
      this.concentrationSummaryItem = new Node( { tagName: 'li' } );
      this.chemicalFormulaSummaryItem = new Node( { tagName: 'li' } );
      this.concentrationRangeSummaryItem = new Node( { tagName: 'li' } );

      Property.multilink( [
          useQuantitativeDescriptionsProperty,
          solution.volumeProperty,
          solution.soluteAmountProperty,
          solution.concentrationProperty,
          solution.soluteProperty ],
        () => this.updateBeakerDescription() );

      this.setChildren( [
        this.soluteAmountSummaryItem,
        this.saturationSummaryContainer,
        this.concentrationSummaryItem,
        this.chemicalFormulaSummaryContainer,
        this.concentrationRangeSummaryItem
      ] );
      this.updateBeakerDescription();
    }

    /**
     * updates the entire beaker summary in the PDOM when a model property changes.
     * @private
     */
    updateBeakerDescription() {

      // summary string above the list items
      this.labelContent = this.updateBeakerSummaryString();

      // each method updates a single list item in the description
      this.updateSoluteAmountSummary();
      this.updateSaturationSummary();
      this.updateConcentrationSummary();
      this.updateChemicalFormulaSummary();
      this.updateConcentrationRangeSummary();
    }

    /**
     * updates the summary sentence before the bulleted list of descriptions
     * @private
     */
    updateBeakerSummaryString() {
      const summaryString = !this.concentrationDescriber.hasSolute() ? pureWaterPatternString : beakerDescriptionPatternString;
      return StringUtils.fillIn( summaryString, {
        solute: !this.concentrationDescriber.hasSolute() ? pureWaterString : this.soluteDescriber.getCurrentSolute(),
        volume: this.volumeDescriber.getCurrentVolume( true ),
        color: this.soluteDescriber.getCurrentColor()
      } );
    }

    /**
     * updates the first bullet point - e.g. 'contains some drink mix'
     * @private
     */
    updateSoluteAmountSummary() {
      this.soluteAmountSummaryItem.innerContent = this.soluteAmountDescriber.getBeakerSoluteAmountString();
    }


    /**
     * if the solution is saturated, creates second bullet point - e.g. 'is saturated with a few solids'.
     * Otherwise, it removes that bullet point from the list
     * @private
     */
    updateSaturationSummary() {
      this.saturationSummaryContainer.children = this.solution.isSaturated() ? [ this.saturationSummaryItem ] : [];
      this.saturationSummaryItem.innerContent = this.concentrationDescriber.getBeakerSaturationString();
    }

    /**
     * updates second/third (depending on saturation state) bullet - e.g. 'has low concentration'.
     * @private
     */
    updateConcentrationSummary() {
      if ( !this.concentrationDescriber.hasSolute() ) {
        this.concentrationSummaryItem.innerContent = hasZeroConcentrationString;
      }
      else {
        this.concentrationSummaryItem.innerContent = this.concentrationDescriber.getBeakerConcentrationString(
          this.useQuantitativeDescriptionsProperty );
      }
    }

    /**
     * updates third/fourth (depending on saturation state) bullet - e.g. 'chemical formula of potassium permanganate
     * is KMnO4.' If the solute is drink mix, this bullet is not created.
     * @private
     */
    updateChemicalFormulaSummary() {
      const isDrinkMix = this.soluteDescriber.getCurrentSolute( true ) === drinkMixString;
      if ( !this.concentrationDescriber.hasSolute() ) {

        // if there is no solute in the beaker, the chemical formula of water is displayed instead.
        this.chemicalFormulaSummaryItem.innerContent = ChemUtils.toSubscript( waterFormulaString );
        this.chemicalFormulaSummaryContainer.children = [ this.chemicalFormulaSummaryItem ];

      }
      else if ( !isDrinkMix ) {

        // if there is solute in the beaker and the solute is not drink mix, displays the chemical formula of the solute.
        this.chemicalFormulaSummaryItem.innerContent = this.soluteDescriber.getBeakerChemicalFormulaString();
        this.chemicalFormulaSummaryContainer.children = [ this.chemicalFormulaSummaryItem ];
      }
      else {

        // if there is solute in the beaker and the solute is drink mix, no chemical formula is displayed
        this.chemicalFormulaSummaryContainer.children = [];
      }
    }

    /**
     * updates the concentration range bullet - e.g. 'concentration readout range 0 to 5.0 molar.'
     * @private
     */
    updateConcentrationRangeSummary() {
      this.concentrationRangeSummaryItem.innerContent = this.concentrationDescriber.getCurrentConcentrationRangeClause();
    }
  }


  return molarity.register( 'MolarityBeakerDescriptionNode', MolarityBeakerDescriptionNode );
} );

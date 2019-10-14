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
      this.solution = solution;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;
      this.concentrationDescriber = concentrationDescriber;
      this.soluteDescriber = soluteDescriber;
      this.soluteAmountDescriber = soluteAmountDescriber;
      this.volumeDescriber = volumeDescriber;

      // @private - Create the list of beaker descriptions for the PDOM
      this.beakerDescriptionList = new Node( {
        tagName: 'ul',
        labelContent: this.updateBeakerSummaryString()
      } );

      // @private
      this.soluteAmountSummaryItem = new Node( { tagName: 'li' } );
      this.saturationSummaryItem = new Node( { tagName: 'li' } );
      this.concentrationSummaryItem = new Node( { tagName: 'li' } );
      this.chemicalFormulaSummaryItem = new Node( { tagName: 'li' } );
      this.concentrationRangeSummaryItem = new Node( { tagName: 'li' } );
      this.beakerDescriptionList.setChildren( [
        this.soluteAmountSummaryItem,
        this.concentrationSummaryItem,
        this.chemicalFormulaSummaryItem,
        this.concentrationRangeSummaryItem
      ] );
      this.updateBeakerDescriptionList();
      this.addChild( this.beakerDescriptionList );

      Property.multilink( [
          useQuantitativeDescriptionsProperty,
          solution.volumeProperty,
          solution.soluteAmountProperty,
          solution.concentrationProperty,
          solution.soluteProperty ],
        () => this.updateBeakerDescriptionList() );
    }

    /**
     * updates the entire beaker summary in the PDOM when a model property changes.
     * @private
     */
    updateBeakerDescriptionList() {

      // summary string above the list items
      this.beakerDescriptionList.labelContent = this.updateBeakerSummaryString();

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
      if ( this.solution.isSaturated() ) {
        this.beakerDescriptionList.canAddChild( this.saturationSummaryItem ) &&
        this.beakerDescriptionList.insertChild( 1, this.saturationSummaryItem );
        this.saturationSummaryItem.innerContent = this.concentrationDescriber.getBeakerSaturationString();
      }
      else {
        this.beakerDescriptionList.children.indexOf( this.saturationSummaryItem ) >= 0 &&
        this.beakerDescriptionList.removeChild( this.saturationSummaryItem );
      }
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
      const containsChemicalFormula = this.beakerDescriptionList.children.indexOf( this.chemicalFormulaSummaryItem ) >= 0;

      // doesn't display the chemical formula if drink mix is selected, otherwise displays as the second-to-last item.
      // if there is no solute in the beaker, the chemical formula of water is displayed instead.
      if ( !this.concentrationDescriber.hasSolute() ) {
        this.beakerDescriptionList.canAddChild( this.chemicalFormulaSummaryItem ) &&
        this.beakerDescriptionList.insertChild( this.beakerDescriptionList.children.length - 1,
          this.chemicalFormulaSummaryItem );
        this.chemicalFormulaSummaryItem.innerContent = ChemUtils.toSubscript( waterFormulaString );
      }
      else if ( isDrinkMix ) {
        containsChemicalFormula && this.beakerDescriptionList.removeChild( this.chemicalFormulaSummaryItem );
      }
      else {
        this.beakerDescriptionList.canAddChild( this.chemicalFormulaSummaryItem ) &&
        this.beakerDescriptionList.insertChild( this.beakerDescriptionList.children.length - 1,
          this.chemicalFormulaSummaryItem );
        this.chemicalFormulaSummaryItem.innerContent = this.soluteDescriber.getBeakerChemicalFormulaString();
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

// Copyright 2019, University of Colorado Boulder

/**
 * Node for the PDOM content to describe the beaker.
 * @author Taylor Want (PhET Interactive Simulations)
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

      //@private
      this.solution = solution;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;
      this.concentrationDescriber = concentrationDescriber;
      this.soluteDescriber = soluteDescriber;
      this.soluteAmountDescriber = soluteAmountDescriber;
      this.volumeDescriber = volumeDescriber;

      this.beakerDescriptionList = new Node( {
        tagName: 'ul',
        labelContent: this.updateBeakerSummaryString()
      } );
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

    // @private
    updateBeakerDescriptionList() {
      this.beakerDescriptionList.labelContent = this.updateBeakerSummaryString();
      this.updateSoluteAmountSummary();
      this.updateSaturationSummary();
      this.updateConcentrationSummary();
      this.updateChemicalFormulaSummary();
      this.updateConcentrationRangeSummary();
    }

    updateBeakerSummaryString() {
      const summaryString = this.concentrationDescriber.isNoSolute() ? pureWaterPatternString : beakerDescriptionPatternString;
      return StringUtils.fillIn( summaryString, {
        solute: this.concentrationDescriber.isNoSolute() ? pureWaterString : this.soluteDescriber.getCurrentSolute(),
        volume: this.volumeDescriber.getCurrentVolume( true ),
        color: this.soluteDescriber.getCurrentColor()
      } );
    }

    //@private
    updateSoluteAmountSummary() {
      this.soluteAmountSummaryItem.innerContent = this.soluteAmountDescriber.getBeakerSoluteAmountString();
    }

    // @private
    updateSaturationSummary() {
      if ( this.solution.isSaturated() ) {
        this.beakerDescriptionList.canAddChild( this.saturationSummaryItem ) &&
        this.beakerDescriptionList.insertChild( 1, this.saturationSummaryItem );
        this.saturationSummaryItem.innerContent = this.concentrationDescriber.getBeakerSaturationString();
      }
      else {
        this.beakerDescriptionList.children.includes( this.saturationSummaryItem ) &&
        this.beakerDescriptionList.removeChild( this.saturationSummaryItem );
      }
    }

    // @private
    updateConcentrationSummary() {
      if ( this.concentrationDescriber.isNoSolute() ) {
        this.concentrationSummaryItem.innerContent = hasZeroConcentrationString;
      }
      else {
        this.concentrationSummaryItem.innerContent = this.concentrationDescriber.getBeakerConcentrationString(
          this.useQuantitativeDescriptionsProperty ).toLowerCase();
      }
    }

    // @private
    updateChemicalFormulaSummary() {
      const isDrinkMix = this.soluteDescriber.getCurrentSolute( true ) === drinkMixString;
      const containsChemicalFormula = this.beakerDescriptionList.children.includes( this.chemicalFormulaSummaryItem );

      // doesn't display the chemical formula if drink mix is selected, otherwise displays as the second-to-last item.
      if ( this.concentrationDescriber.isNoSolute() ) {
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

    // @private
    updateConcentrationRangeSummary() {
      this.concentrationRangeSummaryItem.innerContent = this.concentrationDescriber.getCurrentConcentrationRange();
    }
  }

  return molarity.register( 'MolarityBeakerDescriptionNode', MolarityBeakerDescriptionNode );
} );

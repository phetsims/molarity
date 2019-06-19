// Copyright 2019, University of Colorado Boulder

/**
 * Node for the PDOM content to describe the beaker.
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  const drinkMixString = require( 'string!MOLARITY/drinkMix' );

  // a11y strings
  const beakerDescriptionPatternString = MolarityA11yStrings.beakerDescriptionPattern.value;
  const drinkMixChemicalFormulaPatternString = MolarityA11yStrings.drinkMixChemicalFormulaPattern.value;

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
      this.concentrationDescriber = concentrationDescriber;
      this.soluteDescriber = soluteDescriber;
      this.soluteAmountDescriber = soluteAmountDescriber;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      this.beakerDescriptionList = new Node( {
        tagName: 'ul',
        labelTagName: 'p',
        labelContent: StringUtils.fillIn( beakerDescriptionPatternString, {
          solute: soluteDescriber.getCurrentSolute(),
          volume: volumeDescriber.getCurrentVolume( true )
        } )
      } );
      this.colorSummaryItem = new Node( { tagName: 'li' } );
      this.soluteAmountSummaryItem = new Node( { tagName: 'li' } );
      this.saturationSummaryItem = new Node( { tagName: 'li' } );
      this.concentrationSummaryItem = new Node( { tagName: 'li' } );
      this.chemicalFormulaSummaryItem = new Node( { tagName: 'li' } );
      this.concentrationRangeSummaryItem = new Node( { tagName: 'li' } );
      this.beakerDescriptionList.setChildren( [
        this.colorSummaryItem,
        this.soluteAmountSummaryItem,
        this.saturationSummaryItem,
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
      this.updateColorSummary();
      this.updateSoluteAmountSummary();
      this.updateSaturationSummary();
      this.updateConcentrationSummary();
      this.updateChemicalFormulaSummary();
      this.updateConcentrationRangeSummary();
    }

    // @private
    updateColorSummary() {
      this.colorSummaryItem.innerContent = this.soluteDescriber.getCurrentColor();
    }

    //@private
    updateSoluteAmountSummary() {
      this.soluteAmountSummaryItem.innerContent = this.soluteAmountDescriber.getBeakerSoluteAmountString();
    }

    // @private
    updateSaturationSummary() {
      if ( this.solution.isSaturated() ) {
        this.beakerDescriptionList.canAddChild( this.saturationSummaryItem ) &&
        this.beakerDescriptionList.insertChild( 2, this.saturationSummaryItem );
        this.saturationSummaryItem.innerContent = this.concentrationDescriber.getBeakerSaturationString();
      }
      else {
        if ( this.beakerDescriptionList.getChildAt( 2 ) === this.saturationSummaryItem ) {
          this.beakerDescriptionList.removeChildAt( 2 );
        }
      }
    }

    // @private
    updateConcentrationSummary() {
      this.concentrationSummaryItem.innerContent = this.concentrationDescriber.getBeakerConcentrationString(
        this.useQuantitativeDescriptionsProperty );
    }

    // @private
    updateChemicalFormulaSummary() {
      this.chemicalFormulaSummaryItem.innerContent = this.soluteDescriber.getCurrentSolute( true ) === drinkMixString ?
                                                     drinkMixChemicalFormulaPatternString :
                                                     this.soluteDescriber.getBeakerChemicalFormulaString();
    }

    // @private
    updateConcentrationRangeSummary() {
      this.concentrationRangeSummaryItem.innerContent = this.concentrationDescriber.getCurrentConcentrationRange();
    }
  }

  return molarity.register( 'MolarityBeakerDescriptionNode', MolarityBeakerDescriptionNode );
} );

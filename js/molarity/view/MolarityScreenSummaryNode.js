// Copyright 2019, University of Colorado Boulder

/**
 * Node that holds the PDOM content for the screen summary in Molarity.
 * @author Michael Kauzmann (PhET Interactive Simulations)
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

  // a11y strings
  const screenSummaryFirstParagraphPatternString = MolarityA11yStrings.screenSummaryFirstParagraphPattern.value;
  const currentSolutePatternString = MolarityA11yStrings.currentSolutePattern.value;
  const currentSoluteValuesVisiblePatternString = MolarityA11yStrings.currentSoluteValuesVisiblePattern.value;
  const soluteAmountValuesVisiblePatternString = MolarityA11yStrings.soluteAmountValuesVisiblePattern.value;
  const soluteAmountPatternString = MolarityA11yStrings.soluteAmountPattern.value;
  const solutionVolumePatternString = MolarityA11yStrings.solutionVolumePattern.value;
  const solutionConcentrationValuesVisiblePatternString = MolarityA11yStrings.solutionConcentrationValuesVisiblePattern.value;
  const solutionConcentrationPatternString = MolarityA11yStrings.solutionConcentrationPattern.value;
  const soluteAmountSliderValuesArray = MolarityA11yStrings.soluteAmountSliderValues.value;

  class MolarityScreenSummaryNode extends Node {

    /**
     * @param {MolarityModel} model
     * @param {Property.<boolean>} valuesVisibleProperty - tracks whether the values are visible
     */
    constructor( model, valuesVisibleProperty ) {

      super();

      this.addChild( new Node( {
        tagName: 'p',
        accessibleName: StringUtils.fillIn( screenSummaryFirstParagraphPatternString, {
          numberOfSolutes: model.solutes.length
        } )
      } ) );

      const stateOfSim = new Node( {
        tagName: 'ul'
      } );

      const currentSolute = new Node( {
        tagName: 'li'
      } );

      const soluteAmountNode = new Node( {
        tagName: 'li'
      } );

      const solutionVolumeNode = new Node( {
        tagName: 'li'
      } );

      const solutionConcentrationNode = new Node ( {
        tagName: 'li'
      } );

      stateOfSim.addChild( currentSolute );
      stateOfSim.addChild( soluteAmountNode );
      stateOfSim.addChild( solutionVolumeNode );
      stateOfSim.addChild( solutionConcentrationNode );
      this.addChild( stateOfSim );

      Property.multilink( [ model.solution.soluteProperty, model.solution.soluteAmountProperty, model.solution.volumeProperty, model.solution.concentrationProperty, valuesVisibleProperty ], ( currrentSolute, soluteAmount, solutionVolume, solutionConcentration, valuesVisible ) => {
        if ( valuesVisible ) {
          currentSolute.accessibleName = StringUtils.fillIn( currentSoluteValuesVisiblePatternString, {
            solute: currrentSolute.name
          } );
          soluteAmountNode.accessibleName = StringUtils.fillIn( soluteAmountValuesVisiblePatternString, {
            soluteAmount: soluteAmount.toFixed(3)
          } );
          solutionVolumeNode.accessibleName = StringUtils.fillIn( solutionVolumePatternString, {
            solutionVolume: `${solutionVolume} Liters`
          } );
          solutionConcentrationNode.accessibleName = StringUtils.fillIn( solutionConcentrationValuesVisiblePatternString, {
            solutionConcentration: `${solutionConcentration} M`
          } );
        } else {
          currentSolute.accessibleName = StringUtils.fillIn( currentSolutePatternString, {
            solute: currrentSolute.name
          } );

          //soluteAmountIndex calculates the index to pull from the soluteAmountSliderValues.
          const soluteAmountIndex = Math.floor(soluteAmount*(soluteAmountSliderValuesArray.length-1));
          soluteAmountNode.accessibleName = StringUtils.fillIn( soluteAmountPatternString, {
            soluteAmount: soluteAmountSliderValuesArray[soluteAmountIndex]
          } );
          solutionVolumeNode.accessibleName = StringUtils.fillIn( solutionVolumePatternString, {
            solutionVolume: 'Half Full'
          } );
          solutionConcentrationNode.accessibleName = StringUtils.fillIn( solutionConcentrationPatternString, {

          } );


        }
      } );

      // @private
      this.model = model;

    }
  }
  return molarity.register( 'MolarityScreenSummaryNode', MolarityScreenSummaryNode );
} );

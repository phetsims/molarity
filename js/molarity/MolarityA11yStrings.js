// Copyright 2019, University of Colorado Boulder

/**
 * Single location of all accessibility strings.  These strings are not meant to be translatable yet.  Rosetta needs
 * some work to provide translators with context for these strings, and we want to receive some community feedback
 * before these strings are submitted for translation.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );

  const MolarityA11yStrings = {
    more: {
      value: 'more'
    },
    less: {
      value: 'less'
    },
    moreCapitalized: {
      value: 'More'
    },
    lessCapitalized: {
      value: 'Less'
    },
    solute: {
      value: 'solute'
    },
    soluteAmountAccessibleName: {
      value: 'Solute Amount'
    },
    solutionVolumeAccessibleName: {
      value: 'Solution Volume'
    },
    solutionControlsLabel: {
      value: 'Solution Controls'
    },

    // Help text strings
    showValuesHelpText: {
      value: 'Explore with values shown.'
    },
    sliderHelpText: {
      value: 'Solute amount and solution volume allow changes to chosen solution.'
    },
    soluteComboBoxHelpText: {
      value: 'Choose a different solute for beaker.'
    },

    // Screen summary strings
    screenSummaryFirstParagraphPattern: {
      value: 'In the Play Area, you find a beaker containing a solution, and a concentration readout. You can change solute amount, solution volume, and choose from nine different solutes to play with the solution in beaker.'
    },
    screenSummarySecondParagraph: {
      value: ' In the Control Area there is a checkbox to show exact values for amount of solute (in moles), volume of solution (in liters), and concentration (in molar), and a button to reset the sim.'
    },
    stateOfSimPattern: {
      value: 'Currently, beaker {{volume}} of a {{saturatedConcentration}} {{solute}} ‬solution containing {{soluteAmount}} ‪{{solute}}‬ solute. {{concentrationClause}}.\n'
    },
    stateOfSimInteractionHint: {
      value: 'Play with solution in beaker and observe changes to concentration.'
    },
    stateOfSimNoSolutePattern: {
      value: 'Currently, beaker {{volume}} of water. {{solute}} is selected, but no {{solute}} is in the beaker. Play with solute amount and solution volume to explore changes to the concentration of different solutions.\n'
    },
    noSoluteAlert: {
      value: 'No solute. Solution is pure water'
    },
    pureWater: {
      value: 'pure water'
    },
    waterFormula: {
      value: 'chemical formula of pure water is H2O'
    },

    // Beaker description strings
    beakerHeader: {
      value: 'Beaker'
    },
    beakerDescriptionPattern: {
      value: 'Beaker {{volume}} of a {{solute}} solution. The {{color}} solution: '
    },
    beakerSoluteAmountPattern: {
      value: 'contains {{soluteAmount}} {{solute}}'
    },
    beakerSaturationPattern: {
      value: 'Is saturated with {{solids}} solids'
    },
    beakerQualitativeConcentrationPattern: {
      value: 'Is {{concentration}}'
    },
    beakerQuantitativeConcentrationPattern: {
      value: 'concentration {{concentration}}'
    },
    beakerChemicalFormulaPattern: {
      value: 'chemical formula of {{solute}} is {{chemicalFormula}}.'
    },

    // Volume regions
    full: {
      value: 'full'
    },
    nearlyFull: {
      value: 'nearly full'
    },
    overHalfFull: {
      value: 'over half full'
    },
    halfFull: {
      value: 'half full'
    },
    underHalfFull: {
      value: 'under half full'
    },
    nearlyEmpty: {
      value: 'nearly empty'
    },

    // Volume active regions
    isFull: {
      value: 'is full'
    },
    isNearlyFull: {
      value: 'is nearly full'
    },
    isOverHalfFull: {
      value: 'is over half full'
    },
    isHalfFull: {
      value: 'is half full'
    },
    isUnderHalfFull: {
      value: 'is under half full'
    },
    hasLowestAmount: {
      value: 'has the lowest amount'
    },
    isNearlyEmpty: {
      value: 'is nearly empty'
    },

    // Solute Amount Regions - uppercase and lowercase
    theMaxAmountOf: {
      value: 'The max amount of'
    },
    aLotOf: {
      value: 'A lot of'
    },
    aBunchOf: {
      value: 'A bunch of'
    },
    some: {
      value: 'Some'
    },
    aLowAmountOf: {
      value: 'A low amount of'
    },
    aLittle: {
      value: 'A little'
    },
    no: {
      value: 'No'
    },
    theMaxAmountOfLowercase: {
      value: 'the max amount of'
    },
    aLotOfLowercase: {
      value: 'a lot of'
    },
    aBunchOfLowercase: {
      value: 'a bunch of'
    },
    someLowercase: {
      value: 'some'
    },
    aLowAmountOfLowercase: {
      value: 'a low amount of'
    },
    aLittleLowercase: {
      value: 'a little'
    },
    noLowercase: {
      value: 'no'
    },


    // Solids regions
    aCoupleOf: {
      value: 'a couple of'
    },
    aFew: {
      value: 'a few'
    },

    // Concentration regions
    notConcentrated: {
      value: 'not concentrated'
    },
    barelyConcentrated: {
      value: 'barely concentrated'
    },
    slightlyConcentrated: {
      value: 'slightly concentrated'
    },
    concentrated: {
      value: 'concentrated'
    },
    veryConcentrated: {
      value: 'very concentrated'
    },
    saturated: {
      value: 'saturated'
    },
    notSaturated: {
      value: 'not yet saturated'
    },

    // Quantitative value text strings for both volume and solute amount sliders
    quantitativeInitialValueTextPattern: {
      value: '{{quantity}} in solution.'
    },
    quantitativeInitialAlertPattern: {
      value: '{{concentrationChange}}. Concentration {{concentration}}.'
    },
    quantitativeValueTextPattern: {
      value: '{{concentrationChange}} at {{concentration}}.'
    },
    quantitativeVolumeSliderValueTextPattern: {
      value: '{{volume}} in beaker'
    },
    solutionVolumeAndUnitPattern: {
      value: '{{volume}} liters'
    },
    hasVolumePattern: {
      value: 'has {{volume}} liters'
    },
    soluteAmountAndUnitPattern: {
      value: '{{soluteAmount}} moles'
    },

    // Qualitative value text strings for both volume and solute amount sliders
    qualitativeSaturatedValueTextPattern: {
      value: '{{propertyAmountChange}}, {{solidsChange}}. {{stillSaturatedClause}}.'
    },
    qualitativeValueTextPattern: {
      value: '{{quantityChange}}, {{concentrationChange}}. {{stateInfo}}'
    },

    // Qualitative volume value text strings
    qualitativeVolumeStatePattern: {
      value: 'Beaker {{volume}}'
    },
    qualitativeVolumeSliderValueTextPattern: {
      value: 'Beaker {{volume}}'
    },
    volumeChangePattern: {
      value: '{{moreLess}} solution'
    },

    // Qualitative solute amount value text strings
    qualitativeSoluteAmountStatePattern: {
      value: '{{soluteAmount}} {{solute}}'
    },
    soluteAmountChangedPattern: {
      value: '{{moreLess}} solute'
    },
    soluteAmountSliderValueTextPattern: {
      value: '{{soluteAmount}} {{solute}}'
    },


    // Quantitative concentration value text strings
    qualitativeConcentrationStatePattern: {
      value: 'Solution {{concentration}}'
    },
    quantitativeConcentrationStatePattern: {
      value: 'Concentration {{concentration}}'
    },
    quantitativeConcentrationPattern: {
      value: 'Concentration is {{concentration}}'
    },
    concentrationAndUnit: {
      value: '{{concentration}} molar'
    },

    // Qualitative concentration value text strings
    qualitativeConcentrationPattern: {
      value: 'Solution is {{concentration}} and is {{saturatedConcentration}}'
    },
    concentrationChangePattern: {
      value: '{{moreLess}} concentrated'
    },
    concentrationRangePattern: {
      value: 'concentration readout range 0.00 to {{maxConcentration}}'
    },

    // Solute changed alert string
    soluteChangedAlertPattern: {
      value: 'New solution. {{solute}} {{concentrationRange}}.'
    },
    soluteChangedUnsaturatedAlertPattern: {
      value: 'New solution. Not saturated, no solids. Solution {{concentration}}.'
    },
    soluteChangedSaturatedAlertPattern: {
      value: 'New solution. Saturated, {{solids}} solids. Beyond max concentration.'
    },

    // New saturation state alerts
    saturationReachedAlert: {
      value: 'Solution saturated. Beyond max concentration, solids appear.'
    },
    saturationLostAlertPattern: {
      value: 'Solution no longer saturated. Solution {{concentration}}, solids dissolve.'
    },

    // Saturated solution alert strings
    stillSaturatedAlertPattern: {
      value: 'Still saturated{{withSolids}}'
    },
    withSolidsAlertPattern: {
      value: ' with {{solidAmount}} solids'
    },
    solidsChangePattern: {
      value: '{{moreLess}} solids'
    },

    // Keyboard help content section strings
    popUpListDescription: {
      value: 'Pop up list of solutes with Enter or Space keys'
    },
    moveThroughDescription: {
      value: 'Move through solutes with Up and Down arrow keys'
    },
    changeChooseDescription: {
      value: 'Choose solute with Enter key'
    },
    closeListDescription: {
      value: 'Close list without changing with Esc key'
    },

    // Alert strings for show values checkbox
    showValuesCheckedAlert: {
      value: 'Moles, litres and concentration values shown.'
    },
    showValuesUncheckedAlert: {
      value: 'Values hidden.'
    },

    // Lowercase solute names
    cobaltIINitrateLowercase: {
      value: 'cobalt(II) nitrate'
    },
    cobaltChlorideLowercase: {
      value: 'cobalt(II) chloride'
    },
    copperSulfateLowercase: {
      value: 'copper(II) sulfate'
    },
    drinkMixLowercase: {
      value: 'drink mix'
    },
    goldIIIChlorideLowercase: {
      value: 'gold(III) chloride'
    },
    nickelIIChlorideLowercase: {
      value: 'nickel(II) chloride'
    },
    potassiumChromateLowercase: {
      value: 'potassium chromate'
    },
    potassiumDichromateLowercase: {
      value: 'potassium dichromate'
    },
    potassiumPermanganateLowercase: {
      value: 'potassium permanganate'
    },

    // color strings
    red: {
      value: 'red'
    },
    pink: {
      value: 'pink'
    },
    orange: {
      value: 'orange'
    },
    gold: {
      value: 'gold'
    },
    yellow: {
      value: 'yellow'
    },
    green: {
      value: 'green'
    },
    blue: {
      value: 'blue'
    },
    purple: {
      value: 'purple'
    },
    clear: {
      value: 'clear'
    }
  };

  // TODO: This seems it should be factored out, see https://github.com/phetsims/tasks/issues/917
  if ( phet.chipper.queryParameters.stringTest === 'xss' ) {
    for ( const key in MolarityA11yStrings ) {
      MolarityA11yStrings[ key ].value += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABCQEBtxmN7wAAAABJRU5ErkJggg==" onload="window.location.href=atob(\'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==\')" />';
    }
  }

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( MolarityA11yStrings ); }

  return molarity.register( 'MolarityA11yStrings', MolarityA11yStrings );
} );

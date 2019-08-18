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
    of: {
      value: 'of '
    },
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
    soluteAmount: {
      value: 'Solute Amount'
    },
    solutionVolume: {
      value: 'Solution Volume'
    },
    solutionControls: {
      value: 'Solution Controls'
    },
    concentration: {
      value: 'Concentration'
    },
    solution: {
      value: 'Solution'
    },

    // Help text strings
    solutionValuesHelpText: {
      value: 'Explore with values shown.'
    },
    sliderHelpText: {
      value: 'Solute amount and solution volume allow changes to chosen solution.'
    },
    soluteComboBoxHelpText: {
      value: 'Choose a different solute for beaker.'
    },

    // Screen summary strings
    screenSummaryPlayAreaPattern: {
      value: 'In the Play Area, you find a beaker containing a solution, and a concentration readout. You can change solute amount, solution volume, and choose from nine different solutes to play with the solution in beaker.'
    },
    screenSummaryControlAreaPattern: {
      value: ' In the Control Area there is a checkbox to show exact values for amount of solute (in moles), volume of solution (in liters), and concentration (in molar), and a button to reset the sim.'
    },
    stateOfSimPattern: {
      value: 'Currently, beaker {{volume}} of a {{color}} ‬solution containing {{soluteAmount}} {{of}}‪{{solute}}‬ solute. {{concentrationClause}}.\n'
    },
    stateOfSimInteractionHint: {
      value: 'Play with solution in beaker and observe changes to concentration.'
    },
    stateOfSimNoSolutePattern: {
      value: 'Currently, beaker {{volume}} of pure water, and contains no {{solute}} solute.'
    },
    noSoluteQualitativeAlert: {
      value: 'No solute. Solution is pure water'
    },
    noSoluteQuantitativeAlert: {
      value: 'Zero solute. Solution is pure water'
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
    hasZeroConcentration: {
      value: 'has zero concentration'
    },
    pureWaterPattern: {
      value: 'Beaker {{volume}} of pure water. The {{color}} solution: '
    },
    beakerSoluteAmountPattern: {
      value: 'contains {{soluteAmount}} {{solute}}'
    },
    beakerSaturationPattern: {
      value: 'is saturated with {{solids}} solids'
    },
    beakerQualitativeConcentrationPattern: {
      value: '{{concentration}}'
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
    atLowestAmount: {
      value: 'at lowest amount'
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
    isAtLowestAmount: {
      value: 'is at lowest amount'
    },
    isNearlyEmpty: {
      value: 'is nearly empty'
    },

    // Solute Amount Regions - uppercase
    maxAmountOf: {
      value: 'Max amount of'
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

    // Solute Amount regions -- lowercase
    maxAmountOfLowercase: {
      value: 'max amount of'
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

    // Active concentration regions
    hasLowConcentration: {
      value: 'has low concentration'
    },
    isSlightlyConcentrated: {
      value: 'is slightly concentrated'
    },
    isNotVeryConcentrated: {
      value: 'is not very concentrated'
    },
    isVeryConcentrated: {
      value: 'is very concentrated'
    },
    isHighlyConcentrated: {
      value: 'is highly concentrated'
    },
    hasMaxConcentration: {
      value: 'has max concentration'
    },

    // Concentration regions
    zeroConcentration: {
      value: 'zero concentration'
    },
    lowConcentration: {
      value: 'low concentration'
    },
    slightlyConcentrated: {
      value: 'slightly concentrated'
    },
    notVeryConcentrated: {
      value: 'not very concentrated'
    },
    veryConcentrated: {
      value: 'very concentrated'
    },
    highlyConcentrated: {
      value: 'highly concentrated'
    },
    maxConcentration: {
      value: 'max concentration'
    },

    // saturation states
    saturated: {
      value: 'saturated'
    },
    notSaturated: {
      value: 'not saturated'
    },

    // Quantitative value text strings for both volume and solute amount sliders
    quantitativeInitialValueTextPattern: {
      value: '{{quantity}} in solution.'
    },
    quantitativeInitialAlertPattern: {
      value: '{{concentrationChange}}. Concentration {{concentration}}.'
    },
    quantitativeSliderAlertPattern: {
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
    qualitativeSliderAlertPattern: {
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
      value: 'concentration {{concentration}}.'
    },
    quantitativeConcentrationPattern: {
      value: 'Solution is {{saturatedConcentration}}, and concentration is {{concentration}}'
    },
    concentrationAndUnit: {
      value: '{{concentration}} molar'
    },

    // Qualitative concentration value text strings
    qualitativeConcentrationPattern: {
      value: 'Solution is {{saturatedConcentration}} and {{concentration}}'
    },
    concentrationChangePattern: {
      value: '{{moreLess}} concentrated'
    },
    concentrationRangePattern: {
      value: 'concentration readout range 0 to {{maxConcentration}} molar'
    },

    // Solute changed alert string
    soluteChangedUnsaturatedAlertPattern: {
      value: '{{color}} solution, {{concentrationClause}}.'
    },
    soluteChangedSaturatedAlertPattern: {
      value: '{{color}} solution, saturated with {{solids}} solids, {{concentrationClause}}'
    },
    soluteChangedQualitativePattern: {
      value: 'beyond max concentration'
    },
    noSoluteAlertQuantitative: {
      value: 'Clear solution, pure water at zero moles.'
    },
    noSoluteAlertQualitative: {
      value: 'Clear solution, pure water with no solute.'
    },

    // New saturation state alerts
    saturationReachedAlert: {
      value: 'Solution saturated. Beyond max concentration, solids appear.'
    },
    saturationLostAlertPattern: {
      value: 'Solution no longer saturated. {{solutionOrConcentration}} {{concentration}}, solids dissolve.'
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

    // Alert strings for solution values checkbox
    solutionValuesCheckedAlert: {
      value: 'Moles, litres and concentration values shown.'
    },
    solutionValuesUncheckedAlert: {
      value: 'Values hidden.'
    },

    // capitalized color strings
    redCapitalized: {
      value: 'Red'
    },
    pinkCapitalized: {
      value: 'Pink'
    },
    orangeCapitalized: {
      value: 'Orange'
    },
    goldCapitalized: {
      value: 'Gold'
    },
    yellowCapitalized: {
      value: 'Yellow'
    },
    greenCapitalized: {
      value: 'Green'
    },
    blueCapitalized: {
      value: 'Blue'
    },
    purpleCapitalized: {
      value: 'Purple'
    },
    clearCapitalized: {
      value: 'Clear'
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

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
    showValuesHelpText: {
      value: 'Explore with values shown.'
    },
    soluteAmountAccessibleName: {
      value: 'Solute Amount'
    },
    solutionVolumeAccessibleName: {
      value: 'Solution Volume'
    },
    screenSummaryFirstParagraphPattern: {
      value: 'In the Play Area, you find a beaker containing a solution, and a concentration readout. You can adjust the amount of solute in the solution and the solution volume. You can also choose from nine different solutes to include in your solution. In the Control Area there is a checkbox to show the exact values for amount of solute (in moles), volume of solution (in liters), and concentration (Molar), and a button to reset the sim.'
    },
    stateOfSimPattern: {
      value: 'Currently, beaker is {{volume}} of a {{saturatedConcentration}} {{solute}} ‬solution containing {{soluteAmount}} ‪{{solute}}‬ solute. {{concentrationClause}}.'
    },
    stateOfSimNoSolutePattern: {
      value: 'Beaker is {{volume}} of water. {{solute}} is selected, but no {{solute}} is in the beaker.”'
    },
    soluteAmountAndUnitPattern: {
      value: '{{soluteAmount}} moles'
    },
    soluteAmountPattern: {
      value: 'Solute amount is {{soluteAmount}}.'
    },
    solutionVolumePattern: {
      value: 'Solution is {{volume}}.'
    },
    solutionVolumeAndUnitPattern: {
      value: '{{volume}} liters'
    },
    quantitativeConcentrationPattern: {
      value: 'Concentration is {{concentration}}'
    },
    qualitativeConcentrationPattern: {
      value: 'Solution is {{concentration}} and is {{saturatedConcentration}}'
    },
    beakerHeader: {
      value: 'Beaker'
    },
    beakerDescription: {
      value: 'Solution Concentration of {{solute}} Is {{concentration}}. Concentration readout range is 0.00 to {{maxConcentration}}. The chemical formula for {{solute}} is {{chemicalFormula}}.'
    },
    soluteComboBoxLabel: {
      value: 'Select Solute'
    },
    solutionControlsLabel: {
      value: 'Solution Controls'
    },
    solutionControlsDescription: {
      value: 'Solute Amount and Solution Volume sliders change solution in Beaker.'
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
    low: {
      value: 'low'
    },
    nearlyEmpty: {
      value: 'nearly empty'
    },

    // Solute Amount Regions
    theMaxAmountOf: {
      value: 'the max amount of'
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
    zero: {
      value: 'zero'
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
    more: {
      value: 'More'
    },
    less: {
      value: 'Less'
    },
    solution: {
      value: 'solution'
    },
    solute: {
      value: 'solute'
    },
    soluteAmountChangedPattern: {
      value: '{{moreLess}} solute'
    },
    volumeChangePattern: {
      value: '{{moreLess}} solution'
    },
    volumeSliderMovedAlertPattern: {
      value: '{{moreLess}} solution, {{lessMore}} concentrated. {{stateInfo}}'
    },
    soluteAmountSliderMovedAlertPattern: {
      value: '{{moreLess}} solute, {{lessMore}} concentrated. {{stateInfo}}'
    },
    volumeSliderMovedSolidsAlertPattern: {
      value: '{{moreLess}} solution, {{lessMore}} solids. {{stateInfo}}'
    },
    soluteAmountSliderMovedSolidsAlertPattern: {
      value: '{{moreLess}} solute, {{lessMore}} solids. {{stateInfo}}'
    },
    soluteAmountSliderInitialAlertPattern: {
      value: '{{moreLess}} concentrated. {{soluteAmount}} in solution. Concentration {{concentration}}.'
    },
    volumeSliderInitialAlertPattern: {
      value: '{{concentrationChange}}. {{volume}} of solution in Beaker. Concentration {{concentration}}.'
    },
    stateInfoPattern: {
      value: '{{soluteAmountClause}}{{volumeClause}}. Solution {{concentration}}.'
    },
    soluteAmountStateInfoPattern: {
      value: '{{soluteAmount}} of {{solute}}. Solution {{concentration}}'
    },
    volumeStateInfoPattern: {
      value: 'Beaker {{volume}}. Solution {{concentration}}'
    },
    sliderAlertStateInfoValuesVisiblePattern: {
      value: '{{quantity}}, {{concentrationChange}} at {{concentration}} Molar.'
    },

    // Quantitative value text strings for both volume and solute amount sliders
    quantitativeInitialValueTextPattern: {
      value: '{{concentrationChange}}. {{quantity}} in solution. Concentration {{concentration}}.'
    },
    quantitativeValueTextPattern: {
      value: '{{quantity}}, {{concentrationChange}} at {{concentration}}.'
    },

    // Quantitative value text strings for both volume and solute amount sliders
    qualitativeSaturatedValueTextPattern: {
      value: '{{propertyAmountChange}}, {{solidsChange}}. {{stillSaturatedClause}}.'
    },
    qualitativeStateInfoPattern: {
      value: '{{quantityState}}. {{concentrationState}}.'
    },

    // Qualitative volume value text strings
    qualitativeVolumeValueTextPattern: {
      value: '{{volumeChange}}, {{concentrationChange}}. {{stateInfo}}'
    },
    qualitativeVolumeStatePattern: {
      value: 'Beaker {{volume}}'
    },

    // Qualitative solute amount value text strings
    qualitativeSoluteAmountValueTextPattern: {
      value: '{{soluteAmountChange}}, {{concentrationChange}}. {{stateInfo}}'
    },
    qualitativeSoluteAmountStatePattern: {
      value: '{{soluteAmount}} {{solute}}'
    },

    // Qualitative concentration value text strings
    qualitativeConcentrationStatePattern: {
      value: 'Solution {{concentration}}'
    },
    quantitativeConcentrationStatePattern: {
      value: 'Concentration {{concentration}}'
    },

    soluteChangedAlertPattern: {
      value: '{{solute}} concentration readout range 0.00 to {{maxConcentration}}'
    },
    soluteAmountSliderFocusAlertPattern: {
      value: '{{solute}} {{soluteAmount}} moles, Solute Amount slider'
    },
    saturatedAlert: {
      value: 'Solution saturated. Beyond max concentration, solids appear.'
    },
    stillSaturatedAlertPattern: {
      value: 'Still saturated{{withSolids}}'
    },
    withSolidsAlertPattern: {
      value: ' with {{solidAmount}} solids'
    },

    concentrationChangePattern: {
      value: '{{moreLess}} concentrated'
    },

    solidsChangePattern: {
      value: '{{moreLess}} solids'
    },

    saturationReachedAlert: {
      value: 'Solution saturated. Beyond max concentration, solids appear.'
    },
    saturationLostAlertPattern: {
      value: 'Solution no longer saturated. Solution {{concentration}}, solids dissolve.'
    },
    solids: {
      value: 'solids'
    },
    quantitativeVolumeSliderValueTextPattern: {
      value: '{{volume}} in beaker'
    },
    qualitativeVolumeSliderValueTextPattern: {
      value: 'Beaker {{volume}}'
    },
    soluteAmountSliderValueTextPattern: {
      value: '{{soluteAmount}} {{solute}}'
    },
    noSoluteAlert: {
      value: 'No solute. Solution is pure water.'
    },
    sliderHelpHeading: {
      value: 'Solute Amount & Solution Volume'
    },
    changeSoluteHelpHeading: {
      value: 'Change Solute in 3 Steps'
    },
    popUpListLabel: {
      value: 'Pop up list of solutes with [Enter] or [Space] keys'
    },
    popUpListDescription: {
      value: 'Pop up list of solutes with [Enter] or [Space] keys'
    },
    moveThroughLabel: {
      value: 'Move through solutes with [Up] and [Down] arrow keys'
    },
    moveThroughDescription: {
      value: 'Move through solutes with [Up] and [Down] arrow keys'
    },
    changeChooseLabel: {
      value: 'Change/Choose solute with [Enter] key'
    },
    changeChooseDescription: {
      value: 'Change/Choose solute with [Enter] key'
    },
    closeListLabel: {
      value: 'Close list without changing with [Esc] key'
    },
    closeListDescription: {
      value: 'Close list without changing with [Esc] key'
    },
    showValuesCheckedAlert: {
      value: 'Moles, litres and concentration values shown.'
    },
    showValuesUncheckedAlert: {
      value: 'Values hidden.'
    },
    concentrationAndUnit: {
      value: '{{concentration}} Molar'
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

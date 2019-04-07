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
      value: 'Currently, beaker is {{volume}} of a {{saturatedConcentration}} ‬solution containing {{soluteAmount}} ‪{{solute}}‬ solute. {{concentrationClause}}.'
    },
    stateOfSimNoSolutePattern: {
      value: 'Beaker is {{volume}} water. {{solute}} is selected, but no {{solute}} is in the beaker.”'
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
    solutionConcentrationValuesVisiblePattern: {
      value: 'Concentration is {{concentration}} molar'
    },
    solutionConcentrationPattern: {
      value: 'Solution is {{concentration}} and is {{saturatedConcentration}}'
    },
    beakerHeader: {
      value: 'Beaker'
    },
    beakerDescription: {
      value: 'Solution Concentration of {{solute}} Is {{concentration}} the peak of this solute is {{maxConcentration}} Molar. The chemical formula for {{solute}} is {{chemicalFormula}}.'
    },
    soluteComboBoxLabel: {
      value: 'Select Solute'
    },
    solutionControlsLabelString: {
      value: 'Solution Controls'
    },
    solutionControlsDescriptionString: {
      value: 'Solute Amount and Solution Volume sliders change solution in Beaker.'
    },
    fullString: {
      value: 'full'
    },
    nearlyFullString: {
      value: 'nearly full'
    },
    overHalfString: {
      value: 'over half'
    },
    halfFullString: {
      value: 'half full'
    },
    underHalfString: {
      value: 'under half'
    },
    lowString: {
      value: 'low'
    },
    nearlyEmptyString: {
      value: 'nearly empty'
    },
    fullAmountString: {
      value: 'The full amount'
    },
    aLotString: {
      value: 'A lot of'
    },
    aBunchString: {
      value: 'A bunch of'
    },
    someString: {
      value: 'Some'
    },
    aLowString: {
      value: 'A low amount of'
    },
    aLittleString: {
      value: 'A little'
    },
    zeroString: {
      value: 'zero'
    },
    aCoupleString: {
      value: 'a couple of'
    },
    aFewString: {
      value: 'a few'
    },
    notConcentratedString: {
      value: 'not concentrated'
    },
    barelyConcentratedString: {
      value: 'barely concentrated'
    },
    slightlyConcentratedString: {
      value: 'slightly concentrated'
    },
    concentratedString: {
      value: 'concentrated'
    },
    veryConcentratedString: {
      value: 'very concentrated'
    },
    saturatedString: {
      value: 'saturated'
    },
    notSaturatedString: {
      value: 'not yet saturated'
    },
    moreString: {
      value: 'More'
    },
    lessString: {
      value: 'Less'
    },
    solutionString: {
      value: 'solution'
    },
    soluteString: {
      value: 'solute'
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
      value: '{{moreLess}} concentrated. {{soluteAmount}} moles in solution. Concentration {{concentration}} Molar'
    },
    volumeSliderInitialAlertPattern: {
      value: '{{moreLess}} concentrated. {{volume}} liters of solution in Beaker. Concentration {{concentration}} Molar'
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
      value: '{{quantity}}, {{moreLess}} concentrated at {{concentration}} Molar.'
    },
    soluteChangedAlertPattern: {
      value: '{{solute}} concentration readout range 0.00 Molar to {{maxConcentration}} Molar'
    },
    soluteAmountSliderFocusAlertPattern: {
      value: '{{solute}} {{soluteAmount}} moles, Solute Amount slider'
    },
    saturatedAlertString: {
      value: 'Solution saturated. Beyond max concentration, solids appear.'
    },
    stillSaturatedAlertPattern: {
      value: 'Still saturated {{withSolids}}'
    },
    withSolidsAlertPattern: {
      value: 'with {{solidAmount}} solids'
    },
    saturationReachedAlertString: {
      value: 'Solution saturated. Beyond max concentration, solids appear.'
    },
    saturationLostAlertPattern: {
      value: 'Solution no longer saturated. Solution {{concentration}}, solids dissolve.'
    },
    solidsString: {
      value: 'solids'
    },
    volumeSliderValuesVisibleAriaValueTextPattern: {
      value: '{{volume}} in beaker'
    },
    volumeSliderAriaValueTextPattern: {
      value: 'Beaker {{volume}}'
    },
    soluteAmountSliderAriaValueTextPattern: {
      value: '{{soluteAmount}} {{solute}}'
    },
    noSoluteAlertString: {
      value: 'No solute. Solution is pure water.'
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

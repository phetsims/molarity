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
    screenSummaryFirstParagraphPattern: {
      value: 'In the Play Area, you find a beaker containing a solution and a concentration scale. You can choose 1 of {{numberOfSolutes}} solutes for the beaker, and observe changes to concentration scale as you adjust solute amount or solution volume. In the Control Area, there is a checkbox to show measured values for mols, Liters and Molarity, and a button to reset the sim.'
    },
    currentSoluteValuesVisiblePattern: {
      value: 'Current solute chosen is {{solute}}'
    },
    currentSolutePattern: {
      value: 'Currently, beaker is {{Half full}} of a {{solute}} solution.'
    },
    soluteAmountValuesVisiblePattern:{
      value: 'Solute amount is {{soluteAmount}} mol.'
    },
    soluteAmountPattern:{
      value: 'Solute amount is {{Below Half}}.'
    },
    soluteAmountAccessibleName: {
      value: 'Solute Amount'
    },
    solutionVolumeAccessibleName: {
      value: 'Solution Volume'
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

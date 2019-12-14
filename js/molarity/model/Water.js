// Copyright 2013-2019, University of Colorado Boulder

/**
 * Water, as a solvent. Solvents have a formula and a color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const MolaritySymbols = require( 'MOLARITY/molarity/MolaritySymbols' );
  const StringCasingPair = require( 'SCENERY_PHET/accessibility/StringCasingPair' );

  // a11y strings
  const capitalizedClearString = MolarityA11yStrings.soluteColors.capitalized.clear.value;
  const lowercaseClearString = MolarityA11yStrings.soluteColors.lowercase.clear.value;

  const Water = {
    formula: MolaritySymbols.WATER,
    color: new Color( 224, 255, 255 ),
    colorStringPair: new StringCasingPair( lowercaseClearString, capitalizedClearString )
  };

  molarity.register( 'Water', Water );

  return Water;
} );
// Copyright 2013-2020, University of Colorado Boulder

/**
 * Water, as a solvent. Solvents have a formula and a color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringCasingPair from '../../../../scenery-phet/js/accessibility/StringCasingPair.js';
import Color from '../../../../scenery/js/util/Color.js';
import molarityStrings from '../../molarityStrings.js';
import molarity from '../../molarity.js';
import MolaritySymbols from '../MolaritySymbols.js';

// a11y strings
const soluteColorsCapitalizedClearString = molarityStrings.a11y.soluteColors.capitalized.clear;
const soluteColorsLowercaseClearString = molarityStrings.a11y.soluteColors.lowercase.clear;

const Water = {
  formula: MolaritySymbols.WATER,
  color: new Color( 224, 255, 255 ),
  colorStringPair: new StringCasingPair( soluteColorsLowercaseClearString, soluteColorsCapitalizedClearString )
};

molarity.register( 'Water', Water );

export default Water;
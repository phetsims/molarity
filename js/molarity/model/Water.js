// Copyright 2013-2022, University of Colorado Boulder

/**
 * Water, as a solvent. Solvents have a formula and a color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringCasingPair from '../../../../scenery-phet/js/accessibility/StringCasingPair.js';
import { Color } from '../../../../scenery/js/imports.js';
import molarity from '../../molarity.js';
import MolarityStrings from '../../MolarityStrings.js';
import MolaritySymbols from '../MolaritySymbols.js';

const soluteColorsCapitalizedClearString = MolarityStrings.a11y.soluteColors.capitalized.clear;
const soluteColorsLowercaseClearString = MolarityStrings.a11y.soluteColors.lowercase.clear;

const Water = {
  formula: MolaritySymbols.WATER,
  color: new Color( 224, 255, 255 ),
  colorStringPair: new StringCasingPair( soluteColorsLowercaseClearString, soluteColorsCapitalizedClearString )
};

molarity.register( 'Water', Water );

export default Water;
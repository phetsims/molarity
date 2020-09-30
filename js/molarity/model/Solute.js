// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of a solute, an immutable data structure.
 * This model is immutable in the sense that you should not change any of its fields after construction,
 * since they do not provide change notification. If you do change any field values, you will hose yourself.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import molarity from '../../molarity.js';

/**
 * @param {string} name - title case
 * @param {string} formula
 * @param {number} saturatedConcentration M (moles/L)
 * @param {Color} minColor solution color for smallest non-zero concentration
 * @param {Color} maxColor solution color for saturated concentration
 * @param {string} lowercaseName - for interactive descriptions
 * @param {StringCasingPair} colorStringPair - lowercase/captialized color strings
 * @param {Object} [options]
 * @constructor
 */
function Solute( name, formula, saturatedConcentration, minColor, maxColor, lowercaseName, colorStringPair, options ) {

  options = merge( {
    particleColor: maxColor, // the solute's color as a particle
    phetioType: Solute.SoluteIO
  }, options );

  // @public
  this.name = name;
  this.formula = formula;
  this.saturatedConcentration = saturatedConcentration;
  this.minColor = minColor;
  this.maxColor = maxColor;
  this.lowercaseName = lowercaseName;
  this.colorStringPair = colorStringPair;
  this.particleColor = options.particleColor;

  PhetioObject.call( this, options );
}

molarity.register( 'Solute', Solute );

inherit( PhetioObject, Solute );

Solute.SoluteIO = new IOType( 'SoluteIO', {
  valueType: Solute,
  documentation: 'The solute for the sim',
  supertype: ReferenceIO( IOType.ObjectIO )
} );

export default Solute;
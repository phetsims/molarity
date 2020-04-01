// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for Solute
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import molarity from '../../molarity.js';

// Objects are statically created, use reference equality to look up instances for toStateObject/fromStateObject
class SoluteIO extends ReferenceIO( ObjectIO ) {}

SoluteIO.documentation = 'The solute for the sim';
SoluteIO.validator = { isValidValue: v => v instanceof phet.molarity.Solute }; //TODO #51 replace global with require?
SoluteIO.typeName = 'SoluteIO';
ObjectIO.validateSubtype( SoluteIO );

molarity.register( 'SoluteIO', SoluteIO );
export default SoluteIO;
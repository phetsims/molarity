// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Solute
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import molarity from '../../molarity.js';

// Objects are statically created, use reference equality to look up instances for toStateObject/fromStateObject
const SoluteIO = new IOType( 'SoluteIO', {
  isValidValue: v => v instanceof phet.molarity.Solute,
  documentation: 'The solute for the sim',
  supertype: ReferenceIO( IOType.ObjectIO )
} );

molarity.register( 'SoluteIO', SoluteIO );
export default SoluteIO;
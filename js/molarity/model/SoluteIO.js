// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Solute
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const molarity = require( 'MOLARITY/molarity' );
  const ReferenceIO = require( 'TANDEM/types/ReferenceIO' );

  // Objects are statically created, use reference equality to look up instances for toStateObject/fromStateObject
  class SoluteIO extends ReferenceIO {}

  SoluteIO.documentation = 'The solute for the sim';
  SoluteIO.validator = { isValidValue: v => v instanceof phet.molarity.Solute }; //TODO #51 replace global with require?
  SoluteIO.typeName = 'SoluteIO';
  ObjectIO.validateSubtype( SoluteIO );

  return molarity.register( 'SoluteIO', SoluteIO );
} );


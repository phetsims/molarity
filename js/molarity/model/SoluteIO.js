// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Solute
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var molarity = require( 'MOLARITY/molarity' );
  var ReferenceIO = require( 'TANDEM/types/ReferenceIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );

  /**
   * @param {Solute} solute
   * @param {string} phetioID
   * @constructor
   */
  function SoluteIO( solute, phetioID ) {

    // Objects are statically created, use reference equality to look up instances for toStateObject/fromStateObject
    ReferenceIO.call( this, solute, phetioID );
  }

  phetioInherit( ReferenceIO, 'SoluteIO', SoluteIO, {}, {
    documentation: 'The solute for the sim',
    validator: { isValidValue: v => v instanceof phet.molarity.Solute } //TODO #51 replace global with require?
  } );

  molarity.register( 'SoluteIO', SoluteIO );

  return SoluteIO;
} );


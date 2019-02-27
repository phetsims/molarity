// Copyright 2017-2018, University of Colorado Boulder

//TODO replace this with StateObjectIO, https://github.com/phetsims/molarity/issues/54
/**
 * IO type for Solute
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var molarity = require( 'MOLARITY/molarity' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var validate = require( 'AXON/validate' );

  // ifphetio
  var phetioEngine = require( 'ifphetio!PHET_IO/phetioEngine' );

  /**
   * @param {Solute} solute
   * @param {string} phetioID
   * @constructor
   */
  function SoluteIO( solute, phetioID ) {
    ObjectIO.call( this, solute, phetioID );
  }

  phetioInherit( ObjectIO, 'SoluteIO', SoluteIO, {}, {
    documentation: 'The solute for the sim',
    validator: { isValidValue: v => v instanceof phet.molarity.Solute },

    /**
     * @param {Solute} solute
     */
    toStateObject: function( solute ) {
      validate( solute, this.validator );
      return solute.tandem.phetioID;
    },

    /**
     * @param {Object} stateObject
     */
    fromStateObject: function( stateObject ) {
      return phetioEngine.getInstance( stateObject );
    }
  } );

  molarity.register( 'SoluteIO', SoluteIO );

  return SoluteIO;
} );


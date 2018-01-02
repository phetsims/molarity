// Copyright 2017, University of Colorado Boulder

//TODO replace this with StateObjectIO, see phetsims/phet-io#1100
/**
 * IO type for Solute
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var molarity = require( 'MOLARITY/molarity' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {Solute} solute
   * @param {string} phetioID
   * @constructor
   */
  function SoluteIO( solute, phetioID ) {
    assert && assertInstanceOf( solute, phet.molarity.Solute );
    ObjectIO.call( this, solute, phetioID );
  }

  phetioInherit( ObjectIO, 'SoluteIO', SoluteIO, {}, {
    documentation: 'The solute for the sim',

    /**
     * @param {Object} stateObject
     */
    fromStateObject: function( stateObject ) {
      return phetio.getWrapper( stateObject ).instance;
    },

    /**
     * @param {Solute} solute
     */
    toStateObject: function( solute ) {
      assert && assertInstanceOf( solute, phet.molarity.Solute );
      return solute.phetioID;
    }
  } );

  molarity.register( 'SoluteIO', SoluteIO );

  return SoluteIO;
} );


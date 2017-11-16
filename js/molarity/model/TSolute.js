// Copyright 2017, University of Colorado Boulder

//TODO replace this with TStateObject, see phetsims/phet-io#1100
/**
 * Wrapper type for Solution
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var molarity = require( 'MOLARITY/molarity' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   * @param {Solute} instance
   * @param {string} phetioID
   * @constructor
   */
  function SoluteIO( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.molarity.Solute );
    ObjectIO.call( this, instance, phetioID );
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
     * @param {Solute} instance
     */
    toStateObject: function( instance ) {
      return instance.phetioID;
    }
  } );

  molarity.register( 'SoluteIO', SoluteIO );

  return SoluteIO;
} );


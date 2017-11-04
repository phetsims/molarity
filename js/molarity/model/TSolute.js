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
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var molarity = require( 'MOLARITY/molarity' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   * @param {Solute} instance
   * @param {string} phetioID
   * @constructor
   */
  function TSolute( instance, phetioID ) {
    assertInstanceOf( instance, phet.molarity.Solute );
    TObject.call( this, instance, phetioID );
  }

  phetioInherit( TObject, 'TSolute', TSolute, {}, {
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

  molarity.register( 'TSolute', TSolute );

  return TSolute;
} );


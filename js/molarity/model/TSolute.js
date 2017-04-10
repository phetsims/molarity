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
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );

  /**
   * @param {Solute} instance
   * @param {string} phetioID
   * @constructor
   */
  var TSolute = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.molarity.Solute );
  };

  phetioInherit( TObject, 'TSolute', TSolute, {}, {

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


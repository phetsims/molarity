// Copyright 2013-2017, University of Colorado Boulder

/**
 * The 'Molarity' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var molarity = require( 'MOLARITY/molarity' );
  var MolarityModel = require( 'MOLARITY/molarity/model/MolarityModel' );
  var MolarityScreenView = require( 'MOLARITY/molarity/view/MolarityScreenView' );
  var Screen = require( 'JOIST/Screen' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function MolarityScreen( tandem ) {

    var options = {
      tandem: tandem
    };

    Screen.call( this,
      function() { return new MolarityModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new MolarityScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  molarity.register( 'MolarityScreen', MolarityScreen );

  return inherit( Screen, MolarityScreen );
} );
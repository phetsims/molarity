// Copyright 2013-2017, University of Colorado Boulder

/**
 * The 'Molarity' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityModel = require( 'MOLARITY/molarity/model/MolarityModel' );
  const MolarityScreenView = require( 'MOLARITY/molarity/view/MolarityScreenView' );
  const Screen = require( 'JOIST/Screen' );

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
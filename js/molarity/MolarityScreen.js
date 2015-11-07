// Copyright 2013-2015, University of Colorado Boulder

/**
 * The 'Molarity' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MolarityModel = require( 'MOLARITY/molarity/model/MolarityModel' );
  var MolarityView = require( 'MOLARITY/molarity/view/MolarityView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var molarityString = require( 'string!MOLARITY/molarity' );

  function MolarityScreen() {

    Screen.call( this,
      molarityString,
      null, // no icon, single-screen sim
      function() { return new MolarityModel(); },
      function( model ) { return new MolarityView( model ); }
    );
  }

  return inherit( Screen, MolarityScreen );
} );
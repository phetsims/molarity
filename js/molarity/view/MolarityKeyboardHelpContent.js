// Copyright 2019, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var molarity = require( 'MOLARITY/molarity' );

  /**
   * Constructor.
   *
   * @constructor
   */
  function MolarityKeyboardHelpContent() {

    // general help section
    var generalNavigationHelpSection = new GeneralKeyboardHelpSection();

    HBox.call( this, {
      children: [ generalNavigationHelpSection ],
      align: 'top',
      spacing: 35
    } );
  }

  molarity.register( 'MolarityKeyboardHelpContent', MolarityKeyboardHelpContent );

  return inherit( HBox, MolarityKeyboardHelpContent );
} );
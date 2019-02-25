// Copyright 2019, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var GeneralNavigationHelpContent = require( 'SCENERY_PHET/keyboard/help/GeneralNavigationHelpContent' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Molarity = require( 'MOLARITY/Molarity' );

  /**
   * Constructor.
   *
   * @constructor
   */
  function MolarityKeyboardHelpContent() {

    // general help content
    var generalNavigationHelpContent = new GeneralNavigationHelpContent();

    HBox.call( this, {
      children: [ generalNavigationHelpContent ],
      align: 'top',
      spacing: 35
    } );
  }

  Molarity.register( 'MolarityKeyboardHelpContent', MolarityKeyboardHelpContent );

  return inherit( HBox, MolarityKeyboardHelpContent );
} );
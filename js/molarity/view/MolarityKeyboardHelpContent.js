// Copyright 2019, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Taylor Want (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  const KeyboardHelpIconFactory = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpIconFactory' );
  const KeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpSection' );
  const molarity = require( 'MOLARITY/molarity' );
  const SliderKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/SliderKeyboardHelpSection' );
  const TwoColumnKeyboardHelpContent = require( 'SCENERY_PHET/keyboard/help/TwoColumnKeyboardHelpContent' );

  // strings
  const keyboardSliderHelpHeadingString = require( 'string!MOLARITY/keyboard.sliderHelpHeading' );
  const keyboardPopUpListString = require( 'string!MOLARITY/keyboard.popUpList' );
  const keyboardChangeSoluteString = require( 'string!MOLARITY/keyboard.changeSolute' );
  const keyboardMoveThroughString = require( 'string!MOLARITY/keyboard.moveThrough' );
  const keyboardCloseListString = require( 'string!MOLARITY/keyboard.closeList' );
  const keyboardChangeSoluteHelpHeadingString = require( 'string!MOLARITY/keyboard.changeSoluteHelpHeading' );

  // a11y strings
  // Description strings for list of help commands
  const helpContentPopUpListDescriptionString = require( 'string!MOLARITY/a11y.helpContent.popUpListDescription' );
  const helpContentMoveThroughDescriptionString = require( 'string!MOLARITY/a11y.helpContent.moveThroughDescription' );
  const helpContentChangeChooseDescriptionString = require( 'string!MOLARITY/a11y.helpContent.changeChooseDescription' );
  const helpContentCloseListDescriptionString = require( 'string!MOLARITY/a11y.helpContent.closeListDescription' );

  // constants
  const labelWithIcon = KeyboardHelpSection.labelWithIcon;

  class MolarityKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
    constructor() {
      // general help section
      const generalNavigationHelpSection = new GeneralKeyboardHelpSection();

      // slider controls help section
      const sliderKeyboardHelpSection = new SliderKeyboardHelpSection( { headingString: keyboardSliderHelpHeadingString } );

      // change solute help section
      const step1 = labelWithIcon( keyboardPopUpListString, KeyboardHelpIconFactory.enterOrSpace(), helpContentPopUpListDescriptionString );
      const step2 = labelWithIcon( keyboardMoveThroughString, KeyboardHelpIconFactory.upOrDown(), helpContentMoveThroughDescriptionString );
      const step3 = labelWithIcon( keyboardChangeSoluteString, KeyboardHelpIconFactory.enter(), helpContentChangeChooseDescriptionString );
      const step4 = labelWithIcon( keyboardCloseListString, KeyboardHelpIconFactory.esc(), helpContentCloseListDescriptionString );
      const changeSoluteContent = [ step1, step2, step3, step4 ];
      const changeSoluteHelpSection = new KeyboardHelpSection( keyboardChangeSoluteHelpHeadingString, changeSoluteContent, {
        a11yContentTagName: 'ol'
      } );

      // Layout of all components of the help section created above.
      const leftContent = [ sliderKeyboardHelpSection ];
      const rightContent = [ changeSoluteHelpSection, generalNavigationHelpSection ];
      KeyboardHelpSection.alignHelpSectionIcons( rightContent );
      super( leftContent, rightContent, { columnSpacing: 35, sectionSpacing: 20 } );
    }
  }

  molarity.register( 'MolarityKeyboardHelpContent', MolarityKeyboardHelpContent );
  return MolarityKeyboardHelpContent;
} );
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
  const ArrowKeyNode = require( 'SCENERY_PHET/keyboard/ArrowKeyNode' );
  const EnterKeyNode = require( 'SCENERY_PHET/keyboard/EnterKeyNode' );
  const EscapeKeyNode = require( 'SCENERY_PHET/keyboard/EscapeKeyNode' );
  const GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  const KeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpSection' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const SliderKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/SliderKeyboardHelpSection' );
  const SpaceKeyNode = require( 'SCENERY_PHET/keyboard/SpaceKeyNode' );
  const TwoColumnKeyboardHelpContent = require( 'SCENERY_PHET/keyboard/help/TwoColumnKeyboardHelpContent' );

  // strings
  const keyboardSliderHelpHeadingString = require( 'string!MOLARITY/keyboard.sliderHelpHeading' );
  const keyboardPopUpListString = require( 'string!MOLARITY/keyboard.popUpList' );
  const keyboardChangeSoluteString = require( 'string!MOLARITY/keyboard.changeSolute' );
  const keyboardMoveThroughString = require( 'string!MOLARITY/keyboard.moveThrough' );
  const keyboardCloseListString = require( 'string!MOLARITY/keyboard.closeList' );
  const keyboardChangeSoluteHelpHeadingString = require( 'string!MOLARITY/keyboard.changeSoluteHelpHeading' );

  // Description strings for list of help commands
  const popUpListDescriptionString = MolarityA11yStrings.popUpListDescription.value;
  const moveThroughDescriptionString = MolarityA11yStrings.moveThroughDescription.value;
  const changeChooseDescriptionString = MolarityA11yStrings.changeChooseDescription.value;
  const closeListDescriptionString = MolarityA11yStrings.closeListDescription.value;

  const ICON_CREATOR = {
    enter: () => {
      return new EnterKeyNode();
    },
    enterOrSpace: () => {
      return KeyboardHelpSection.iconOrIcon( new EnterKeyNode(), new SpaceKeyNode() );
    },
    upOrDown: () => {
      return KeyboardHelpSection.iconOrIcon( new ArrowKeyNode( 'up' ), new ArrowKeyNode( 'down' ) );
    },
    esc: () => {
      return new EscapeKeyNode();
    }
  };

  class MolarityKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
    constructor() {
      // general help section
      const generalNavigationHelpSection = new GeneralKeyboardHelpSection();

      // slider controls help section
      const sliderKeyboardHelpSection = new SliderKeyboardHelpSection( { headingString: keyboardSliderHelpHeadingString } );

      // change solute help section
      const step1 = KeyboardHelpSection.labelWithIcon( keyboardPopUpListString, ICON_CREATOR.enterOrSpace(), popUpListDescriptionString );
      const step2 = KeyboardHelpSection.labelWithIcon( keyboardMoveThroughString, ICON_CREATOR.upOrDown(), moveThroughDescriptionString );
      const step3 = KeyboardHelpSection.labelWithIcon( keyboardChangeSoluteString, ICON_CREATOR.enter(), changeChooseDescriptionString );
      const step4 = KeyboardHelpSection.labelWithIcon( keyboardCloseListString, ICON_CREATOR.esc(), closeListDescriptionString );
      const changeSoluteContent = [ step1, step2, step3, step4 ];
      const changeSoluteHelpSection = new KeyboardHelpSection( keyboardChangeSoluteHelpHeadingString, changeSoluteContent,
        { a11yContentTagName: 'ol' } );

      // Layout of all components of the help section created above.
      KeyboardHelpSection.alignHelpSectionIcons( [ generalNavigationHelpSection, changeSoluteHelpSection ] );
      const leftContent = [ sliderKeyboardHelpSection ];
      const rightContent = [ changeSoluteHelpSection, generalNavigationHelpSection ];
      super( leftContent, rightContent, { columnSpacing: 35, sectionSpacing: 20 } );
    }
  }

  molarity.register( 'MolarityKeyboardHelpContent', MolarityKeyboardHelpContent );
  return MolarityKeyboardHelpContent;
} );
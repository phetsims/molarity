// Copyright 2019-2022, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Taylor Want (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import MenuKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MenuKeyboardHelpSection.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import molarity from '../../molarity.js';
import molarityStrings from '../../molarityStrings.js';

const keyboardSliderHelpHeadingString = molarityStrings.keyboard.sliderHelpHeading;

class MolarityKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  constructor() {

    // general help section
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } );

    // slider controls help section
    const sliderControlsKeyboardHelpSection = new SliderControlsKeyboardHelpSection( { headingString: keyboardSliderHelpHeadingString } );

    const changeSoluteHelpSection = new MenuKeyboardHelpSection( {
      headingString: molarityStrings.keyboard.changeSoluteHelpHeading,
      thingAsLowerCasePlural: molarityStrings.solutes,
      thingAsLowerCaseSingular: molarityStrings.soluteLowercase
    } );

    // Layout of all components of the help section created above.
    const leftContent = [ sliderControlsKeyboardHelpSection ];
    const rightContent = [ changeSoluteHelpSection, basicActionsHelpSection ];
    KeyboardHelpSection.alignHelpSectionIcons( rightContent );
    super( leftContent, rightContent, { columnSpacing: 35, sectionSpacing: 20 } );
  }
}

molarity.register( 'MolarityKeyboardHelpContent', MolarityKeyboardHelpContent );
export default MolarityKeyboardHelpContent;
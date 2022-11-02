// Copyright 2019-2022, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Taylor Want (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import molarity from '../../molarity.js';
import MolarityStrings from '../../MolarityStrings.js';

const keyboardSliderHelpHeadingString = MolarityStrings.keyboard.sliderHelpHeadingStringProperty;

class MolarityKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  constructor() {

    // general help section
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } );

    // slider controls help section
    const sliderControlsKeyboardHelpSection = new SliderControlsKeyboardHelpSection( {
      headingStringProperty: keyboardSliderHelpHeadingString
    } );

    const changeSoluteHelpSection = new ComboBoxKeyboardHelpSection( {
      headingString: MolarityStrings.keyboard.changeSoluteHelpHeading,
      thingAsLowerCasePlural: MolarityStrings.solutes,
      thingAsLowerCaseSingular: MolarityStrings.soluteLowercase
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
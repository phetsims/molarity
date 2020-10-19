// Copyright 2019-2020, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Taylor Want (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import GeneralKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/GeneralKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import SliderKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import molarity from '../../molarity.js';
import molarityStrings from '../../molarityStrings.js';

const keyboardSliderHelpHeadingString = molarityStrings.keyboard.sliderHelpHeading;

class MolarityKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  constructor() {

    // general help section
    const generalNavigationHelpSection = new GeneralKeyboardHelpSection( {
      withCheckboxContent: true
    } );

    // slider controls help section
    const sliderKeyboardHelpSection = new SliderKeyboardHelpSection( { headingString: keyboardSliderHelpHeadingString } );

    const changeSoluteHelpSection = new ComboBoxKeyboardHelpSection( molarityStrings.solute, {
      heading: molarityStrings.changeSoluteHelpHeading,
      thingAsLowerCasePlural: molarityStrings.solutes,
      thingAsLowerCaseSingular: molarityStrings.soluteLowercase
    } );

    // Layout of all components of the help section created above.
    const leftContent = [ sliderKeyboardHelpSection ];
    const rightContent = [ changeSoluteHelpSection, generalNavigationHelpSection ];
    KeyboardHelpSection.alignHelpSectionIcons( rightContent );
    super( leftContent, rightContent, { columnSpacing: 35, sectionSpacing: 20 } );
  }
}

molarity.register( 'MolarityKeyboardHelpContent', MolarityKeyboardHelpContent );
export default MolarityKeyboardHelpContent;
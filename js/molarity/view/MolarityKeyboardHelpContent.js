// Copyright 2019-2020, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Taylor Want (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import GeneralKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/GeneralKeyboardHelpSection.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import SliderKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import molarity from '../../molarity.js';
import molarityStrings from '../../molarityStrings.js';

const keyboardSliderHelpHeadingString = molarityStrings.keyboard.sliderHelpHeading;
const keyboardPopUpListString = molarityStrings.keyboard.popUpList;
const keyboardChangeSoluteString = molarityStrings.keyboard.changeSolute;
const keyboardMoveThroughString = molarityStrings.keyboard.moveThrough;
const keyboardCloseListString = molarityStrings.keyboard.closeList;
const keyboardChangeSoluteHelpHeadingString = molarityStrings.keyboard.changeSoluteHelpHeading;

// Description strings for list of help commands
const helpContentPopUpListDescriptionString = molarityStrings.a11y.helpContent.popUpListDescription;
const helpContentMoveThroughDescriptionString = molarityStrings.a11y.helpContent.moveThroughDescription;
const helpContentChangeChooseDescriptionString = molarityStrings.a11y.helpContent.changeChooseDescription;
const helpContentCloseListDescriptionString = molarityStrings.a11y.helpContent.closeListDescription;

// constants
const labelWithIcon = KeyboardHelpSection.labelWithIcon;

class MolarityKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  constructor() {

    // general help section
    const generalNavigationHelpSection = new GeneralKeyboardHelpSection( {
      withCheckboxContent: true
    } );

    // slider controls help section
    const sliderKeyboardHelpSection = new SliderKeyboardHelpSection( { headingString: keyboardSliderHelpHeadingString } );

    // change solute help section
    const step1 = labelWithIcon( keyboardPopUpListString, KeyboardHelpIconFactory.spaceOrEnter(), helpContentPopUpListDescriptionString );
    const step2 = labelWithIcon( keyboardMoveThroughString, KeyboardHelpIconFactory.upOrDown(), helpContentMoveThroughDescriptionString );
    const step3 = labelWithIcon( keyboardChangeSoluteString, TextKeyNode.enter(), helpContentChangeChooseDescriptionString );
    const step4 = labelWithIcon( keyboardCloseListString, TextKeyNode.esc(), helpContentCloseListDescriptionString );
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
export default MolarityKeyboardHelpContent;
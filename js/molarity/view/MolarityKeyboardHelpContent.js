// Copyright 2019, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( function( require ) {
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
  const VBox = require( 'SCENERY/nodes/VBox' );

  const sliderHelpHeadingString = MolarityA11yStrings.sliderHelpHeading.value;
  const changeSoluteHelpHeadingString = MolarityA11yStrings.changeSoluteHelpHeading.value;
  const popUpListLabelString = MolarityA11yStrings.popUpListLabel.value;
  const popUpListDescriptionString = MolarityA11yStrings.popUpListDescription.value;
  const moveThroughLabelString = MolarityA11yStrings.moveThroughLabel.value;
  const moveThroughDescriptionString = MolarityA11yStrings.moveThroughDescription.value;
  const changeChooseLabelString = MolarityA11yStrings.changeChooseLabel.value;
  const changeChooseDescriptionString = MolarityA11yStrings.changeChooseDescription.value;
  const closeListLabelString = MolarityA11yStrings.closeListLabel.value;
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

  /**
   * Construct a row for the help dialog, assembling a label with an icon using HelpSection. Usages will look like:
   * constructRow( 'jump to the end', 'end' );
   *
   * @param {string} labelString - the text label for the row (visual)
   * @param {string} descriptionString - must be one of the keys in ICON_CREATOR
   * @param {string} iconID - must be one of ICON_CREATOR keys, see that above
   */
  const constructRow = ( labelString, descriptionString, iconID ) => {
    const iconNode = ICON_CREATOR[ iconID ]();
    return KeyboardHelpSection.labelWithIcon( labelString, iconNode, descriptionString );
  };


  class MolarityKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
    constructor() {
      // general help section
      const generalNavigationHelpSection = new GeneralKeyboardHelpSection();

      // slider controls help section
      const sliderKeyboardHelpSection = new SliderKeyboardHelpSection( { headingString: sliderHelpHeadingString } );

      // change solute help section
      const step1 = constructRow( popUpListLabelString,
        popUpListDescriptionString,
        'enterOrSpace' );
      const step2 = constructRow( moveThroughLabelString,
        moveThroughDescriptionString,
        'upOrDown' );
      const step3 = constructRow( changeChooseLabelString,
        changeChooseDescriptionString,
        'enter' );
      const step4 = constructRow( closeListLabelString,
        closeListDescriptionString,
        'esc' );
      const changeSoluteContent = [ step1, step2, step3, step4 ];

      const changeSoluteHelpSection = new KeyboardHelpSection( changeSoluteHelpHeadingString, changeSoluteContent );

      const leftContent = new VBox( { children: [ sliderKeyboardHelpSection, changeSoluteHelpSection ] } );
      super( leftContent, generalNavigationHelpSection, { spacing: 35 } );
    }
  }

  molarity.register( 'MolarityKeyboardHelpContent', MolarityKeyboardHelpContent );

  return MolarityKeyboardHelpContent;
} );
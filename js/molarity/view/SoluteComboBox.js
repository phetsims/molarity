// Copyright 2013-2022, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Rectangle, Text } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import molarity from '../../molarity.js';
import MolarityStrings from '../../MolarityStrings.js';

const pattern0LabelString = MolarityStrings.pattern[ '0label' ];
const soluteString = MolarityStrings.solute;

const soluteComboBoxHelpTextString = MolarityStrings.a11y.soluteComboBoxHelpText;

class SoluteComboBox extends ComboBox {

  /**
   * @param {Property.<Solute>} selectedSoluteProperty
   * @param {Solute[]} solutes
   * @param {Node} listParent parent node for the popup list
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  constructor( selectedSoluteProperty, solutes, listParent, tandem, options ) {

    options = merge( {

      // 'Solute' label
      labelNode: new Text( StringUtils.format( pattern0LabelString, soluteString ), { font: new PhetFont( 22 ) } ),
      listPosition: 'above',
      cornerRadius: 8,
      xMargin: 16,
      yMargin: 16,
      highlightFill: 'rgb( 218, 255, 255 )',

      // pdom
      accessibleName: soluteString,
      helpText: soluteComboBoxHelpTextString,

      // voicing in Comboox:
      comboBoxVoicingNameResponsePattern: MolarityStrings.a11y.soluteValuePattern,
      comboBoxVoicingHintResponse: soluteComboBoxHelpTextString
    }, options );

    assert && assert( !options.tandem, 'tandem is a required constructor parameter' );
    options.tandem = tandem;

    // {ComboBoxItem[]}
    const items = solutes.map( createItem );

    super( selectedSoluteProperty, items, listParent, options );
  }
}

molarity.register( 'SoluteComboBox', SoluteComboBox );

/**
 * Creates an item for the combo box.
 * @param {Solute} solute
 * @returns {ComboBoxItem}
 */
const createItem = solute => {

  const colorNode = new Rectangle( 0, 0, 20, 20, {
    fill: solute.maxColor,
    stroke: solute.maxColor.darkerColor()
  } );

  const textNode = new Text( solute.name, {
    font: new PhetFont( 20 )
  } );

  const hBox = new HBox( {
    spacing: 5,
    children: [ colorNode, textNode ]
  } );

  return {
    value: solute,
    node: hBox,
    soundPlayer: nullSoundPlayer, // sound generation for selection is done elsewhere
    tandemName: `${solute.tandem.name}${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`,
    a11yLabel: solute.name
  };
};

export default SoluteComboBox;
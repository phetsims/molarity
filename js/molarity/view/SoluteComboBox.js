// Copyright 2013-2021, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import SoundPlayer from '../../../../tambo/js/SoundPlayer.js';
import molarity from '../../molarity.js';
import molarityStrings from '../../molarityStrings.js';

const pattern0LabelString = molarityStrings.pattern[ '0label' ];
const soluteString = molarityStrings.solute;

const soluteComboBoxHelpTextString = molarityStrings.a11y.soluteComboBoxHelpText;

class SoluteComboBox extends ComboBox {
  /**
   * @param {Solute[]} solutes
   * @param {Property.<Solute>} selectedSoluteProperty
   * @param {Node} listParent parent node for the popup list
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  constructor( solutes, selectedSoluteProperty, listParent, tandem, options ) {

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
      helpText: soluteComboBoxHelpTextString
    }, options );

    assert && assert( !options.tandem, 'tandem is a required constructor parameter' );
    options.tandem = tandem;

    // {ComboBoxItem[]}
    const items = solutes.map( createItem );

    super( items, selectedSoluteProperty, listParent, options );
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

  return new ComboBoxItem( hBox, solute, {
    soundPlayer: SoundPlayer.NO_SOUND, // sound generation for selection is done elsewhere
    tandemName: `${solute.tandem.name}Item`,
    a11yLabel: solute.name
  } );
};

export default SoluteComboBox;
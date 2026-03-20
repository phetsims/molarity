// Copyright 2013-2026, University of Colorado Boulder

/**
 * The 'Molarity' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import MolarityModel from './model/MolarityModel.js';
import MolarityKeyboardHelpContent from './view/MolarityKeyboardHelpContent.js';
import MolarityScreenView from './view/MolarityScreenView.js';

class MolarityScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      tandem: tandem,
      createKeyboardHelpNode: () => new MolarityKeyboardHelpContent()
    };

    super(
      () => new MolarityModel( tandem.createTandem( 'model' ) ),
      model => new MolarityScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

export default MolarityScreen;

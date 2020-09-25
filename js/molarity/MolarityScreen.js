// Copyright 2013-2020, University of Colorado Boulder

/**
 * The 'Molarity' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import molarity from '../molarity.js';
import MolarityModel from './model/MolarityModel.js';
import MolarityScreenView from './view/MolarityScreenView.js';

class MolarityScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      tandem: tandem
    };

    super(
      function() { return new MolarityModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new MolarityScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }
}

molarity.register( 'MolarityScreen', MolarityScreen );
export default MolarityScreen;
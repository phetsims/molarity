// Copyright 2013-2019, University of Colorado Boulder

/**
 * The 'Molarity' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import molarity from '../molarity.js';
import MolarityModel from './model/MolarityModel.js';
import MolarityScreenView from './view/MolarityScreenView.js';

/**
 * @param {Tandem} tandem
 * @constructor
 */
function MolarityScreen( tandem ) {

  const options = {
    tandem: tandem
  };

  Screen.call( this,
    function() { return new MolarityModel( tandem.createTandem( 'model' ) ); },
    function( model ) { return new MolarityScreenView( model, tandem.createTandem( 'view' ) ); },
    options
  );
}

molarity.register( 'MolarityScreen', MolarityScreen );

inherit( Screen, MolarityScreen );
export default MolarityScreen;
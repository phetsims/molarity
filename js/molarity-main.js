// Copyright 2013-2020, University of Colorado Boulder

/**
 * Main entry point for the 'Molarity' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import PreferencesConfiguration from '../../joist/js/preferences/PreferencesConfiguration.js';
import Tandem from '../../tandem/js/Tandem.js';
import MolarityScreen from './molarity/MolarityScreen.js';
import molarityStrings from './molarityStrings.js';

const molarityTitleString = molarityStrings.molarity.title;

// constants
const tandem = Tandem.ROOT;

const options = {
  credits: {
    leadDesign: 'Julia Chamberlain',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.), John Blanco, Michael Kauzmann, Taylor Want',
    team: 'Kelly Lancaster, Emily B. Moore, Matthew Moore, Robert Parson, Kathy Perkins, Taliesin Smith, Brianna Tomlinson',
    soundDesign: 'Ashton Morris',
    qualityAssurance: 'Jaspe Arias, Logan Bray, Steele Dalton, Alex Dornan, Ethan Johnson, Megan Lai, Elise Morgan, Liam Mulhall, Oliver Orejola, Jacob Romero, Kathryn Woessner, Bryan Yoelin'
  },
  hasKeyboardHelpContent: true,
  preferencesConfiguration: new PreferencesConfiguration()

};

simLauncher.launch( () => {
  const screens = [ new MolarityScreen( tandem.createTandem( 'molarityScreen' ) ) ];
  const sim = new Sim( molarityTitleString, screens, options );
  sim.start();
} );
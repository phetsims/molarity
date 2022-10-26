// Copyright 2013-2022, University of Colorado Boulder

/**
 * Main entry point for the 'Molarity' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import MolarityScreen from './molarity/MolarityScreen.js';
import MolarityStrings from './MolarityStrings.js';

const molarityTitleStringProperty = MolarityStrings.molarity.titleStringProperty;

// constants
const tandem = Tandem.ROOT;

const options = {
  credits: {
    leadDesign: 'Julia Chamberlain',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.), John Blanco, Michael Kauzmann, Taylor Want',
    team: 'Kelly Lancaster, Emily B. Moore, Matthew Moore, Robert Parson, Kathy Perkins, Taliesin Smith, Brianna Tomlinson',
    soundDesign: 'Ashton Morris',
    qualityAssurance: 'Jaspe Arias, Logan Bray, Steele Dalton, Alex Dornan, Ethan Johnson, Megan Lai, Elise Morgan, Liam Mulhall, Oliver Orejola, Jacob Romero, Kathryn Woessner, Bryan Yoelin'
  }
};

simLauncher.launch( () => {
  const screens = [ new MolarityScreen( tandem.createTandem( 'molarityScreen' ) ) ];
  const sim = new Sim( molarityTitleStringProperty, screens, options );
  sim.start();
} );
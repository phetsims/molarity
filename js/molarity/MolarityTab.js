// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Molarity' tab. Conforms to the contract specified in joist/Tab
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var MolarityModel = require( 'molarity/model/MolarityModel' );
  var MolarityView = require( 'molarity/view/MolarityView' );
  var MStrings = require( 'molarity/MStrings' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  function MolarityTab() {

    this.name = MStrings.molarity;
    this.icon = new Rectangle( 0, 0, 10, 10, { fill: 'white' } );  //TODO joist#15, icon should not be required for single-tab sims
    this.backgroundColor = 'white';

    this.createModel = function() {
      return new MolarityModel();
    };

    this.createView = function( model ) {
      return new MolarityView( model );
    };
  }

  return MolarityTab;
} );
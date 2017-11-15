// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model of a solute, an immutable data structure.
 * This model is immutable in the sense that you should not change any of its fields after construction,
 * since they do not provide change notification. If you do change any field values, you will hose yourself.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var molarity = require( 'MOLARITY/molarity' );

  // phet-io modules
  var TSolute = require( 'ifphetio!MOLARITY/molarity/model/TSolute' );

  /**
   * @param {string} name
   * @param {string} formula
   * @param {number} saturatedConcentration M (moles/L)
   * @param {Color} minColor solution color for smallest non-zero concentration
   * @param {Color} maxColor solution color for saturated concentration
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function Solute( name, formula, saturatedConcentration, minColor, maxColor, tandem, options ) {

    options = _.extend( {
      particleColor: maxColor, // the solute's color as a particle
      phetioType: TSolute
    }, options );

    // @public
    this.name = name;
    this.formula = formula;
    this.saturatedConcentration = saturatedConcentration;
    this.minColor = minColor;
    this.maxColor = maxColor;
    this.particleColor = options.particleColor;

    tandem.addInstance( this, options );

    // this is used to create the tandem name for ComboBox items
    this.tandemName = tandem.tail;
  }

  molarity.register( 'Solute', Solute );

  return Solute;
} );

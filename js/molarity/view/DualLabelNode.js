// Copyright 2013-2015, University of Colorado Boulder

/**
 * A label that is switchable between 2 representations: qualitative and quantitative.
 * When property valueVisible is true, the quantitative label is displayed; otherwise the qualitative label is displayed.
 * X-coordinate of the origin is adjusted to be in the center, to simplify layout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var molarity = require( 'MOLARITY/molarity' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var DEBUG_BOUNDS = false;

  /**
   * @param {string} quantitativeValue
   * @param {string} qualitativeValue
   * @param {Property.<boolean>} isQuantitativeProperty
   * @param {Font} font
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function DualLabelNode( quantitativeValue, qualitativeValue, isQuantitativeProperty, font, tandem, options ) {

    Node.call( this );

    var quantitativeNode = new Text( quantitativeValue, { font: font } );
    this.addChild( quantitativeNode );

    var qualitativeNode = new Text( qualitativeValue, { font: font } );
    this.addChild( qualitativeNode );
    qualitativeNode.centerX = quantitativeNode.centerX;
    qualitativeNode.centerY = quantitativeNode.centerY;

    // add an invisible rectangle so that bounds don't change
    var boundsNode = new Rectangle( this.left, this.top, this.width, this.height );
    if ( DEBUG_BOUNDS ) {
      boundsNode.stroke = 'red';
    }
    this.addChild( boundsNode );

    // switch between qualitative and quantitative
    isQuantitativeProperty.link( function( isQuantitative ) {
      quantitativeNode.setVisible( isQuantitative );
      qualitativeNode.setVisible( !isQuantitative );
    } );

    this.mutate( options );
  }

  molarity.register( 'DualLabelNode', DualLabelNode );

  return inherit( Node, DualLabelNode );
} );
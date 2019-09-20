// Copyright 2013-2019, University of Colorado Boulder

/**
 * A label that is switchable between 2 representations: qualitative and quantitative.
 * When property valueVisible is true, the quantitative label is displayed; otherwise the qualitative label is displayed.
 * X-coordinate of the origin is adjusted to be in the center, to simplify layout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const molarity = require( 'MOLARITY/molarity' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const DEBUG_BOUNDS = false;

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

    const quantitativeNode = new Text( quantitativeValue, {
      font: font,
      tandem: tandem.createTandem( 'quantitativeNode' )
    } );
    this.addChild( quantitativeNode );

    const qualitativeNode = new Text( qualitativeValue, {
      font: font,
      center: quantitativeNode.center,
      tandem: tandem.createTandem( 'qualitativeNode' )
    } );
    this.addChild( qualitativeNode );

    // add an invisible rectangle so that bounds don't change
    const boundsNode = new Rectangle( this.left, this.top, this.width, this.height );
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
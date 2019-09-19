// Copyright 2013-2019, University of Colorado Boulder

/**
 * Indicator that the solution is saturated.
 * This consists of 'Saturated!' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const molarity = require( 'MOLARITY/molarity' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const saturatedString = require( 'string!MOLARITY/saturated' );

  /**
   * @param {Solution} solution
   * @param {Tandem} tandem
   * @constructor
   */
  function SaturatedIndicator( solution, tandem ) {

    Node.call( this, { tandem: tandem } );

    var textNode = new Text( saturatedString, {
      font: new PhetFont( 22 ),
      maxWidth: 200,
      tandem: tandem.createTandem( 'textNode')
    } );

    // translucent light-gray background, so this shows up on all solution colors
    var backgroundNode = new Rectangle( 0, 0, 1.2 * textNode.width, 1.2 * textNode.height, 8, 8, {
      fill: 'rgba( 240, 240, 240, 0.6 )',
      tandem: tandem.createTandem( 'backgroundNode')
    } );

    // rendering order
    this.addChild( backgroundNode );
    this.addChild( textNode );

    // layout
    textNode.center = backgroundNode.center;

    // make this node visible when the solution is saturated
    var self = this;
    solution.precipitateAmountProperty.link( function() {
      self.visible = solution.isSaturated();
    } );
  }

  molarity.register( 'SaturatedIndicator', SaturatedIndicator );

  return inherit( Node, SaturatedIndicator );
} );
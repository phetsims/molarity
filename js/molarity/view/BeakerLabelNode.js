// Copyright 2013-2015, University of Colorado Boulder

/**
 * Label that appears on the beaker in a frosty, translucent frame.
 * Displays solute formula. Origin at top center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MSymbols = require( 'MOLARITY/molarity/MSymbols' );
  var molarity = require( 'MOLARITY/molarity' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  // constants
  var LABEL_SIZE = new Dimension2( 180, 80 );
  var LABEL_FONT = new PhetFont( { size: 28, weight: 'bold' } );

  /**
   * @param {Solution} solution
   * @constructor
   */
  function BeakerLabelNode( solution ) {

    Node.call( this );

    var formulaNode = new SubSupText( '?', {
      font: LABEL_FONT,
      maxWidth: 0.9 * LABEL_SIZE.width
    } );
    var backgroundNode = new Rectangle( -LABEL_SIZE.width / 2, 0, LABEL_SIZE.width, LABEL_SIZE.height, 10, 10,
      { fill: new Color( 255, 255, 255, 0.6 ), stroke: Color.LIGHT_GRAY } );

    this.addChild( backgroundNode );
    this.addChild( formulaNode );

    solution.multilink( [ 'solute', 'volume', 'concentration' ], function( solute, volume, concentration ) {
      // use solute formula
      if ( volume === 0 ) {
        formulaNode.text = '';
      }
      else if ( concentration === 0 ) {
        formulaNode.text = MSymbols.WATER;
      }
      else {
        formulaNode.text = solute.formula;
      }
      // center formula in background
      formulaNode.centerX = backgroundNode.centerX;
      formulaNode.centerY = backgroundNode.centerY;
    } );
  }

  molarity.register( 'BeakerLabelNode', BeakerLabelNode );

  return inherit( Node, BeakerLabelNode );
} );
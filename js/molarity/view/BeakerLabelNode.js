// Copyright 2013-2018, University of Colorado Boulder

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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var molarity = require( 'MOLARITY/molarity' );
  var MSymbols = require( 'MOLARITY/molarity/MSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );

  // ifphetio
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );

  // constants
  var LABEL_SIZE = new Dimension2( 180, 80 );
  var LABEL_FONT = new PhetFont( { size: 28, weight: 'bold' } );

  /**
   * @param {Solution} solution
   * @param {Tandem} tandem
   * @constructor
   */
  function BeakerLabelNode( solution, tandem ) {

    Node.call( this, { tandem: tandem } );

    var textNode = new RichText( '?', {
      font: LABEL_FONT,
      maxWidth: 0.9 * LABEL_SIZE.width,
      tandem: tandem.createTandem( 'textNode' )
    } );

    var backgroundNode = new Rectangle( -LABEL_SIZE.width / 2, 0, LABEL_SIZE.width, LABEL_SIZE.height, 10, 10, {
      fill: new Color( 255, 255, 255, 0.6 ), stroke: Color.LIGHT_GRAY,
      tandem: tandem.createTandem( 'backgroundNode' )
    } );

    this.addChild( backgroundNode );
    this.addChild( textNode );

    // label on the beaker
    var beakerLabelProperty = new DerivedProperty( [ solution.soluteProperty, solution.volumeProperty, solution.concentrationProperty ],
      function( solute, volume, concentration ) {
        var label;
        if ( volume === 0 ) {
          label = '';
        }
        else if ( concentration === 0 ) {
          label = MSymbols.WATER;
        }
        else {
          label = solute.formula;
        }
        return label;
      }, {
        tandem: tandem.createTandem( 'beakerLabelProperty' ),
        phetioType: DerivedPropertyIO( StringIO )
      } );

    // update the label
    beakerLabelProperty.link( function( label ) {
      textNode.text = label;
      // center formula in background
      textNode.centerX = backgroundNode.centerX;
      textNode.centerY = backgroundNode.centerY;
    } );
  }

  molarity.register( 'BeakerLabelNode', BeakerLabelNode );

  return inherit( Node, BeakerLabelNode );
} );
// Copyright 2013-2019, University of Colorado Boulder

/**
 * Label that appears on the beaker in a frosty, translucent frame.
 * Displays solute formula. Origin at top center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolaritySymbols = require( 'MOLARITY/molarity/MolaritySymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const StringIO = require( 'TANDEM/types/StringIO' );

  // constants
  const LABEL_SIZE = new Dimension2( 180, 80 );
  const LABEL_FONT = new PhetFont( { size: 28, weight: 'bold' } );

  /**
   * @param {Solution} solution
   * @param {Tandem} tandem
   * @constructor
   */
  function BeakerLabelNode( solution, tandem ) {

    Node.call( this, { tandem: tandem } );

    const textNode = new RichText( '?', {
      font: LABEL_FONT,
      maxWidth: 0.9 * LABEL_SIZE.width,
      tandem: tandem.createTandem( 'textNode' )
    } );

    const backgroundNode = new Rectangle( -LABEL_SIZE.width / 2, 0, LABEL_SIZE.width, LABEL_SIZE.height, 10, 10, {
      fill: new Color( 255, 255, 255, 0.6 ), stroke: Color.LIGHT_GRAY,
      tandem: tandem.createTandem( 'backgroundNode' )
    } );

    this.addChild( backgroundNode );
    this.addChild( textNode );

    // label on the beaker
    const beakerLabelProperty = new DerivedProperty( [ solution.soluteProperty, solution.volumeProperty, solution.concentrationProperty ],
      function( solute, volume, concentration ) {
        let label;
        if ( volume === 0 ) {
          label = '';
        }
        else if ( concentration === 0 ) {
          label = MolaritySymbols.WATER;
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
// Copyright 2013-2019, University of Colorado Boulder

/**
 * Solution shown in a beaker.
 * Assumes that the beaker is represented as a cylinder, with elliptical top and bottom.
 * Origin is at the upper-left corner of this cylinder.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Color = require( 'SCENERY/util/Color' );
  const inherit = require( 'PHET_CORE/inherit' );
  const molarity = require( 'MOLARITY/molarity' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );

  // constants
  const DEBUG_ORIGIN = false;

  /**
   * @param {Dimension2} cylinderSize
   * @param {number} cylinderEndHeight
   * @param {Solution} solution
   * @param {number} maxVolume - liters
   * @param {Tandem} tandem
   * @constructor
   */
  function SolutionNode( cylinderSize, cylinderEndHeight, solution, maxVolume, tandem ) {

    Node.call( this, {
      pickable: false,
      tandem: tandem
    } );

    // middle shape will change with volume
    const middleNode = new Rectangle( 0, 0, 1, 1, {
      tandem: tandem.createTandem( 'middleNode' )
    } );

    const endShape = Shape.ellipse( cylinderSize.width / 2, 0, cylinderSize.width / 2, cylinderEndHeight / 2 );

    const topNode = new Path( endShape, {
      lineWidth: 0.5,
      stroke: new Color( 0, 0, 0, 85 ),
      tandem: tandem.createTandem( 'topNode' )
    } );

    const bottomNode = new Path( endShape, {
      tandem: tandem.createTandem( 'bottomNode' )
    } );

    this.addChild( bottomNode );
    this.addChild( middleNode );
    this.addChild( topNode );

    if ( DEBUG_ORIGIN ) {
      this.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    // sync with model
    const updateColor = function() {
      const color = solution.getColor();
      topNode.fill = color;
      middleNode.fill = color;
      bottomNode.fill = color;
    };
    solution.concentrationProperty.link( updateColor );
    solution.soluteProperty.link( updateColor );

    const updateShape = function() {
      const height = Util.linear( 0, maxVolume, 0, cylinderSize.height, solution.volumeProperty.get() );
      topNode.visible = bottomNode.visible = middleNode.visible = ( height > 0 );
      if ( height > 0 ) {
        middleNode.setRect( 0, cylinderSize.height - height, cylinderSize.width, height );
        topNode.y = cylinderSize.height - height;
        bottomNode.y = cylinderSize.height;
      }
    };
    solution.volumeProperty.link( updateShape );
  }

  molarity.register( 'SolutionNode', SolutionNode );

  return inherit( Node, SolutionNode );
} );
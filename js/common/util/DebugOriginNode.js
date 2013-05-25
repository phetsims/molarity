// Copyright 2002-2013, University of Colorado

/**
 * To debug a node's origin, add an instance of this node as a child.
 * Be careful not to change this node's position, leave it at (0,0).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Circle = require( "SCENERY/nodes/Circle" );

  /**
   * @param {object} options
   * @constructor
   */
  function DebugOriginNode( options ) {
    options = _.extend( { radius: 3, fill: 'red' }, options );
    Circle.call( this, options.radius, { fill: options.fill } );
  }

  inherit( DebugOriginNode, Circle );

  return DebugOriginNode;
} );

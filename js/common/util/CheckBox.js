// Copyright 2002-2013, University of Colorado

/**
 * Check box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var FontAwesomeNode = require( "SUN/FontAwesomeNode" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {Node} content
   * @param {Property<Boolean>} property
   * @constructor
   */
  function CheckBox( content, property, options ) {

    options = _.extend(
        {
          spacing: 8,
          boxScale: 0.75
        }, options );

    var thisNode = this;
    Node.call( this );

    var checkedNode = new FontAwesomeNode( "check", { scale: options.boxScale } );
    var uncheckedNode = new FontAwesomeNode( "check_empty", { scale: options.boxScale } );

    thisNode.addChild( checkedNode );
    thisNode.addChild( uncheckedNode );
    thisNode.addChild( content );

    content.left = checkedNode.right + options.spacing;
    content.centerY = checkedNode.centerY;

    // put a rectangle on top of everything to prevent dead zones which clicking
    thisNode.addChild( new Rectangle( thisNode.left, thisNode.top, thisNode.width, thisNode.height ) );

    // interactivity
    thisNode.cursor = "pointer";
    thisNode.addInputListener(
        {
          up: function() {
            property.set( !property.get() );
          }
        } );

    // sync with property
    property.addObserver( function( checked ) {
      checkedNode.visible = checked;
      uncheckedNode.visible = !checked;
    } );
  }

  inherit( CheckBox, Node );

  return CheckBox;
} );
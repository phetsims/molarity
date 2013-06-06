// Copyright 2002-2013, University of Colorado

/**
 * Highlights a node by changing its fill color.
 * Highlighting is typically used to as a visual cue to indicate that a node is interactive.
 * <p/>
 * A node is highlighted if:
 * (a) the mouse cursor is moved inside the node's bounding rectangle, or
 * (b) the mouse was been pressed while inside the node's bounding rectangle and not yet released.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Property = require( "PHETCOMMON/model/property/Property" );

  /**
   * @param {Color|String} normalFill
   * @param {Color|String} highlightFill
   * @param {Property<Boolean>} enabled
   * @constructor
   */
  function FillHighlighter( normalFill, highlightFill, enabled ) {

    enabled = _.isUndefined( enabled ) ? new Property( true ) : enabled;

    var isMouseInside = false;
    var isMousePressed = false;
    var downNode, downPointer; // the node and pointer that received the "down" event

    // listener added to "down" pointer to received corresponding "up" event
    var upListener = {
      up: function() {
        up();
      },
      cancel: function() {
        up();
      }
    };

    var setHighlighted = function( node, highlighted ) {
      if ( enabled.get() ) {
        node.fill = highlighted ? highlightFill : normalFill;
      }
    };

    var enter = function( node ) {
      isMouseInside = true;
      setHighlighted( node, true );
    };

    var exit = function( node ) {
      isMouseInside = false;
      if ( !isMousePressed ) {
        setHighlighted( node, false );
      }
    };

    var down = function( node, pointer ) {
      downNode = node;
      downPointer = pointer;
      isMousePressed = true;
      setHighlighted( node, true );
      // scenery doesn't deliver down/up as event pairs, 'up' must be handled by attaching a listener to pointer
      pointer.addInputListener( upListener );
    };

    var up = function() {
      isMousePressed = false;
      if ( !isMouseInside ) {
        setHighlighted( downNode, false );
      }
      downPointer.removeInputListener( upListener );
    };

    this.enter = function( event ) {
      enter( event.currentTarget );
    };

    this.exit = function( event ) {
      exit( event.currentTarget );
    };

    this.down = function( event ) {
      down( event.currentTarget, event.pointer );
    };
  }

  return FillHighlighter;
} );

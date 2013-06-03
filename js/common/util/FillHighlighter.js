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
   * @param {Node} node
   * @param {Color|String} normalFill
   * @param {Color|String} highlightFill
   * @param {Property<Boolean>} enabled
   * @constructor
   */
  function FillHighlighter( node, normalFill, highlightFill, enabled ) {

    enabled = _.isUndefined( enabled ) ? new Property( true ) : enabled;

    var isMouseInside = false;
    var isMousePressed = false;
    var downPointer; // the pointer that received the "down" event
    // listener added to "down" pointer to received corresponding "up" event
    var upListener = {
      up: function() {
        up();
      },
      cancel: function() {
        up();
      }
    };

    var setHighlighted = function( highlighted ) {
      if ( enabled.value ) {
        node.fill = highlighted ? highlightFill : normalFill;
      }
    };

    var enter = function() {
      isMouseInside = true;
      setHighlighted( true );
    };

    var exit = function() {
      isMouseInside = false;
      if ( !isMousePressed ) {
        setHighlighted( false );
      }
    };

    var down = function( event ) {
      downPointer = event.pointer;
      isMousePressed = true;
      setHighlighted( true );
      // scenery doesn't deliver down/up as event pairs, 'up' must be handled by attaching a listener to pointer
      event.pointer.addInputListener( upListener );
    };

    var up = function() {
      isMousePressed = false;
      if ( !isMouseInside ) {
        setHighlighted( false );
      }
      downPointer.removeInputListener( upListener );
    };

    this.enter = function() {
      enter();
    };

    this.exit = function() {
      exit();
    };

    this.down = function( event ) {
      down( event );
    };
  }

  return FillHighlighter;
} );

// Copyright 2002-2013, University of Colorado

/**
 * Miscellaneous chemistry utils.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  "use strict";

  function ChemUtils() {
  }

  /**
   * Handles HTML subscript formatting for molecule symbols.
   * All numbers in a string are assumed to be part of a subscript, and will be enclosed in a <sub> tag.
   * For example, "C2H4" becomes "C<sub>2</sub>H<sub>4</sub>".
   * @param {String} inString the input plaintext string
   * @return {String} HTML fragment
   */
  ChemUtils.toSubscript = function( inString ) {
    var outString = "";
    var sub = false; // are we in a <sub> tag?
    var isDigit = function( c ) {
      return ( c >= '0' && c <= '9');
    };
    for ( var i = 0; i < inString.length; i++ ) {
      var c = inString.charAt( i );
      if ( !sub && isDigit( c ) ) {
        // start the subscript tag when a digit is found
        outString += "<sub>";
        sub = true;
      }
      else if ( sub && !isDigit( c ) ) {
        // end the subscript tag when a non-digit is found
        outString += "</sub>";
        sub = false;
      }
      outString += c;
    }
    // end the subscript tag if inString ends with a digit
    if ( sub ) {
      outString += "</sub>";
      sub = false;
    }
    return outString;
  };

  return ChemUtils;
} );
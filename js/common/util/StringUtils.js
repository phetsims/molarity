// Copyright 2002-2013, University of Colorado

define( function() {
  "use strict";

  function StringUtils() {
  }

  /*
   * Similar to Java's MessageFormat.
   * Eg, StringUtils.format( "{0} + {1}", [2,3] ) -> "2 + 3"
   *
   * @param {String} pattern pattern string, with N placeholders, where N is an integer
   * @param {Array} args array of values to be substituted for placeholders in pattern
   * @return {String}
   */
  StringUtils.format = function( pattern, args ) {
    return pattern.replace( /\{(\d+)\}/g, function() {
      return args[arguments[1]];
    } );
  };

  return StringUtils;
} );

// Copyright 2013-2017, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var molarity = require( 'MOLARITY/molarity' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var pattern0LabelString = require( 'string!MOLARITY/pattern.0label' );
  var soluteString = require( 'string!MOLARITY/solute' );

  /**
   * @param {Solute[]} solutes
   * @param {Property.<Solute>} selectedSoluteProperty
   * @param {Node} listParent parent node for the popup list
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function SoluteComboBox( solutes, selectedSoluteProperty, listParent, tandem, options ) {

    options = _.extend( {
      labelNode: new Text( StringUtils.format( pattern0LabelString, soluteString ), { font: new PhetFont( 22 ) } ), // 'Solute' label
      listPosition: 'above',
      itemYMargin: 12,
      itemHighlightFill: 'rgb(218,255,255)'
    }, options );

    assert && assert( !options.tandem, 'tandem is a required constructor parameter' );
    options.tandem = tandem;

    // items
    var items = solutes.map( createItem );

    ComboBox.call( this, items, selectedSoluteProperty, listParent, options );
  }

  molarity.register( 'SoluteComboBox', SoluteComboBox );

  /**
   * Creates an item for the combo box.
   * @param solute
   * @returns {*|{node: *, value: *}}
   */
  var createItem = function( solute ) {

    var node = new Node();
    var colorNode = new Rectangle( 0, 0, 20, 20, { fill: solute.maxColor, stroke: solute.maxColor.darkerColor() } );
    var textNode = new Text( solute.name, { font: new PhetFont( 20 ) } );
    node.addChild( colorNode );
    node.addChild( textNode );
    textNode.left = colorNode.right + 5;
    textNode.centerY = colorNode.centerY;

    return ComboBox.createItem( node, solute, {
      tandemName: solute.phetioObjectTandem.tail
    } );
  };

  return inherit( ComboBox, SoluteComboBox );
} );
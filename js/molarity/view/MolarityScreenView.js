// Copyright 2013-2019, University of Colorado Boulder

/**
 * View for the 'Molarity' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const BeakerNode = require( 'MOLARITY/molarity/view/BeakerNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Checkbox = require( 'SUN/Checkbox' );
  const ConcentrationDisplay = require( 'MOLARITY/molarity/view/ConcentrationDisplay' );
  const ControlAreaNode = require( 'SCENERY_PHET/accessibility/nodes/ControlAreaNode' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MConstants = require( 'MOLARITY/molarity/MConstants' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const MolarityScreenSummaryNode = require( 'MOLARITY/molarity/view/MolarityScreenSummaryNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlayAreaNode = require( 'SCENERY_PHET/accessibility/nodes/PlayAreaNode' );
  const PrecipitateNode = require( 'MOLARITY/molarity/view/PrecipitateNode' );
  const Property = require( 'AXON/Property' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const SaturatedIndicator = require( 'MOLARITY/molarity/view/SaturatedIndicator' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Shape = require( 'KITE/Shape' );
  const SoluteComboBox = require( 'MOLARITY/molarity/view/SoluteComboBox' );
  const MolarityDescriber = require( 'MOLARITY/molarity/view/describers/MolarityDescriber' );
  const SolutionNode = require( 'MOLARITY/molarity/view/SolutionNode' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  const VerticalSlider = require( 'MOLARITY/molarity/view/VerticalSlider' );

  // strings
  const fullString = require( 'string!MOLARITY/full' );
  const litersString = require( 'string!MOLARITY/liters' );
  const lotsString = require( 'string!MOLARITY/lots' );
  const lowString = require( 'string!MOLARITY/low' );
  const molesString = require( 'string!MOLARITY/moles' );
  const noneString = require( 'string!MOLARITY/none' );
  const patternParentheses0TextString = require( 'string!MOLARITY/pattern.parentheses.0text' );
  const showValuesString = require( 'string!MOLARITY/showValues' );
  const soluteAmountString = require( 'string!MOLARITY/soluteAmount' );
  const solutionVolumeString = require( 'string!MOLARITY/solutionVolume' );
  const unitsLitersString = require( 'string!MOLARITY/units.liters' );
  const unitsMolesString = require( 'string!MOLARITY/units.moles' );

  // a11y strings
  const showValuesHelpTextString = MolarityA11yStrings.showValuesHelpText.value;
  const soluteAmountAccessibleNameString = MolarityA11yStrings.soluteAmountAccessibleName.value;
  const solutionVolumeAccessibleNameString = MolarityA11yStrings.solutionVolumeAccessibleName.value;
  const solutionControlsLabelString = MolarityA11yStrings.solutionControlsLabelString.value;
  const solutionControlsDescriptionString = MolarityA11yStrings.solutionControlsDescriptionString.value;

  // constants
  const SLIDER_TRACK_WIDTH = 12;

  /**
   * @param {MolarityModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function MolarityScreenView( model, tandem ) {

    this.model = model;

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 1100, 700 ),
      tandem: tandem,
      addScreenSummaryNode: true
    } );

    const valuesVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' )
    } );

    // a11y - an utterance that can be used whenever the state of the sim changes, using this
    // utterance will prevent the utteranceQueue from spamming alerts with this information
    const simStateUtterance = new Utterance();

    // a11y - adds an alert when the solute is changed
    valuesVisibleProperty.lazyLink( () => {
      simStateUtterance.alert = molarityDescriber.getValuesVisibleChangedAlertString();
      utteranceQueue.addToBack( simStateUtterance );
    } );

    // a11y - initializes describer
    const molarityDescriber = new MolarityDescriber( model.solution, valuesVisibleProperty );

    // a11y - creates screen summary in the PDOM and add it to the screenView
    const molarityScreenSummaryNode = new MolarityScreenSummaryNode( model, valuesVisibleProperty, molarityDescriber );
    this.screenSummaryNode.addChild( molarityScreenSummaryNode );

    // beaker, with solution and precipitate inside of it
    const beakerNode = new BeakerNode( model.solution, MConstants.SOLUTION_VOLUME_RANGE.max, valuesVisibleProperty,
      tandem.createTandem( 'beakerNode' ) );

    // a11y - update beaker description in the PDOM when model changes
    Property.multilink( [ model.solution.soluteProperty, model.solution.concentrationProperty, valuesVisibleProperty ], () => {
      beakerNode.descriptionContent = molarityDescriber.getBeakerDescription();
    } );

    const cylinderSize = beakerNode.getCylinderSize();
    const solutionNode = new SolutionNode( cylinderSize, beakerNode.getCylinderEndHeight(), model.solution,
      MConstants.SOLUTION_VOLUME_RANGE.max, tandem.createTandem( 'solutionNode' ) );
    const precipitateNode = new PrecipitateNode( model.solution, cylinderSize, beakerNode.getCylinderEndHeight(),
      model.maxPrecipitateAmount, tandem.createTandem( 'precipitateNode' ) );
    const saturatedIndicator = new SaturatedIndicator( model.solution, tandem.createTandem( 'saturatedIndicator' ) );

    // solute control
    const soluteComboBoxListParent = new Node( { maxWidth: 300 } );
    const soluteComboBox = new SoluteComboBox( model.solutes, model.solution.soluteProperty, soluteComboBoxListParent,
      tandem.createTandem( 'soluteComboBox' ), {
        maxWidth: 500
      } );

    // slider for controlling amount of solute
    const soluteAmountSlider = new VerticalSlider( soluteAmountString,
      StringUtils.format( patternParentheses0TextString, molesString ),
      noneString, lotsString,
      new Dimension2( SLIDER_TRACK_WIDTH, cylinderSize.height ),
      model.solution.soluteAmountProperty,
      MConstants.SOLUTE_AMOUNT_RANGE,
      MConstants.SOLUTE_AMOUNT_DECIMAL_PLACES,
      unitsMolesString,
      valuesVisibleProperty,
      tandem.createTandem( 'soluteAmountSlider' ),
      soluteAmountAccessibleNameString,
      () => molarityDescriber.getSoluteAmountAriaValueText(),
      model.solution.soluteProperty,
      molarityDescriber,
      ( formattedString, newValue, oldValue ) => molarityDescriber.getSoluteAmountSliderAlertString( newValue > oldValue )
    );

    // slider for controlling volume of solution, sized to match tick marks on the beaker
    const volumeSliderHeight = ( MConstants.SOLUTION_VOLUME_RANGE.getLength() / MConstants.SOLUTION_VOLUME_RANGE.max ) * cylinderSize.height;
    const solutionVolumeSlider = new VerticalSlider( solutionVolumeString,
      StringUtils.format( patternParentheses0TextString, litersString ),
      lowString, fullString,
      new Dimension2( SLIDER_TRACK_WIDTH, volumeSliderHeight ),
      model.solution.volumeProperty,
      MConstants.SOLUTION_VOLUME_RANGE,
      MConstants.SOLUTION_VOLUME_DECIMAL_PLACES,
      unitsLitersString,
      valuesVisibleProperty,
      tandem.createTandem( 'solutionVolumeSlider' ),
      solutionVolumeAccessibleNameString,
      () => molarityDescriber.getVolumeAriaValueText(),
      model.solution.soluteProperty,
      molarityDescriber,
      () => molarityDescriber.volumeDescriber.getVolumeChangedValueText() // TODO: volumeDescriber is private!
    );

    // concentration display
    const concentrationBarSize = new Dimension2( 40, cylinderSize.height + 50 );
    const concentrationDisplay = new ConcentrationDisplay( model.solution, MConstants.CONCENTRATION_RANGE,
      valuesVisibleProperty, concentrationBarSize, tandem.createTandem( 'concentrationDisplay' ) );

    // Show Values checkbox
    const showValuesLabel = new Text( showValuesString, {
      font: new PhetFont( 22 ),
      tandem: tandem.createTandem( 'showValuesText' )
    } );
    const showValuesCheckbox = new Checkbox( showValuesLabel, valuesVisibleProperty, {
      maxWidth: 175,
      tandem: tandem.createTandem( 'showValuesCheckbox' ),

      // a11y
      accessibleName: showValuesString,
      helpText: showValuesHelpTextString
    } );
    showValuesCheckbox.touchArea = Shape.rectangle( showValuesCheckbox.left, showValuesCheckbox.top - 15, showValuesCheckbox.width, showValuesCheckbox.height + 30 );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      listener: function() {
        valuesVisibleProperty.reset();
        model.reset();
      },
      scale: 1.32,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // a11y - heading for slider controls: contains heading for slider controls and orders included PDOM elements
    const solutionControlsNode = new Node( {
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: solutionControlsLabelString,
      descriptionContent: solutionControlsDescriptionString
    } );
    solutionControlsNode.accessibleOrder = [ soluteAmountSlider, solutionVolumeSlider ];

    // a11y - adds an alert when the solute is changed
    model.solution.soluteProperty.lazyLink( () => {
      simStateUtterance.alert = molarityDescriber.soluteDescriber.getSoluteChangedAlertString();
      utteranceQueue.addToBack( simStateUtterance );
    } );

    // a11y - contains PDOM heading for Play Area, and orders the PDOM for included elements
    const playAreaNode = new PlayAreaNode();
    playAreaNode.accessibleOrder = [
      beakerNode,
      solutionControlsNode,
      soluteComboBox,
      soluteComboBoxListParent
    ];

    // a11y - contains PDOM heading for control area, and orders the PDOM for included elements
    const controlAreaNode = new ControlAreaNode();
    controlAreaNode.accessibleOrder = [
      showValuesCheckbox,
      resetAllButton
    ];

    // layout for things that don't have a location in the model
    {
      soluteAmountSlider.left = 0;
      soluteAmountSlider.top = 0;
      // to the right of the Solute Amount slider
      solutionVolumeSlider.left = soluteAmountSlider.right + 5;
      solutionVolumeSlider.top = soluteAmountSlider.top;
      // to the right of the Solution Volume slider
      beakerNode.left = solutionVolumeSlider.right - 15;
      beakerNode.top = soluteAmountSlider.top - 11;
      // same coordinate frame as beaker
      solutionNode.x = beakerNode.x;
      solutionNode.y = beakerNode.y;
      // same coordinate frame as beaker
      precipitateNode.x = beakerNode.x;
      precipitateNode.y = beakerNode.y;
      // centered below beaker
      soluteComboBox.centerX = beakerNode.centerX;
      soluteComboBox.top = beakerNode.bottom + 50;
      // toward bottom of the beaker
      const saturatedIndicatorVisible = saturatedIndicator.visible; // so we can layout an invisible node
      saturatedIndicator.visible = true;
      saturatedIndicator.centerX = beakerNode.x + ( cylinderSize.width / 2 );
      saturatedIndicator.bottom = beakerNode.bottom - ( 0.2 * cylinderSize.height );
      saturatedIndicator.visible = saturatedIndicatorVisible;
      // right of beaker
      concentrationDisplay.left = beakerNode.right + 40;
      concentrationDisplay.bottom = beakerNode.bottom;
      // left of combo box
      showValuesCheckbox.right = soluteComboBox.left - 50;
      showValuesCheckbox.centerY = soluteComboBox.centerY;
      // right of combo box
      resetAllButton.left = Math.max( soluteComboBox.right + 10, concentrationDisplay.centerX - ( resetAllButton.width / 2 ) );
      resetAllButton.centerY = soluteComboBox.centerY;
    }

    // center everything on the screen
    this.addChild( new Node( {
      children: [
        solutionNode,
        beakerNode,
        precipitateNode,
        saturatedIndicator,
        soluteAmountSlider,
        solutionVolumeSlider,
        concentrationDisplay,
        showValuesCheckbox,
        resetAllButton,
        soluteComboBox,
        soluteComboBoxListParent,
        solutionControlsNode,
        playAreaNode,
        controlAreaNode
      ],
      center: this.layoutBounds.center
    } ) );
  }

  molarity.register( 'MolarityScreenView', MolarityScreenView );

  return inherit( ScreenView, MolarityScreenView );
} );

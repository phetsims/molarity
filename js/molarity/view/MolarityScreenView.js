// Copyright 2013-2020, University of Colorado Boulder

/**
 * View for the 'Molarity' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import InvertedBooleanProperty from '../../../../tambo/js/InvertedBooleanProperty.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import checkboxCheckedSound from '../../../../tambo/sounds/checkbox-checked_mp3.js';
import checkboxUncheckedSound from '../../../../tambo/sounds/checkbox-unchecked_mp3.js';
import molarityStrings from '../../molarity-strings.js';
import molarity from '../../molarity.js';
import MolarityConstants from '../MolarityConstants.js';
import BeakerNode from './BeakerNode.js';
import ConcentrationDisplay from './ConcentrationDisplay.js';
import ConcentrationSoundGenerator from './ConcentrationSoundGenerator.js';
import ConcentrationDescriber from './describers/ConcentrationDescriber.js';
import PrecipitateAmountDescriber from './describers/PrecipitateAmountDescriber.js';
import SoluteAmountDescriber from './describers/SoluteAmountDescriber.js';
import SoluteDescriber from './describers/SoluteDescriber.js';
import VolumeDescriber from './describers/VolumeDescriber.js';
import molarityAlertManager from './molarityAlertManager.js';
import MolarityScreenSummaryNode from './MolarityScreenSummaryNode.js';
import PrecipitateNode from './PrecipitateNode.js';
import PrecipitateSoundGenerator from './PrecipitateSoundGenerator.js';
import SaturatedIndicator from './SaturatedIndicator.js';
import SoluteComboBox from './SoluteComboBox.js';
import SoluteSelectionSoundGenerator from './SoluteSelectionSoundGenerator.js';
import SolutionNode from './SolutionNode.js';
import VerticalSlider from './VerticalSlider.js';

const fullString = molarityStrings.full;
const litersString = molarityStrings.liters;
const lotsString = molarityStrings.lots;
const lowString = molarityStrings.low;
const molesString = molarityStrings.moles;
const noneString = molarityStrings.none;
const patternParentheses0TextString = molarityStrings.pattern.parentheses[ '0text' ];
const showValuesString = molarityStrings.showValues;
const soluteAmountString = molarityStrings.soluteAmount;
const solutionVolumeString = molarityStrings.solutionVolume;
const unitsLitersString = molarityStrings.units.liters;
const unitsMolesString = molarityStrings.units.moles;

// sounds

// a11y strings
const beakerSolutionControlsString = molarityStrings.a11y.beakerSolutionControls;
const solutionValuesHelpTextString = molarityStrings.a11y.solutionValuesHelpText;
const soluteAmountNoNewlineString = molarityStrings.a11y.soluteAmountNoNewline;
const sliderHelpTextString = molarityStrings.a11y.sliderHelpText;

// constants
const SLIDER_TRACK_WIDTH = 12;

/**
 * @param {MolarityModel} model
 * @param {Tandem} tandem
 * @constructor
 */
function MolarityScreenView( model, tandem ) {
  this.model = model;

  // Whether or the not model values are displayed in the visual view
  const valuesVisibleProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'valuesVisibleProperty' )
  } );

  // Determines whether qualitative or quantitative interactive descriptions are used. Even though it is the same as the
  // valuesVisibleProperty currently, this improves maintainability by not overloading valuesVisibleProperty with
  // description-specific use-case (a totally different view). For example, we could decide to display quantitative
  // descriptions when not showing values, but the state of solution is "x," with no refactoring.
  const useQuantitativeDescriptionsProperty = new DerivedProperty( [ valuesVisibleProperty ],
    currentValuesVisible => currentValuesVisible );

  // a11y - initializes describers and alert manager to generate and update all PDOM and alert content.
  const concentrationDescriber = new ConcentrationDescriber( model.solution, useQuantitativeDescriptionsProperty );
  const precipitateAmountDescriber = new PrecipitateAmountDescriber( model.solution, concentrationDescriber, useQuantitativeDescriptionsProperty );
  const soluteDescriber = new SoluteDescriber( model.solution, concentrationDescriber, precipitateAmountDescriber );
  const volumeDescriber = new VolumeDescriber( model.solution.volumeProperty, useQuantitativeDescriptionsProperty );
  const soluteAmountDescriber = new SoluteAmountDescriber( model.solution.soluteAmountProperty, soluteDescriber, useQuantitativeDescriptionsProperty );
  molarityAlertManager.initialize( model.solution, useQuantitativeDescriptionsProperty, concentrationDescriber,
    precipitateAmountDescriber, soluteAmountDescriber, volumeDescriber, soluteDescriber, valuesVisibleProperty );

  ScreenView.call( this, {
    layoutBounds: new Bounds2( 0, 0, 1100, 700 ),
    tandem: tandem,
    screenSummaryContent: new MolarityScreenSummaryNode( model, useQuantitativeDescriptionsProperty,
      concentrationDescriber, soluteAmountDescriber, soluteDescriber, volumeDescriber )
  } );

  // beaker, with solution and precipitate inside of it
  const beakerNode = new BeakerNode( model.solution, MolarityConstants.SOLUTION_VOLUME_RANGE.max, valuesVisibleProperty,
    tandem.createTandem( 'beakerNode' ), soluteDescriber, soluteAmountDescriber, volumeDescriber,
    concentrationDescriber, precipitateAmountDescriber, useQuantitativeDescriptionsProperty );

  const cylinderSize = beakerNode.getCylinderSize();
  const solutionNode = new SolutionNode( cylinderSize, beakerNode.getCylinderEndHeight(), model.solution,
    MolarityConstants.SOLUTION_VOLUME_RANGE.max, tandem.createTandem( 'solutionNode' ) );
  const precipitateNode = new PrecipitateNode( model.solution, cylinderSize, beakerNode.getCylinderEndHeight(),
    model.maxPrecipitateAmount, tandem.createTandem( 'precipitateNode' ) );
  const saturatedIndicator = new SaturatedIndicator( model.solution, tandem.createTandem( 'saturatedIndicator' ) );

  // solute control
  const soluteComboBoxListParent = new Node();
  const soluteComboBox = new SoluteComboBox( model.solutes, model.solution.soluteProperty, soluteComboBoxListParent,
    tandem.createTandem( 'soluteComboBox' ), {
      maxWidth: 500
    } );

  // slider for controlling amount of solute
  const soluteAmountSlider = new VerticalSlider( soluteAmountString,
    StringUtils.format( patternParentheses0TextString, molesString ),
    noneString, lotsString,
    model.solution.soluteAmountProperty,
    MolarityConstants.SOLUTE_AMOUNT_RANGE,
    MolarityConstants.SOLUTE_AMOUNT_DECIMAL_PLACES,
    unitsMolesString,
    valuesVisibleProperty,
    useQuantitativeDescriptionsProperty, molarityAlertManager, soluteAmountDescriber, {
      tandem: tandem.createTandem( 'soluteAmountSlider' ),
      sliderOptions: {
        trackSize: new Dimension2( SLIDER_TRACK_WIDTH, cylinderSize.height ),

        // a11y
        accessibleName: soluteAmountNoNewlineString,
        a11yCreateAriaValueText: () => soluteAmountDescriber.getSoluteAmountValueText(),
        a11yDependencies: [ model.solution.soluteProperty ]
      }
    }
  );

  // slider for controlling volume of solution, sized to match tick marks on the beaker
  const volumeSliderHeight = ( MolarityConstants.SOLUTION_VOLUME_RANGE.getLength() /
                               MolarityConstants.SOLUTION_VOLUME_RANGE.max ) * cylinderSize.height;
  const solutionVolumeSlider = new VerticalSlider( solutionVolumeString,
    StringUtils.format( patternParentheses0TextString, litersString ),
    lowString, fullString,
    model.solution.volumeProperty,
    MolarityConstants.SOLUTION_VOLUME_RANGE,
    MolarityConstants.SOLUTION_VOLUME_DECIMAL_PLACES,
    unitsLitersString,
    valuesVisibleProperty,
    useQuantitativeDescriptionsProperty, molarityAlertManager, volumeDescriber, {
      tandem: tandem.createTandem( 'solutionVolumeSlider' ),
      sliderOptions: {
        trackSize: new Dimension2( SLIDER_TRACK_WIDTH, volumeSliderHeight ),

        // a11y
        accessibleName: solutionVolumeString,
        a11yCreateAriaValueText: () => volumeDescriber.getVolumeAriaValueText()
      }
    } );

  // concentration display
  const concentrationBarSize = new Dimension2( 40, cylinderSize.height + 50 );
  const concentrationDisplay = new ConcentrationDisplay( model.solution, MolarityConstants.CONCENTRATION_RANGE,
    valuesVisibleProperty, concentrationBarSize, tandem.createTandem( 'concentrationDisplay' ) );

  // sound generator for concentration
  soundManager.addSoundGenerator( new ConcentrationSoundGenerator(
    model.solution,
    soluteAmountSlider,
    solutionVolumeSlider,
    model.resetInProgressProperty,
    { initialOutputLevel: 0.15 }
  ) );

  // sound generator for precipitate amount
  soundManager.addSoundGenerator( new PrecipitateSoundGenerator(
    model.solution.precipitateAmountProperty,
    soluteAmountSlider,
    solutionVolumeSlider,
    { initialOutputLevel: 0.1 }
  ) );

  // sound generator for solute selection
  soundManager.addSoundGenerator( new SoluteSelectionSoundGenerator(
    model.solution.soluteProperty,
    model.solutes,
    model.resetInProgressProperty,
    { initialOutputLevel: 0.4 }
  ) );

  // Solution Values checkbox
  const solutionValuesLabel = new Text( showValuesString, {
    font: new PhetFont( 22 ),
    tandem: tandem.createTandem( 'solutionValuesText' )
  } );
  const solutionValuesCheckbox = new Checkbox( solutionValuesLabel, valuesVisibleProperty, {
    maxWidth: 175,
    tandem: tandem.createTandem( 'solutionValuesCheckbox' ),

    // a11y
    accessibleName: showValuesString,
    helpText: solutionValuesHelpTextString
  } );
  solutionValuesCheckbox.touchArea = Shape.rectangle( solutionValuesCheckbox.left, solutionValuesCheckbox.top - 15, solutionValuesCheckbox.width + 5, solutionValuesCheckbox.height + 30 );

  // sound generator for check box
  const uncheckedClip = new SoundClip( checkboxUncheckedSound, {
    enableControlProperties: [ new InvertedBooleanProperty( model.resetInProgressProperty ) ]
  } );
  soundManager.addSoundGenerator( uncheckedClip );
  const checkedClip = new SoundClip( checkboxCheckedSound );
  soundManager.addSoundGenerator( checkedClip );
  valuesVisibleProperty.lazyLink( value => {
    if ( value ) {
      checkedClip.play();
    }
    else {
      uncheckedClip.play();
    }
  } );

  // Reset All button
  const resetAllButton = new ResetAllButton( {
    listener: function() {
      valuesVisibleProperty.reset();
      model.reset();
    },
    scale: 1.32,
    tandem: tandem.createTandem( 'resetAllButton' )
  } );

  // a11y - heading and accessible order for slider controls section of PDOM
  const solutionControlsNode = new Node( {
    tagName: 'div',
    labelTagName: 'h3',
    labelContent: beakerSolutionControlsString,
    descriptionContent: sliderHelpTextString
  } );
  solutionControlsNode.accessibleOrder = [ soluteAmountSlider, solutionVolumeSlider ];

  // a11y - heading and accessible order for play area section of PDOM
  this.pdomPlayAreaNode.accessibleOrder = [
    beakerNode,
    solutionControlsNode,
    soluteComboBox,
    soluteComboBoxListParent
  ];

  // a11y - contains PDOM heading for Control Area, and orders the PDOM for included elements
  this.pdomControlAreaNode.accessibleOrder = [
    solutionValuesCheckbox,
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
    solutionValuesCheckbox.right = soluteComboBox.left - 50;
    solutionValuesCheckbox.centerY = soluteComboBox.centerY;
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
      solutionValuesCheckbox,
      resetAllButton,
      soluteComboBox,
      soluteComboBoxListParent,
      solutionControlsNode
    ],
    center: this.layoutBounds.center
  } ) );
}

molarity.register( 'MolarityScreenView', MolarityScreenView );

inherit( ScreenView, MolarityScreenView );
export default MolarityScreenView;
// Copyright 2020, University of Colorado Boulder

/**
 * Abstract base class to describers that describe quantities that change about the slider. Each of these values are
 * handled similarly in situations like alerting a quantity change, and so this Type is to formalize that definition.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import molarity from '../../../molarity.js';

class SolutionQuantityDescriber {

  /**
   * @abstract
   * @public
   */
  getRegionChanged() {
    throw new Error( 'override expected' );
  }

  /**
   * @abstract
   * @public
   */
  getStringsFromSliderChange() {
    throw new Error( 'override expected' );
  }
}

molarity.register( 'SolutionQuantityDescriber', SolutionQuantityDescriber );
export default SolutionQuantityDescriber;
//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Enables CODAP integration by exporing data when concentration changes.
 *
 * To Add Molarity to CODAP, you can modify game_selection to include:
 *
 * DG.GameSpec.create({
 *  name: "Molarity",
 *  dimensions: { width: 1100/2, height: 700/2 },
 *  url: 'http://localhost:8080/molarity/molarity_en.html?iframeAPI'
 * }),
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  var caseID;

  /**
   *
   * @constructor
   */
  function MolarityCodap() {
  }

  return inherit( Object, MolarityCodap, {}, {
    start: function( sim ) {
      var codapPhone = new iframePhone.IframePhoneRpcEndpoint( function() {}, "codap-game", window.parent );
      codapPhone.call( {
        action: 'initGame',
        args: {
          name: 'Name of the Game!',
          //dimensions: { width: 400, height: 300 },
          contextType: 'DG.DataContext',
          collections: [
            {
              name: "Flight Record",
              attrs: [
                {
                  name: "solute amount",
                  type: "numeric",
                  precision: 2,
                  defaultMin: 0,
                  defaultMax: 30,
                  description: "seconds since beginning of attempt"
                },
                {
                  name: "solution volume",
                  type: "numeric",
                  precision: 1,
                  defaultMin: 0,
                  defaultMax: 360,
                  description: "distance above the lunar surface"
                },
                {
                  name: "solution concentration",
                  type: "numeric",
                  precision: 2,
                  defaultMin: 0,
                  defaultMax: 30,
                  description: "velocity of lander staoeunthatoeu"
                }
              ],
              labels: {
                singleCase: "measurement",
                pluralCase: "measurements",
                singleCaseWithArticle: "a measurement",
                setOfCases: "flight record",
                setOfCasesWithArticle: "a flight record"
              },
              defaults: {
                xAttr: "time",
                yAttr: "altitude"
              }
            }
          ]


        }
      }, function() {
        console.log( "Initializing interactive" );

        codapPhone.call( {
            action: 'openCase',
            args: {
              collection: "Rounds",
              values: [
                this.gameNum,
                this.trialNum
              ]
            }
          },
          function( result ) {
            caseID = result.caseID;
          }
        );

      }.bind( this ) );


      //Link to the sim variables:
      sim.screens[ 0 ].model.solution.concentrationProperty.link( function( concentration ) {
        codapPhone.call( {
          action: "createCase",
          args: {
            collection: "Flight Record",
            parent: caseID,
            values: [
              sim.screens[ 0 ].model.solution.soluteAmount,
              sim.screens[ 0 ].model.solution.volume,
              sim.screens[ 0 ].model.solution.concentration
            ]
          }
        } );

      } );
    }
  } );
} );
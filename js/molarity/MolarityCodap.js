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
 * or
 *
 * Launch with a query parameter like so:
 *
 * http://codap.concord.org/releases/latest/static/dg/en/cert/index.html?documentServer=http://document-store.herokuapp.com/&documentServer=http://document-store.herokuapp.com/?moreGames=[{%22name%22:%20%22Molarity%22,%22dimensions%22:{%22width%22:550,%22height%22:%20350%20},%22url%22:%20%22http://localhost:8080/molarity/molarity_en.html%22}]
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // Record the parent caseID so it can be sent when delivering data to codap
  var caseID;

  return {

    // After the sim has started, connect to codap and link to the sim to deliver data.
    start: function( sim ) {

      // Use iframe-phone for connection across the frame.
      var codapPhone = new iframePhone.IframePhoneRpcEndpoint( function() {}, "codap-game", window.parent );

      // Tell codap that the game has initialized
      codapPhone.call( {
        action: 'initGame',
        args: {
          name: 'Molarity',
          contextType: 'DG.DataContext',
          collections: [
            {
              name: "Values",
              attrs: [
                {
                  name: "solute amount",
                  type: "numeric",
                  precision: 2,
                  defaultMin: 0,
                  defaultMax: 1,
                  description: "amount of solute in the solution"
                },
                {
                  name: "solution volume",
                  type: "numeric",
                  precision: 2,
                  defaultMin: 0,
                  defaultMax: 1,
                  description: "total volume of the solution"
                },
                {
                  name: "solution concentration",
                  type: "numeric",
                  precision: 2,
                  defaultMin: 0,
                  defaultMax: 1,
                  description: "the concentration of the solution"
                }
              ],
              labels: {
                singleCase: "measurement",
                pluralCase: "measurements",
                singleCaseWithArticle: "a measurement",
                setOfCases: "Values",
                setOfCasesWithArticle: "a Values"
              },
              defaults: {
                xAttr: "solution volume",
                yAttr: "solution concentration"
              }
            }
          ]


        }
      }, function() {

        // After we have registered with codap, open a case
        // TODO: Is this really necessary?  Perhaps there is a better way to get a caseID?
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
            collection: "Values",
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
  };
} );
Implementation notes for 'Molarity' sim

This sim uses phet.axon.Property throughout the model and view for storage of properties and notification of changes.

Since spatial units (distance, size, location) have no relevance to the model, there is no model-view transform.
The model uses the view coordinate frame, where positive x is to the right, and positive y is down.

I find that I frequently need to change the rendering order and layout of nodes.
To make this easier, node constructors typically have this structure:

    function MyNode(...) {

        // instantiate nodes

        // set rendering order (addChild)

        // do layout

        // register observers
    }

## Disposal

There are no dynamic pieces to this simulation, and as a result nothing is disposed.
As a result no listeners need to be unlinked or removed.

## Accessibility

This simulation has be instrumented with Sonification and Interactive Description. While this instrumentation includes
changes to many sim files, several files are specifically for the purpose of Interactive Description instrumentation:

* every file in the `molarity/view/describers` directory - these files each track changes to one or two model Properties
to generate description strings to be used for both PDOM content and aria-live alerts).
* MolarityBeakerDescriptionNode.js - sets the PDOM content that describes the beaker.
* MolarityScreenSummaryNode.js - sets the PDOM content for the screen summary.
* MolarityKeyboardHelpContent.js - sets the content and layout for the keyboard help dialogue
* MolarityAlertManager.js - responsible for triggering aria-live alerts as the sim changes. In general, it is not
responsible for generating the strings for these alerts (as most of this work is handled by the describers).
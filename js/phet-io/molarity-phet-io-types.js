/* eslint-disable */
window.phet.phetio.phetioTypes = assert &&
  {
    "ActionIO.<>": {
      "documentation": "Emits when an event occurs. No arguments.",
      "events": {
        "0": "emitted"
      },
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<>"
          },
          "returnType": "VoidIO"
        },
        "execute": {
          "documentation": "Executes the function the Action is wrapping.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {},
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {},
      "supertype": "ObjectIO",
      "typeName": "ActionIO.<>"
    },
    "ActionIO.<BooleanIO>": {
      "documentation": "Emits when an event occurs. The arguments are:<br><ol><li>isChecked: BooleanIO</li></ol>",
      "events": {
        "0": "emitted"
      },
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<BooleanIO>"
          },
          "returnType": "VoidIO"
        },
        "execute": {
          "documentation": "Executes the function the Action is wrapping.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "BooleanIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "BooleanIO"
      },
      "supertype": "ObjectIO",
      "typeName": "ActionIO.<BooleanIO>"
    },
    "ActionIO.<DOMEventIO>": {
      "documentation": "Emits when an event occurs. The arguments are:<br><ol><li>event: DOMEventIO</li></ol>",
      "events": {
        "0": "emitted"
      },
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<DOMEventIO>"
          },
          "returnType": "VoidIO"
        },
        "execute": {
          "documentation": "Executes the function the Action is wrapping.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "DOMEventIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "DOMEventIO"
      },
      "supertype": "ObjectIO",
      "typeName": "ActionIO.<DOMEventIO>"
    },
    "ActionIO.<EventIO, VoidIO, VoidIO>": {
      "documentation": "Emits when an event occurs. The arguments are:<br><ol><li>event: EventIO</li>\n<li>targetNode: VoidIO</li>\n<li>callback: VoidIO</li></ol>",
      "events": {
        "0": "emitted"
      },
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<EventIO, VoidIO, VoidIO>"
          },
          "returnType": "VoidIO"
        },
        "execute": {
          "documentation": "Executes the function the Action is wrapping.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "EventIO",
            "1": "VoidIO",
            "2": "VoidIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "EventIO",
        "1": "VoidIO",
        "2": "VoidIO"
      },
      "supertype": "ObjectIO",
      "typeName": "ActionIO.<EventIO, VoidIO, VoidIO>"
    },
    "ActionIO.<NullableIO.<EventIO>, VoidIO>": {
      "documentation": "Emits when an event occurs. The arguments are:<br><ol><li>event: NullableIO.<EventIO></li>\n<li>callback: VoidIO</li></ol>",
      "events": {
        "0": "emitted"
      },
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<NullableIO.<EventIO>, VoidIO>"
          },
          "returnType": "VoidIO"
        },
        "execute": {
          "documentation": "Executes the function the Action is wrapping.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NullableIO.<EventIO>",
            "1": "VoidIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "NullableIO.<EventIO>",
        "1": "VoidIO"
      },
      "supertype": "ObjectIO",
      "typeName": "ActionIO.<NullableIO.<EventIO>, VoidIO>"
    },
    "ActionIO.<NumberIO, NumberIO>": {
      "documentation": "Emits when an event occurs. The arguments are:<br><ol><li>width: NumberIO</li>\n<li>height: NumberIO</li></ol>",
      "events": {
        "0": "emitted"
      },
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<NumberIO, NumberIO>"
          },
          "returnType": "VoidIO"
        },
        "execute": {
          "documentation": "Executes the function the Action is wrapping.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NumberIO",
            "1": "NumberIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "NumberIO",
        "1": "NumberIO"
      },
      "supertype": "ObjectIO",
      "typeName": "ActionIO.<NumberIO, NumberIO>"
    },
    "ActionIO.<NumberIO, Vector2IO, DOMEventIO>": {
      "documentation": "Emits when an event occurs. The arguments are:<br><ol><li>id: NumberIO</li>\n<li>point: Vector2IO</li>\n<li>event: DOMEventIO</li></ol>",
      "events": {
        "0": "emitted"
      },
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<NumberIO, Vector2IO, DOMEventIO>"
          },
          "returnType": "VoidIO"
        },
        "execute": {
          "documentation": "Executes the function the Action is wrapping.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NumberIO",
            "1": "Vector2IO",
            "2": "DOMEventIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "NumberIO",
        "1": "Vector2IO",
        "2": "DOMEventIO"
      },
      "supertype": "ObjectIO",
      "typeName": "ActionIO.<NumberIO, Vector2IO, DOMEventIO>"
    },
    "ActionIO.<NumberIO>": {
      "documentation": "Emits when an event occurs. The arguments are:<br><ol><li>dt: NumberIO</li></ol>",
      "events": {
        "0": "emitted"
      },
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<NumberIO>"
          },
          "returnType": "VoidIO"
        },
        "execute": {
          "documentation": "Executes the function the Action is wrapping.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NumberIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "NumberIO"
      },
      "supertype": "ObjectIO",
      "typeName": "ActionIO.<NumberIO>"
    },
    "ActionIO.<Vector2IO, DOMEventIO>": {
      "documentation": "Emits when an event occurs. The arguments are:<br><ol><li>point: Vector2IO</li>\n<li>event: DOMEventIO</li></ol>",
      "events": {
        "0": "emitted"
      },
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<Vector2IO, DOMEventIO>"
          },
          "returnType": "VoidIO"
        },
        "execute": {
          "documentation": "Executes the function the Action is wrapping.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "Vector2IO",
            "1": "DOMEventIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "Vector2IO",
        "1": "DOMEventIO"
      },
      "supertype": "ObjectIO",
      "typeName": "ActionIO.<Vector2IO, DOMEventIO>"
    },
    "ActionIO.<Vector2IO, VoidIO>": {
      "documentation": "Emits when an event occurs. The arguments are:<br><ol><li>point: Vector2IO. the position of the drag start in view coordinates</li>\n<li>event: VoidIO. the scenery pointer Event</li></ol>",
      "events": {
        "0": "emitted"
      },
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<Vector2IO, VoidIO>"
          },
          "returnType": "VoidIO"
        },
        "execute": {
          "documentation": "Executes the function the Action is wrapping.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "Vector2IO",
            "1": "VoidIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "Vector2IO",
        "1": "VoidIO"
      },
      "supertype": "ObjectIO",
      "typeName": "ActionIO.<Vector2IO, VoidIO>"
    },
    "ActionIO.<VoidIO>": {
      "documentation": "Emits when an event occurs. The arguments are:<br><ol><li>event: VoidIO</li></ol>",
      "events": {
        "0": "emitted"
      },
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<VoidIO>"
          },
          "returnType": "VoidIO"
        },
        "execute": {
          "documentation": "Executes the function the Action is wrapping.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "VoidIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "VoidIO"
      },
      "supertype": "ObjectIO",
      "typeName": "ActionIO.<VoidIO>"
    },
    "ComboBoxIO": {
      "documentation": "A combo box is composed of a push button and a listbox. The listbox contains items that represent choices. Pressing the button pops up the listbox. Selecting from an item in the listbox sets the value of an associated Property. The button shows the item that is currently selected.",
      "events": {
        "0": "listBoxShown",
        "1": "listBoxHidden"
      },
      "methodOrder": {},
      "methods": {},
      "supertype": "NodeIO",
      "typeName": "ComboBoxIO"
    },
    "DerivedPropertyIO.<BooleanIO>": {
      "documentation": "Like PropertyIO, but not settable.  Instead it is derived from other DerivedPropertyIO or PropertyIO instances",
      "events": {},
      "methodOrder": {},
      "methods": {
        "setValue": {
          "documentation": "Errors out when you try to set a derived property.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "BooleanIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "BooleanIO"
      },
      "supertype": "PropertyIO.<BooleanIO>",
      "typeName": "DerivedPropertyIO.<BooleanIO>"
    },
    "DerivedPropertyIO.<NumberIO>": {
      "documentation": "Like PropertyIO, but not settable.  Instead it is derived from other DerivedPropertyIO or PropertyIO instances",
      "events": {},
      "methodOrder": {},
      "methods": {
        "setValue": {
          "documentation": "Errors out when you try to set a derived property.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NumberIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "NumberIO"
      },
      "supertype": "PropertyIO.<NumberIO>",
      "typeName": "DerivedPropertyIO.<NumberIO>"
    },
    "DerivedPropertyIO.<StringIO>": {
      "documentation": "Like PropertyIO, but not settable.  Instead it is derived from other DerivedPropertyIO or PropertyIO instances",
      "events": {},
      "methodOrder": {},
      "methods": {
        "setValue": {
          "documentation": "Errors out when you try to set a derived property.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "StringIO"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "StringIO"
      },
      "supertype": "PropertyIO.<StringIO>",
      "typeName": "DerivedPropertyIO.<StringIO>"
    },
    "EmitterIO.<>": {
      "documentation": "Emits when an event occurs. No arguments.",
      "events": {},
      "methodOrder": {},
      "methods": {
        "addListener": {
          "documentation": "Adds a listener which will be called when the emitter emits.",
          "parameterTypes": {
            "0": "FunctionIO.<>"
          },
          "returnType": "VoidIO"
        },
        "emit": {
          "documentation": "Emits a single event to all listeners.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {},
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {},
      "supertype": "ActionIO.<>",
      "typeName": "EmitterIO.<>"
    },
    "LinkedElementIO": {
      "documentation": "A LinkedElement",
      "events": {},
      "methodOrder": {},
      "methods": {},
      "supertype": "ObjectIO",
      "typeName": "LinkedElementIO"
    },
    "NodeIO": {
      "documentation": "The base type for graphical and potentially interactive objects.  NodeIO has nested PropertyIO values for visibility, pickability and opacity.<br><br>Pickable can take one of three values:<br><ul><li>null: pass-through behavior. Nodes with input listeners are pickable, but nodes without input listeners won't block events for nodes behind it.</li><li>false: The node cannot be interacted with, and it blocks events for nodes behind it.</li><li>true: The node can be interacted with (if it has an input listener).</li></ul>For more about Scenery node pickability, please see <a href=\"http://phetsims.github.io/scenery/doc/implementation-notes#pickability\">http://phetsims.github.io/scenery/doc/implementation-notes#pickability</a>",
      "events": {},
      "methodOrder": {},
      "methods": {},
      "supertype": "ObjectIO",
      "typeName": "NodeIO"
    },
    "NumberPropertyIO": {
      "documentation": "Extends PropertyIO to add values for the numeric range ( min, max ) and numberType ( 'FloatingPoint' | 'Integer' )",
      "events": {},
      "methodOrder": {},
      "methods": {},
      "parameterTypes": {
        "0": "NumberIO"
      },
      "supertype": "PropertyIO.<NumberIO>",
      "typeName": "NumberPropertyIO"
    },
    "ObjectIO": {
      "documentation": "The root of the wrapper object hierarchy.",
      "events": {},
      "methodOrder": {},
      "methods": {},
      "supertype": null,
      "typeName": "ObjectIO"
    },
    "PhetButtonIO": {
      "documentation": "The PhET Button in the bottom right of the screen",
      "events": {},
      "methodOrder": {},
      "methods": {},
      "supertype": "ObjectIO",
      "typeName": "PhetButtonIO"
    },
    "PhetMenuIO": {
      "documentation": "The PhET Menu in the bottom right of the screen",
      "events": {},
      "methodOrder": {},
      "methods": {},
      "supertype": "ObjectIO",
      "typeName": "PhetMenuIO"
    },
    "PhetioCommandProcessorIO": {
      "documentation": "Invokes PhET-iO API commands on a running simulation.",
      "events": {
        "0": "invoked"
      },
      "methodOrder": {},
      "methods": {},
      "supertype": "ObjectIO",
      "typeName": "PhetioCommandProcessorIO"
    },
    "PhetioEngineIO": {
      "documentation": "Mediator for the phet-io module, with system-wide methods for communicating with the sim and other globals",
      "events": {
        "0": "simStarted",
        "1": "state"
      },
      "methodOrder": {
        "0": "addPhetioElementAddedListener",
        "1": "addPhetioElementRemovedListener",
        "2": "addEventListener",
        "3": "getScreenshotDataURL",
        "4": "getPhetioIDs",
        "5": "getValues",
        "6": "getState",
        "7": "setState",
        "8": "getChangedState",
        "9": "getStateForObject",
        "10": "getPhetioElementMetadata",
        "11": "setRandomSeed",
        "12": "getRandomSeed",
        "13": "setDisplaySize",
        "14": "setPlaybackMode",
        "15": "setInteractive",
        "16": "isInteractive",
        "17": "startEvent",
        "18": "endEvent",
        "19": "triggerEvent",
        "20": "stepSimulation",
        "21": "launchSimulation",
        "22": "invokeControllerInputEvent",
        "23": "setSimStartedMetadata",
        "24": "simulateError"
      },
      "methods": {
        "addEventListener": {
          "documentation": "Adds a listener to the PhET-iO dataStream, which can be used to respond to events or for data analysis. Unlike Client.launchSim( {onEvent} ) which is called recursively for each child event, this is only called with top-level events.",
          "parameterTypes": {
            "0": "FunctionIO.<ObjectIO>"
          },
          "returnType": "VoidIO"
        },
        "addPhetioElementAddedListener": {
          "documentation": "Adds a listener that receives a callback when a PhET-iO Element has been added.Arguments for the function: \n<ul><li><strong>phetioID:</strong> {String}\n</li><li><strong>type:</strong> {Object} - the IO Type api\n</li><li><strong>metadata:</strong> {Object} - element specific metadata like documentation and type, see PhetioEngineIO.getPhetioElementMetadata().</li><li><strong>state:</strong> {Object} - a snapshot of the initial state of the PhET-iO Element.</li></ul>",
          "parameterTypes": {
            "0": "FunctionIO.<StringIO, ObjectIO, ObjectIO, ObjectIO>"
          },
          "returnType": "VoidIO"
        },
        "addPhetioElementRemovedListener": {
          "documentation": "Removes a listener that was added with addPhetioElementAddedListener",
          "parameterTypes": {
            "0": "FunctionIO.<StringIO, StringIO>"
          },
          "returnType": "VoidIO"
        },
        "endEvent": {
          "documentation": "Ends a previously started wrapper event message.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NumberIO"
          },
          "returnType": "VoidIO"
        },
        "getChangedState": {
          "documentation": "Gets the state of the simulation, only returning values that have changed from their initial state. PhET-iO elements that have been deleted will be displayed with the value \"DELETED\".",
          "parameterTypes": {},
          "returnType": "ObjectIO"
        },
        "getPhetioElementMetadata": {
          "documentation": "Get metadata about the PhET-iO element. This includes the following keys:<ul><li><strong>phetioTypeName:</strong> The name of the PhET-iO Type\n</li><li><strong>phetioState:</strong> default - true. When true, includes the PhET-iO element in the PhET-iO state\n</li><li><strong>phetioReadOnly:</strong> default - false. When true, you can only get values from the PhET-iO element; no setting allowed.\n</li><li><strong>phetioDocumentation:</strong> default - null. Useful notes about a PhET-iO element, shown in the PhET-iO Studio Wrapper</li></ul>",
          "parameterTypes": {
            "0": "StringIO"
          },
          "returnType": "ObjectIO"
        },
        "getPhetioElementsBaseline": {
          "documentation": "Gets the baseline element API. Taken with the overrides and types, this produces the full API. Clients will probably not use this.",
          "parameterTypes": {},
          "returnType": "ObjectIO"
        },
        "getPhetioIDs": {
          "documentation": "Gets a list of all of the PhET-iO elements.",
          "parameterTypes": {},
          "returnType": "ArrayIO.<StringIO>"
        },
        "getRandomSeed": {
          "documentation": "Gets the random seed, used for replicable playbacks",
          "parameterTypes": {},
          "returnType": "NumberIO"
        },
        "getScreenshotDataURL": {
          "documentation": "Gets a base64 string representation of a screenshot of the simulation as a data url.",
          "parameterTypes": {},
          "returnType": "StringIO"
        },
        "getState": {
          "documentation": "Gets the full state of the simulation, including parts that have not changed from startup.",
          "parameterTypes": {},
          "returnType": "ObjectIO"
        },
        "getStateForObject": {
          "documentation": "Gets the state object for a PhET-iO element or null if phetioID does not exist.",
          "parameterTypes": {
            "0": "StringIO"
          },
          "returnType": "ObjectIO"
        },
        "getValues": {
          "documentation": "Get the current values for multiple Property/DerivedProperty elements at the same time. Useful for collecting data to be plotted, so values will be consistent.",
          "parameterTypes": {
            "0": "ArrayIO.<StringIO>"
          },
          "returnType": "ObjectIO"
        },
        "invokeControllerInputEvent": {
          "documentation": "Plays back a recorded input event into the simulation.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "ObjectIO"
          },
          "returnType": "VoidIO"
        },
        "isInteractive": {
          "documentation": "Gets whether the sim can be interacted with (via mouse/touch/keyboard).",
          "parameterTypes": {},
          "returnType": "BooleanIO"
        },
        "launchSimulation": {
          "documentation": "Finishes launching the simulation, called from a wrapper after all cross-frame initialization is complete. Note: cannot be invoked with other commands.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {},
          "returnType": "VoidIO"
        },
        "setDisplaySize": {
          "documentation": "Sets the size of the visible region for the simulation.  In most cases, it would be recommended to set the size of the iframe, but this method can be used to set the size of the display inside the iframe.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NumberIO",
            "1": "NumberIO"
          },
          "returnType": "VoidIO"
        },
        "setInteractive": {
          "documentation": "Sets whether the sim can be interacted with (via mouse/touch/keyboard). When set to false, the sim animations and model will still step.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "BooleanIO"
          },
          "returnType": "VoidIO"
        },
        "setPlaybackMode": {
          "documentation": "Sets whether the sim is in \"playback mode\", which is used for playing back recorded events.  In this mode, the simulation clock will only advance based on the played back events.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "BooleanIO"
          },
          "returnType": "VoidIO"
        },
        "setRandomSeed": {
          "documentation": "Sets the random seed so that the simulation will have reproducible \"randomness\" between runs.  This must be set before the PhET-iO simulation is launched so that all of the random variables will take on deterministic values.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NumberIO"
          },
          "returnType": "VoidIO"
        },
        "setSimStartedMetadata": {
          "documentation": "Sets additional data that is added to the simStarted event, which will appear in the PhET-iO event stream. It can be used to record startup parameters or other information specified by the wrapper.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "ObjectIO"
          },
          "returnType": "VoidIO"
        },
        "setState": {
          "documentation": "Sets the simulation state based on the keys provided. The parameter is a map where the keys are phetioIDs and the values are the corresponding states for each PhET-iO element. This method expectsa complete list of state supported phetioIDs, which can be found by calling getState().",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "ObjectIO"
          },
          "returnType": "VoidIO"
        },
        "simulateError": {
          "documentation": "Simulates an error in the simulation frame for testing purposes.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NullableIO.<StringIO>"
          },
          "returnType": "VoidIO"
        },
        "startEvent": {
          "documentation": "Begins a message from the wrapper and interleaves it in the PhET-iO Simulation's data stream. Takes an object with entries like: <br><strong>{string} phetioID</strong> - the id of the specific element that created the event in camelCasing like 'frictionCheckbox'<br><strong>{{typeName: string, events: String[]}}componentType </strong> - The Type that is emitting the event. The event being started must be included in the \"events\" array.<br><strong>{string} event</strong> - the name of the action that occurred, in camelCase, like 'pressed'<br><strong>{Object} [parameters]</strong> - key/value pairs of arguments for the event, to provide further description of the event.       It is the programmer's responsibility to make sure the optional arguments don't collide with the other key names<br>.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "ObjectIO"
          },
          "returnType": "NumberIO"
        },
        "stepSimulation": {
          "documentation": "Steps one frame of the simulation.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NumberIO"
          },
          "returnType": "VoidIO"
        },
        "triggerEvent": {
          "documentation": "Start and end a message from the wrapper, interleaving it into the PhET-iO Simulation's data stream. Takes an object with entries like: <br><strong>{string} phetioID</strong> - the id of the specific element that created the event in camelCasing like 'frictionCheckbox'<br><strong>{{typeName: string, events: String[]}} type</strong> - The Type that is emitting the event. The event being triggered must be included in the \"events\" array.<br><strong>{string} event</strong> - the name of the action that occurred, in camelCase, like 'pressed'<br><strong>{Object} [parameters]</strong> - key/value pairs of arguments for the event, to provide further description of the event.       It is the programmer's responsibility to make sure the optional arguments don't collide with the other key names<br>.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "ObjectIO"
          },
          "returnType": "VoidIO"
        }
      },
      "supertype": "ObjectIO",
      "typeName": "PhetioEngineIO"
    },
    "PropertyIO.<BooleanIO>": {
      "documentation": "Observable values that send out notifications when the value changes. This differs from the traditional listener pattern in that added listeners also receive a callback with the current value when the listeners are registered. This is a widely-used pattern in PhET-iO simulations.",
      "events": {
        "0": "changed"
      },
      "methodOrder": {
        "0": "link",
        "1": "lazyLink"
      },
      "methods": {
        "getValue": {
          "documentation": "Gets the current value.",
          "parameterTypes": {},
          "returnType": "BooleanIO"
        },
        "lazyLink": {
          "documentation": "Adds a listener which will be called when the value changes. This method is like \"link\", but without the current-value callback on registration. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<BooleanIO, NullableIO.<BooleanIO>>"
          },
          "returnType": "VoidIO"
        },
        "link": {
          "documentation": "Adds a listener which will be called when the value changes. On registration, the listener is also called with the current value. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<BooleanIO, NullableIO.<BooleanIO>>"
          },
          "returnType": "VoidIO"
        },
        "setValue": {
          "documentation": "Sets the value of the property. If the value differs from the previous value, listeners are notified with the new value.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "BooleanIO"
          },
          "returnType": "VoidIO"
        },
        "unlink": {
          "documentation": "Removes a listener.",
          "parameterTypes": {
            "0": "FunctionIO.<BooleanIO>"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "BooleanIO"
      },
      "supertype": "ObjectIO",
      "typeName": "PropertyIO.<BooleanIO>"
    },
    "PropertyIO.<NullableIO.<BooleanIO>>": {
      "documentation": "Observable values that send out notifications when the value changes. This differs from the traditional listener pattern in that added listeners also receive a callback with the current value when the listeners are registered. This is a widely-used pattern in PhET-iO simulations.",
      "events": {
        "0": "changed"
      },
      "methodOrder": {
        "0": "link",
        "1": "lazyLink"
      },
      "methods": {
        "getValue": {
          "documentation": "Gets the current value.",
          "parameterTypes": {},
          "returnType": "NullableIO.<BooleanIO>"
        },
        "lazyLink": {
          "documentation": "Adds a listener which will be called when the value changes. This method is like \"link\", but without the current-value callback on registration. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<NullableIO.<BooleanIO>, NullableIO.<NullableIO.<BooleanIO>>>"
          },
          "returnType": "VoidIO"
        },
        "link": {
          "documentation": "Adds a listener which will be called when the value changes. On registration, the listener is also called with the current value. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<NullableIO.<BooleanIO>, NullableIO.<NullableIO.<BooleanIO>>>"
          },
          "returnType": "VoidIO"
        },
        "setValue": {
          "documentation": "Sets the value of the property. If the value differs from the previous value, listeners are notified with the new value.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NullableIO.<BooleanIO>"
          },
          "returnType": "VoidIO"
        },
        "unlink": {
          "documentation": "Removes a listener.",
          "parameterTypes": {
            "0": "FunctionIO.<NullableIO.<BooleanIO>>"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "NullableIO.<BooleanIO>"
      },
      "supertype": "ObjectIO",
      "typeName": "PropertyIO.<NullableIO.<BooleanIO>>"
    },
    "PropertyIO.<NullableIO.<FocusIO>>": {
      "documentation": "Observable values that send out notifications when the value changes. This differs from the traditional listener pattern in that added listeners also receive a callback with the current value when the listeners are registered. This is a widely-used pattern in PhET-iO simulations.",
      "events": {
        "0": "changed"
      },
      "methodOrder": {
        "0": "link",
        "1": "lazyLink"
      },
      "methods": {
        "getValue": {
          "documentation": "Gets the current value.",
          "parameterTypes": {},
          "returnType": "NullableIO.<FocusIO>"
        },
        "lazyLink": {
          "documentation": "Adds a listener which will be called when the value changes. This method is like \"link\", but without the current-value callback on registration. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<NullableIO.<FocusIO>, NullableIO.<NullableIO.<FocusIO>>>"
          },
          "returnType": "VoidIO"
        },
        "link": {
          "documentation": "Adds a listener which will be called when the value changes. On registration, the listener is also called with the current value. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<NullableIO.<FocusIO>, NullableIO.<NullableIO.<FocusIO>>>"
          },
          "returnType": "VoidIO"
        },
        "setValue": {
          "documentation": "Sets the value of the property. If the value differs from the previous value, listeners are notified with the new value.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NullableIO.<FocusIO>"
          },
          "returnType": "VoidIO"
        },
        "unlink": {
          "documentation": "Removes a listener.",
          "parameterTypes": {
            "0": "FunctionIO.<NullableIO.<FocusIO>>"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "NullableIO.<FocusIO>"
      },
      "supertype": "ObjectIO",
      "typeName": "PropertyIO.<NullableIO.<FocusIO>>"
    },
    "PropertyIO.<RangeIO>": {
      "documentation": "Observable values that send out notifications when the value changes. This differs from the traditional listener pattern in that added listeners also receive a callback with the current value when the listeners are registered. This is a widely-used pattern in PhET-iO simulations.",
      "events": {
        "0": "changed"
      },
      "methodOrder": {
        "0": "link",
        "1": "lazyLink"
      },
      "methods": {
        "getValue": {
          "documentation": "Gets the current value.",
          "parameterTypes": {},
          "returnType": "RangeIO"
        },
        "lazyLink": {
          "documentation": "Adds a listener which will be called when the value changes. This method is like \"link\", but without the current-value callback on registration. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<RangeIO, NullableIO.<RangeIO>>"
          },
          "returnType": "VoidIO"
        },
        "link": {
          "documentation": "Adds a listener which will be called when the value changes. On registration, the listener is also called with the current value. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<RangeIO, NullableIO.<RangeIO>>"
          },
          "returnType": "VoidIO"
        },
        "setValue": {
          "documentation": "Sets the value of the property. If the value differs from the previous value, listeners are notified with the new value.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "RangeIO"
          },
          "returnType": "VoidIO"
        },
        "unlink": {
          "documentation": "Removes a listener.",
          "parameterTypes": {
            "0": "FunctionIO.<RangeIO>"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "RangeIO"
      },
      "supertype": "ObjectIO",
      "typeName": "PropertyIO.<RangeIO>"
    },
    "PropertyIO.<SoluteIO>": {
      "documentation": "Observable values that send out notifications when the value changes. This differs from the traditional listener pattern in that added listeners also receive a callback with the current value when the listeners are registered. This is a widely-used pattern in PhET-iO simulations.",
      "events": {
        "0": "changed"
      },
      "methodOrder": {
        "0": "link",
        "1": "lazyLink"
      },
      "methods": {
        "getValue": {
          "documentation": "Gets the current value.",
          "parameterTypes": {},
          "returnType": "SoluteIO"
        },
        "lazyLink": {
          "documentation": "Adds a listener which will be called when the value changes. This method is like \"link\", but without the current-value callback on registration. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<SoluteIO, NullableIO.<SoluteIO>>"
          },
          "returnType": "VoidIO"
        },
        "link": {
          "documentation": "Adds a listener which will be called when the value changes. On registration, the listener is also called with the current value. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<SoluteIO, NullableIO.<SoluteIO>>"
          },
          "returnType": "VoidIO"
        },
        "setValue": {
          "documentation": "Sets the value of the property. If the value differs from the previous value, listeners are notified with the new value.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "SoluteIO"
          },
          "returnType": "VoidIO"
        },
        "unlink": {
          "documentation": "Removes a listener.",
          "parameterTypes": {
            "0": "FunctionIO.<SoluteIO>"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "SoluteIO"
      },
      "supertype": "ObjectIO",
      "typeName": "PropertyIO.<SoluteIO>"
    },
    "PropertyIO.<StringIO>": {
      "documentation": "Observable values that send out notifications when the value changes. This differs from the traditional listener pattern in that added listeners also receive a callback with the current value when the listeners are registered. This is a widely-used pattern in PhET-iO simulations.",
      "events": {
        "0": "changed"
      },
      "methodOrder": {
        "0": "link",
        "1": "lazyLink"
      },
      "methods": {
        "getValue": {
          "documentation": "Gets the current value.",
          "parameterTypes": {},
          "returnType": "StringIO"
        },
        "lazyLink": {
          "documentation": "Adds a listener which will be called when the value changes. This method is like \"link\", but without the current-value callback on registration. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<StringIO, NullableIO.<StringIO>>"
          },
          "returnType": "VoidIO"
        },
        "link": {
          "documentation": "Adds a listener which will be called when the value changes. On registration, the listener is also called with the current value. The listener takes two arguments, the new value and the previous value.",
          "parameterTypes": {
            "0": "FunctionIO.<StringIO, NullableIO.<StringIO>>"
          },
          "returnType": "VoidIO"
        },
        "setValue": {
          "documentation": "Sets the value of the property. If the value differs from the previous value, listeners are notified with the new value.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "StringIO"
          },
          "returnType": "VoidIO"
        },
        "unlink": {
          "documentation": "Removes a listener.",
          "parameterTypes": {
            "0": "FunctionIO.<StringIO>"
          },
          "returnType": "VoidIO"
        }
      },
      "parameterTypes": {
        "0": "StringIO"
      },
      "supertype": "ObjectIO",
      "typeName": "PropertyIO.<StringIO>"
    },
    "RichTextIO": {
      "documentation": "The tandem IO type for the scenery RichText node",
      "events": {},
      "methodOrder": {},
      "methods": {},
      "supertype": "NodeIO",
      "typeName": "RichTextIO"
    },
    "SliderIO": {
      "documentation": "A traditional slider component, with a knob and possibly tick marks",
      "events": {},
      "methodOrder": {},
      "methods": {
        "setMajorTicksVisible": {
          "documentation": "Set whether the major tick marks should be shown",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "BooleanIO"
          },
          "returnType": "VoidIO"
        },
        "setMinorTicksVisible": {
          "documentation": "Set whether the minor tick marks should be shown",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "BooleanIO"
          },
          "returnType": "VoidIO"
        }
      },
      "supertype": "NodeIO",
      "typeName": "SliderIO"
    },
    "SoluteIO": {
      "documentation": "The solute for the sim",
      "events": {},
      "methodOrder": {},
      "methods": {},
      "supertype": "ReferenceIO",
      "typeName": "SoluteIO"
    },
    "TextIO": {
      "documentation": "Text that is displayed in the simulation. TextIO has a nested PropertyIO.&lt;String&gt; for the current string value.",
      "events": {},
      "methodOrder": {},
      "methods": {
        "getFontOptions": {
          "documentation": "Gets font options for this TextIO instance as an object",
          "parameterTypes": {},
          "returnType": "FontIO"
        },
        "getMaxWidth": {
          "documentation": "Gets the maximum width of text box",
          "parameterTypes": {},
          "returnType": "NumberIO"
        },
        "setFontOptions": {
          "documentation": "Sets font options for this TextIO instance, e.g. {size: 16, weight: bold}. If increasing the font size does not make the text size larger, you may need to increase the maxWidth of the TextIO also.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "FontIO"
          },
          "returnType": "VoidIO"
        },
        "setMaxWidth": {
          "documentation": "Sets the maximum width of text box. If the text width exceeds maxWidth, it is scaled down to fit.",
          "invocableForReadOnlyElements": false,
          "parameterTypes": {
            "0": "NumberIO"
          },
          "returnType": "VoidIO"
        }
      },
      "supertype": "NodeIO",
      "typeName": "TextIO"
    }
  };
# react-native-html5-loader

Mini library to help you easily integrate existing web library into React Native!

## Install

npm install --save react-native-html5-loader

## What can it do for you?

This is indeed a mini library, but it offers some good stuff to you:

* Create base HTML template inside Webview, let you easily inject the part you need for customization
* Hook up basic communication channel between the WebView and React Native using the `postMessage`. The message format is redux like: `type` and `payload`, so you won't need to manually stringify or parse anything youself.
* Handle WebView initialization to `avoid the possible race condition between WebView and React Native`, since there're running in their own JS runtime
* You can `write JS function for web directly in your React Native project` (NOTICE: es5 syntax only)

## Example 

Please see `examples` directory, we have provided 3 examples for now:

* A simple `Counter` example
* An example to integrate `SignaturePad` js library
* An example to integrate `ThreeJs` to show 3D object

## API Usage

Let's use a simple `Counter` example to explain the usage. 

What we want to accomplish is:

* Create the counter UI inside `WebView`
* Increment or decrement the counter value in `React Native` side.

The full code is here, very short and clean:

```javascript
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, WebView} from 'react-native';
import Html5Loader from 'react-native-html5-loader';

export default class App extends Component {
  render() {
    return (
      <Html5Loader
        head={`
          <style>
            body { margin:0; padding: 20px; }
            h1 { font-size: 100px; }
          </style>
        `}
        body={`
          <h1>0</h1>
        `}
        webHandler={function webHandler(action, callRN, window) {
          var count = parseInt(window.document.querySelector('h1').innerHTML, 10);
          if (action.type === 'inc') {
              window.document.querySelector('h1').innerHTML = (count + 1);
          } else if (action.type === 'dec') {
              window.document.querySelector('h1').innerHTML = (count - 1);
          }
          callRN('ack', 'message ' + action.type + ' received')
        }}
        rnHandler={(action, callWeb) => console.log(action.type, action.payload)}
      > 
        {({callWeb, webViewProps}) => (
          <View style={{flex: 1}}>
            <WebView
              {...webViewProps}
              style={{flex: 1, alignSelf: 'stretch'}}
            />

            <View style={{flexDirection: 'row', height: 60, justifyContent: 'space-around'}}>
              <TouchableOpacity onPress={() => callWeb('inc', null)}>
                  <Text>+1</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => callWeb('dec', null)}>
                  <Text>-1</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Html5Loader>
    );
  }
}

```

### Props
* **head** (`string`): will be injected into the `<head>` section of WebView HTML.
* **body** (`string`): will be injected into the `<body>` section of WebView HTML.
* **webHandler** (`es5 function`): the code to execute inside Web when receiving message from React Native side. The signature:
    * **action**: JS object with format `{type, payload}` 
    * **callRN**: used to send message back to React Native side. `callRN` also has two positional params `type`(string) and `payload`(any)
    * **window**: injected global `window` object for WebView.
* **rnHandler** (`function`): the code to execute inside RN when receiving message from Web side. The signature:
    * **action**: JS object with format `{type, payload}` 
    * **callWeb**: used to send message to web side. `callWeb` also has two positional params `type`(string) and `payload`(any)

### props.children

This library uses `render props pattern` and the `props.children` should be a function returning `JSX`, with a single param which is an object containing following properties:
  * **callWeb**: used to send message to web side. `callWeb` also has two positional params `type`(string) and `payload`(any)
  * **webViewProps**: calculated props for the actual `WebView`, use spread operator to pass those props to let the magic happen!

## Contributions

Welcome!



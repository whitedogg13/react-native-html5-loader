import React, {Component} from 'react';
import {View, Text, TouchableOpacity, WebView} from 'react-native';
import Html5Loader from '../../index';

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

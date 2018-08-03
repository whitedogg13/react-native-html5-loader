import React, {Component} from 'react';
import {WebView} from 'react-native';
import Html5Loader from '../../index';
import libSignaturePad from './signaturePad'

const head = `
  <style>
    * { margin:0; padding:0;}

    canvas {
      position:absolute;transform:translateZ(0);
      /* In case the React Transformation is not performant, we'll fall back to this one

      transform-origin:left top;
      -ms-transform-origin:left top;
      -webkit-transform-origin:left top;
      transform:rotate(-90deg) translate(-100%, 0px);
      -ms-transform:rotate(-90deg)  translate(-100%, 0px);
      -webkit-transform:rotate(-90deg)  translate(-100%, 0px);*/
    }
  </style>
  <script>
    ${libSignaturePad}
  </script>
`
const body = `
  <canvas style="margin-left: 0; margin-top: 0;"></canvas>
`;

function webHandler(action, callRN, window) {
  var showSignaturePad = function (signaturePadCanvas, bodyWidth, bodyHeight) {
    var width = bodyWidth;
    var height = bodyHeight;

    var sizeSignaturePad = function () {
      var devicePixelRatio = 1; /*window.devicePixelRatio || 1;*/
      var canvasWidth = width * devicePixelRatio;
      var canvasHeight = height * devicePixelRatio;
      signaturePadCanvas.width = canvasWidth;
      signaturePadCanvas.height = canvasHeight;
      signaturePadCanvas.getContext('2d').scale(devicePixelRatio, devicePixelRatio);
    };

    var finishedStroke = function(base64DataUrl) {
       callRN('finishedStroke', {base64DataUrl: base64DataUrl});
    };

    var enableSignaturePadFunctionality = function () {
      var signaturePad = new SignaturePad(signaturePadCanvas, {
        penColor: 'black',
        backgroundColor: 'white',
        onEnd: function() { finishedStroke(signaturePad.toDataURL()); }
      });
      signaturePad.minWidth = 1;
      signaturePad.maxWidth = 4;
    };

    sizeSignaturePad();
    enableSignaturePadFunctionality();
  };

  if (action.type === 'render') {
    var bodyWidth = window.document.body.clientWidth;
    var bodyHeight = window.document.body.clientHeight;
    if(!bodyWidth) {
      bodyWidth = window.innerWidth;
    }
    if(!bodyHeight) {
      bodyHeight = window.innerHeight;
    }

    var canvasElement = window.document.querySelector('canvas');
    showSignaturePad(canvasElement, bodyWidth, bodyHeight);
  }
}

export default class App extends Component {
  render() {
    function rnHandler(action, callWeb) {
      console.log(action.type, action.payload);
      if (action.type === '__init__') {
        callWeb('render', 'hello webview!');
      }
    }

    return (
      <Html5Loader
        head={head}
        body={body}
        webHandler={webHandler}
        rnHandler={rnHandler}
      >
        {({callWeb, webViewProps}) => (
          <WebView
            {...webViewProps}
            style={{flex: 1, alignSelf: 'stretch'}}
          />
        )}
      </Html5Loader>
    );
  }
}


import React, {Component} from 'react';
import WebLoaderView from '../../index';

const head = `
  <script src="https://threejs.org/build/three.js"></script>

  <style>
    body { margin:0; padding:0; }
	  canvas { width: 100%; height: 100% }
  </style>
`;

function webHandler(action, callRN, window) {
  if (action.type === 'render') {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    window.document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    var animate = function () {
        requestAnimationFrame( animate );

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render( scene, camera );
    };

    animate();
  }
}

export default class App extends Component {
  render() {
    function rnHandler(action, callWeb) {
      if (action.type === '__init__') {
        callWeb('render', 'hello webview!');
      }
    }

    return (
      <WebLoaderView
        head={head}
        webHandler={webHandler}
        rnHandler={rnHandler}
        webViewProps={{
          style: {flex: 1, alignSelf: 'stretch'}
        }}
      />
    );
  }
}


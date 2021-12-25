import * as THREE from 'three'
import { WEBGL } from 'three/examples/jsm/WebGL'
import Stats from 'three/examples/jsm/libs/stats.module'
//import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';

const scene = new THREE.Scene( );
const camera = new THREE.PerspectiveCamera( 76.0, window.innerWidth/window.innerHeight, 0.1, 1000.0 );

function platformSetup( ) : boolean {
    // Check and log WebGL support.
    const isWebGLSupported = WEBGL.isWebGLAvailable( );
    const isWebGL2Supported = WEBGL.isWebGL2Available( );
    console.log( 'Sandbox Setup\nWebGL 1.0: %s\nWebGL 2.0: %s', isWebGLSupported, isWebGL2Supported );

    return isWebGL2Supported;
}

platformSetup( );

// Setup the stats widget.
const stats = Stats( );
document.body.appendChild( stats.dom );

const canvas = document.querySelector( '#viewport' );
const renderer = new THREE.WebGLRenderer( {
    antialias: true
} );

function setupRenderer() {
    // Configure renderer and canvas.
    canvas?.appendChild( renderer.domElement );
    renderer.setSize( window.innerWidth, window.innerHeight );

    window.addEventListener( 'resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    } );
}

// Setup some temp geometry.
const geometry = new THREE.TorusKnotGeometry( 2.5, 0.1, 32, 16, 2, 3 );
const material = new THREE.MeshStandardMaterial( {
    color: 0x00ff00,
    roughness: 1.0,
    metalness: 0.0
} );

// Add the actual mesh geometry to the scene.
const meshGeometry = new THREE.Mesh( geometry, material );
scene.add( meshGeometry );

// Add a rough light.
const light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
scene.add( light );

camera.position.z = 7.0;

// Game tick update.
function gameTick( ) {
    requestAnimationFrame( gameTick );

    meshGeometry.rotation.x += 0.01;
    meshGeometry.rotation.y += 0.01;

    // Execute the renderer tick. This... Shouldn't be done here.
    renderTick( );

    stats.update( );
}

// Renderer tick update.
function renderTick( ) {
    renderer.render( scene, camera );
}

setupRenderer( );

gameTick( );
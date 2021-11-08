import * as THREE from '../node_modules/three/build/three.module.js';
//import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 76.0, window.innerWidth/window.innerHeight, 0.1, 1000.0 );

const renderer = new THREE.WebGLRenderer( {
    antialias: true
} );

const setupRenderer = function( ) {
    // Configure renderer and canvas.
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    } )
}

// Setup some temp geometry.
const geometry = new THREE.TorusKnotGeometry( 2.5, 0.1, 32, 16, 2, 3 );
const material = new THREE.MeshStandardMaterial( { 
    color: 0x00ff00,
    roughness: 1.0,
    metallic: 0.0
} );

// Add the actual mesh geometry to the scene.
const meshGeometry = new THREE.Mesh( geometry, material );
scene.add( meshGeometry );

// Add a rough light.
const light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
scene.add( light );

camera.position.z = 7.0;

// Game tick update.
const gameTick = function( ) {
    requestAnimationFrame( gameTick );

    meshGeometry.rotation.x+= 0.01;
    meshGeometry.rotation.y+= 0.01;

    renderTick( );
};

// Renderer tick update.
const renderTick = function( ) {
    renderer.render( scene, camera );
}

setupRenderer( );

gameTick( );
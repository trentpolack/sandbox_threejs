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
const geometry = new THREE.TorusKnotGeometry( 1.75, 0.1, 32, 10, 2, 3 );
const material = new THREE.MeshBasicMaterial( { 
    color: 0x00ff00
} );

const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5.0;

const animate = function( ) {
    requestAnimationFrame( animate );

    cube.rotation.x+= 0.01;
    cube.rotation.y+= 0.01;

    renderer.render( scene, camera );
};

setupRenderer( );
animate( );
import * as THREE from 'three'
import { WEBGL } from 'three/examples/jsm/WebGL'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { Mesh } from 'three';

import Client from './client/client';

// Test geometry.
let torusKnotMeshGeometry : Mesh;
const torusKnotGeometryData = {
    radius: 10,
    tube: 2.5,
    tubularSegments: 64,
    radialSegments: 8,
    p: 2,
    q: 3,

    visible: true
};

// Test lights.
const directionalLight_01 : THREE.Light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );

window.onload = ( ) => {
	window.focus( );
    
    // Setup the client.
    Client.init( true, true );

    init( );

    Client.registerTickFunction( main );
    Client.run( );
}

/**
 * Temporary interface/class to deal with loading the bunny. 
 *  NOTE: I'm still learning okay.
 */
interface IMeshGroup {
    group : THREE.Group;
    visible : boolean;
}

class MeshGroup implements IMeshGroup {
    group = new THREE.Group( );
    visible = false;
}

const bunnyMeshGroup : MeshGroup = new MeshGroup( );

function init( ) {
    /**
     * NOTE (trent, 12/26): Temp code while moving bits around.
     */

    {
        // Setup ground plane.
        const groundMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
        groundMaterial.color.setHSL( 0.095, 1, 0.75 );

        const groundGeo = new THREE.PlaneGeometry( 1000.0, 1000.0 );
        const groundMesh = new THREE.Mesh( groundGeo, groundMaterial );
        groundMesh.rotateX( Math.PI*1.5 );
        groundMesh.translateZ( -25.0 );
        groundMesh.receiveShadow = true;

        Client.scene.add( groundMesh );
    }
    
    // SETUP TEMP MATERIAL AND GEO.
    const material = new THREE.MeshStandardMaterial( {
        color: 0xcccccc,
        roughness: 1.0,
        metalness: 1.0
    } );

    // Add the actual mesh geometry to the scene.
    torusKnotMeshGeometry = new THREE.Mesh( new THREE.TorusKnotGeometry( torusKnotGeometryData.radius, torusKnotGeometryData.tube, torusKnotGeometryData.tubularSegments, torusKnotGeometryData.radialSegments, torusKnotGeometryData.p, torusKnotGeometryData.q ), material );
    torusKnotMeshGeometry.castShadow = true;
    Client.scene.add( torusKnotMeshGeometry );

    {
        const skylight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        skylight.color.setHSL( 0.6, 1, 0.6 );
        skylight.groundColor.setHSL( 0.095, 1, 0.75 );
        skylight.position.set( 0, 50, 0 );
        Client.scene.add( skylight );
    }

    {
        // SETUP TEMP LIGHTS.
        directionalLight_01.name = "sun";
        directionalLight_01.position.set( 1, 1, 1 );
        directionalLight_01.castShadow = true;
        directionalLight_01.shadow.mapSize.width = 512;
        directionalLight_01.shadow.mapSize.height = 512;
        directionalLight_01.shadow.radius = 4;
        directionalLight_01.shadow.bias = - 0.0005;

        directionalLight_01.position.set( -1, 0.75, 1 );
        directionalLight_01.position.multiplyScalar( 25.0 );

        directionalLight_01.castShadow = true;
        directionalLight_01.shadow.mapSize = new THREE.Vector2( 1024, 1024 );

        const size = 300;
        directionalLight_01.shadow.camera = new THREE.OrthographicCamera( -size, size, size, -size, 0.1, 3500.0 );
        directionalLight_01.shadow.bias = -0.0001;
        Client.scene.add( directionalLight_01 );
    }
    
    {
        const backlight = new THREE.DirectionalLight( 0xFFFFFF, 1.5 );
        backlight.translateZ( -500.0 );
        Client.scene.add( backlight );
    }

    // CAMERA!
    const orbitCamera = new OrbitControls( Client.camera, Client.getClientCanvas( ) );
    Client.camera.position.z = 50.0;

    // SETUP THE BUNNY.
    const fbxLoader = new FBXLoader( );
    fbxLoader.load( 'content/meshes/misc/sm_stanford_bunny_02.fbx', function( obj ) {
        bunnyMeshGroup.group = obj;
        bunnyMeshGroup.group.traverse( function( child ) {
            if( ( child as THREE.Mesh ).isMesh ) {
                ( child as THREE.Mesh ).castShadow = true;
                ( child as THREE.Mesh ).material = material;
                    if( ( child as THREE.Mesh ).material) {
                        ( ( child as THREE.Mesh ).material as THREE.MeshBasicMaterial ).transparent = false;
                        child.visible = bunnyMeshGroup.visible;
                    }
                }
            } )
        bunnyMeshGroup.group.scale.set( 0.1, 0.1, 0.1 );
        Client.scene.add( obj );
    } );

    /**
     * Temp UI Setup.
     */
    Client.gui.title( 'JoyGL Client' );

    {
        // Torus Knot customization GUI parameters.
        let knotFolder = Client.gui.addFolder( 'knot' );
        knotFolder.add( torusKnotGeometryData, 'radius', 0.25, 15, 0.25 );
        knotFolder.add( torusKnotGeometryData, 'tube', 0.1, 10, 0.1 );
        knotFolder.add( torusKnotGeometryData, 'tubularSegments', 5, 250, 1 );
        knotFolder.add( torusKnotGeometryData, 'radialSegments', 5, 20, 1 );
        knotFolder.add( torusKnotGeometryData, 'p', 1, 20, 1 );
        knotFolder.add( torusKnotGeometryData, 'q', 1, 20, 1 );

        knotFolder.add( torusKnotGeometryData, 'visible' );

        knotFolder.onChange( () => {
            torusKnotMeshGeometry.geometry.dispose( );
            torusKnotMeshGeometry.geometry = new THREE.TorusKnotGeometry( torusKnotGeometryData.radius, torusKnotGeometryData.tube, torusKnotGeometryData.tubularSegments, torusKnotGeometryData.radialSegments, torusKnotGeometryData.p, torusKnotGeometryData.q );

            torusKnotMeshGeometry.visible = torusKnotGeometryData.visible;
        } );

        knotFolder.close( );
    }

    {
        // Bunny visibility GUI parameters.
        let bunnyFolder = Client.gui.addFolder( 'bunny' );
        bunnyFolder.add( bunnyMeshGroup, 'visible' );
        bunnyFolder.onChange( () => {
            bunnyMeshGroup.group.traverse( function( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.visible = bunnyMeshGroup.visible;
                }
            });
        } );

        bunnyFolder.close( );
    }

    {
        // Miscellaneous controls and functionality.
        let debugFolder = Client.gui.addFolder( 'debug' );
        debugFolder.add( Client.renderer, 'logRenderStats' );
    }
}

/**
 * Tick function.
 * @param deltaTime Time delta since the prior tick.
 */
function main( deltaTime : number ) : boolean {
//    console.log( deltaTime );
    return true;
}
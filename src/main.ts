import * as THREE from 'three'
import { WEBGL } from 'three/examples/jsm/WebGL'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { Color, Mesh, Vector3 } from 'three';

import Client from './client/client';
import LightDirectional from './renderer/lightDirectional';
import SceneGraph from './renderer/sceneGraph';

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
const directionalLight_01 : LightDirectional = new LightDirectional( );

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
    const sceneGraphRef : SceneGraph = Client.getSceneGraph( );

    {
        // Setup ground plane.
        const groundMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
        groundMaterial.color.setHSL( 0.095, 1, 0.75 );

        const groundGeo = new THREE.PlaneGeometry( 10000.0, 10000.0 );
        const groundMesh = new THREE.Mesh( groundGeo, groundMaterial );
        groundMesh.name = 'groundPlane';
        groundMesh.rotateX( Math.PI*1.5 );
        groundMesh.translateZ( -25.0 );
        groundMesh.receiveShadow = true;

        Client.getSceneGraph( ).add( groundMesh );
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
    torusKnotMeshGeometry.name = 'torusKnot';
    sceneGraphRef.add( torusKnotMeshGeometry );

    {
        // SETUP TEMP LIGHTS.
//      directionalLight_01.name = "sun";
        directionalLight_01.setColor( new Color( 1.0, 1.0, 1.0 ) );
        directionalLight_01.setIntensity( 1.0 );
        directionalLight_01.setLightFacing( new Vector3( -1.0, 0.75, 1.0 ) );

        sceneGraphRef.add( directionalLight_01.getLightInstance( ) );
        directionalLight_01.enableDebugVisual( true );
    }

    // CAMERA!
    const orbitCamera = new OrbitControls( Client.camera, Client.getClientCanvas( ) );
    Client.camera.position.z = 50.0;

    // SETUP THE BUNNY.
    const fbxLoader = new FBXLoader( );
    fbxLoader.load( 'content/meshes/misc/sm_stanford_bunny_01.fbx', function( obj ) {
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
        sceneGraphRef.add( obj );
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
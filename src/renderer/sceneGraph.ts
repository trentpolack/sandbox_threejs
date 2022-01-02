import * as THREE from 'three'
import { Quaternion } from 'three';

// Default parameters for directional lights.
const defaultSceneSettings = {
    // Debug Visualizer.
    debugVisualizerSize: 10.0
}

/**
 * SceneGraph class definition.
 *  Scene graph (geometry, lights, etc.); wraps and extends the informal ThreeJS scene implementation.
 */
 export default class SceneGraph {
    // Base scene member; Three's Scene implementation is, basically, just support for fog, background, and environment map over its core Object3D object hierarchy.
    private scene : THREE.Scene;
    private sceneOrigin : THREE.Object3D;

    // Debug visualizer. "Disabled" (null) by default.
    protected debugVisualizer : THREE.AxesHelper | null = null;

    /**
     * Scene class constructor; minimal shenanigans.
     */
    public constructor( ) {
        this.scene = new THREE.Scene( );
        
        // Setup the scene origin as an object and add it to the scene.
        this.sceneOrigin = new THREE.Object3D( );
        this.sceneOrigin.name = 'origin';
        this.sceneOrigin.position.set( 0.0, 0.0, 0.0 );
        this.sceneOrigin.setRotationFromEuler( new THREE.Euler( 0.0, 0.0, 0.0 ) );

        this.scene.add( this.sceneOrigin );
    }

    /**
     * Add an object to the scene graph. 
     *  NOTE (trent, 12/30): This is purely a wrapper over ThreeJS's setup right now; this will change once more of the framework is built out.
     * @param sceneObject Any viable scene object such as geometry, light, etc..
     */
    public add( sceneObject : any ) : void {
        this.scene.add( sceneObject );
    }
 
    /**
     * Remove an object from the scene graph. 
     *  NOTE (trent, 12/30): This is purely a wrapper over ThreeJS's setup right now; this will change once more of the framework is built out.
     * @param sceneObject Any viable scene object such as geometry, light, etc..
     */
    public remove( sceneObject : any ) : void {
        this.scene.remove( sceneObject );
    }

    /**
     * Accessor for the base scene graph object. Hopefully this method doesn't exist long (timestamp of this statement: 12/30/21 at 0.28).
     * @returns ThreeJS scene graph object.
     */
    public getScene( ) : THREE.Scene {
        return this.scene;
    }

    /**
     * Get the instanced object that represents the scene origin; this is more for target object reference (e.g. directional lights) rather than being treated as the root of the scene graph.
     * @returns Object instance of the scene origin.
     */
    public getSceneOrigin( ) : THREE.Object3D {
        return this.sceneOrigin;
    }

    /**
     * Enable/disable a directional scene axes debug visualizer.
     * @param enable Set the state of the debug visualizer.
     * @return Updated state of the debug visualizer.
     */
     public enableDebugVisual( enable : boolean ) : boolean {
        if( !enable ) {
            // Disable and, if necessary, dispose of the visualizer.
            if( this.debugVisualizer !== null ) {
                // Dispose of the visualizer.
                this.getScene( ).remove( this.debugVisualizer );

                this.debugVisualizer.dispose( );
                this.debugVisualizer = null;
            }

            return false;
        } else if( enable && ( this.debugVisualizer !== null ) ) {
            // Enabled and it already exists, so: job done.
            return true;
        }

        // Enable the debug visualizer by, you know, creating it.
        this.debugVisualizer = new THREE.AxesHelper( defaultSceneSettings.debugVisualizerSize );
        this.getScene( ).add( this.debugVisualizer );

        return true;
    }
}
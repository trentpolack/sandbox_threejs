import * as THREE from 'three'

/**
 * Scene class definition.
 *  Scene graph (geometry, lights, etc.); wraps and extends the informal ThreeJS scene implementation.
 *  TODO (trent, 12/30): Figure out whether this is actually necessary; if so, like, make it necessary and strongly-typed like it should be (e.g. establish SceneComponent equivalent or somne such). This is pending further direction on light setup.
 */
 export default class Scene {
    // Base scene member; Three's Scene implementation is, basically, just support for fog, background, and environment map over its core Object3D object hierarchy.
    private sceneGraph : THREE.Scene;

    /**
     * Scene class constructor; minimal shenanigans.
     */
    public constructor( ) {
        this.sceneGraph = new THREE.Scene( );
    }

    /**
     * Add an object to the scene graph. 
     *  NOTE (trent, 12/30): This is purely a wrapper over ThreeJS's setup right now; this will change once more of the framework is built out.
     * @param sceneObject Any viable scene object such as geometry, light, etc..
     */
    public add( sceneObject : any ): void {
        this.sceneGraph.add( sceneObject );
    }
 
    /**
     * Remove an object from the scene graph. 
     *  NOTE (trent, 12/30): This is purely a wrapper over ThreeJS's setup right now; this will change once more of the framework is built out.
     * @param sceneObject Any viable scene object such as geometry, light, etc..
     */
    public remove( sceneObject : any ): void {
        this.sceneGraph.remove( sceneObject );
    }

    /**
     * Accessor for the base scene graph object. Hopefully this method doesn't exist long (timestamp of this statement: 12/30/21 at 0.28).
     * @returns ThreeJS scene graph object.
     */
    public getSceneGraph( ) : THREE.Scene {
        return this.sceneGraph;
    }
}
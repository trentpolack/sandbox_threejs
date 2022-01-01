import * as THREE from 'three'
import { Vector3 } from 'three';
import LightBase from './lightBase';

// Default parameters for directional lights.
const defaultLightDirectionalSettings = {
    distance: 1000.0,           // Light distance from the target. NOTE (trent, 12/31/21): this shouldn't be necessary but ThreeJS's directional light is a "targeted light".
    direction: new THREE.Vector3( 0.0, -1.0, 0.0 ),

    // Shadow Parameters.
    castShadow: true,           // Ignored if the renderer is specified to not use shadow maps.
    shadowAutoUpdate: true,
    shadowMapSize: new THREE.Vector2( 1024, 1024 ),

    shadowBias: -0.0005,
    shadowNormalBias: 0.0,

    shadowBlurRadius: 4.0,      // This only applies to VSM shadowing; PCF Soft Shadows should modify (decrease) map size for increased blurring.
    shadowBlurSamples: 10,

    shadowFrustumSize: 300.0,   // TODO (trent, 12/31/21): Arbitrary value; reevaluate.
    shadowNearPlane: 0.1,
    shadowFarPlane: 3500.0,

    // Debug Visualizer.
    debugVisualizerSize: 10.0
}

/**
 * LightDirectional Class Definition.
 *  Directional light implementation that treats ThreeJS's directional light like a traditional directional light (position-independent, defined by orientation). 
 */
export default class LightDirectional extends LightBase {
    // Constants.
    private static readonly kLightDirectionalTypeName : string = "lightDirectional";

    // Directional light parameters.
    protected distance : number = defaultLightDirectionalSettings.distance;
    protected direction : THREE.Vector3 = defaultLightDirectionalSettings.direction;

    protected targetObject : THREE.Object3D | null = null;  // This should always be the origin.

    // Debug visualizer. "Disabled" (null) by default.
    protected debugVisualizer : THREE.DirectionalLightHelper | null = null;

    /**
     * Initialize and setup a directional light.
     * @returns The created directional ligh.
     */
    protected createLight( ) : THREE.Light {
        const light = new THREE.DirectionalLight( );

        // Set the name based on light type and current count.
        ++LightBase.lightTypeCounters.directionalAtmosphereLightCount;
        light.name = LightDirectional.kLightDirectionalTypeName.concat( '-', LightBase.lightTypeCounters.directionaLightCount.toString( ) );

        // Set default parameters on the ThreeJS light.
        light.castShadow = defaultLightDirectionalSettings.castShadow;
        light.shadow.autoUpdate = defaultLightDirectionalSettings.shadowAutoUpdate;

        light.shadow.mapSize = defaultLightDirectionalSettings.shadowMapSize;
        light.shadow.bias = defaultLightDirectionalSettings.shadowBias;
        light.shadow.normalBias = defaultLightDirectionalSettings.shadowNormalBias;

        light.shadow.radius = defaultLightDirectionalSettings.shadowBlurRadius;
        light.shadow.blurSamples = defaultLightDirectionalSettings.shadowBlurSamples;

        const d = defaultLightDirectionalSettings.shadowFrustumSize;
        light.shadow.camera = new THREE.OrthographicCamera( -d, d, d, -d, defaultLightDirectionalSettings.shadowNearPlane, defaultLightDirectionalSettings.shadowFarPlane );

        return light;
    }

    /**
     * Set the light facing based on the light direction (as euler orientation); this technically just sets the light position in respect to a target point (origin) as ThreeJS does not respect directional light rotation.
     * @param orientation Euler light orientation. 
     */
    public setLightFacing( direction : THREE.Vector3, targetObject? : THREE.Object3D ) : void {
        // ThreeJS treats directional light facing as position with respect to a target point.
        this.direction = direction.normalize( );
        this.targetObject = ( ( targetObject !== undefined ) && ( targetObject !== null ) ) ? targetObject : this.targetObject;

        // Update properties in the light instance.
        const light : THREE.DirectionalLight = this.getLightInstance( ) as THREE.DirectionalLight;
        light.position.copy( this.direction.clone( ).multiplyScalar( this.distance ) );
    }

    /**
     * Enable/disable a directional light debug visualizer.
     * @param enable Set the state of the debug visualizer.
     * @return Updated state of the debug visualizer.
     */
    public enableDebugVisual( enable : boolean ) : boolean {
        if( !enable ) {
            // Disable and, if necessary, dispose of the visualizer.
            if( this.debugVisualizer !== null ) {
                // Dispose of the visualizer.
                this.debugVisualizer.removeFromParent( );
                this.debugVisualizer.dispose( );
                this.debugVisualizer = null;
            }

            return false;
        } else if( enable && ( this.debugVisualizer !== null ) ) {
            // Enabled and it already exists, so: job done. Update just in case.
            this.debugVisualizer.update( );
            return true;
        }

        // Enable the debug visualizer by, you know, creating it.
        this.debugVisualizer = new THREE.DirectionalLightHelper( this.getLightInstance( ) as THREE.DirectionalLight , defaultLightDirectionalSettings.debugVisualizerSize );

        {
            // TODO (trent, 12/31/21): Fix the assumptions here and get any scene manipulation out of here.
            const parent = this.getLightInstance( ).parent;
            if( parent !== null ) {
                parent.add( this.debugVisualizer );
            }
        }

        return true;
    }
}
import * as THREE from 'three'
import LightBase from './lightBase';

// Default parameters for directional lights.
const defaultLightDirectionalSettings = {
    rotation: new THREE.Euler( 0.0, 0.0, 0.0 ),

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
 *  Directional light implementation; implem
 * 
 */
export default class LightDirectional extends LightBase {
    // Debug visualizer. "Disabled" (null) by default.
    protected debugVisualizer : THREE.DirectionalLightHelper | null = null;

    /**
     * Initialize and setup a directional light.
     * @returns The created directional ligh.
     */
    protected createLight( ) : THREE.Light {
        const light = new THREE.DirectionalLight( );

        // Set default parameters.
        light.setRotationFromEuler( defaultLightDirectionalSettings.rotation );

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
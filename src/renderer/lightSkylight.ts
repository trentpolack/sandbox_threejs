import * as THREE from 'three'
import LightBase from './lightBase';

// Default parameters for directional lights.
const defaultLightSkylightSettings = {
    // Colors.
    skyColor: new THREE.Color( 0.26, 0.52, 0.94 ),
    groundColor: new THREE.Color( 0.9, 0.7, 0.36 ),

    // Debug Visualizer.
    debugVisualizerSize: 10.0
}

/**
 * LightSkylight Class Definition.
 *  Wrapper over and extension on ThreeJS's hemisphere light; intended to be closely integrated/paired with skyAtmosphereRenderer. 
 */
export default class LightSkylight extends LightBase {
    // Constants.
    private static readonly kLightSkylightTypeName : string = "lightSkylight";

    // Debug visualizer. "Disabled" (null) by default.
    protected debugVisualizer : THREE.HemisphereLightHelper | null = null;

    /**
     * Initialize and setup a directional light.
     * @returns The created directional ligh.
     */
    protected createLight( ) : THREE.Light {
        const light = new THREE.HemisphereLight( );
        light.color = defaultLightSkylightSettings.skyColor;
        light.groundColor = defaultLightSkylightSettings.groundColor;

        // Set the name based on light type and current count.
        ++LightBase.lightTypeCounters.hemisphereLightCount;
        light.name = LightSkylight.kLightSkylightTypeName.concat( '-', LightBase.lightTypeCounters.hemisphereLightCount.toString( ) );

        return light;
    }

    /**
     * Disposal method (inherited).
     */
    public dispose( ) : void {
        if( this.debugVisualizer !== null ) {
            // Cleanup the debug visualizer if it exists.
            this.debugVisualizer.dispose( );
        }

        super.dispose( );
    }

    /**
     * Set the hemispheric light's sky color.
     * @param skyColor Desired sky color.
     */
    public setSkyColor( skyColor : THREE.Color ) : void {
        // ThreeJS just uses the base ::color member as its "sky color", so just pass this on.
        this.setColor( skyColor );
    }

    /**
     * Get the current sky color value.
     * @returns The sky color.
     */
    public getSkyColor( ) : THREE.Color {
        // Sky color is justu represented in ThreeJS by the base light ::color member; so:
        return( this.getColor( ) );
    }

    /**
     * Set the ground light color; preferably this is specified using RGB values in the [0,1] range.
     * @param color - Ground light color.
     */
    public setGroundColor( groundColor : THREE.Color ) : void {
        ( this.getLightInstance( ) as THREE.HemisphereLight ).groundColor = groundColor;
    }

    /**
     * Get the ground light color.
     * @returns Ground light color.
     */
    public getGroundColor( ) : THREE.Color {
        return( ( this.getLightInstance( ) as THREE.HemisphereLight ).groundColor );
    }

    /**
     * Enable/disable a skylight debug visualizer.
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
        this.debugVisualizer = new THREE.HemisphereLightHelper( this.getLightInstance( ) as THREE.HemisphereLight, defaultLightSkylightSettings.debugVisualizerSize );
        this.getLightInstance( ).add( this.debugVisualizer );

        return true;
    }
}
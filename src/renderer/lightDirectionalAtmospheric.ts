import * as THREE from 'three'
import LightBase from './lightBase';
import LightDirectional from './lightDirectional';

/**
 * LightDirectionalAtmospheric Class Definition.
 *  Extension of the base directional light class to fully support a light as an atmospheric light (more expensive).
 */
export default class LightDirectionalAtmospheric extends LightDirectional {
    private static readonly kLightDirectionalAtmosphericTypeName : string = "lightDirectionalAtmospheric";

    /**
     * Initialize and setup a directional light.
     * @returns The created directional ligh.
     */
    protected createLight( ) : THREE.Light {
        const light = super.createLight( );

        // Set the name based on light type and current count.
        ++LightBase.lightTypeCounters.directionalAtmosphereLightCount;
        light.name = LightDirectionalAtmospheric.kLightDirectionalAtmosphericTypeName.concat( '-', LightBase.lightTypeCounters.directionalAtmosphereLightCount.toString( ) );

        return light;
    }
}
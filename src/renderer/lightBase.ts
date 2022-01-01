import * as THREE from 'three'

/**
 * LightBase Abstract Class Definition.
 *  Abstract base class for all JGL lights. Intended to unify physical lighting use, parameters, and shadow settings.
 * 
 * Additional info:
 *  {@link https://www.torchspot.com/lumens-lux-and-candela/|https://www.torchspot.com/lumens-lux-and-candela/}
 *  {@link https://docs.unrealengine.com/4.26/en-US/BuildingWorlds/LightingAndShadows/PhysicalLightUnits/|https://docs.unrealengine.com/4.26/en-US/BuildingWorlds/LightingAndShadows/PhysicalLightUnits/}
 */
export default abstract class LightBase {
    // Base ThreeJS light object instance; only accessible through accessors in subclasses.
    private lightInstance : THREE.Light;

    // Static members.
    //  Automated naming.
    protected static lightTypeCounters = {
        pointLightCount: 0,
        spotLightCount: 0,
        rectLightCount: 0,
        directionaLightCount: 0,
    }

    /**
     * Constructor.
     *  This method must be invoked by subclasses.
     * @param color Light color. Preferably specified as RGB ([0,1]).
     * @param intensity Light intensity; unit depends on type of light. Generally, Directional Light (lux), Sky Lights (cd/m2), and Point/Spot/Rect Lights (lumens).
     */
    public constructor( color : THREE.Color = new THREE.Color( 1.0, 1.0, 1.0 ), intensity : number = 1.0 ) {
        // Initialize the ThreeJS light instance through the abstract ::createLight method.
        this.lightInstance = this.createLight( );

        this.setColor( color );
        this.setIntensity( intensity );
    }

    /**
     * Initialize and setup the base parameters of the ThreeJS light instance. This method also sets sane defaults for other parameters.
     * @returns The created light.
     */
    protected abstract createLight( ) : THREE.Light;

    /**
     * Accessor for the ThreeJS light object instance.
     * @returns The ThreeJS instance of the light.
     */
    public getLightInstance( ) : THREE.Light {
        return this.lightInstance;
    }
    
    /**
     * Set the light color; preferably this is specified using RGB values in the [0,1] range.
     * @param color - Light color.
     */
    public setColor( color : THREE.Color ) : void {
        this.getLightInstance( ).color = color;
    }

    /**
     * Get the light color.
     * @returns Light color.
     */
    public getColor( ) : THREE.Color {
        return( this.getLightInstance( ).color );
    }

    /**
     * Set the intensity of the light. Unit is conventionally based on light type:
     *  * Directional Light: Lux.
     *  * Sky Lights: Candela per meter squared (cd/m2).
     *  * Point/Spot/Rect Lights: Lumens.
     * @param intensity The intensity of the light; unit depends on light type.
     */
    public setIntensity( intensity : number ) : void {
        this.getLightInstance( ).intensity = intensity;
    }

    /**
     * Get light intensity in the unit based on light type (by convention).
     * @returns Light intensity value.
     */
    public getIntensity( ) : number {
        return( this.getLightInstance( ).intensity );
    }

    /**
     * Enable/disable a debug visualizer of the light.
     * @param enable Set the state of the debug visualizer.
     * @return Enable state of the debug visualizer.
     */
    public abstract enableDebugVisual( enable : boolean ) : boolean;
}
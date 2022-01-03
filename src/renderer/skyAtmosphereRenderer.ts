import * as THREE from 'three'
import LightSkylight from './lightSkylight';

/**
 * SkyDome Interface Definition.
 *  Core set of data that defines a skydome.
 */
interface SkyDome {
    uniforms? : any;

    geometry : THREE.SphereGeometry;
    material : THREE.ShaderMaterial;

    mesh : THREE.Mesh;
}

/**
 * SkyAtmosphereRenderer Class Definition.
 *  Sky and atmospherics renderer; can optionally have a specified directional light to manage as a primary scene light source (sun).
 *  This class directly creates and manages a skylight (hemisphere light).
 *  NOTE (trent, 12/31/21): Part of this renderer will be a basic sky dome which, ideally, is not necessary long-term (otherwise that would be an entity, not renderer functionality).
 *  TODO (trent, 1/1/22): Should probably convert this to be more of a component or something that ties a bit better into a dynamic TOD sim (the eventual goal).
 */
export default class SkyAtmosphereRenderer {
    private root : THREE.Object3D;

    // Hemisphere lighting data.
    protected skylight : LightSkylight;

    // Sky Dome data.
    protected skyDome : SkyDome;

    // Atmospherics data.
    public fogDensity : number = 0.0025;

    /**
     * Constructor.
     *  Setup the sky dome, hemisphere lighting, and fog data.
     *  TODO (trent, 1/1/22): Move away from heavy-handed scene management.
     */
    public constructor( ) {
        // Setup the skylight.
        this.skylight = new LightSkylight( );

        // Setup the sky dome.
        this.skyDome = this.setupSkyDome( );
        this.skyDome.uniforms[ 'topColor' ].value = this.skylight.getSkyColor( );
        this.skyDome.uniforms[ 'bottomColor' ].value = this.skylight.getGroundColor( );

        // Create a root scene object and group the light and dome into it.
        this.root = new THREE.Object3D( );
        this.root.add( this.skylight.getLightInstance( ) );
        this.root.add( this.skyDome.mesh );

        this.root.name = 'SkyAtmosphereRenderer';
    }

    /**
     * Access the sky dome mesh (setup at init-time).
     * @returns Instance of the sky dome mesh.
     */
    protected setupSkyDome( ) : SkyDome {        
        const vertexShader : string = require( '../shaders/lighting/skyDome.vs.glsl' );
        const fragmentShader : string = require( '../shaders/lighting/skyDome.fs.glsl' );

        const uniforms = {
            "topColor": { value: new THREE.Color( 0x0077ff ) },
            "bottomColor": { value: new THREE.Color( 0xffffff ) },
            "offset": { value: 75 },
            "exponent": { value: 0.6 }            
        }

        const geometry = new THREE.SphereGeometry( 1000, 32, 15 );
        const material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
        } );

        const mesh = new THREE.Mesh( geometry, material );
        mesh.name = 'skyAtmosphereRenderer-Dome';

        return( {
            uniforms: uniforms,

            geometry: geometry,
            material: material,

            mesh: mesh
        } );
    }

    /**
     * Disposal method.
     */
    public dispose( ) : void {
        this.skylight.dispose( );
        this.skyDome.geometry.dispose( );
        this.skyDome.material.dispose( );
    }

    /**
     * Accessor for the skylight.
     * @returns Instance of the skylight.
     */
    public getSkylight( ) : LightSkylight {
        return this.skylight;
    }

    /**
     * Access the sky dome mesh (setup at init-time).
     * @returns Instance of the sky dome mesh.
     */
    public getSkyDome( ) : THREE.Mesh {
        return this.skyDome.mesh;
    }

    /**
     * Get the root component that groups the sub-objects.
     *  TODO (trent, 1/2/22): This is terrible; proper conventions need to be established real bad.
     * @returns Root component for the object instances.
     */
    public getRoot( ) : THREE.Object3D {
        return this.root;
    }
}
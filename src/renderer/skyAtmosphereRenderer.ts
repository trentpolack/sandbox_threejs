import * as THREE from 'three'

interface SkyDome {
    mesh : THREE.Mesh;
    geometry : THREE.SphereGeometry;
    material : THREE.ShaderMaterial;
}

/**
 * SkyAtmosphereRenderer Class Definition.
 *  Sky and atmospherics renderer; can optionally have a specified directional light to manage as a primary scene light source (sun).
 *  This class directly creates and manages a skylight (hemisphere light).
 *  NOTE (trent, 12/31/21): Part of this renderer will be a basic sky dome which, ideally, is not necessary long-term (otherwise that would be an entity, not renderer functionality).
 */
export default class SkyAtmosphereRenderer {
    // Sky Dome data.
    protected skyDome : SkyDome;

    /**
     * Constructor.
     *  Setup the sky dome, hemisphere lighting, and fog data.
     *  TODO (trent, 1/1/22): Move away from heavy-handed scene management.
     */
    public constructor( ) {

        // Setup the sky dome.
        this.skyDome = this.setupSkyDome( );
    }

    /**
     * Access the sky dome mesh (setup at init-time).
     * @returns Instance of the sky dome mesh.
     */
    public setupSkyDome( ) : SkyDome {        
        const fragmentShader : string = require( '../shaders/lighting/skyDome.fs.glsl' );
        const vertexShader : string = require( '../shaders/lighting/skyDome.vs.glsl' );

        const skyDomeUniforms = {
            "topColor": { value: new THREE.Color( 0x0077ff ) },
            "bottomColor": { value: new THREE.Color( 0xffffff ) },
            "offset": { value: 33 },
            "exponent": { value: 0.6 }            
        }

//      skyDomeUniforms[ "topColor" ].value.copy( hemiLight.color );
//      scene.fog.color.copy( uniforms[ "bottomColor" ].value );

        const geometry = new THREE.SphereGeometry( 400, 32, 15 );
        const material = new THREE.ShaderMaterial( {
            uniforms: skyDomeUniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
        } );

        return( {
            geometry: geometry,
            material: material,

            mesh: new THREE.Mesh( geometry, material )
        } );
    }

    /**
     * Access the sky dome mesh (setup at init-time).
     * @returns Instance of the sky dome mesh.
     */
    public getSkyDome( ) : THREE.Mesh {
        return this.skyDome.mesh;
    }
}
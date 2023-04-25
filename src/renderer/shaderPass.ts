import * as THREE from 'three'
import { ShaderMaterial } from 'three';

/**
 * ShaderPass class definition.
 */
 export default class ShaderPass {
    // Postprocess.
    private textureID : string = "tDiffuse";

//	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    private postMaterial : ShaderMaterial | null = null;

/*
	this.material = new THREE.ShaderMaterial( {

		defines: shader.defines || {},
		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );
*/

	private renderToScreen : boolean = false;

	private enabled : boolean = true;
	private needsSwap : boolean = true;
	private clear : boolean = false;

    private quadMesh : THREE.Mesh | null = null;s

//	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
//	this.scene  = new THREE.Scene();

//	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
//	this.scene.add( this.quad );

    /**
     * Renderer constructor.
     *  TODO (trent, 12/27): Parameterize the renderer setup a bit better. Well. At all, really.
     *  NOTE (trent, 12/27): {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices|https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices}
     * @returns Initialization success/failure.
     */
    public constructor( enableAntialiasing : boolean = false, enableShadowing : boolean = true, enableAtmospherics : boolean = false ) {
        this.quadMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );

    }
 }
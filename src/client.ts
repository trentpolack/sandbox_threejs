import * as THREE from 'three'
import { WEBGL } from 'three/examples/jsm/WebGL'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'lil-gui'
//import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';

window.onload = () =>
{
	window.focus();

    console.assert( Client.checkPlatformRequirements( ), 'WebGL 2.0 not supported.' );

    Client.initCanvas( true );
    Client.initRenderer( );
    Client.initClient( );

    let lightFolder = Client.gui.addFolder( 'light' );
    lightFolder.addColor( Client.sceneLight, 'color' );

    Client.main( );
}

/**
 * Client Static Class Definition.
 *  Application entry point.
 */
export default class Client
{
    /**
     * TEMPORARY MEMBERS: BEGIN.
     */

    public static renderer : THREE.WebGLRenderer;
    public static scene : THREE.Scene;
    public static camera : THREE.PerspectiveCamera;

    public static sceneLight : THREE.DirectionalLight;
    public static meshGeometry : THREE.Mesh;

    /**
     * TEMPORARY MEMBERS: END.
     */

    // Core client data.
    public static canvas : HTMLElement;

    // Optional client elements.
    public static stats : Stats;
    public static gui : GUI;

	/**
     * Application entry point.
     */
	public static main( ) : void {
        Client.tickClient( );
        Client.tickRenderer( );

        // Queue up another frame.
        requestAnimationFrame( Client.main );
    }

	/**
	 * Check for platform capabilities (primarily WebGL 2.0 support).
     *  TODO (trent, 12/25): Actually build-in support for WebGL 1.0. This is totally something that can be encapsulated in a single TODO.
	 */
    public static checkPlatformRequirements( ) : boolean {
        // Check and log WebGL support.
        const isWebGLSupported = WEBGL.isWebGLAvailable( );
        const isWebGL2Supported = WEBGL.isWebGL2Available( );
        console.log( 'Sandbox Setup\nWebGL 1.0: %s\nWebGL 2.0: %s', isWebGLSupported, isWebGL2Supported );
    
        return isWebGL2Supported;
    }

    /**
	 * Canvas setup.
	 */
    public static initCanvas( enableStats : boolean = true ) : void {
        if( enableStats ) {
            // Setup the stats widget.
            this.stats = Stats( );
            document.body.appendChild( this.stats.dom );
        }

        this.gui = new GUI( );

        {
            // Setup the canvas.
            //  TODO (trent, 12/25): I'm 100% sure this is not the way to do this.
            let canvasTemp = document.querySelector< HTMLElement >( '#viewport' );
            console.assert( canvasTemp !== null, 'Viewport renderer element not found.' );

            this.canvas = canvasTemp!;
        }
    }

   /**
	 * Renderer setup.
	 */
    public static initClient( ) : void {    
        /**
         * TEMPORARY LOGIC.
         */
       
        // Setup some temp geometry.
        const geometry = new THREE.TorusKnotGeometry( 2.5, 0.1, 32, 16, 2, 3 );
        const material = new THREE.MeshStandardMaterial( {
            color: 0x00ff00,
            roughness: 1.0,
            metalness: 0.0
        } );

        // Add the actual mesh geometry to the scene.
        this.meshGeometry = new THREE.Mesh( geometry, material );
        this.scene.add( this.meshGeometry );

        // Add a rough light.
        this.sceneLight = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
        this.scene.add( this.sceneLight );
  
        this.camera.position.z = 7.0;
    }

    /**
	 * Renderer setup.
	 */
    public static initRenderer( ) : void {
        this.renderer = new THREE.WebGLRenderer( {
            antialias: true
        } );

        this.scene = new THREE.Scene( );
        this.camera = new THREE.PerspectiveCamera( 76.0, window.innerWidth/window.innerHeight, 0.1, 1000.0 );

        this.canvas.appendChild( this.renderer.domElement );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    
        window.addEventListener( 'resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        } );

        /**
         * TEMPORARY LOGIC.
         */
    }

    /**
     * Render tick method.
     *  TODO: Should be split into a separate class and PLEASE make an actual separate thread from the game thread if at all possible.
     */
     public static tickClient( ) : void {
        this.meshGeometry.rotation.x += 0.01;
        this.meshGeometry.rotation.y += 0.01;
    
        if( this.stats != null ) {
            // Update the stats component. If it exists.
            this.stats.update( );
        }
    }

    /**
     * Render tick method.
     *  TODO: Should be split into a separate class and PLEASE make an actual separate thread from the game thread if at all possible.
     */
     public static tickRenderer( ) : void {
        this.renderer.render( this.scene, this.camera );
    }
}
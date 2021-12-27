import * as THREE from 'three'
import { WEBGL } from 'three/examples/jsm/WebGL'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'lil-gui'

import Stats from 'three/examples/jsm/libs/stats.module'

/**
 * Function interface for anything that should be ticked as part of the primary client loop.
 *  NOTE: If a tick function ever returns false it is removed from the stack.
 */
export interface ITickFunction {
    ( deltaTime : number ) : boolean;
}

/**
 * Client Static Class Definition.
 *  Application entry point.
 */
export default class Client {
    /**
     * TEMPORARY MEMBERS: BEGIN.
     */

    public static renderer: THREE.WebGLRenderer;
    public static scene: THREE.Scene;
    public static camera: THREE.PerspectiveCamera;

    public static gui : GUI;

    /**
     * TEMPORARY MEMBERS: END.
     */

    // Core client data.
    public static canvas : HTMLElement;

    private static time : THREE.Clock;
    private static tickFunctionRegister : Array< ITickFunction >;

    // Optional client elements.
    public static stats : Stats;

    /**
     * Client initialization and setup.
     * @param enableStats Enable the stat page elements.
     */
    public static init( enableStats : boolean = true ) : void {
        console.assert( this.checkPlatformRequirements( ), 'WebGL 2.0 not supported.' );
        
        // High priority early inits.
        this.time = new THREE.Clock( true );

        if( enableStats ) {
            // Setup the stats widget.
            this.stats = Stats( );
            document.body.appendChild( this.stats.dom );
        }

        // TODO (trent, 12/26): Move this.
        this.gui = new GUI( );

        {
            // Setup the canvas.
            //  TODO (trent, 12/25): I'm 100% sure this is not the way to do this.
            let canvasTemp = document.querySelector< HTMLElement >( '#viewport' );
            console.assert( canvasTemp !== null, 'Viewport renderer element not found.' );

            this.canvas = canvasTemp!;
        }

        this.tickFunctionRegister = new Array< ITickFunction >( );

        // TODO (trent, 12/26): Move this.
        this.initRenderer( );
    }

    /**
     * Entry point for the client's main loop.
     */
    public static run( ) {
        this.tick( );
    }

    /**
     * Register a new tick function.
     */
    public static registerTickFunction( tickFunction : ITickFunction ) : void {
        // Treating this as a stack feels dirty.
        this.tickFunctionRegister.push( tickFunction );
    }

    /**
     * Application entry point.
     */
    private static tick( ) : void {
        const deltaTime : number = Client.time.getDelta( );

        if( Client.stats != null ) {
            // Update the stats component. If it exists.
            Client.stats.update( );
        }

        {
            // Iterate through register tick functions.
            let i = Client.tickFunctionRegister.length;
            while( i-- ) {
                if( !Client.tickFunctionRegister[i]( deltaTime ) ) {
                    // Tick method flagged for removal.
                    Client.tickFunctionRegister.splice( i, 1 );
                }
            }
        }

        // Tick the renderer last.
        Client.tickRenderer( );

        // Queue up another frame.
        requestAnimationFrame( Client.tick );
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
     * Renderer setup.
     */
    //  physicallyCorrectLights: false
    //  toneMapping: THREE.NoToneMapping
    //  toneMappingExposure: 1.0
    public static initRenderer( ) : void {
        this.renderer = new THREE.WebGLRenderer( {
            precision: undefined,       // options: "highp", "mediump" or "lowp".
            powerPreference: undefined, // options: "high-performance", "low-power" or "default".
            antialias: true
        } );
        this.renderer.setClearColor( 0x111111 );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;

        this.scene = new THREE.Scene( );
        this.camera = new THREE.PerspectiveCamera( 76.0, window.innerWidth / window.innerHeight, 0.1, 1000.0 );

        this.canvas.appendChild( this.renderer.domElement );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        window.addEventListener( 'resize', ( ) => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix( );
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
    public static tickRenderer( ) : void {
        this.renderer.render( this.scene, this.camera );
    }
}
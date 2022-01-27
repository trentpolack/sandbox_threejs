import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'

import Renderer from '../renderer/renderer'
import SceneGraph from '../renderer/sceneGraph'
import UI from '../ui/ui'
import GUI from 'lil-gui'

enum WebGLType {
    WebGL1 = 1,     // WebGL 1.0
    WebGL2 = 2      // WebGL 2.0
}

/**
 * Function interface for anything that should be ticked as part of the primary client loop.
 *  NOTE: If a tick function ever returns false it is removed from the stack.
 */
export interface ITickFunction {
    ( deltaTime : number ) : boolean;
}

/**
 * Client Class Definition (Singleton).
 *  Application entry point.
 */
export default class Client {
    /**
     * TEMPORARY MEMBERS: END.
     */

    // Core client data.
    private static canvas : HTMLElement;

    private static time : THREE.Clock;
    private static tickFunctionRegister : Array< ITickFunction >;

    // Rendering data.
    private static renderer : Renderer;

    // UI data.
    private static ui : UI;

    // Optional client elements.
    private static stats : Stats;

    /**
     * Client initialization and setup.
     * @param enableStats Enable the stat page elements.
     */
    public static init( enableStats : boolean = true, verboseLogs : boolean = false ) : void {
        console.assert( this.checkPlatformRequirements( ), 'WebGL 2.0 not supported.' );
        
        // High priority early inits.
        this.time = new THREE.Clock( true );

        if( enableStats ) {
            // Setup the stats widget.
            this.stats = Stats( );
            document.body.appendChild( this.stats.dom );
        }

        // TODO (trent, 12/26): Move this.
        this.ui = new UI( );

        {
            // Setup the canvas.
            let viewport = document.querySelector< HTMLElement >( '#viewport' );
            console.assert( viewport !== null, 'Viewport renderer element not found.' );

            this.canvas = viewport!;
        }

        {
            // Renderer setup.
            this.renderer = new Renderer( false, true, true );
            this.renderer.setSize( window.innerWidth, window.innerHeight );

            this.canvas.appendChild( this.renderer.getDomElement( ) );

            window.addEventListener( 'resize', ( ) => {
                Renderer.onWindowResize( this.renderer );
            } );
        }

        // Create the tick stack.
        this.tickFunctionRegister = new Array< ITickFunction >( );

        if( verboseLogs ) {
            // Log some additional information.
            //  TODO (trent, 12/28): Pretty up all output/capability information.
            console.log( this.renderer.getRenderer( ).capabilities );
        }
    }

    /**
     * Client destruction method; since this class is a singleton, this clears out members which need manual cleanup.
     */
    public static dispose( ) : void {
        // Cleaned up last-in/first-out style.
        this.renderer.dispose( );
    }

    /**
     * Check for platform capabilities (primarily WebGL 2.0 support).
     *  TODO (trent, 12/25): Actually build-in support for WebGL 1.0. This is totally something that can be encapsulated in a single TODO.
     */
     public static checkPlatformRequirements( ) : boolean {
        // Check and log WebGL support.
        const isWebGLSupported = this.isWebGLAvailable( );
        const isWebGL2Supported = this.isWebGL2Available( );
        console.log( 'JoyGL Client\n\tWebGL Support:\tWebGL 1.0 (%s)\tWebGL 2.0 (%s)', isWebGLSupported, isWebGL2Supported );

        return isWebGL2Supported;
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
        const deltaTime : number = this.time.getDelta( );

        if( this.stats != null ) {
            // Update the stats component. If it exists.
            this.stats.begin( );
        }

        {
            // Iterate through register tick functions.
            let i = this.tickFunctionRegister.length;
            while( i-- ) {
                if( !this.tickFunctionRegister[i]( deltaTime ) ) {
                    // Tick method flagged for removal.
                    this.tickFunctionRegister.splice( i, 1 );
                }
            }
        }

        // Render the current frame to the canvas.
        this.renderer.renderFrame( );

        if( this.stats !== null ) {
            // Update the stats component. If it exists.
            this.stats.end( );
        }
    
        // Queue up another frame.
        const tickBinding = this.tick.bind( Client );
        requestAnimationFrame( tickBinding );
    }

    /*****
     * Accessors to members that should otherwise probably not be easily-accessible.
     *  NOTE (trent, 8/1/22): Make that the case some day maybe?
     */

    /**
     * Get the client's DOM canvas.
     * @returns Client's DOM element which encapsulates the primary renderer.
     */
    public static getClientCanvas( ) : HTMLElement {
        return this.canvas;
    }

    /**
     * Get the renderer instance reference.
     * @returns Instance of the renderer.
     */
    public static getRenderer( ) : Renderer {
        return( this.renderer );
    }

    /**
     * Get the UI instance reference.
     * @returns Instance of the UI class.
     */
    public static getUI( ) : UI {
        return( this.ui );
    }

    /**
     * Get the lil-gui GUI instance directly.
     *  TODO (trent, 8/1/22): Stop-gap for when the UI class is more functional.
     * @returns Instance of the lil-gui GUI class.
     */
    public static getUIInstance( ) : GUI {
        return( this.ui.getUI( ) );
    }
    

    /**
     * Accessor for the renderer's scene graph instance (removing friction for the actual accessor from an app).
     * @returns Instance of client scene graph.
     */
    public static getSceneGraph( ) : SceneGraph {
        return( this.renderer.getSceneGraph( ) );
    }

    /**
     * Get whether the browser supports WebGL 1.0.
     * @returns Is WebGL 1.0 available.
     */
	static isWebGLAvailable( ) : boolean {
		try {

			const canvas = document.createElement( 'canvas' );
			return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );

		} catch ( e ) {

			return false;

		}
	}

    /**
     * Get whether the browser supports WebGL 1.0.
     * @returns Is WebGL 2.0 available.
     */
     static isWebGL2Available( ) : boolean {
		try {

			const canvas = document.createElement( 'canvas' );
			return !! ( window.WebGL2RenderingContext && canvas.getContext( 'webgl2' ) );

		} catch ( e ) {

			return false;

		}
	}

    /**
     * Get an error message that WebGL 1.0 isn't supported.
     * @returns Element with a formatted DOM element to print to the page.
     */
	static getWebGLErrorMessage( ) {
		return( this.getErrorMessage( WebGLType.WebGL1 ) );
	}

    /**
     * Get an error message that WebGL 2.0 isn't supported.
     * @returns Element with a formatted DOM element to print to the page.
     */
     static getWebGL2ErrorMessage( ) {
		return( this.getErrorMessage( WebGLType.WebGL2 ) );
	}

    /**
     * Get an error message for the lack of support for the queried WebGL version.
     * @param WebGLType type to query the error message for.
     * @returns DOM element with formatted error message.
     */
	static getErrorMessage( version : WebGLType ) {
		const names = {
			1: 'WebGL',
			2: 'WebGL 2'
		};

		const contexts = {
			1: window.WebGLRenderingContext,
			2: window.WebGL2RenderingContext
		};

		let message = 'Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>';

		const element = document.createElement( 'div' );
		element.id = 'webglmessage';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if( contexts[ version ] ) {
			message = message.replace( '$0', 'graphics card' );
		} else {
			message = message.replace( '$0', 'browser' );
		}

		message = message.replace( '$1', names[ version ] as string );

		element.innerHTML = message;
		return element;
	}
}
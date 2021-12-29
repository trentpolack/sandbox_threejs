import * as THREE from 'three'
import { Color, WebGLRenderer, WebGLRenderTarget } from 'three';
import { WEBGL } from 'three/examples/jsm/WebGL'

/**
 * Renderer class definition.
 *  WebGL renderer bassed on ThreeJS; defaults to WebGL 2.0. 
 *  NOTE (trent, 12/28): Largely a wrapper over Three's renderer for the time being. Treating three's renderer as private (despite the accessor) as much as possible. Because it sounds prudent.
 */
 export default class Renderer {
    private webglRenderer : THREE.WebGLRenderer;

    /**
     * Renderer initialiation method.
     *  TODO (trent, 12/27): Parameterize the renderer setup a bit better. Well. At all, really.
     *  NOTE (trent, 12/27): https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
     * @returns Initialization success/failure.
     */
    public constructor( enableAntialiasing : boolean = false, enableShadowMap : boolean = true ) {
        // Initialize Three WebGL renderer and necessary settings. Some enumerated here just so I don't forget they exist.
        this.webglRenderer = new THREE.WebGLRenderer( {
            precision: 'highp',             // options: "highp", "mediump" or "lowp".
            powerPreference: 'default',     // options: "high-performance", "low-power" or "default".
            alpha: false,                   // Three's default value.
            premultipliedAlpha: false,      // TODO (trent, 12/27): Revisit this setting.
            antialias: enableAntialiasing
        } );
        this.webglRenderer.shadowMap.enabled = enableShadowMap;
        this.webglRenderer.shadowMap.type = ( enableShadowMap ? THREE.VSMShadowMap : this.webglRenderer.shadowMap.type );

        // Miscellaneous other settings.
        this.webglRenderer.setClearColor( new Color( 0.1, 0.1, 0.1 ), 1.0 );

        this.webglRenderer.setPixelRatio( 1.0 );

    //  physicallyCorrectLights: false
    //  toneMapping: THREE.NoToneMapping
    //  toneMappingExposure: 1.0
    }

    /**
     * Renderer accessor.
     */
    public getRenderer( ) : THREE.WebGLRenderer {
        return( this.webglRenderer as THREE.WebGLRenderer );
    }

    /**
     * Accessor for the renderer's DOM element.
     */
    public getDomElement( ) : HTMLCanvasElement {
        return( this.getRenderer( ).domElement );
    }

    /**
     * Set (or resize) the output canvas and updates the viewport to fit the specified size.
     * @param width Width in pixels.
     * @param height Height in pixels.
     */
    public setSize( width : number, height : number ) {
        this.getRenderer( ).setSize( width, height, false );
    }

    /**
     * Get renderer output canvas size.
     * @returns Size of the output canvas.
     */
    public getSize( ) : THREE.Vector2 {
        let size : THREE.Vector2 = new THREE.Vector2( );
        this.getRenderer( ).getSize( size );

        return size;
    }

    /**
     * Set the renderer's device pixel ratio. Defaults to 1.0.
     * @param pixelRatio Device pixel ratio for properly supporting high-DPU canvases.
     */
    public setPixelRatio( pixelRatio : number ) {
        this.getRenderer( ).setPixelRatio( pixelRatio );
    }

    /**
     * Accessor for the renderer's device pixel ratio.
     * @returns Renderer's current pixel ratio.
     */
    public getPixelRatio( ) : number {
        return( this.getRenderer( ).getPixelRatio( ) );
    }

    /**
     * Set the specified target for the renderer. 
     * @param renderTarget The render target; if null then the renderer targets the canvas.
     */
    public setRenderTarget( renderTarget : WebGLRenderTarget | null ) {
        this.getRenderer( ).setRenderTarget( renderTarget );
    }

    /**
     * Get the renderer's current render target.
     * @returns Returns the current render target; if null is returned, the canvas is the active target.
     */
    public getRenderTarget( ) : WebGLRenderTarget | null {
        return( this.getRenderer( ).getRenderTarget( ) );
    }

    /**
     * Render an object using the specified camera.
     */
    public render( obj : THREE.Object3D, camera : THREE.Camera ) : void {
        this.getRenderer( ).render( obj, camera );
    }

    /**
     * Render the current scene.
     *  TODO (trent, 12/28): THREE.Scene should be replaced by a wrapped object as, otherwise, THREE.Scene can also be renderered through the generic render method.
     */
    public renderFrame( scene : THREE.Scene, camera : THREE.Camera ) : void {
        this.getRenderer( ).render( scene, camera );
    }

    /**
     * Method to gather and print render stats.
     *  TODO (trent, 12/28): Expand range of profiling/visualization of render stats... "Some day".
     */
    public logRenderStats( ) : void {
        const renderInfo : THREE.WebGLInfo = this.getRenderer( ).info;

        // Format output of high-level render stats.
        console.log( "Renderer Profile (Frame %d):\n Draw Calls: %d\n Meshes: %d\n Textures: %d\n Stats:\n\tPoints: %d\n\tLines: %d\n\tTriangles: %d", 
            renderInfo.render.frame,
            renderInfo.render.calls,
            renderInfo.memory.geometries,
            renderInfo.memory.textures,
            renderInfo.render.points,
            renderInfo.render.lines,
            renderInfo.render.triangles );
        
        // Log program object directly for further inspection.
        console.log( renderInfo.programs );
    }

    /**
     * Static Methods. 
     **/

    /**
     * Window resize event method.
     * @param renderer Renderer instance for resize handling.
     */
    public static onWindowResize( renderer : Renderer ) {
        renderer.getRenderer( ).setSize( window.innerWidth, window.innerHeight );
    }
 }
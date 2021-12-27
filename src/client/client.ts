import * as THREE from 'three'
import { WEBGL } from 'three/examples/jsm/WebGL'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'lil-gui'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import Stats from 'three/examples/jsm/libs/stats.module'

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
     public static update( ) : void {
         Client.tickClient( );
         Client.tickRenderer( );
 
         // Queue up another frame.
         requestAnimationFrame( Client.update );
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
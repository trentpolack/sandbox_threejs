/*
 * platform.js
 *  General platform functionality and helpers.     
*/

class Platform {
  // Private fields.
  #canvas;
  #pixelRatio = 1.0;

  // Constructor takes in the canvas and a desired pixel ratio.
  constructor( canvasDomElement, devicePixelRatio = 1.0 ) {
    // Keep a reference to the canvas element.
    this.canvas = canvasDomElement;

    this.pixelRatio = devicePixelRatio;
  }

  // Method for handling window resizing.
  onResize( rendererIn ) {
    const width = this.canvas.clientWidth*this.pixelRatio | 0;
    const height = this.canvas.clientHeight*this.pixelRatio | 0;

    const needResize = ( this.canvas.width !== width ) || ( this.canvas.height !== height );
    if( needResize ) {
      rendererIn.setSize( width, height, false );
    }

    return needResize;
  }

  // Get aspect ratio.
  getAspectRatio( ) {
    return( this.canvas.clientWidth/this.canvas.clientHeight );
  }
}

export { Platform };
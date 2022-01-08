/**
 * skySphere.fs.glsl
 *  Basic sky dome with an atmospherics-like color gradient.
*/

uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;
varying float vFogDepth;

void main( ) {
    float h = normalize( vWorldPosition + offset ).y;

    gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0 ), exponent ), 0.0 ) ), 1.0 );
}
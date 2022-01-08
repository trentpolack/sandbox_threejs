/**
 * skyDome.vs.glsl
 *  Basic sky dome with an atmospherics-like color gradient.
*/

varying vec3 vWorldPosition;
varying float vFogDepth;

void main( ) {
    vec4 worldPosition = modelMatrix*vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;

    vec4 mvPosition = modelViewMatrix*vec4( position, 1.0 );
    vFogDepth = -mvPosition.z;

    gl_Position = projectionMatrix*modelViewMatrix*vec4( position, 1.0 );
}
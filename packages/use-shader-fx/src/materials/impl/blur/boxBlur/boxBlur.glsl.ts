import { ShaderLib } from "../../../../shaders/ShaderLib";

export const vertex = `
	void main() {
		${ShaderLib.plane_vertex}
	}
`;

export const fragment = `
	uniform float blurSize;

	void main() {

		vec2 perDivSize = blurSize / resolution;
		
		vec4 outColor = vec4(
			texture2D(texture_src, vUv + perDivSize * vec2(-1.0, -1.0)) +
			texture2D(texture_src, vUv + perDivSize * vec2(0.0, -1.0)) + 
			texture2D(texture_src, vUv + perDivSize * vec2(1.0, -1.0)) + 
			texture2D(texture_src, vUv + perDivSize * vec2(-1.0, 0.0)) + 
			texture2D(texture_src, vUv + perDivSize * vec2(0.0,  0.0)) + 
			texture2D(texture_src, vUv + perDivSize * vec2(1.0,  0.0)) + 
			texture2D(texture_src, vUv + perDivSize * vec2(-1.0, 1.0)) + 
			texture2D(texture_src, vUv + perDivSize * vec2(0.0,  1.0)) + 
			texture2D(texture_src, vUv + perDivSize * vec2(1.0,  1.0))
			) / 9.0;

		gl_FragColor = outColor;

	}
`;
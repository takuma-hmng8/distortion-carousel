import * as THREE from "three";
import { HooksReturn } from "../../types";
import { UseCreateWobble3DProps } from "./useCreateWobble3D";
import { WobbleMaterialProps, WobbleMaterialConstructor } from "./useMaterial";
import { HooksProps3D } from "../types";
import { CustomParams } from "../../../utils/setUniforms";
export type Wobble3DParams = {
    /** default : `0.3` */
    wobbleStrength?: number;
    wobblePositionFrequency?: number;
    wobbleTimeFrequency?: number;
    /** The roughness is attenuated by the strength of the wobble. It has no meaning if the roughness is set to 0 or if the material does not have a roughness param, default : `0` */
    wobbleShine?: number;
    warpStrength?: number;
    warpPositionFrequency?: number;
    warpTimeFrequency?: number;
    /** Manipulate the vertices using the color channels of this texture. The strength of the wobble changes depending on the g channel of this texture, default : `false` */
    wobbleMap?: THREE.Texture | false;
    /** Strength of wobbleMap, default : `0.03` */
    wobbleMapStrength?: number;
    /** Strength of distorting the 'normal' by wobbleMap, default : `0.0` */
    wobbleMapDistortion?: number;
    color0?: THREE.Color;
    color1?: THREE.Color;
    color2?: THREE.Color;
    color3?: THREE.Color;
    /** Mixing ratio with the material's original output color, 0~1 , defaulat : `1` */
    colorMix?: number;
    /** Threshold of edge. 0 for edge disabled, default : `0` */
    edgeThreshold?: number;
    /** Color of edge. default : `0x000000` */
    edgeColor?: THREE.Color;
    /** valid only for MeshPhysicalMaterial , default : `0.1` */
    chromaticAberration?: number;
    /** valid only for MeshPhysicalMaterial , default : `0.1` */
    anisotropicBlur?: number;
    /** valid only for MeshPhysicalMaterial , default : `0.0` */
    distortion?: number;
    /** valid only for MeshPhysicalMaterial , default : `0.1` */
    distortionScale?: number;
    /** valid only for MeshPhysicalMaterial , default : `0.0` */
    temporalDistortion?: number;
    /** Refraction samples, default : `6`  */
    samples?: number;
    /** you can get into the rhythm ♪ , default : `false` */
    beat?: number | false;
};
export type Wobble3DObject = {
    scene: THREE.Scene;
    mesh: THREE.Mesh;
    depthMaterial: THREE.MeshDepthMaterial;
    renderTarget: THREE.WebGLRenderTarget;
    output: THREE.Texture;
};
export declare const WOBBLE3D_PARAMS: Wobble3DParams;
/**
 * @link https://github.com/FunTechInc/use-shader-fx
 */
export declare const useWobble3D: <T extends WobbleMaterialConstructor>({ size, dpr, samples, isSizeUpdate, camera, geometry, baseMaterial, materialParameters, uniforms, onBeforeCompile, depthOnBeforeCompile, }: HooksProps3D & UseCreateWobble3DProps & WobbleMaterialProps<T>) => HooksReturn<Wobble3DParams, Wobble3DObject, CustomParams>;

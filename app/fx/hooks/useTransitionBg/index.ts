import { useCallback, useMemo } from "react";
import * as THREE from "three";
import { useMesh } from "./useMesh";
import { useCamera } from "../utils/useCamera";
import { RootState } from "@react-three/fiber";
import { useSingleFBO } from "../utils/useSingleFBO";
import { setUniform } from "../utils/setUniforms";
import { HooksReturn } from "../types";
import { useParams } from "../utils/useParams";

export type TransitionBgParams = {
   texture0?: THREE.Texture;
   texture1?: THREE.Texture;
   imageResolution?: THREE.Vector2;
   noise?: THREE.Texture;
   noiseStrength?: number;
   progress?: number;
   dir?: THREE.Vector2;
};

export type TransitionBgObject = {
   scene: THREE.Scene;
   material: THREE.Material;
   camera: THREE.Camera;
   renderTarget: THREE.WebGLRenderTarget;
};

export const useTransitionBg = (): HooksReturn<
   TransitionBgParams,
   TransitionBgObject
> => {
   const scene = useMemo(() => new THREE.Scene(), []);
   const material = useMesh(scene);
   const camera = useCamera();
   const [renderTarget, updateRenderTarget] = useSingleFBO(scene, camera);

   const [params, setParams] = useParams<TransitionBgParams>({
      texture0: new THREE.Texture(),
      texture1: new THREE.Texture(),
      imageResolution: new THREE.Vector2(0, 0),
      noise: new THREE.Texture(),
      noiseStrength: 0.0,
      progress: 0.0,
      dir: new THREE.Vector2(0, 0),
   });

   const updateFx = useCallback(
      (props: RootState, updateParams: TransitionBgParams) => {
         const { gl } = props;

         setParams(updateParams);

         setUniform(material, "uTexture0", params.texture0!);
         setUniform(material, "uTexture1", params.texture1!);
         setUniform(material, "uImageResolution", params.imageResolution!);
         setUniform(material, "noise", params.noise!);
         setUniform(material, "noiseStrength", params.noiseStrength!);
         setUniform(material, "progress", params.progress!);
         setUniform(material, "dirX", params.dir!.x);
         setUniform(material, "dirY", params.dir!.y);

         const bufferTexture = updateRenderTarget(gl);

         return bufferTexture;
      },
      [updateRenderTarget, material, params, setParams]
   );
   return {
      updateFx,
      setParams,
      fxObject: {
         scene: scene,
         material: material,
         camera: camera,
         renderTarget: renderTarget,
      },
   };
};
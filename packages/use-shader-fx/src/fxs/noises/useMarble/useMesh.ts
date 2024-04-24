import { useMemo } from "react";
import * as THREE from "three";
import vertexShader from "./shader/main.vert";
import fragmentShader from "./shader/main.frag";
import { useAddObject } from "../../../utils/useAddObject";
import { MaterialProps } from "../../types";

export class MarbleMaterial extends THREE.ShaderMaterial {
   uniforms!: {
      u_time: { value: number };
      u_pattern: { value: number };
      u_complexity: { value: number };
      u_complexityAttenuation: { value: number };
      u_iterations: { value: number };
      u_timeStrength: { value: number };
      u_scale: { value: number };
   };
}

export const useMesh = ({
   scene,
   onBeforeCompile,
}: { scene: THREE.Scene } & MaterialProps) => {
   const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);
   const material = useMemo(() => {
      const mat = new THREE.ShaderMaterial({
         uniforms: {
            u_time: { value: 0 },
            u_pattern: { value: 0 },
            u_complexity: { value: 0 },
            u_complexityAttenuation: { value: 0 },
            u_iterations: { value: 0 },
            u_timeStrength: { value: 0 },
            u_scale: { value: 0 },
         },
         vertexShader: vertexShader,
         fragmentShader: fragmentShader,
      });
      if (onBeforeCompile) {
         mat.onBeforeCompile = onBeforeCompile;
      }
      return mat;
   }, [onBeforeCompile]) as MarbleMaterial;
   const mesh = useAddObject(scene, geometry, material, THREE.Mesh);
   return { material, mesh };
};

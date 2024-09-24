"use client";

import * as THREE from "three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, extend, useLoader } from "@react-three/fiber";
import {
   useNoise,
   useFluid,
   useCoverTexture,
} from "@/packages/use-shader-fx/src";
import { FxMaterial } from "./FxMaterial";
import {
   Environment,
   Float,
   OrbitControls,
   useVideoTexture,
} from "@react-three/drei";

/*===============================================
# webglooの設計
- useFxResolverでhookを切り替える
===============================================*/

extend({ FxMaterial });

// ここに渡すstateでレンダリングを切り替える
const useFxResolver = (test: boolean) => {
   if (test) {
      return useNoise;
   } else {
      return useFluid;
   }
};

// const hooks = [useNoise, useNoise];

export const Playground = () => {
   const { size } = useThree();

   const funkun_mov = useVideoTexture("/FT_Ch02-comp.mp4", {
      width: 1280,
      height: 720,
   });

   const [gear, smoke] = useLoader(THREE.TextureLoader, [
      "/stickers/webp/sticker17.webp",
      "smoke.png",
   ]);

   const noise = useNoise({
      size,
      dpr: 0.2,
      scale: 0.02,
      // mixSrc: gear,
      // mixSrcResolution: new THREE.Vector2(512, 512),
      // mixSrcUvFactor: 0.2,
      // mixSrcAlphaFactor: 0.1,
      // mixSrcColorFactor: 0.4,
      // mixDst: gear,
      // mixDstResolution: new THREE.Vector2(512, 512),
      // mixDstUvFactor: 0.3,
      // mixDstAlphaFactor: 1,
      // mixDstColorFactor: 0,
   });

   const fluid = useFluid({
      size,
      dpr: 0.1,
   });

   const cover = useCoverTexture({
      size,
      dpr: 2,
      src: funkun_mov,
      textureResolution: new THREE.Vector2(1280, 720),
      // mixSrc: fluid.texture,
      mixSrcResolution: new THREE.Vector2(512, 512),
      mixSrcUvFactor: 0.05,
      mixSrcAlphaFactor: 0.1,
      mixSrcColorFactor: 0.0,
   });

   useFrame((state) => {
      // cover.render(state);
      fluid.render(state);
      // noise.render(state);
      // material.color = new THREE.Color(
      //    Math.sin(state.clock.getElapsedTime()),
      //    1,
      //    1
      // );
      // mesh.current!.rotation.x += 0.01;
      // mesh.current!.rotation.y += 0.01;
   });

   return (
      <>
         <Float rotationIntensity={10} floatIntensity={10} speed={2}>
            <mesh>
               {/* <planeGeometry args={[2, 2]} />
            <fxMaterial u_fx={cover.texture} key={FxMaterial.key} /> */}
               <ambientLight intensity={0.2} />
               <directionalLight intensity={0.2} />
               <torusKnotGeometry args={[2, 1, 400, 32]} />
               <meshPhysicalMaterial
                  transparent
                  transmission={0.9}
                  thickness={0.1}
                  iridescence={0.1}
                  ior={1.5}
                  roughness={0.1}
                  metalness={0.1}
                  color={0xffffff}
               />
               {/* <Environment preset="city" /> */}
               <Environment frames={Infinity} background>
                  <mesh scale={2}>
                     <sphereGeometry args={[2, 64, 64]} />
                     <meshBasicMaterial
                        map={fluid.texture}
                        side={THREE.BackSide}
                     />
                  </mesh>
               </Environment>
               {/* <OrbitControls /> */}
            </mesh>
         </Float>
      </>
   );
};
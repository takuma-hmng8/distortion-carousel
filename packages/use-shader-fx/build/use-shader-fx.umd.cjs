(function(x,z){typeof exports=="object"&&typeof module<"u"?z(exports,require("three"),require("react")):typeof define=="function"&&define.amd?define(["exports","three","react"],z):(x=typeof globalThis<"u"?globalThis:x||self,z(x["use-shader-fx"]={},x.THREE,x.React))})(this,function(x,z,a){"use strict";function ce(t){const s=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(t){for(const o in t)if(o!=="default"){const u=Object.getOwnPropertyDescriptor(t,o);Object.defineProperty(s,o,u.get?u:{enumerable:!0,get:()=>t[o]})}}return s.default=t,Object.freeze(s)}const n=ce(z);var ve=`varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 1.0);
}`,fe=`precision highp float;

uniform sampler2D uMap;
uniform sampler2D uTexture;
uniform float uRadius;
uniform float uDissipation;
uniform vec2 uResolution;
uniform float uSmudge;
uniform float uAspect;
uniform vec2 uMouse;
uniform vec2 uPrevMouse;
uniform vec2 uVelocity;
uniform vec3 uColor;
uniform float uMotionBlur;
uniform int uMotionSample;

varying vec2 vUv;

float isOnLine(vec2 point, vec2 start, vec2 end, float width, float aspect) {
	
	point.x *= aspect;
	start.x *= aspect;
	end.x *= aspect;

	
	vec2 dir = normalize(end - start);
	
	
	vec2 n = vec2(dir.y, -dir.x);

	vec2 p0 = point - start;
	
	
	float distToLine = abs(dot(p0, n));
	float distAlongLine = dot(p0, dir);
	float totalLength = length(end - start);

	
	float distFromStart = length(point - start);
	float distFromEnd = length(point - end);
	
	bool withinLine = (distToLine < width && distAlongLine > 0.0 && distAlongLine < totalLength) || distFromStart < width || distFromEnd < width;

	return float(withinLine);
}

vec4 createSmudge(){
	vec2 offsets[9];
	offsets[0] = vec2(-1, -1); offsets[1] = vec2( 0, -1); offsets[2] = vec2( 1, -1);
	offsets[3] = vec2(-1,  0); offsets[4] = vec2( 0,  0); offsets[5] = vec2( 1,  0);
	offsets[6] = vec2(-1,  1); offsets[7] = vec2( 0,  1); offsets[8] = vec2( 1,  1);
	
	for(int i = 0; i < 9; i++) {
		offsets[i] = (offsets[i] * uSmudge) / uResolution;
	}	
	vec4 smudgedColor = vec4(0.0);
	for(int i = 0; i < 9; i++) {
		smudgedColor += texture2D(uMap, vUv + offsets[i]);
	}
	return smudgedColor / 9.0;
}

vec4 createMotionBlur(vec4 baseColor, vec2 velocity, float motion, int samples) {
	vec4 motionBlurredColor = baseColor;
	vec2 scaledVelocity = velocity * motion;
	for(int i = 1; i < samples; i++) {
		float t = float(i) / float(samples - 1);
		vec2 offset = t * scaledVelocity / uResolution;
		motionBlurredColor += texture2D(uMap, vUv + offset);
	}
	return motionBlurredColor / float(samples);
}

void main() {
	
	vec2 st = vUv * 2.0 - 1.0;
	
	
	vec2 velocity = uVelocity * uResolution;

	
	vec4 smudgedColor = createSmudge();
	
	
	vec4 motionBlurredColor = createMotionBlur(smudgedColor, velocity, uMotionBlur,uMotionSample);

	vec4 bufferColor = motionBlurredColor * uDissipation;

	
	float modifiedRadius = max(0.0,uRadius);

	
	vec3 color = uColor;

	
	vec4 textureColor = texture2D(uTexture, vUv);
	vec3 finalColor = mix(color, textureColor.rgb, textureColor.a);

	float onLine = isOnLine(st, uPrevMouse, uMouse, modifiedRadius, uAspect);
	bufferColor.rgb = mix(bufferColor.rgb, finalColor, onLine);
	
	gl_FragColor = vec4(bufferColor.rgb,1.0);
}`;const B=(t,s=!1)=>{const o=s?t.width*s:t.width,u=s?t.height*s:t.height;return a.useMemo(()=>new n.Vector2(o,u),[o,u])},P=(t,s,o)=>{const u=a.useMemo(()=>new n.Mesh(s,o),[s,o]);return a.useEffect(()=>{t.add(u)},[t,u]),a.useEffect(()=>()=>{t.remove(u),s.dispose(),o.dispose()},[t,s,o,u]),u},i=(t,s,o)=>{t.uniforms&&t.uniforms[s]&&o!==void 0&&o!==null?t.uniforms[s].value=o:console.error(`Uniform key "${String(s)}" does not exist in the material. or "${String(s)}" is null | undefined`)},de=({scene:t,size:s,dpr:o})=>{const u=a.useMemo(()=>new n.PlaneGeometry(2,2),[]),e=a.useMemo(()=>new n.ShaderMaterial({uniforms:{uMap:{value:new n.Texture},uResolution:{value:new n.Vector2(0,0)},uAspect:{value:0},uTexture:{value:new n.Texture},uRadius:{value:0},uSmudge:{value:0},uDissipation:{value:0},uMotionBlur:{value:0},uMotionSample:{value:0},uMouse:{value:new n.Vector2(0,0)},uPrevMouse:{value:new n.Vector2(0,0)},uVelocity:{value:new n.Vector2(0,0)},uColor:{value:new n.Color(16777215)}},vertexShader:ve,fragmentShader:fe}),[]),l=B(s,o);return a.useEffect(()=>{i(e,"uAspect",l.width/l.height),i(e,"uResolution",l.clone())},[l,e]),P(t,u,e),e},me=(t,s)=>{const o=s,u=t/s,[e,l]=[o*u/2,o/2];return{width:e,height:l,near:-1e3,far:1e3}},R=t=>{const s=B(t),{width:o,height:u,near:e,far:l}=me(s.x,s.y);return a.useMemo(()=>new n.OrthographicCamera(-o,o,u,-u,e,l),[o,u,e,l])},$=()=>{const t=a.useRef(new n.Vector2(0,0)),s=a.useRef(new n.Vector2(0,0)),o=a.useRef(0),u=a.useRef(new n.Vector2(0,0)),e=a.useRef(!1);return a.useCallback(d=>{const f=performance.now(),r=d.clone();o.current===0&&(o.current=f,t.current=r);const c=Math.max(1,f-o.current);o.current=f,u.current.copy(r).sub(t.current).divideScalar(c);const p=u.current.length()>0,m=e.current?t.current.clone():r;return!e.current&&p&&(e.current=!0),t.current=r,{currentPointer:r,prevPointer:m,diffPointer:s.current.subVectors(r,m),velocity:u.current,isVelocityUpdate:p}},[])},C=t=>{const s=e=>Object.values(e).some(l=>typeof l=="function"),o=a.useRef(s(t)?t:structuredClone(t)),u=a.useCallback(e=>{for(const l in e){const d=l;d in o.current&&e[d]!==void 0&&e[d]!==null?o.current[d]=e[d]:console.error(`"${String(d)}" does not exist in the params. or "${String(d)}" is null | undefined`)}},[]);return[o.current,u]},N={minFilter:n.LinearFilter,magFilter:n.LinearFilter,type:n.HalfFloatType,stencilBuffer:!1},j=({gl:t,fbo:s,scene:o,camera:u,onBeforeRender:e,onSwap:l})=>{t.setRenderTarget(s),e(),t.clear(),t.render(o,u),l&&l(),t.setRenderTarget(null),t.clear()},D=({scene:t,camera:s,size:o,dpr:u=!1,isSizeUpdate:e=!1,samples:l=0,depthBuffer:d=!1,depthTexture:f=!1})=>{const r=a.useRef(),c=B(o,u);r.current=a.useMemo(()=>{const m=new n.WebGLRenderTarget(c.x,c.y,{...N,samples:l,depthBuffer:d});return f&&(m.depthTexture=new n.DepthTexture(c.x,c.y,n.FloatType)),m},[]),a.useLayoutEffect(()=>{var m;e&&((m=r.current)==null||m.setSize(c.x,c.y))},[c,e]),a.useEffect(()=>{const m=r.current;return()=>{m==null||m.dispose()}},[]);const p=a.useCallback((m,v)=>{const g=r.current;return j({gl:m,fbo:g,scene:t,camera:s,onBeforeRender:()=>v&&v({read:g.texture})}),g.texture},[t,s]);return[r.current,p]},I=({scene:t,camera:s,size:o,dpr:u=!1,isSizeUpdate:e=!1,samples:l=0,depthBuffer:d=!1,depthTexture:f=!1})=>{const r=a.useRef({read:null,write:null,swap:function(){let v=this.read;this.read=this.write,this.write=v}}),c=B(o,u),p=a.useMemo(()=>{const v=new n.WebGLRenderTarget(c.x,c.y,{...N,samples:l,depthBuffer:d}),g=new n.WebGLRenderTarget(c.x,c.y,{...N,samples:l,depthBuffer:d});return f&&(v.depthTexture=new n.DepthTexture(c.x,c.y,n.FloatType),g.depthTexture=new n.DepthTexture(c.x,c.y,n.FloatType)),{read:v,write:g}},[]);r.current.read=p.read,r.current.write=p.write,a.useLayoutEffect(()=>{var v,g;e&&((v=r.current.read)==null||v.setSize(c.x,c.y),(g=r.current.write)==null||g.setSize(c.x,c.y))},[c,e]),a.useEffect(()=>{const v=r.current;return()=>{var g,h;(g=v.read)==null||g.dispose(),(h=v.write)==null||h.dispose()}},[]);const m=a.useCallback((v,g)=>{var y;const h=r.current;return j({gl:v,scene:t,camera:s,fbo:h.write,onBeforeRender:()=>g&&g({read:h.read.texture,write:h.write.texture}),onSwap:()=>h.swap()}),(y=h.read)==null?void 0:y.texture},[t,s]);return[{read:r.current.read,write:r.current.write},m]},H={texture:new n.Texture,radius:.05,smudge:0,dissipation:1,motionBlur:0,motionSample:5,color:new n.Color(16777215)},pe=({size:t,dpr:s,samples:o=0})=>{const u=a.useMemo(()=>new n.Scene,[]),e=de({scene:u,size:t,dpr:s}),l=R(t),d=$(),[f,r]=I({scene:u,camera:l,size:t,dpr:s,samples:o}),[c,p]=C(H);return[a.useCallback((v,g)=>{const{gl:h,pointer:y}=v;g&&p(g),i(e,"uTexture",c.texture),i(e,"uRadius",c.radius),i(e,"uSmudge",c.smudge),i(e,"uDissipation",c.dissipation),i(e,"uMotionBlur",c.motionBlur),i(e,"uMotionSample",c.motionSample),i(e,"uColor",c.color);const{currentPointer:M,prevPointer:w,velocity:T}=d(y);return i(e,"uMouse",M),i(e,"uPrevMouse",w),i(e,"uVelocity",T),r(h,({read:V})=>{i(e,"uMap",V)})},[e,d,r,c,p]),p,{scene:u,material:e,camera:l,renderTarget:f}]};var ge=`varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 1.0);
}`,xe=`precision highp float;

varying vec2 vUv;
uniform sampler2D uTexture;

uniform vec3 uColor0;
uniform vec3 uColor1;

void main() {
	vec2 uv = vUv;
	vec4 texColor = texture2D(uTexture, uv);
	float grayscale = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
	vec3 duotone = mix(uColor0, uColor1, grayscale);
	gl_FragColor = vec4(duotone, texColor.a);
}`;const he=t=>{const s=a.useMemo(()=>new n.PlaneGeometry(2,2),[]),o=a.useMemo(()=>new n.ShaderMaterial({uniforms:{uTexture:{value:new n.Texture},uColor0:{value:new n.Color(16777215)},uColor1:{value:new n.Color(0)}},vertexShader:ge,fragmentShader:xe}),[]);return P(t,s,o),o},Y={texture:new n.Texture,color0:new n.Color(16777215),color1:new n.Color(0)},ye=({size:t,dpr:s,samples:o=0})=>{const u=a.useMemo(()=>new n.Scene,[]),e=he(u),l=R(t),[d,f]=D({scene:u,camera:l,size:t,dpr:s,samples:o}),[r,c]=C(Y);return[a.useCallback((m,v)=>{const{gl:g}=m;return v&&c(v),i(e,"uTexture",r.texture),i(e,"uColor0",r.color0),i(e,"uColor1",r.color1),f(g)},[f,e,c,r]),c,{scene:u,material:e,camera:l,renderTarget:d}]};var Me=`varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 1.0);
}`,Te=`precision highp float;

varying vec2 vUv;
uniform sampler2D u_texture;
uniform sampler2D u_map;
uniform bool u_isAlphaMap;
uniform sampler2D u_alphaMap;
uniform float u_mapIntensity;
uniform vec3 u_brightness;
uniform float u_min;
uniform float u_max;
uniform vec3 u_dodgeColor;
uniform bool u_isDodgeColor;

void main() {
	vec2 uv = vUv;

	
	vec3 mapColor = texture2D(u_map, uv).rgb;
	vec3 normalizedMap = mapColor * 2.0 - 1.0;

	uv = uv * 2.0 - 1.0;
	uv *= mix(vec2(1.0), abs(normalizedMap.rg), u_mapIntensity);
	uv = (uv + 1.0) / 2.0;

	
	float brightness = dot(mapColor,u_brightness);
	vec4 textureMap = texture2D(u_texture, uv);
	float blendValue = smoothstep(u_min, u_max, brightness);

	
	vec3 dodgeColor = u_isDodgeColor ? u_dodgeColor : mapColor;
	vec3 outputColor = blendValue * dodgeColor + (1.0 - blendValue) * textureMap.rgb;
	
	
	float alpha = u_isAlphaMap ? texture2D(u_alphaMap, uv).a : textureMap.a;
	float mixValue = u_isAlphaMap ? alpha : 0.0;
	vec3 alphColor = mix(outputColor,mapColor,mixValue);

	gl_FragColor = vec4(alphColor, alpha);
}`;const Se=t=>{const s=a.useMemo(()=>new n.PlaneGeometry(2,2),[]),o=a.useMemo(()=>new n.ShaderMaterial({uniforms:{u_texture:{value:new n.Texture},u_map:{value:new n.Texture},u_alphaMap:{value:new n.Texture},u_isAlphaMap:{value:!1},u_mapIntensity:{value:0},u_brightness:{value:new n.Vector3},u_min:{value:0},u_max:{value:.9},u_dodgeColor:{value:new n.Color(16777215)},u_isDodgeColor:{value:!1}},vertexShader:Me,fragmentShader:Te}),[]);return P(t,s,o),o},q={texture:new n.Texture,map:new n.Texture,alphaMap:!1,mapIntensity:.3,brightness:new n.Vector3(.5,.5,.5),min:0,max:1,dodgeColor:!1},we=({size:t,dpr:s,samples:o=0})=>{const u=a.useMemo(()=>new n.Scene,[]),e=Se(u),l=R(t),[d,f]=D({scene:u,camera:l,size:t,dpr:s,samples:o}),[r,c]=C(q);return[a.useCallback((m,v)=>{const{gl:g}=m;return v&&c(v),i(e,"u_texture",r.texture),i(e,"u_map",r.map),i(e,"u_mapIntensity",r.mapIntensity),r.alphaMap?(i(e,"u_alphaMap",r.alphaMap),i(e,"u_isAlphaMap",!0)):i(e,"u_isAlphaMap",!1),i(e,"u_brightness",r.brightness),i(e,"u_min",r.min),i(e,"u_max",r.max),r.dodgeColor?(i(e,"u_dodgeColor",r.dodgeColor),i(e,"u_isDodgeColor",!0)):i(e,"u_isDodgeColor",!1),f(g)},[f,e,c,r]),c,{scene:u,material:e,camera:l,renderTarget:d}]};var A=`varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;

void main () {
	vUv = uv;
	vL = vUv - vec2(texelSize.x, 0.0);
	vR = vUv + vec2(texelSize.x, 0.0);
	vT = vUv + vec2(0.0, texelSize.y);
	vB = vUv - vec2(0.0, texelSize.y);
	gl_Position = vec4(position, 1.0);
}`,_e=`precision highp float;

void main(){
	gl_FragColor = vec4(0.0);
}`;const be=()=>a.useMemo(()=>new n.ShaderMaterial({vertexShader:A,fragmentShader:_e,depthTest:!1,depthWrite:!1}),[]);var Re=`precision highp float;

varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;

void main () {
	vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
	gl_FragColor = dissipation * texture2D(uSource, coord);
	gl_FragColor.a = 1.0;
}`;const Ce=()=>a.useMemo(()=>new n.ShaderMaterial({uniforms:{uVelocity:{value:new n.Texture},uSource:{value:new n.Texture},texelSize:{value:new n.Vector2},dt:{value:0},dissipation:{value:0}},vertexShader:A,fragmentShader:Re}),[]);var De=`precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;

vec2 sampleVelocity (in vec2 uv) {
	vec2 multiplier = vec2(1.0, 1.0);
	if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }
	if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }
	if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }
	if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }
	return multiplier * texture2D(uVelocity, uv).xy;
}

void main () {
	float L = sampleVelocity(vL).x;
	float R = sampleVelocity(vR).x;
	float T = sampleVelocity(vT).y;
	float B = sampleVelocity(vB).y;
	float div = 0.5 * (R - L + T - B);
	gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}`;const Pe=()=>a.useMemo(()=>new n.ShaderMaterial({uniforms:{uVelocity:{value:null},texelSize:{value:new n.Vector2}},vertexShader:A,fragmentShader:De}),[]);var Ve=`precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;

vec2 boundary (in vec2 uv) {
	uv = min(max(uv, 0.0), 1.0);
	return uv;
}

void main () {
	float L = texture2D(uPressure, boundary(vL)).x;
	float R = texture2D(uPressure, boundary(vR)).x;
	float T = texture2D(uPressure, boundary(vT)).x;
	float B = texture2D(uPressure, boundary(vB)).x;
	float C = texture2D(uPressure, vUv).x;
	float divergence = texture2D(uDivergence, vUv).x;
	float pressure = (L + R + B + T - divergence) * 0.25;
	gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`;const Ue=()=>a.useMemo(()=>new n.ShaderMaterial({uniforms:{uPressure:{value:null},uDivergence:{value:null},texelSize:{value:new n.Vector2}},vertexShader:A,fragmentShader:Ve}),[]);var Ae=`precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;

void main () {
	float L = texture2D(uVelocity, vL).y;
	float R = texture2D(uVelocity, vR).y;
	float T = texture2D(uVelocity, vT).x;
	float B = texture2D(uVelocity, vB).x;
	float vorticity = R - L - T + B;
	gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
}`;const Fe=()=>a.useMemo(()=>new n.ShaderMaterial({uniforms:{uVelocity:{value:null},texelSize:{value:new n.Vector2}},vertexShader:A,fragmentShader:Ae}),[]);var Be=`precision highp float;

varying vec2 vUv;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;

void main () {
	float T = texture2D(uCurl, vT).x;
	float B = texture2D(uCurl, vB).x;
	float C = texture2D(uCurl, vUv).x;
	vec2 force = vec2(abs(T) - abs(B), 0.0);
	force *= 1.0 / length(force + 0.00001) * curl * C;
	vec2 vel = texture2D(uVelocity, vUv).xy;
	gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
}`;const Oe=()=>a.useMemo(()=>new n.ShaderMaterial({uniforms:{uVelocity:{value:null},uCurl:{value:null},curl:{value:0},dt:{value:0},texelSize:{value:new n.Vector2}},vertexShader:A,fragmentShader:Be}),[]);var Ee=`precision highp float;

varying vec2 vUv;
uniform sampler2D uTexture;
uniform float value;

void main () {
	gl_FragColor = value * texture2D(uTexture, vUv);
}`;const Ie=()=>a.useMemo(()=>new n.ShaderMaterial({uniforms:{uTexture:{value:new n.Texture},value:{value:0},texelSize:{value:new n.Vector2}},vertexShader:A,fragmentShader:Ee}),[]);var Le=`precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;

vec2 boundary (in vec2 uv) {
	uv = min(max(uv, 0.0), 1.0);
	return uv;
}

void main () {
	float L = texture2D(uPressure, boundary(vL)).x;
	float R = texture2D(uPressure, boundary(vR)).x;
	float T = texture2D(uPressure, boundary(vT)).x;
	float B = texture2D(uPressure, boundary(vB)).x;
	vec2 velocity = texture2D(uVelocity, vUv).xy;
	velocity.xy -= vec2(R - L, T - B);
	gl_FragColor = vec4(velocity, 0.0, 1.0);
}`;const ze=()=>a.useMemo(()=>new n.ShaderMaterial({uniforms:{uPressure:{value:new n.Texture},uVelocity:{value:new n.Texture},texelSize:{value:new n.Vector2}},vertexShader:A,fragmentShader:Le}),[]);var $e=`precision highp float;

varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;

void main () {
	vec2 nPoint = (point + vec2(1.0)) * 0.5;
	vec2 p = vUv - nPoint.xy;
	p.x *= aspectRatio;
	vec3 splat = exp(-dot(p, p) / radius) * color;
	vec3 base = texture2D(uTarget, vUv).xyz;
	gl_FragColor = vec4(base + splat, 1.0);
}`;const Ne=()=>a.useMemo(()=>new n.ShaderMaterial({uniforms:{uTarget:{value:new n.Texture},aspectRatio:{value:0},color:{value:new n.Vector3},point:{value:new n.Vector2},radius:{value:0},texelSize:{value:new n.Vector2}},vertexShader:A,fragmentShader:$e}),[]),ke=({scene:t,size:s,dpr:o})=>{const u=a.useMemo(()=>new n.PlaneGeometry(2,2),[]),e=be(),l=e.clone(),d=Fe(),f=Oe(),r=Ce(),c=Pe(),p=Ue(),m=Ie(),v=ze(),g=Ne(),h=a.useMemo(()=>({vorticityMaterial:f,curlMaterial:d,advectionMaterial:r,divergenceMaterial:c,pressureMaterial:p,clearMaterial:m,gradientSubtractMaterial:v,splatMaterial:g}),[f,d,r,c,p,m,v,g]),y=B(s,o);a.useEffect(()=>{i(h.splatMaterial,"aspectRatio",y.x/y.y);for(const T of Object.values(h))i(T,"texelSize",new n.Vector2(1/y.x,1/y.y))},[y,h]);const M=P(t,u,e);a.useEffect(()=>{e.dispose(),M.material=l},[e,M,l]),a.useEffect(()=>()=>{for(const T of Object.values(h))T.dispose()},[h]);const w=a.useCallback(T=>{M.material=T,M.material.needsUpdate=!0},[M]);return[h,w]},K={density_dissipation:.98,velocity_dissipation:.99,velocity_acceleration:10,pressure_dissipation:.9,pressure_iterations:20,curl_strength:35,splat_radius:.002,fluid_color:new n.Vector3(1,1,1)},je=({size:t,dpr:s,samples:o=0})=>{const u=a.useMemo(()=>new n.Scene,[]),[e,l]=ke({scene:u,size:t,dpr:s}),d=R(t),f=$(),r=a.useMemo(()=>({scene:u,camera:d,size:t,samples:o}),[u,d,t,o]),[c,p]=I(r),[m,v]=I(r),[g,h]=D(r),[y,M]=D(r),[w,T]=I(r),F=a.useRef(0),V=a.useRef(new n.Vector2(0,0)),O=a.useRef(new n.Vector3(0,0,0)),[_,E]=C(K);return[a.useCallback((k,ue)=>{const{gl:U,pointer:Vn,clock:W,size:ie}=k;ue&&E(ue),F.current===0&&(F.current=W.getElapsedTime());const se=Math.min((W.getElapsedTime()-F.current)/3,.02);F.current=W.getElapsedTime();const X=p(U,({read:S})=>{l(e.advectionMaterial),i(e.advectionMaterial,"uVelocity",S),i(e.advectionMaterial,"uSource",S),i(e.advectionMaterial,"dt",se),i(e.advectionMaterial,"dissipation",_.velocity_dissipation)}),Un=v(U,({read:S})=>{l(e.advectionMaterial),i(e.advectionMaterial,"uVelocity",X),i(e.advectionMaterial,"uSource",S),i(e.advectionMaterial,"dissipation",_.density_dissipation)}),{currentPointer:An,diffPointer:Fn,isVelocityUpdate:Bn,velocity:On}=f(Vn);Bn&&(p(U,({read:S})=>{l(e.splatMaterial),i(e.splatMaterial,"uTarget",S),i(e.splatMaterial,"point",An);const L=Fn.multiply(V.current.set(ie.width,ie.height).multiplyScalar(_.velocity_acceleration));i(e.splatMaterial,"color",O.current.set(L.x,L.y,1)),i(e.splatMaterial,"radius",_.splat_radius)}),v(U,({read:S})=>{l(e.splatMaterial),i(e.splatMaterial,"uTarget",S);const L=typeof _.fluid_color=="function"?_.fluid_color(On):_.fluid_color;i(e.splatMaterial,"color",L)}));const En=h(U,()=>{l(e.curlMaterial),i(e.curlMaterial,"uVelocity",X)});p(U,({read:S})=>{l(e.vorticityMaterial),i(e.vorticityMaterial,"uVelocity",S),i(e.vorticityMaterial,"uCurl",En),i(e.vorticityMaterial,"curl",_.curl_strength),i(e.vorticityMaterial,"dt",se)});const In=M(U,()=>{l(e.divergenceMaterial),i(e.divergenceMaterial,"uVelocity",X)});T(U,({read:S})=>{l(e.clearMaterial),i(e.clearMaterial,"uTexture",S),i(e.clearMaterial,"value",_.pressure_dissipation)}),l(e.pressureMaterial),i(e.pressureMaterial,"uDivergence",In);let le;for(let S=0;S<_.pressure_iterations;S++)le=T(U,({read:L})=>{i(e.pressureMaterial,"uPressure",L)});return p(U,({read:S})=>{l(e.gradientSubtractMaterial),i(e.gradientSubtractMaterial,"uPressure",le),i(e.gradientSubtractMaterial,"uVelocity",S)}),Un},[e,l,h,v,M,f,T,p,E,_]),E,{scene:u,materials:e,camera:d,renderTarget:{velocity:c,density:m,curl:g,divergence:y,pressure:w}}]},Ge=({scale:t,max:s,texture:o,scene:u})=>{const e=a.useRef([]),l=a.useMemo(()=>new n.PlaneGeometry(t,t),[t]),d=a.useMemo(()=>new n.MeshBasicMaterial({map:o??null,transparent:!0,blending:n.AdditiveBlending,depthTest:!1,depthWrite:!1}),[o]);return a.useEffect(()=>{for(let f=0;f<s;f++){const r=new n.Mesh(l.clone(),d.clone());r.rotateZ(2*Math.PI*Math.random()),r.visible=!1,u.add(r),e.current.push(r)}},[l,d,u,s]),a.useEffect(()=>()=>{e.current.forEach(f=>{f.geometry.dispose(),Array.isArray(f.material)?f.material.forEach(r=>r.dispose()):f.material.dispose(),u.remove(f)}),e.current=[]},[u]),e.current},Z={frequency:.01,rotation:.05,fadeout_speed:.9,scale:.3,alpha:.6},We=({texture:t,scale:s=64,max:o=100,size:u,dpr:e,samples:l=0})=>{const d=a.useMemo(()=>new n.Scene,[]),f=Ge({scale:s,max:o,texture:t,scene:d}),r=R(u),c=$(),[p,m]=D({scene:d,camera:r,size:u,dpr:e,samples:l}),[v,g]=C(Z),h=a.useRef(0);return[a.useCallback((M,w)=>{const{gl:T,pointer:F,size:V}=M;w&&g(w);const{currentPointer:O,diffPointer:_}=c(F);if(v.frequency<_.length()){const b=f[h.current];b.visible=!0,b.position.set(O.x*(V.width/2),O.y*(V.height/2),0),b.scale.x=b.scale.y=0,b.material.opacity=v.alpha,h.current=(h.current+1)%o}return f.forEach(b=>{if(b.visible){const k=b.material;b.rotation.z+=v.rotation,k.opacity*=v.fadeout_speed,b.scale.x=v.fadeout_speed*b.scale.x+v.scale,b.scale.y=b.scale.x,k.opacity<.002&&(b.visible=!1)}}),m(T)},[m,f,c,o,v,g]),g,{scene:d,camera:r,meshArr:f,renderTarget:p}]};var Xe=`varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 1.0);
}`,He=`precision highp float;

varying vec2 vUv;
uniform vec2 uResolution;
uniform vec2 uTextureResolution;
uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uMap;
uniform float mapIntensity;
uniform float edgeIntensity;
uniform float progress;
uniform float dirX;
uniform float dirY;
uniform vec2 epicenter;
uniform float padding;

bool isInPaddingArea(vec2 uv) {
   return uv.x < padding || uv.x > 1.0 - padding || uv.y < padding || uv.y > 1.0 - padding;
}

void main() {
	float screenAspect = uResolution.x / uResolution.y;
	float textureAspect = uTextureResolution.x / uTextureResolution.y;
	vec2 aspectRatio = vec2(
		min(screenAspect / textureAspect, 1.0),
		min(textureAspect / screenAspect, 1.0)
	);
	vec2 uv = vUv * aspectRatio + (1.0 - aspectRatio) * .5;

	
	vec2 map = texture2D(uMap, uv).rg;
	vec2 normalizedMap = map * 2.0 - 1.0;

	
	uv = uv * 2.0 - 1.0;
	uv *= map * distance(epicenter, uv) * edgeIntensity + 1.0;
	uv = (uv + 1.0) / 2.0;

	
	if (isInPaddingArea(uv)) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
		return;
	}
	vec2 paddedUV = uv * (1.0 - 2.0 * padding * -1.) + padding * -1.;

	
	vec2 centeredUV = paddedUV - vec2(0.5);

	
	centeredUV *= normalizedMap * map * mapIntensity + 1.0;

	
	float xOffsetTexture0 = 0.5 - dirX * progress;
	float yOffsetTexture0 = 0.5 - dirY * progress;
	vec2 samplePosTexture0 = vec2(xOffsetTexture0, yOffsetTexture0) + centeredUV;

	
	float xOffsetTexture1 = 0.5 + dirX * (1.0 - progress);
	float yOffsetTexture1 = 0.5 + dirY * (1.0 - progress);
	vec2 samplePosTexture1 = vec2(xOffsetTexture1, yOffsetTexture1) + centeredUV;

	vec4 color0 = texture2D(uTexture0, samplePosTexture0);
	vec4 color1 = texture2D(uTexture1, samplePosTexture1);

	gl_FragColor = mix(color0, color1, progress);

}`;const Ye=({scene:t,size:s,dpr:o})=>{const u=a.useMemo(()=>new n.PlaneGeometry(2,2),[]),e=a.useMemo(()=>new n.ShaderMaterial({uniforms:{uResolution:{value:new n.Vector2},uTextureResolution:{value:new n.Vector2},uTexture0:{value:new n.Texture},uTexture1:{value:new n.Texture},padding:{value:0},uMap:{value:new n.Texture},edgeIntensity:{value:0},mapIntensity:{value:0},epicenter:{value:new n.Vector2(0,0)},progress:{value:0},dirX:{value:0},dirY:{value:0}},vertexShader:Xe,fragmentShader:He}),[]),l=B(s,o);return a.useEffect(()=>{e.uniforms.uResolution.value=l.clone()},[l,e]),P(t,u,e),e},J={texture0:new n.Texture,texture1:new n.Texture,textureResolution:new n.Vector2(0,0),padding:0,map:new n.Texture,mapIntensity:0,edgeIntensity:0,epicenter:new n.Vector2(0,0),progress:0,dir:new n.Vector2(0,0)},qe=({size:t,dpr:s,samples:o=0})=>{const u=a.useMemo(()=>new n.Scene,[]),e=Ye({scene:u,size:t,dpr:s}),l=R(t),[d,f]=D({scene:u,camera:l,dpr:s,size:t,samples:o,isSizeUpdate:!0}),[r,c]=C(J);return[a.useCallback((m,v)=>{const{gl:g}=m;return v&&c(v),i(e,"uTexture0",r.texture0),i(e,"uTexture1",r.texture1),i(e,"uTextureResolution",r.textureResolution),i(e,"padding",r.padding),i(e,"uMap",r.map),i(e,"mapIntensity",r.mapIntensity),i(e,"edgeIntensity",r.edgeIntensity),i(e,"epicenter",r.epicenter),i(e,"progress",r.progress),i(e,"dirX",r.dir.x),i(e,"dirY",r.dir.y),f(g)},[f,e,r,c]),c,{scene:u,material:e,camera:l,renderTarget:d}]};var Ke=`varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 1.0);
}`,Ze=`precision highp float;
precision highp int;

varying vec2 vUv;
uniform float uTime;
uniform float timeStrength;
uniform int noiseOctaves;
uniform int fbmOctaves;
uniform int warpOctaves;
uniform vec2 warpDirection;
uniform float warpStrength;
uniform float scale;

const float per  = 0.5;
const float PI   = 3.14159265359;

float rnd(vec2 n) {
	float a = 0.129898;
	float b = 0.78233;
	float c = 437.585453;
	float dt= dot(n ,vec2(a, b));
	float sn= mod(dt, PI);
	return fract(sin(sn) * c);
}

float interpolate(float a, float b, float x){
    float f = (1.0 - cos(x * PI)) * 0.5;
    return a * (1.0 - f) + b * f;
}

float irnd(vec2 p){
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec4 v = vec4(rnd(vec2(i.x,i.y)),rnd(vec2(i.x + 1.0,i.y)),rnd(vec2(i.x,i.y + 1.0)),rnd(vec2(i.x + 1.0, i.y + 1.0)));
	return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}

float noise(vec2 p, float time){
	float t = 0.0;
	for(int i = 0; i < noiseOctaves; i++){
		float freq = pow(2.0, float(i));
		float amp  = pow(per, float(noiseOctaves - i));
		t += irnd(vec2(p.y / freq + time, p.x / freq + time)) * amp;
	}
	return t;
}

float fbm(vec2 x, float time) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
	mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
	float sign = 1.0;
	for (int i = 0; i < fbmOctaves; ++i) {
		v += a * noise(x, time * sign);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
		sign *= -1.0;
	}
	return v;
}

float warp(vec2 x, float g,float time){
	float val = 0.0;
	for (int i = 0; i < warpOctaves; i++){
		val = fbm(x + g * vec2(cos(warpDirection.x * val), sin(warpDirection.y * val)), time);
	}
	return val;
}

void main() {
	float noise = warp(gl_FragCoord.xy * scale ,warpStrength,uTime * timeStrength);
	gl_FragColor = vec4(vec3(noise),1.0);
}`;const Je=t=>{const s=a.useMemo(()=>new n.PlaneGeometry(2,2),[]),o=a.useMemo(()=>new n.ShaderMaterial({uniforms:{uTime:{value:0},scale:{value:0},timeStrength:{value:0},noiseOctaves:{value:0},fbmOctaves:{value:0},warpOctaves:{value:0},warpDirection:{value:new n.Vector2},warpStrength:{value:0}},vertexShader:Ke,fragmentShader:Ze}),[]);return P(t,s,o),o},Q={scale:.004,timeStrength:.3,noiseOctaves:2,fbmOctaves:2,warpOctaves:2,warpDirection:new n.Vector2(2,2),warpStrength:8},Qe=({size:t,dpr:s,samples:o=0})=>{const u=a.useMemo(()=>new n.Scene,[]),e=Je(u),l=R(t),[d,f]=D({scene:u,camera:l,size:t,dpr:s,samples:o}),[r,c]=C(Q);return[a.useCallback((m,v)=>{const{gl:g,clock:h}=m;return v&&c(v),i(e,"scale",r.scale),i(e,"timeStrength",r.timeStrength),i(e,"noiseOctaves",r.noiseOctaves),i(e,"fbmOctaves",r.fbmOctaves),i(e,"warpOctaves",r.warpOctaves),i(e,"warpDirection",r.warpDirection),i(e,"warpStrength",r.warpStrength),i(e,"uTime",h.getElapsedTime()),f(g)},[f,e,c,r]),c,{scene:u,material:e,camera:l,renderTarget:d}]},G=process.env.NODE_ENV==="development",en=t=>{var e,l,d;const s=(e=t.dom)==null?void 0:e.length,o=(l=t.texture)==null?void 0:l.length,u=(d=t.resolution)==null?void 0:d.length;return!s||!o||!u?(G&&console.warn("No dom or texture or resolution is set"),!1):s!==o||s!==u?(G&&console.warn("not Match dom , texture and resolution length"),!1):!0};var nn=`varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}`,tn=`precision highp float;

varying vec2 vUv;
uniform sampler2D u_texture;
uniform vec2 u_textureResolution;
uniform vec2 u_resolution;
uniform float u_borderRadius;

void main() {
	
	float screenAspect = u_resolution.x / u_resolution.y;
	float textureAspect = u_textureResolution.x / u_textureResolution.y;
	vec2 ratio = vec2(
		min(screenAspect / textureAspect, 1.0),
		min(textureAspect / screenAspect, 1.0)
	);

	vec2 adjustedUv = vUv * ratio + (1.0 - ratio) * 0.5;
	vec3 textureColor = texture2D(u_texture, adjustedUv).rgb;
	float textureAlpha = texture2D(u_texture, adjustedUv).a;

	
	float maxSide = max(u_resolution.x, u_resolution.y);
	float minSide = min(u_resolution.x, u_resolution.y);
	vec2 aspect = u_resolution / maxSide;
	vec2 alphaUv = vUv - 0.5;

	float borderRadius = min(u_borderRadius, minSide * 0.5);
	vec2 offset = vec2(borderRadius) / u_resolution;
	vec2 alphaXY = smoothstep(vec2(0.5 - offset), vec2(0.5 - offset - 0.001), abs(alphaUv));
	float alpha = min(1.0, alphaXY.x + alphaXY.y);

	vec2 alphaUv2 = abs(vUv - 0.5);
	float radius = borderRadius / maxSide;
	alphaUv2 = (alphaUv2 - 0.5) * aspect + radius;
	float roundAlpha = smoothstep(radius + 0.001, radius, length(alphaUv2));

	alpha = min(1.0, alpha + roundAlpha);

	
	alpha *= textureAlpha;

	gl_FragColor = vec4(textureColor, alpha);
}`;const rn=({params:t,size:s,scene:o})=>{o.children.length>0&&(o.children.forEach(u=>{u instanceof n.Mesh&&(u.geometry.dispose(),u.material.dispose())}),o.remove(...o.children)),t.texture.forEach((u,e)=>{const l=new n.Mesh(new n.PlaneGeometry(1,1),new n.ShaderMaterial({vertexShader:nn,fragmentShader:tn,transparent:!0,uniforms:{u_texture:{value:u},u_textureResolution:{value:new n.Vector2(0,0)},u_resolution:{value:new n.Vector2(0,0)},u_borderRadius:{value:t.boderRadius[e]?t.boderRadius[e]:0}}}));o.add(l)})},on=()=>{const t=a.useRef([]),s=a.useRef([]);return a.useCallback(({isIntersectingRef:u,isIntersectingOnceRef:e,params:l})=>{t.current.length>0&&t.current.forEach((f,r)=>{f.unobserve(s.current[r])}),s.current=[],t.current=[];const d=new Array(l.dom.length).fill(!1);u.current=[...d],e.current=[...d],l.dom.forEach((f,r)=>{const c=m=>{m.forEach(v=>{l.onIntersect[r]&&l.onIntersect[r](v),u.current[r]=v.isIntersecting})},p=new IntersectionObserver(c,{rootMargin:"0px",threshold:0});p.observe(f),t.current.push(p),s.current.push(f)})},[])},an=()=>{const t=a.useRef([]),s=a.useCallback(({params:o,size:u,resolutionRef:e,scene:l,isIntersectingRef:d})=>{l.children.length!==t.current.length&&(t.current=new Array(l.children.length)),l.children.forEach((f,r)=>{const c=o.dom[r];if(!c){G&&console.warn("DOM is null.");return}const p=c.getBoundingClientRect();if(t.current[r]=p,f.scale.set(p.width,p.height,1),f.position.set(p.left+p.width*.5-u.width*.5,-p.top-p.height*.5+u.height*.5,0),d.current[r]&&(o.rotation[r]&&f.rotation.copy(o.rotation[r]),f instanceof n.Mesh)){const m=f.material;i(m,"u_texture",o.texture[r]),i(m,"u_textureResolution",o.resolution[r]),i(m,"u_resolution",e.current.set(p.width,p.height)),i(m,"u_borderRadius",o.boderRadius[r]?o.boderRadius[r]:0)}})},[]);return[t.current,s]},un=()=>{const t=a.useRef([]),s=a.useRef([]),o=a.useCallback((u,e=!1)=>{t.current.forEach((d,f)=>{d&&(s.current[f]=!0)});const l=e?[...s.current]:[...t.current];return u<0?l:l[u]},[]);return{isIntersectingRef:t,isIntersectingOnceRef:s,isIntersecting:o}},ee={texture:[],dom:[],resolution:[],boderRadius:[],rotation:[],onIntersect:[]},sn=({size:t,dpr:s,samples:o=0},u=[])=>{const e=a.useMemo(()=>new n.Scene,[]),l=R(t),[d,f]=D({scene:e,camera:l,size:t,dpr:s,samples:o,isSizeUpdate:!0}),[r,c]=C(ee),[p,m]=an(),v=a.useRef(new n.Vector2(0,0)),[g,h]=a.useState(!0);a.useEffect(()=>{h(!0)},u);const y=on(),{isIntersectingOnceRef:M,isIntersectingRef:w,isIntersecting:T}=un();return[a.useCallback((V,O)=>{const{gl:_,size:E}=V;return O&&c(O),en(r)&&(g&&(rn({params:r,size:E,scene:e}),y({isIntersectingRef:w,isIntersectingOnceRef:M,params:r}),h(!1)),m({params:r,size:E,resolutionRef:v,scene:e,isIntersectingRef:w})),f(_)},[f,c,y,m,g,e,r,M,w]),c,{scene:e,camera:l,renderTarget:d,isIntersecting:T,DOMRects:p}]};var ln=`precision mediump float;

varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 1.0);
}`,cn=`precision mediump float;

varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uBlurSize;

void main() {
	vec2 uv = vUv;	
	vec2 perDivSize = uBlurSize / uResolution;

	
	vec4 outColor = vec4(
		texture2D(uTexture, uv + perDivSize * vec2(-1.0, -1.0)) +
		texture2D(uTexture, uv + perDivSize * vec2(0.0, -1.0)) + 
		texture2D(uTexture, uv + perDivSize * vec2(1.0, -1.0)) + 
		texture2D(uTexture, uv + perDivSize * vec2(-1.0, 0.0)) + 
		texture2D(uTexture, uv + perDivSize * vec2(0.0,  0.0)) + 
		texture2D(uTexture, uv + perDivSize * vec2(1.0,  0.0)) + 
		texture2D(uTexture, uv + perDivSize * vec2(-1.0, 1.0)) + 
		texture2D(uTexture, uv + perDivSize * vec2(0.0,  1.0)) + 
		texture2D(uTexture, uv + perDivSize * vec2(1.0,  1.0))
		) / 9.0;
	
	gl_FragColor = outColor;
}`;const vn=t=>{const s=a.useMemo(()=>new n.PlaneGeometry(2,2),[]),o=a.useMemo(()=>new n.ShaderMaterial({uniforms:{uTexture:{value:new n.Texture},uResolution:{value:new n.Vector2(0,0)},uBlurSize:{value:1}},vertexShader:ln,fragmentShader:cn}),[]);return P(t,s,o),o},ne={texture:new n.Texture,blurSize:3,blurPower:5},fn=({size:t,dpr:s,samples:o=0})=>{const u=a.useMemo(()=>new n.Scene,[]),e=vn(u),l=R(t),d=a.useMemo(()=>({scene:u,camera:l,size:t,dpr:s,samples:o}),[u,l,t,s,o]),[f,r]=D(d),[c,p]=I(d),[m,v]=C(ne);return[a.useCallback((h,y)=>{const{gl:M}=h;y&&v(y),i(e,"uTexture",m.texture),i(e,"uResolution",[m.texture.source.data.width,m.texture.source.data.height]),i(e,"uBlurSize",m.blurSize);let w=p(M);const T=m.blurPower;for(let V=0;V<T;V++)i(e,"uTexture",w),w=p(M);return r(M)},[r,p,e,v,m]),v,{scene:u,material:e,camera:l,renderTarget:f}]};var dn=`varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 1.0);
}`,mn=`precision highp float;

varying vec2 vUv;
uniform float uProgress;
uniform float uStrength;
uniform float uWidth;
uniform vec2 uEpicenter;
uniform int uMode;

float PI = 3.141592653589;

void main() {

	vec2 uv = vUv;

	float progress = min(uProgress, 1.0);
	float progressFactor = sin(progress * PI);

	float border = progress - progress * progressFactor * uWidth;
	float blur = uStrength * progressFactor;
	
	
	vec2 normalizeCenter = (uEpicenter + 1.0) / 2.0;

	
	float dist = uMode == 0 ? length(uv - normalizeCenter) : uMode == 1 ? length(uv.x - normalizeCenter.x) : length(uv.y - normalizeCenter.y);

	
	float maxDistance = max(
		length(vec2(0.0, 0.0) - normalizeCenter),
		max(
				length(vec2(1.0, 0.0) - normalizeCenter),
				max(
					length(vec2(0.0, 1.0) - normalizeCenter),
					length(vec2(1.0, 1.0) - normalizeCenter)
				)
		)
	);

	
	dist = maxDistance > 0.0 ? dist / maxDistance : dist;

	vec3 color = vec3(smoothstep(border - blur, border, dist) -
                  smoothstep(progress, progress + blur, dist));
	
	
	color *= progressFactor;

	gl_FragColor = vec4(color, 1.0);
}`;const pn=t=>{const s=a.useMemo(()=>new n.PlaneGeometry(2,2),[]),o=a.useMemo(()=>new n.ShaderMaterial({uniforms:{uEpicenter:{value:new n.Vector2(0,0)},uProgress:{value:0},uStrength:{value:0},uWidth:{value:0},uMode:{value:0}},vertexShader:dn,fragmentShader:mn}),[]);return P(t,s,o),o},te={epicenter:new n.Vector2(0,0),progress:0,width:0,strength:0,mode:"center"},gn=({size:t,dpr:s,samples:o=0})=>{const u=a.useMemo(()=>new n.Scene,[]),e=pn(u),l=R(t),[d,f]=D({scene:u,camera:l,size:t,dpr:s,samples:o,isSizeUpdate:!0}),[r,c]=C(te);return[a.useCallback((m,v)=>{const{gl:g}=m;return v&&c(v),i(e,"uEpicenter",r.epicenter),i(e,"uProgress",r.progress),i(e,"uWidth",r.width),i(e,"uStrength",r.strength),i(e,"uMode",r.mode==="center"?0:r.mode==="horizontal"?1:2),f(g)},[f,e,c,r]),c,{scene:u,material:e,camera:l,renderTarget:d}]};var xn=`varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 1.0);
}`,hn=`precision highp float;

varying vec2 vUv;
uniform sampler2D u_texture;
uniform vec3 u_brightness;
uniform float u_min;
uniform float u_max;

void main() {
	vec2 uv = vUv;
	vec3 color = texture2D(u_texture, uv).rgb;
	float brightness = dot(color,u_brightness);
	float alpha = clamp(smoothstep(u_min, u_max, brightness),0.0,1.0);
	gl_FragColor = vec4(color, alpha);
}`;const yn=t=>{const s=a.useMemo(()=>new n.PlaneGeometry(2,2),[]),o=a.useMemo(()=>new n.ShaderMaterial({uniforms:{u_texture:{value:new n.Texture},u_brightness:{value:new n.Vector3},u_min:{value:0},u_max:{value:1}},vertexShader:xn,fragmentShader:hn}),[]);return P(t,s,o),o},re={texture:new n.Texture,brightness:new n.Vector3(.5,.5,.5),min:0,max:1},Mn=({size:t,dpr:s,samples:o=0})=>{const u=a.useMemo(()=>new n.Scene,[]),e=yn(u),l=R(t),[d,f]=D({scene:u,camera:l,size:t,dpr:s,samples:o}),[r,c]=C(re);return[a.useCallback((m,v)=>{const{gl:g}=m;return v&&c(v),i(e,"u_texture",r.texture),i(e,"u_brightness",r.brightness),i(e,"u_min",r.min),i(e,"u_max",r.max),f(g)},[f,e,c,r]),c,{scene:u,material:e,camera:l,renderTarget:d}]};var Tn=`varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 1.0);
}`,Sn=`precision highp float;
varying vec2 vUv;

uniform sampler2D uTexture;
uniform bool isTexture;
uniform sampler2D noise;
uniform bool isNoise;
uniform vec2 noiseStrength;
uniform float laminateLayer;
uniform vec2 laminateInterval;
uniform vec2 laminateDetail;
uniform vec2 distortion;
uniform vec3 colorFactor;
uniform float uTime;
uniform vec2 timeStrength;
uniform float scale;

void main() {
	vec2 uv = vUv;

	vec2 pos = isTexture ? texture2D(uTexture, uv).rg : uv * scale;
	vec2 noise = isNoise ? texture2D(noise, uv).rg : vec2(0.0);
	float alpha = isTexture ? texture2D(uTexture, uv).a : 1.0;
	
	
	alpha = (alpha < 1e-10) ? 0.0 : alpha;

	vec3 col;
	for(float j = 0.0; j < 3.0; j++){
		for(float i = 1.0; i < laminateLayer; i++){
			float timeNoiseSin = sin(uTime / (i + j)) * timeStrength.x + noise.r * noiseStrength.x;
			float timeNoiseCos = cos(uTime / (i + j)) * timeStrength.y + noise.g * noiseStrength.y;
			pos.x += laminateInterval.x / (i + j) * cos(i * distortion.x * pos.y + timeNoiseSin + sin(i + j));
			pos.y += laminateInterval.y / (i + j) * cos(i * distortion.y * pos.x + timeNoiseCos + sin(i + j));
		}
		col[int(j)] = sin(pow(pos.x, 2.) * pow(laminateDetail.x, 2.)) + sin(pow(pos.y, 2.) * pow(laminateDetail.y, 2.));
	}

	col *= colorFactor * alpha;
	col = clamp(col, 0.0, 1.0);
	
	gl_FragColor = vec4(col, alpha);
}`;const wn=t=>{const s=a.useMemo(()=>new n.PlaneGeometry(2,2),[]),o=a.useMemo(()=>new n.ShaderMaterial({uniforms:{uTexture:{value:new n.Texture},isTexture:{value:!1},scale:{value:1},noise:{value:new n.Texture},noiseStrength:{value:new n.Vector2(0,0)},isNoise:{value:!1},laminateLayer:{value:1},laminateInterval:{value:new n.Vector2(.1,.1)},laminateDetail:{value:new n.Vector2(1,1)},distortion:{value:new n.Vector2(0,0)},colorFactor:{value:new n.Vector3(1,1,1)},uTime:{value:0},timeStrength:{value:new n.Vector2(0,0)}},vertexShader:Tn,fragmentShader:Sn}),[]);return P(t,s,o),o},oe={texture:!1,scale:1,laminateLayer:1,laminateInterval:new n.Vector2(.1,.1),laminateDetail:new n.Vector2(1,1),distortion:new n.Vector2(0,0),colorFactor:new n.Vector3(1,1,1),timeStrength:new n.Vector2(0,0),noise:!1,noiseStrength:new n.Vector2(0,0)},_n=({size:t,dpr:s,samples:o=0})=>{const u=a.useMemo(()=>new n.Scene,[]),e=wn(u),l=R(t),[d,f]=D({scene:u,camera:l,size:t,dpr:s,samples:o}),[r,c]=C(oe);return[a.useCallback((m,v)=>{const{gl:g,clock:h}=m;return v&&c(v),r.texture?(i(e,"uTexture",r.texture),i(e,"isTexture",!0)):(i(e,"isTexture",!1),i(e,"scale",r.scale)),r.noise?(i(e,"noise",r.noise),i(e,"isNoise",!0),i(e,"noiseStrength",r.noiseStrength)):i(e,"isNoise",!1),i(e,"uTime",h.getElapsedTime()),i(e,"laminateLayer",r.laminateLayer),i(e,"laminateInterval",r.laminateInterval),i(e,"laminateDetail",r.laminateDetail),i(e,"distortion",r.distortion),i(e,"colorFactor",r.colorFactor),i(e,"timeStrength",r.timeStrength),f(g)},[f,e,c,r]),c,{scene:u,material:e,camera:l,renderTarget:d}]};var bn=`varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 1.0);
}`,Rn=`precision highp float;

varying vec2 vUv;
uniform sampler2D u_texture;
uniform sampler2D u_map;
uniform float u_mapIntensity;

void main() {
	vec2 uv = vUv;

	vec2 mapColor = texture2D(u_map, uv).rg;
	vec2 normalizedMap = mapColor * 2.0 - 1.0;
	
	uv = uv * 2.0 - 1.0;
	uv *= mix(vec2(1.0), abs(normalizedMap.rg), u_mapIntensity);
	uv = (uv + 1.0) / 2.0;

	gl_FragColor = texture2D(u_texture, uv);
}`;const Cn=t=>{const s=a.useMemo(()=>new n.PlaneGeometry(2,2),[]),o=a.useMemo(()=>new n.ShaderMaterial({uniforms:{u_texture:{value:new n.Texture},u_map:{value:new n.Texture},u_mapIntensity:{value:0}},vertexShader:bn,fragmentShader:Rn}),[]);return P(t,s,o),o},ae={texture:new n.Texture,map:new n.Texture,mapIntensity:.3},Dn=({size:t,dpr:s,samples:o=0})=>{const u=a.useMemo(()=>new n.Scene,[]),e=Cn(u),l=R(t),[d,f]=D({scene:u,camera:l,size:t,dpr:s,samples:o}),[r,c]=C(ae);return[a.useCallback((m,v)=>{const{gl:g}=m;return v&&c(v),i(e,"u_texture",r.texture),i(e,"u_map",r.map),i(e,"u_mapIntensity",r.mapIntensity),f(g)},[f,e,c,r]),c,{scene:u,material:e,camera:l,renderTarget:d}]},Pn=({scene:t,camera:s,size:o,dpr:u=!1,isSizeUpdate:e=!1,samples:l=0,depthBuffer:d=!1,depthTexture:f=!1},r)=>{const c=a.useRef([]),p=B(o,u);c.current=a.useMemo(()=>Array.from({length:r},()=>{const v=new n.WebGLRenderTarget(p.x,p.y,{...N,samples:l,depthBuffer:d});return f&&(v.depthTexture=new n.DepthTexture(p.x,p.y,n.FloatType)),v}),[r]),a.useLayoutEffect(()=>{e&&c.current.forEach(v=>v.setSize(p.x,p.y))},[p,e]),a.useEffect(()=>{const v=c.current;return()=>{v.forEach(g=>g.dispose())}},[r]);const m=a.useCallback((v,g,h)=>{const y=c.current[g];return j({gl:v,scene:t,camera:s,fbo:y,onBeforeRender:()=>h&&h({read:y.texture})}),y.texture},[t,s]);return[c.current,m]};x.BLENDING_PARAMS=q,x.BRIGHTNESSPICKER_PARAMS=re,x.BRUSH_PARAMS=H,x.COLORSTRATA_PARAMS=oe,x.DOMSYNCER_PARAMS=ee,x.DUOTONE_PARAMS=Y,x.FLUID_PARAMS=K,x.FXBLENDING_PARAMS=ae,x.FXTEXTURE_PARAMS=J,x.NOISE_PARAMS=Q,x.RIPPLE_PARAMS=Z,x.SIMPLEBLUR_PARAMS=ne,x.WAVE_PARAMS=te,x.setUniform=i,x.useAddMesh=P,x.useBlending=we,x.useBrightnessPicker=Mn,x.useBrush=pe,x.useCamera=R,x.useColorStrata=_n,x.useCopyTexture=Pn,x.useDomSyncer=sn,x.useDoubleFBO=I,x.useDuoTone=ye,x.useFluid=je,x.useFxBlending=Dn,x.useFxTexture=qe,x.useNoise=Qe,x.useParams=C,x.usePointer=$,x.useResolution=B,x.useRipple=We,x.useSimpleBlur=fn,x.useSingleFBO=D,x.useWave=gn,Object.defineProperty(x,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=use-shader-fx.umd.cjs.map

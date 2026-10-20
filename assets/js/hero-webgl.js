// Kinetic loops: independent transforms, no central sphere or shared spin.
const host=document.querySelector('.sculpture');
const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('../css/hero-webgl.css',import.meta.url).href;
css.addEventListener('load',()=>{try{start()}catch(e){host?.classList.remove('webgl-ready');host?.querySelector('canvas')?.remove();console.warn('CSS fallback:',e)}});document.head.appendChild(css);
function start(){
 if(!host)return;const canvas=document.createElement('canvas');canvas.className='webgl-canvas';canvas.setAttribute('aria-hidden','true');
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});if(!gl)return;
 const resources=[];let dead=false,frame=0;
 const dispose=()=>{if(dead)return;dead=true;cancelAnimationFrame(frame);for(const [kind,r]of resources){if(kind==='buffer')gl.deleteBuffer(r);if(kind==='shader')gl.deleteShader(r);if(kind==='program')gl.deleteProgram(r)}canvas.remove();host.classList.remove('webgl-ready')};
 try{
 function shader(type,text){const s=gl.createShader(type);resources.push(['shader',s]);gl.shaderSource(s,text);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
 const vs=shader(gl.VERTEX_SHADER,`precision highp float;attribute vec3 p,n;uniform vec3 rotation,offset;uniform float scale,aspect;varying mediump vec3 N,V;
 vec3 rx(vec3 v,float a){float c=cos(a),s=sin(a);return vec3(v.x,v.y*c-v.z*s,v.y*s+v.z*c);}
 vec3 ry(vec3 v,float a){float c=cos(a),s=sin(a);return vec3(v.x*c+v.z*s,v.y,-v.x*s+v.z*c);}
 vec3 rz(vec3 v,float a){float c=cos(a),s=sin(a);return vec3(v.x*c-v.y*s,v.x*s+v.y*c,v.z);}
 vec3 rot(vec3 v){return rx(ry(rz(ry(rx(v,rotation.x),rotation.y),rotation.z),.55),-.35);}
 void main(){vec3 q=rot(p*scale)+offset;q.z-=8.6;N=rot(n);V=-q;gl_Position=vec4(q.x*2.414/aspect,q.y*2.414,-1.004*q.z-.2004,-q.z);}`);
 const fs=shader(gl.FRAGMENT_SHADER,`precision mediump float;varying mediump vec3 N,V;uniform vec3 metal;
 float box(vec3 r,vec3 a,vec3 up,vec2 size,float blur){vec3 x=normalize(cross(a,up)),y=normalize(cross(x,a));float d=dot(r,a);vec2 q=abs(vec2(dot(r,x),dot(r,y))/max(d,.05));vec2 e=smoothstep(size-vec2(blur),size+vec2(blur),q);return smoothstep(0.,.2,d)*(1.-e.x)*(1.-e.y);}
 vec3 tone(vec3 c){return clamp(c*(2.51*c+.03)/(c*(2.43*c+.59)+.14),0.,1.);}
 void main(){vec3 nn=normalize(N),v=normalize(V),r=reflect(-v,nn);float nv=max(dot(nn,v),0.);
 vec3 f=metal+(1.-metal)*pow(1.-nv,5.);
 float key=box(r,normalize(vec3(-.8,.9,1.)),vec3(0.,1.,0.),vec2(.4,1.1),.14);
 float edge=box(r,normalize(vec3(1.,.15,.65)),vec3(0.,1.,0.),vec2(.12,.9),.075);
 float top=box(r,normalize(vec3(.1,1.,-.3)),vec3(0.,0.,1.),vec2(1.2,.4),.18);
 vec3 env=vec3(.024,.028,.035)+vec3(.045,.05,.06)*max(r.y,0.);env+=vec3(1.65,1.56,1.4)*key+vec3(.7,.82,1.)*edge+vec3(.65,.63,.57)*top;
 vec3 c=f*env;gl_FragColor=vec4(pow(tone(c),vec3(1./2.2)),1.);}`);
 const prog=gl.createProgram();resources.push(['program',prog]);gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
 const attr={p:gl.getAttribLocation(prog,'p'),n:gl.getAttribLocation(prog,'n')},u={};for(const s of ['rotation','offset','scale','aspect','metal'])u[s]=gl.getUniformLocation(prog,s);
 // Wide oval bands with a flattened elliptical cross-section.
 const pos=[],normal=[],index=[],A=160,B=40;for(let i=0;i<=A;i++){const a=i/A*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);for(let j=0;j<=B;j++){const b=j/B*Math.PI*2,cb=Math.cos(b),sb=Math.sin(b);pos.push((1.6+.25*cb)*ca,.09*sb,(1.6+.25*cb)*sa*.76);const x=ca*cb/.25,y=sb/.09,z=sa*cb/(.25*.76),l=Math.hypot(x,y,z);normal.push(x/l,y/l,z/l)}}for(let i=0;i<A;i++)for(let j=0;j<B;j++){const a=i*(B+1)+j,b=a+B+1;index.push(a,b,a+1,b,b+1,a+1)}
 function buffer(target,data){const b=gl.createBuffer();resources.push(['buffer',b]);gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b}
 const pb=buffer(gl.ARRAY_BUFFER,new Float32Array(pos)),nb=buffer(gl.ARRAY_BUFFER,new Float32Array(normal)),ib=buffer(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(index));
 gl.bindBuffer(gl.ARRAY_BUFFER,pb);gl.enableVertexAttribArray(attr.p);gl.vertexAttribPointer(attr.p,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,nb);gl.enableVertexAttribArray(attr.n);gl.vertexAttribPointer(attr.n,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let time=0,last=0,visible=true;
 const active=()=>!reduced.matches&&!document.body.classList.contains('paused');
 function queue(){if(!dead&&!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw)}
 function loop(rotation,offset,scale,metal){gl.uniform3fv(u.rotation,rotation);gl.uniform3fv(u.offset,offset);gl.uniform1f(u.scale,scale);gl.uniform3fv(u.metal,metal);gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT,0)}
 function draw(now){frame=0;if(dead||!visible||document.hidden)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(active())time+=dt;
 const rect=host.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.75),w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);gl.uniform1f(u.aspect,w/h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 const t=time,halfPi=Math.PI/2;
 // At t=0 the planes are mutually perpendicular; motion then diverges.
 loop([Math.sin(t*.44)*.28,t*.16,Math.sin(t*.27)*.15],[-.12,.83+Math.sin(t*.65)*.13,0],.88,[.73,.66,.52]);
 loop([halfPi+Math.sin(t*.37)*.3,-t*.21,(Math.cos(t*.31)-1.)*.18],[.16,Math.sin(t*.57+2)*.13,.05],1.,[.66,.69,.73]);
 loop([Math.sin(t*.5)*.26,t*.12,halfPi+Math.sin(t*.35)*.18],[-.05,-.83+Math.sin(t*.48+4)*.13,0],.82,[.52,.47,.38]);
 if(active())queue()}
 const change=()=>{last=0;queue()};
 const resize=new ResizeObserver(change);resize.observe(host);const seen=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)queue();else{cancelAnimationFrame(frame);frame=0}});seen.observe(host);const state=new MutationObserver(change);state.observe(document.body,{attributes:true,attributeFilter:['class']});
 const visibility=()=>{last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0}else queue()};document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',change);window.addEventListener('pageshow',change);
 function cleanup(){resize.disconnect();seen.disconnect();state.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',change);window.removeEventListener('pageshow',change);dispose()}
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cleanup()},{once:true});window.addEventListener('pagehide',e=>{if(!e.persisted)cleanup();else{last=0;cancelAnimationFrame(frame);frame=0}});
 host.appendChild(canvas);draw(performance.now());host.classList.add('webgl-ready');
 }catch(e){dispose();throw e}
}

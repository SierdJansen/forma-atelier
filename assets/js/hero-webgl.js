const host=document.querySelector('.sculpture');
const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('../css/hero-webgl.css',import.meta.url).href;
css.addEventListener('load',()=>{try{init()}catch(error){host?.classList.remove('webgl-ready');host?.querySelector('canvas')?.remove();console.warn('WebGL niet beschikbaar; CSS-versie blijft actief.',error)}});
document.head.appendChild(css);
function init(){
 if(!host)return;
 const canvas=document.createElement('canvas');canvas.className='webgl-canvas';canvas.setAttribute('aria-hidden','true');
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'default'});if(!gl)return;
 const resources=[];
 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(s);gl.deleteShader(s);throw Error(message)}resources.push(['shader',s]);return s}
 const vs=shader(gl.VERTEX_SHADER,`precision highp float;attribute vec3 aPosition,aNormal;uniform vec3 uRotation;uniform vec2 uView;uniform float uScale,uAspect;varying mediump vec3 vN,vV;
 vec3 rx(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}
 vec3 ry(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);}
 vec3 rz(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x-s*p.y,s*p.x+c*p.y,p.z);}
 vec3 rot(vec3 p){p=rz(ry(rx(p,uRotation.x),uRotation.y),uRotation.z);return ry(rx(p,uView.x),uView.y);}
 void main(){vec3 p=rot(aPosition*uScale);vN=rot(aNormal);p.z-=8.;vV=-p;float n=.1,f=50.;gl_Position=vec4(p.x*2.41421356/uAspect,p.y*2.41421356,(-(f+n)*p.z-2.*f*n)/(f-n),-p.z);}`);
 const fs=shader(gl.FRAGMENT_SHADER,`precision mediump float;varying mediump vec3 vN,vV;uniform vec3 uGold;
 const float PI=3.14159265;
 vec3 tone(vec3 c){return clamp((c*(2.51*c+.03))/(c*(2.43*c+.59)+.14),0.,1.);}
 vec3 fresnel(float hv,vec3 f0){return f0+(1.-f0)*pow(1.-clamp(hv,0.,1.),5.);}
 float geometry(float n,float k){return n/max(n*(1.-k)+k,.001);}
 vec3 specular(vec3 N,vec3 V,vec3 L,vec3 f0,float rough){
  vec3 H=normalize(V+L);float nv=max(dot(N,V),.001),nl=max(dot(N,L),0.),nh=max(dot(N,H),0.);
  float a=rough*rough,a2=a*a,d=nh*nh*(a2-1.)+1.;float D=a2/max(PI*d*d,.0001);float k=(rough+1.)*(rough+1.)*.125;
  float G=geometry(nv,k)*geometry(nl,k);return fresnel(max(dot(H,V),0.),f0)*D*G*nl/max(4.*nv*nl,.001);}
 float softbox(vec3 r,vec3 axis,vec3 up,float width,float height,float edge){
  vec3 right=normalize(cross(axis,up)),vertical=normalize(cross(right,axis));float forward=dot(r,axis);
  vec2 p=vec2(dot(r,right),dot(r,vertical))/max(forward,.05);
  return smoothstep(0.,.15,forward)*(1.-smoothstep(width-edge,width+edge,abs(p.x)))*(1.-smoothstep(height-edge,height+edge,abs(p.y)));}
 void main(){
  vec3 N=normalize(vN),V=normalize(vV),R=reflect(-V,N);float nv=max(dot(N,V),0.);
  vec3 f0=mix(uGold,vec3(.79,.69,.49),.65)*.82;float rough=.29;
  float key=softbox(R,normalize(vec3(-.65,.8,1.)),vec3(0.,1.,0.),.24,.9,.095);
  float fill=softbox(R,normalize(vec3(.9,.2,.7)),vec3(0.,1.,0.),.12,.65,.065);
  float ceiling=softbox(R,normalize(vec3(0.,1.,-.25)),vec3(0.,0.,1.),1.5,.32,.13);
  vec3 studio=vec3(.012,.016,.023)+vec3(.025,.03,.04)*max(R.y,0.);
  studio+=vec3(1.5,1.43,1.3)*key+vec3(.65,.78,1.)*fill+vec3(.5,.48,.43)*ceiling;
  vec3 color=fresnel(nv,f0)*studio;
  color+=specular(N,V,normalize(vec3(-.65,.8,1.)),f0,rough)*vec3(.65,.6,.5);
  color+=specular(N,V,normalize(vec3(.9,.2,.7)),f0,rough)*vec3(.12,.16,.22);
  color+=f0*.008;
  gl_FragColor=vec4(pow(tone(color*.95),vec3(1./2.2)),1.);}`);
 const program=gl.createProgram();resources.push(['program',program]);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const loc={};for(const name of ['aPosition','aNormal'])loc[name]=gl.getAttribLocation(program,name);for(const name of ['uRotation','uView','uScale','uAspect','uGold'])loc[name]=gl.getUniformLocation(program,name);
 function mesh(sphere){const positions=[],normals=[],indices=[],rows=sphere?40:128,cols=sphere?64:28;for(let i=0;i<=rows;i++){const u=i/rows*Math.PI*(sphere?1:2);for(let j=0;j<=cols;j++){const v=j/cols*Math.PI*2;let x,y,z,nx,ny,nz;if(sphere){nx=Math.sin(u)*Math.cos(v);ny=Math.cos(u);nz=Math.sin(u)*Math.sin(v);x=nx;y=ny;z=nz}else{nx=Math.cos(u)*Math.cos(v);ny=Math.sin(v);nz=Math.sin(u)*Math.cos(v);x=(1.86+.14*Math.cos(v))*Math.cos(u);y=.14*Math.sin(v);z=(1.86+.14*Math.cos(v))*Math.sin(u)}positions.push(x,y,z);normals.push(nx,ny,nz)}}for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const a=i*(cols+1)+j,b=a+cols+1;indices.push(a,b,a+1,b,b+1,a+1)}
 function buffer(target,data){const b=gl.createBuffer();resources.push(['buffer',b]);gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b}
 return{p:buffer(gl.ARRAY_BUFFER,new Float32Array(positions)),n:buffer(gl.ARRAY_BUFFER,new Float32Array(normals)),i:buffer(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices)),count:indices.length}}
 const torus=mesh(false),sphere=mesh(true);gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
 let angle=.5,last=0,frame=0,visible=true,dead=false,mx=0,my=0,sx=0,sy=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function active(){return !reduced.matches&&!document.body.classList.contains('paused')}
 function queue(){if(!frame&&!dead&&visible&&!document.hidden)frame=requestAnimationFrame(draw)}
 function draw(now){frame=0;if(dead||!visible||document.hidden)return;const delta=last?Math.min((now-last)/1000,.05):0;last=now;if(active()){angle+=delta*.16;sx+=(mx-sx)*.07;sy+=(my-sy)*.07}else{sx=sy=0}
 const box=host.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.round(box.width*dpr)),h=Math.max(1,Math.round(box.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(loc.uAspect,w/h);gl.uniform2f(loc.uView,-.25+sy*.18,angle+sx*.25);
 function render(m,rotation,scale,color){gl.bindBuffer(gl.ARRAY_BUFFER,m.p);gl.enableVertexAttribArray(loc.aPosition);gl.vertexAttribPointer(loc.aPosition,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,m.n);gl.enableVertexAttribArray(loc.aNormal);gl.vertexAttribPointer(loc.aNormal,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.i);gl.uniform3fv(loc.uRotation,rotation);gl.uniform1f(loc.uScale,scale);gl.uniform3fv(loc.uGold,color);gl.drawElements(gl.TRIANGLES,m.count,gl.UNSIGNED_SHORT,0)}
 render(torus,[.3,.1,.1],1,[.83,.63,.3]);render(torus,[1.15,.55,.65],1,[.76,.57,.26]);render(torus,[.75,-.9,-.6],1,[.92,.75,.44]);render(sphere,[0,0,0],.66,[.78,.6,.31]);if(active())queue()}
 const pointer=e=>{if(!active()||e.pointerType==='touch')return;const b=host.getBoundingClientRect();mx=Math.max(-.5,Math.min(.5,(e.clientX-b.left)/b.width-.5));my=Math.max(-.5,Math.min(.5,(e.clientY-b.top)/b.height-.5));queue()};
 const leave=()=>{mx=my=0;queue()};const visibility=()=>{last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0}else queue()};const change=()=>{last=0;queue()};
 const resize=new ResizeObserver(()=>queue());resize.observe(host);
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)queue();else{cancelAnimationFrame(frame);frame=0}});intersection.observe(host);
 const mutation=new MutationObserver(change);mutation.observe(document.body,{attributes:true,attributeFilter:['class']});
 host.addEventListener('pointermove',pointer);host.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',change);window.addEventListener('pageshow',change);
 function dispose(){if(dead)return;dead=true;cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();mutation.disconnect();host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',change);window.removeEventListener('pageshow',change);for(const [type,r]of resources){if(type==='buffer')gl.deleteBuffer(r);if(type==='shader')gl.deleteShader(r);if(type==='program')gl.deleteProgram(r)}canvas.remove();host.classList.remove('webgl-ready')}
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();dispose()},{once:true});window.addEventListener('pagehide',e=>{if(!e.persisted)dispose();else{cancelAnimationFrame(frame);frame=0;last=0}});
 host.appendChild(canvas);try{draw(performance.now());host.classList.add('webgl-ready')}catch(error){dispose();throw error}
}

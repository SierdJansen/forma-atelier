const style=document.createElement('link');
style.rel='stylesheet';style.href=new URL('../css/feel.css?v=tactile1',import.meta.url).href;
style.addEventListener('load',enhance,{once:true});document.head.append(style);
function enhance(){
const body=document.body,reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
const moving=()=>!reduced.matches&&!body.classList.contains('paused');
const animations=new Set(),targets=new Set(),wired=new WeakSet(),seen=new WeakSet();
body.classList.add('feel-ready');
function animate(node,keyframes,options){if(!moving()||typeof node.animate!=='function')return;const a=node.animate(keyframes,options);animations.add(a);const done=()=>animations.delete(a);a.addEventListener('finish',done,{once:true});a.addEventListener('cancel',done,{once:true})}
const reveal=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;reveal.unobserve(entry.target);animate(entry.target,[{opacity:.25,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.75,.25,1)'})}},{threshold:.08}):null;
function observe(node){if(seen.has(node))return;seen.add(node);reveal?.observe(node)}
function wire(node,card){if(wired.has(node))return;wired.add(node);targets.add(node);let frame=0,point=null;
const names=card?['--feel-x','--feel-y','--feel-rx','--feel-ry']:['--feel-mx','--feel-my'];
function clear(){cancelAnimationFrame(frame);frame=0;point=null;names.forEach(name=>node.style.removeProperty(name))}
node.addEventListener('pointermove',event=>{if(!fine.matches||!moving()||event.pointerType==='touch')return;point={x:event.clientX,y:event.clientY};if(frame)return;frame=requestAnimationFrame(()=>{frame=0;if(!point||!moving()||document.hidden)return;const box=node.getBoundingClientRect();if(!box.width||!box.height)return;const x=Math.max(0,Math.min(1,(point.x-box.left)/box.width)),y=Math.max(0,Math.min(1,(point.y-box.top)/box.height));if(card){node.style.setProperty('--feel-x',x*100+'%');node.style.setProperty('--feel-y',y*100+'%');node.style.setProperty('--feel-rx',(0.5-y)*5+'deg');node.style.setProperty('--feel-ry',(x-0.5)*6+'deg')}else{node.style.setProperty('--feel-mx',(x-0.5)*7+'px');node.style.setProperty('--feel-my',(y-0.5)*5+'px')}})},{passive:true});node.addEventListener('pointerleave',clear);node.addEventListener('pointercancel',clear);node.addEventListener('blur',clear);node.feelClear=clear;
}
function scan(){document.querySelectorAll('.hero .copy,.heading,.projects>article,.statement h2,.service,.steps article,.contact h2').forEach(observe);document.querySelectorAll('a.button').forEach(n=>wire(n,false));document.querySelectorAll('.projects .preview').forEach(n=>wire(n,true));for(const node of targets)if(!node.isConnected){node.feelClear?.();targets.delete(node)}}
scan();const projects=document.querySelector('.projects');if(projects)new MutationObserver(scan).observe(projects,{childList:true});
document.querySelectorAll('.faq details').forEach(detail=>{detail.addEventListener('toggle',()=>{if(detail.open)detail.querySelectorAll('p').forEach(p=>animate(p,[{opacity:.3,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'}))})});
function sync(){if(!moving()){animations.forEach(a=>a.cancel());targets.forEach(n=>n.feelClear?.())}}
reduced.addEventListener('change',sync);fine.addEventListener('change',()=>targets.forEach(n=>n.feelClear?.()));new MutationObserver(sync).observe(body,{attributes:true,attributeFilter:['class']});
const progress=document.createElement('div');progress.className='feel-progress';progress.setAttribute('aria-hidden','true');body.append(progress);let scrollFrame=0;
function draw(){scrollFrame=0;const total=document.documentElement.scrollHeight-innerHeight;const value=total>0?Math.max(0,Math.min(1,scrollY/total)):0;progress.style.transform='scaleX('+value+')'}
function schedule(){if(!scrollFrame&&!document.hidden)scrollFrame=requestAnimationFrame(draw)}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('pageshow',schedule);document.addEventListener('visibilitychange',()=>{if(document.hidden){targets.forEach(n=>n.feelClear?.());animations.forEach(a=>a.cancel())}else schedule()});if(typeof ResizeObserver==='function')new ResizeObserver(schedule).observe(document.documentElement);schedule();
}

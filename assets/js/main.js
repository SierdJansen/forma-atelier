'use strict';
document.documentElement.classList.add('js');
const find=s=>document.querySelector(s);
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),motion=find('#motion');
function preference(){motion.hidden=reduced.matches}preference();reduced.addEventListener('change',preference);
motion.addEventListener('click',()=>{const paused=document.body.classList.toggle('paused');motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Animatie hervatten':'Animatie pauzeren'});
find('#year').textContent=new Date().getFullYear();
import('./hero-webgl.js').catch(error=>console.warn('WebGL-hero niet geladen; CSS-versie blijft beschikbaar.',error));
if(document.body.dataset.page==='home')import('./feel.js?v=tactile1').catch(()=>console.warn('Extra interacties niet geladen; de website blijft beschikbaar.'));

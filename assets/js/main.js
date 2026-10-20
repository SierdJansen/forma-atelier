'use strict';
document.documentElement.classList.add('js');
const find=s=>document.querySelector(s),menu=find('#menu'),links=find('#links');
menu.hidden=false;
function closeMenu(){links.classList.remove('open');menu.setAttribute('aria-expanded','false')}
menu.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&links.classList.contains('open')){closeMenu();menu.focus()}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),motion=find('#motion');
function preference(){motion.hidden=reduced.matches}preference();reduced.addEventListener('change',preference);
motion.addEventListener('click',()=>{const paused=document.body.classList.toggle('paused');motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Animatie hervatten':'Animatie pauzeren'});
const toggle=find('#brief-toggle'),brief=find('#brief');toggle.hidden=false;
toggle.addEventListener('click',()=>{brief.hidden=!brief.hidden;toggle.setAttribute('aria-expanded',String(!brief.hidden));if(!brief.hidden)find('#project').focus()});
find('#download').addEventListener('click',()=>{const text=find('#project').value.trim(),status=find('#status');if(!text){status.textContent='Vul eerst je projectbrief in.';return}const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='forma-projectbrief.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Download aangevraagd. Er is niets verstuurd.'});
find('#year').textContent=new Date().getFullYear();
import('./hero-webgl.js').catch(error=>console.warn('WebGL-hero niet geladen; CSS-versie blijft beschikbaar.',error));
import('./design-studio.js').catch(error=>console.warn('Ontwerpstudio niet geladen; basiswebsite blijft beschikbaar.',error));

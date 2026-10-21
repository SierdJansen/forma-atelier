(function(){
'use strict';
var body=document.body,toggle=document.getElementById('fm-toggle');
if(!toggle)return;
var page=body.getAttribute('data-page')||'home',home=page==='home',prefix=home?'':'./index.html';
var idle='Onafhankelijk. Doordacht. Op maat.';
var items=[
{label:'Home',href:home?'#main':'./index.html',desc:'Terug naar het begin.',current:home},
{label:'Concepten',href:prefix+'#werk',desc:'Zelf geïnitieerde ontwerpstudies.'},
{label:'Expertise',href:prefix+'#expertise',desc:'Strategie, identiteit en webontwikkeling.'},
{label:'Aanpak',href:prefix+'#proces',desc:'Eerst begrijpen, dan ontwerpen, dan bouwen.'},
{label:'Lab',href:page==='lab'?'#main':'./lab.html',desc:'Werkende demo’s om zelf te proberen.',current:page==='lab'},
{label:'Contact',href:page==='contact'?'#main':'./contact.html',desc:'Vertel kort wat je wilt maken.',current:page==='contact'}];
function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function burger(cross){var b=el('span','fm-burger'+(cross?' is-x':''));b.setAttribute('aria-hidden','true');b.appendChild(el('i'));b.appendChild(el('i'));return b}
var overlay=el('div','fm-overlay');overlay.id='fm-menu';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Hoofdmenu');overlay.setAttribute('inert','');
var closeButton=el('button','fm-close');closeButton.type='button';closeButton.setAttribute('aria-label','Menu sluiten');closeButton.appendChild(burger(true));closeButton.appendChild(el('span','fm-label','Sluit'));
var layout=el('div','fm-layout'),nav=el('nav','fm-main');nav.setAttribute('aria-label','Hoofdnavigatie');var list=el('ol','fm-list');
items.forEach(function(item,index){var li=el('li','fm-item');li.style.setProperty('--i',String(index));var a=el('a','fm-link');a.href=item.href;if(item.current)a.setAttribute('aria-current','page');var num=el('span','fm-num',(index<9?'0':'')+(index+1));num.setAttribute('aria-hidden','true');a.appendChild(num);a.appendChild(el('span','fm-text',item.label));li.appendChild(a);list.appendChild(li)});
nav.appendChild(list);
var stage=el('div','fm-stage');stage.setAttribute('aria-hidden','true');var glow=el('div','fm-glow'),rings=el('div','fm-rings');rings.appendChild(el('i'));rings.appendChild(el('i'));rings.appendChild(el('i'));rings.appendChild(el('b'));var caption=el('p','fm-caption',idle);stage.appendChild(glow);stage.appendChild(rings);stage.appendChild(caption);
layout.appendChild(nav);layout.appendChild(stage);
overlay.appendChild(closeButton);overlay.appendChild(layout);overlay.appendChild(el('p','fm-foot',idle));
body.appendChild(overlay);
toggle.hidden=false;
var isOpen=false,inerted=[],links=Array.prototype.slice.call(overlay.querySelectorAll('.fm-link'));
function hot(index){if(index<0){overlay.removeAttribute('data-hot');rings.style.setProperty('--ty','0px');rings.style.setProperty('--sc','1');caption.textContent=idle}else{overlay.setAttribute('data-hot','');rings.style.setProperty('--ty',Math.round((index-2.5)*14)+'px');rings.style.setProperty('--sc','1.06');caption.textContent=items[index].desc}caption.classList.remove('is-swap');void caption.offsetWidth;caption.classList.add('is-swap')}
links.forEach(function(a,index){a.addEventListener('mouseenter',function(){hot(index)});a.addEventListener('focus',function(){hot(index)});a.addEventListener('mouseleave',function(){hot(-1)});a.addEventListener('blur',function(){hot(-1)})});
function backgroundInert(on){if(on){inerted=Array.prototype.filter.call(body.children,function(n){return n!==overlay&&n.tagName!=='SCRIPT'&&!n.hasAttribute('inert')});inerted.forEach(function(n){n.setAttribute('inert','')})}else{inerted.forEach(function(n){n.removeAttribute('inert')});inerted=[]}}
function openMenu(){if(isOpen)return;isOpen=true;var r=toggle.getBoundingClientRect();overlay.style.setProperty('--mx',Math.round(r.left+r.width/2)+'px');overlay.style.setProperty('--my',Math.round(r.top+r.height/2)+'px');hot(-1);backgroundInert(true);overlay.removeAttribute('inert');document.documentElement.classList.add('fm-lock');toggle.setAttribute('aria-expanded','true');window.requestAnimationFrame(function(){overlay.classList.add('is-open')});window.setTimeout(function(){if(isOpen)closeButton.focus()},60)}
function closeMenu(restore){if(!isOpen)return;isOpen=false;overlay.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');document.documentElement.classList.remove('fm-lock');backgroundInert(false);overlay.setAttribute('inert','');if(restore)toggle.focus()}
toggle.addEventListener('click',function(){isOpen?closeMenu(true):openMenu()});
closeButton.addEventListener('click',function(){closeMenu(true)});
links.forEach(function(a){a.addEventListener('click',function(){closeMenu(false)})});
document.addEventListener('keydown',function(e){if(!isOpen)return;if(e.key==='Escape'){e.preventDefault();closeMenu(true);return}if(e.key==='Tab'){var stops=[closeButton].concat(links),first=stops[0],last=stops[stops.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
})();

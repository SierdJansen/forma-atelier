const hero=document.querySelector('body[data-page="home"] .hero');
if(hero){
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('../css/hero-composition.css?v=composition1',import.meta.url).href;
 css.addEventListener('load',()=>{
  const bottom=hero.querySelector('.hero-bottom');
  if(!bottom||!document.getElementById('werk')||bottom.querySelector('.hero-explore'))return;
  const link=document.createElement('a');link.className='hero-explore';link.href='#werk';link.textContent='Ontdek het werk';
  const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent='↓';link.append(arrow);bottom.append(link);
 },{once:true});
 document.head.append(css);
}

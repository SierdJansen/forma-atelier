export const BASE='https://xhqoobighsubxhoobhfc.supabase.co',KEY='sb_publishable_lXAeFrgFbU4GmD8XYoNbdg_XpEaeY1R',OWNER='s.j.f.jansen@tilburguniversity.edu';
export const pages=[
['hero','Homepage — opening','.hero h1','.hero .eyebrow','.hero .lead'],
['statement','Homepage — overtuiging','.statement h2','.statement .eyebrow','.statement .wrap>p:last-child'],
['work','Projecten — introductie','#werk h2','#werk .eyebrow','#werk .heading>p'],
['expertise','Diensten — titel','#expertise h2','#expertise>.eyebrow',''],
['service-strategy','Diensten — strategie','.service:nth-child(1) h3','','.service:nth-child(1) p'],
['service-identity','Diensten — identiteit','.service:nth-child(2) h3','','.service:nth-child(2) p'],
['service-development','Diensten — ontwikkeling','.service:nth-child(3) h3','','.service:nth-child(3) p'],
['process','Werkwijze — titel','#proces h2','#proces>.eyebrow',''],
['step-discover','Werkwijze — ontdekken','.steps article:nth-child(1) h3','.steps article:nth-child(1) small','.steps article:nth-child(1) p'],
['step-design','Werkwijze — ontwerpen','.steps article:nth-child(2) h3','.steps article:nth-child(2) small','.steps article:nth-child(2) p'],
['step-build','Werkwijze — bouwen','.steps article:nth-child(3) h3','.steps article:nth-child(3) small','.steps article:nth-child(3) p'],
['about','Homepage — achter Forma Atelier','#about h2','#about>.eyebrow','#about .about-copy'],
['contact','Contact — uitnodiging','#contact h2','#contact>.eyebrow','#contact>p:not(.eyebrow)'],
['faq-price','Veelgestelde vragen — kosten','.faq details:nth-of-type(1) summary','','.faq details:nth-of-type(1) p'],
['faq-time','Veelgestelde vragen — planning','.faq details:nth-of-type(2) summary','','.faq details:nth-of-type(2) p'],
['faq-shop','Veelgestelde vragen — webshop','.faq details:nth-of-type(3) summary','','.faq details:nth-of-type(3) p']];
export const originals=['still-spaces','edit-objects'];
export function text(node){if(!node)return '';const copy=node.cloneNode(true);copy.querySelectorAll('br').forEach(br=>br.replaceWith('\n'));return copy.textContent.trim()}
export function defaults(doc){const records=new Map();for(const [key,label,title,eyebrow,summary] of pages)records.set(key,{key,kind:'page',data:{title:text(doc.querySelector(title)),eyebrow:eyebrow?text(doc.querySelector(eyebrow)):'',summary:summary?text(doc.querySelector(summary)):'',order:0},label});doc.querySelectorAll('#werk .projects>article').forEach((card,index)=>{if(originals[index])records.set(originals[index],{key:originals[index],kind:'project',data:{title:text(card.querySelector('.caption h3')),eyebrow:text(card.querySelector('.caption span')),summary:'',image_url:'',image_alt:'',order:index*10}})});return records}
export function imageUrl(value,origin){try{const url=new URL(value);return url.protocol==='https:'&&(url.origin===origin||url.origin===BASE)?url.href:''}catch{return ''}}

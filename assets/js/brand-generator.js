import {palettes,moods,types,brands,checks,shown,summary,tokens} from './brand-data.js';
const mount=document.querySelector('#brand-mount');
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function group(legend,name,options,checked){const set=el('fieldset','bg-group');set.append(el('legend','',legend));for(const [value,item] of Object.entries(options)){const label=el('label','bg-choice'),input=el('input');input.type='radio';input.name=name;input.value=value;input.checked=value===checked;label.append(input,document.createTextNode(' '+(item.label||item.name)));set.append(label)}return set}
if(mount&&!mount.querySelector('#merkgenerator')){
const section=el('section','brand-lab');section.id='merkgenerator';section.setAttribute('aria-labelledby','brand-title');
const wrap=el('div','wrap'),heading=el('div','bg-heading'),titleBox=el('div');
titleBox.append(el('p','eyebrow','Demo 02 — Merkgenerator'));const title=el('h2');title.id='brand-title';title.append(document.createTextNode('Wie ben je? '),document.createElement('br'),el('em','','Zo zie je eruit.'));titleBox.append(title);
heading.append(titleBox,el('p','','Kies een voorbeeldmerk en verander sfeer, kleur en letterstijl. Alles is fictief; het gaat om de keuzes die een merk herkenbaar maken.'));
const shell=el('div','bg-shell'),controls=el('aside','bg-controls');controls.setAttribute('aria-label','Merkinstellingen');
controls.append(group('01 — Voorbeeldmerk','bg-brand',brands,'bakery'),group('02 — Sfeer','bg-mood',moods,'calm'),group('03 — Kleur','bg-palette',palettes,'sage'),group('04 — Letterstijl','bg-type',types,'classic'));
const status=el('p','bg-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');controls.append(status,el('p','lab-note','Voorbeeldmerken zijn fictief. De contrastwaarden worden live berekend uit de gekozen kleuren.'));
const stage=el('div','bg-stage'),frame=el('div','brand-frame');frame.setAttribute('role','group');frame.setAttribute('aria-label','Voorbeeld van een fictief merk');
const nav=el('div','b-nav'),name=el('span','b-name'),kind=el('span','b-kind');nav.append(name,kind);
const hero=el('div','b-hero'),eyebrow=el('p','b-eyebrow'),headline=el('h3'),text=el('p'),button=el('span','b-button');hero.append(eyebrow,headline,text,button);
const cards=el('div','b-cards'),cardNodes=[0,1,2].map(()=>{const card=el('article','b-card');const h=el('h4'),p=el('p');card.append(h,p);cards.append(card);return[h,p]});
const foot=el('div','b-foot','Voorbeeldmerk — fictief, alleen ter demonstratie');
frame.append(nav,hero,cards,foot);stage.append(frame);shell.append(controls,stage);
const bottom=el('div','bg-bottom'),left=el('div');left.append(el('h3','','Kleur is meer dan smaak.'),el('p','','Een merk moet ook leesbaar zijn. Daarom worden contrastverhoudingen live berekend volgens de WCAG-regel voor normale tekst (minimaal 4,5 op 1).'));const list=el('ul','bg-checks');left.append(list);
const details=el('details','studio-code'),summaryNode=el('summary','','Bekijk de ontwerpkeuzes achter dit merk'),pre=el('pre'),code=el('code');pre.append(code);details.append(summaryNode,pre,el('p','','Dit zijn de tokens van de huidige combinatie; niet de volledige broncode.'));bottom.append(left,details);
wrap.append(heading,shell,bottom);section.append(wrap);mount.replaceChildren(section);
function selected(inputName){return controls.querySelector('input[name="'+inputName+'"]:checked').value}
function update(){const brand=brands[selected('bg-brand')],mood=moods[selected('bg-mood')],paletteKey=selected('bg-palette'),palette=palettes[paletteKey],type=types[selected('bg-type')];if(!brand||!mood||!palette||!type)return;
frame.dataset.palette=paletteKey;frame.dataset.mood=selected('bg-mood');frame.dataset.type=selected('bg-type');
name.textContent=brand.name;kind.textContent=brand.kind;eyebrow.textContent=brand.eyebrow;headline.textContent=brand.headline;text.textContent=brand.text;button.textContent=brand.button;brand.cards.forEach((card,index)=>{cardNodes[index][0].textContent=card[0];cardNodes[index][1].textContent=card[1]});
status.textContent=summary(brand,mood,palette,type);code.textContent=tokens(palette,mood,type);
list.replaceChildren(...checks(palette).map(item=>el('li','',(item.pass?'Voldoende — ':'Onvoldoende — ')+item.label+': '+shown(item.value)+' op 1 (minimaal 4,5)')))}
controls.querySelectorAll('input').forEach(input=>input.addEventListener('change',update));update();
}

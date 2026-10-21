export const palettes={
sage:{name:'Salie',adj:'natuurlijk',bg:'#eef0e6',ink:'#1f2a22',accent:'#3f5a44',on:'#f7f6ee',card:'#e0e5d6'},
terracotta:{name:'Terracotta',adj:'warm',bg:'#f6ece4',ink:'#3a2218',accent:'#a84a2a',on:'#fff8f3',card:'#ecd9cb'},
midnight:{name:'Middernacht',adj:'diep',bg:'#121a2e',ink:'#eef1fb',accent:'#8fb0ff',on:'#0f1830',card:'#1c2744'},
champagne:{name:'Champagne',adj:'luxueus',bg:'#15130f',ink:'#f3ecdc',accent:'#d7be91',on:'#1a160e',card:'#231f17'}};
export const moods={calm:{name:'Rustig',adj:'rustig',radius:'6px'},playful:{name:'Speels',adj:'speels',radius:'22px'},luxe:{name:'Luxe',adj:'verfijnd',radius:'0px'}};
export const types={classic:{name:'Klassiek',adj:'klassiek',heading:'Georgia, "Times New Roman", serif'},modern:{name:'Modern',adj:'modern',heading:'system-ui, -apple-system, "Segoe UI", Arial, sans-serif'},character:{name:'Karaktervol',adj:'karaktervol',heading:'"Palatino Linotype", Palatino, "Book Antiqua", serif'}};
export const brands={
bakery:{label:'Bakkerij',name:'Korst & Krumel',kind:'Ambachtelijke bakkerij',eyebrow:'Sinds de ochtend',headline:'Brood met geduld gebakken.',text:'Zuurdesem, boter en tijd. Elke ochtend vers uit de oven.',button:'Bekijk het brood',cards:[['Zuurdesem','Langzaam gerezen, krokant gebakken.'],['Seizoen','Wisselend aanbod met streekproducten.'],['Voor morgen','Bestel vooraf en haal het warm op.']]},
architect:{label:'Architect',name:'Atelier Noord',kind:'Architectenbureau',eyebrow:'Architectuur en interieur',headline:'Ruimte met rust ontworpen.',text:'Van eerste schets tot oplevering, met aandacht voor licht en materiaal.',button:'Bekijk de projecten',cards:[['Wonen','Huizen die bij hun bewoners passen.'],['Renovatie','Bestaande gebouwen nieuw leven geven.'],['Advies','Duidelijke keuzes voor je plannen.']]},
shop:{label:'Designwinkel',name:'Maat & Vorm',kind:'Designwinkel',eyebrow:'Objecten voor thuis',headline:'Dingen om mee te leven.',text:'Een kleine selectie voorwerpen die goed gemaakt zijn en lang meegaan.',button:'Naar de collectie',cards:[['Licht','Lampen met een rustige uitstraling.'],['Tafel','Servies en bestek voor elke dag.'],['Opbergen','Slimme vormen voor minder rommel.']]}};
export function luminance(hex){const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4);return 0.2126*r+0.7152*g+0.0722*b}
export function ratio(a,b){const [x,y]=[luminance(a),luminance(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05)}
export function checks(p){return [['Tekst op achtergrond',p.ink,p.bg],['Tekst op kaart',p.ink,p.card],['Knoptekst op knop',p.on,p.accent],['Accenttekst op achtergrond',p.accent,p.bg]].map(([label,a,b])=>{const value=ratio(a,b);return{label,value,min:4.5,pass:value>=4.5}})}
export function shown(value){return (Math.floor(value*10)/10).toFixed(1)}
export function summary(brand,mood,palette,type){return brand.name+' voelt '+mood.adj+', '+type.adj+' en '+palette.adj+'.'}
export function tokens(palette,mood,type){return ['--brand-bg: '+palette.bg+';','--brand-ink: '+palette.ink+';','--brand-accent: '+palette.accent+';','--brand-on-accent: '+palette.on+';','--brand-radius: '+mood.radius+';','--brand-heading: '+type.heading+';'].join('\n')}

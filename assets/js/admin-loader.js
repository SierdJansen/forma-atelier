const required=['notice','login-panel','login','workspace','logout','editor','documents','new-project','editing-title','draft-note','publish','hide-project','filter','reload','inquiries','previous','page','next'];
const missing=required.filter(id=>!document.getElementById(id));
const fields=['title','eyebrow','summary','image_url','image_alt','order'];
const editor=document.getElementById('editor'),login=document.getElementById('login');
if(editor)fields.forEach(name=>{if(!editor.elements.namedItem(name))missing.push('editor.'+name)});
if(login)['email','password'].forEach(name=>{if(!login.elements.namedItem(name))missing.push('login.'+name)});
function fail(message){const notice=document.getElementById('notice');if(notice)notice.textContent=message;if(login)login.querySelectorAll('input,button').forEach(node=>node.disabled=true);console.error('Beheerinitialisatie afgebroken. Ontbrekende onderdelen:',missing)}
if(missing.length){fail('Er zijn verschillende versies van de beheerpagina geladen. Vernieuw de pagina volledig of open de beheerpagina in een nieuw privévenster. Er is niets opgeslagen.')}else{import('./admin.js?v=71b04a0').catch(()=>fail('De beheerpagina kon niet volledig worden geladen. Vernieuw de pagina volledig en probeer opnieuw. Er is niets opgeslagen.'))}

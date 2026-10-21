const required=['notice','login-panel','login','workspace','logout','editor','documents','new-project','editing-title','draft-note','publish','hide-project','filter','reload','inquiries','previous','page','next','requests-panel','content-panel','show-requests','show-content'];
const missing=required.filter(id=>!document.getElementById(id));
const editor=document.getElementById('editor'),login=document.getElementById('login');
if(editor)['title','eyebrow','summary','image_url','image_alt','order'].forEach(name=>{if(!editor.elements.namedItem(name))missing.push('editor.'+name)});
if(login)['email','password'].forEach(name=>{if(!login.elements.namedItem(name))missing.push('login.'+name)});
function fail(){const notice=document.getElementById('notice');if(notice)notice.textContent='De beheerpagina kon niet volledig worden geladen. Vernieuw de pagina volledig en probeer opnieuw. Er is niets opgeslagen.';if(login)login.querySelectorAll('input,button').forEach(n=>n.disabled=true)}
if(missing.length){fail()}else{import('./admin-workspace.js?v=review1').catch(fail)}

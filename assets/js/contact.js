(function(){
'use strict';
var BASE='https://xhqoobighsubxhoobhfc.supabase.co',KEY='sb_publishable_lXAeFrgFbU4GmD8XYoNbdg_XpEaeY1R';
var form=document.getElementById('contact-form'),status=document.getElementById('form-status'),done=document.getElementById('cp-done');
if(!form)return;
var button=form.querySelector('button[type=submit]'),counter=document.getElementById('message-count'),busy=false;
document.getElementById('year').textContent=new Date().getFullYear();
function say(text,isError){status.textContent=text;status.className=isError?'cp-status is-error':'cp-status'}
function finish(){form.hidden=true;done.hidden=false;done.focus()}
form.elements.message.addEventListener('input',function(){counter.textContent=form.elements.message.value.length+' / 5000 tekens'});
form.addEventListener('submit',function(event){
event.preventDefault();if(busy)return;
var name=form.elements.name.value.trim(),email=form.elements.email.value.trim(),message=form.elements.message.value.trim();
if(form.elements.website.value){finish();return}
if(!name){say('Vul je naam in.',true);form.elements.name.focus();return}
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){say('Vul een geldig e-mailadres in.',true);form.elements.email.focus();return}
if(message.length<10){say('Schrijf minimaal een paar woorden over je idee.',true);form.elements.message.focus();return}
busy=true;button.disabled=true;say('Bezig met versturen...',false);
fetch(BASE+'/rest/v1/inquiries',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name:name,email:email,message:message}),credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000)})
.then(function(response){if(response.status!==201)throw new Error('status '+response.status);form.reset();counter.textContent='0 / 5000 tekens';finish()})
.catch(function(){say('Het versturen is niet gelukt. Probeer het later opnieuw.',true)})
.then(function(){busy=false;button.disabled=false});
});
})();

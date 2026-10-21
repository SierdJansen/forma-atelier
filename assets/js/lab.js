document.getElementById('year').textContent=new Date().getFullYear();
import('./design-studio.js').catch(error=>console.warn('Ontwerpstudio niet geladen.',error));
import('./brand-generator.js').catch(error=>console.warn('Merkgenerator niet geladen.',error));

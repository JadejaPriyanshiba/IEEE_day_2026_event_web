/* =========================================================
   Header, navbar + footer
   Owner: Parthvi + Pushkar
   Section: #site-header, #site-footer

   Loaded with "defer", so the HTML is ready when this runs.
   Shared helpers from main.js: IEEEDay.prefersReducedMotion()
   Keep everything inside this block so your variables don't
   clash with other teams' files.
   ========================================================= */

(function () {
    function reduced(){return window.IEEEDay&&typeof window.IEEEDay.prefersReducedMotion==='function'?window.IEEEDay.prefersReducedMotion():window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
    var toggle=document.getElementById('menu-toggle-btn'),close=document.getElementById('menu-close-btn'),drawer=document.getElementById('mobile-index-menu'),previousFocus;
    function closeDrawer(){toggle.setAttribute('aria-expanded','false');drawer.classList.remove('is-active');drawer.setAttribute('aria-hidden','true');document.body.classList.remove('menu-open');(previousFocus||toggle).focus();}
    function openDrawer(){previousFocus=document.activeElement;toggle.setAttribute('aria-expanded','true');drawer.classList.add('is-active');drawer.setAttribute('aria-hidden','false');document.body.classList.add('menu-open');close.focus();}
    if(toggle&&close&&drawer){toggle.addEventListener('click',function(){toggle.getAttribute('aria-expanded')==='true'?closeDrawer():openDrawer();});close.addEventListener('click',closeDrawer);drawer.querySelectorAll('.index-menu-row').forEach(function(link){link.addEventListener('click',closeDrawer);});document.addEventListener('keydown',function(event){if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true')closeDrawer();});}
    var header=document.getElementById('site-header');if(header){var ticking=false;function update(){header.classList.toggle('site-header--scrolled',window.scrollY>12);ticking=false;}update();window.addEventListener('scroll',function(){if(reduced()){update();return;}if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});}
    var links=document.querySelectorAll('.site-nav--desktop .site-nav__link');if(links.length&&'IntersectionObserver'in window){var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;links.forEach(function(link){link.getAttribute('href')==='#'+entry.target.id?link.setAttribute('aria-current','location'):link.removeAttribute('aria-current');});});},{rootMargin:'-20% 0px -65% 0px'});links.forEach(function(link){var target=document.querySelector(link.getAttribute('href'));if(target)observer.observe(target);});}
})();

/* =============================================
   CONFIGURATION
   ============================================= */

// IMPORTANTE: Substitua pelo número real do WhatsApp de Emanuel
// Formato: código do país + DDD + número (somente dígitos)
// Exemplo: '5531999999999' para Minas Gerais
const WHATSAPP_NUMBER = '55XXXXXXXXXXX';

/* =============================================
   AOS – ANIMATE ON SCROLL
   ============================================= */
AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 70,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
});

/* =============================================
   HEADER – SCROLL STATE
   ============================================= */
const header = document.getElementById('header');

function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
    updateActiveNavLink();
}

window.addEventListener('scroll', onScroll, { passive: true });

/* =============================================
   NAVIGATION – HAMBURGER MENU
   ============================================= */
const hamburger = document.getElementById('navHamburger');
const navMenu   = document.getElementById('navMenu');

function openMenu() {
    navMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    navMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
});

// Close on link click
navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) closeMenu();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

/* =============================================
   NAVIGATION – ACTIVE LINK HIGHLIGHT
   ============================================= */
const sections  = Array.from(document.querySelectorAll('section[id]'));
const navLinks  = Array.from(document.querySelectorAll('.nav__link:not(.nav__link--cta)'));

function updateActiveNavLink() {
    const scrollY = window.scrollY + 120;

    let current = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            'is-active',
            link.getAttribute('href') === `#${current}`
        );
    });
}

/* =============================================
   SMOOTH SCROLL – ANCHOR LINKS
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const navHeight = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* =============================================
   HERO – SUBTLE PARALLAX
   ============================================= */
const heroImageCol = document.querySelector('.hero__image-col');

if (heroImageCol && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight * 1.2) {
            heroImageCol.style.transform = `translateY(${scrollY * 0.06}px)`;
        }
    }, { passive: true });
}

/* =============================================
   CONTACT FORM – WHATSAPP REDIRECT
   ============================================= */
const objetivoLabels = {
    hipertrofia:    'Ganho de Massa Muscular',
    emagrecimento:  'Perda de Gordura',
    reabilitacao:   'Reabilitação de Lesões',
    recomposicao:   'Recomposição Corporal',
    resistencia:    'Ganho de Resistência',
    outro:          'Outro',
};

const contatoForm = document.getElementById('contatoForm');

contatoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome      = document.getElementById('nome').value.trim();
    const telefone  = document.getElementById('telefone').value.trim();
    const objetivo  = document.getElementById('objetivo').value;
    const mensagem  = document.getElementById('mensagem').value.trim();

    if (!nome || !telefone || !objetivo) return;

    const objetivoLabel = objetivoLabels[objetivo] || objetivo;

    let msg = `Olá Emanuel! Meu nome é *${nome}*.`;
    msg += `\n\nMeu objetivo é: *${objetivoLabel}*`;
    msg += `\nMeu contato: ${telefone}`;

    if (mensagem) {
        msg += `\n\n${mensagem}`;
    }

    msg += `\n\nGostaria de agendar minha avaliação gratuita!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
});

/* =============================================
   LAZY IMAGES – INTERSECTION OBSERVER
   ============================================= */
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('is-loaded');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(img => imageObserver.observe(img));
}

/* =============================================
   INIT
   ============================================= */
// Run on load to set correct state
onScroll();

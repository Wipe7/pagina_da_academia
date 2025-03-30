/**
 * FitLife Academia - Script principal
 */

// DOM Elements
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav ul li a');

// Functions
// Função para alternar o menu mobile
function toggleMenu() {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Alterar o ícone do botão do menu
    if (menuToggle.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

// Função para fechar o menu mobile quando um link é clicado
function closeMenu() {
    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

// Função para adicionar classe de scroll ao header
function scrollHeader() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Event Listeners
menuToggle.addEventListener('click', toggleMenu);

// Adiciona evento de clique a cada link do menu
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Adiciona evento de scroll para alterar o header
window.addEventListener('scroll', scrollHeader);

// Adiciona evento de scroll para animações ao rolar a página
window.addEventListener('load', () => {
    // Verificar se o navegador suporta Intersection Observer
    if ('IntersectionObserver' in window) {
        // Selecionar todos os elementos que devem ser animados
        const elements = document.querySelectorAll('.feature-card, .class-card, .pricing-card, .testimonial-card');
        
        // Configurar o Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        });
        
        // Observar cada elemento
        elements.forEach(element => {
            observer.observe(element);
        });
    }
});

// Função para lidar com os formulários
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Aqui você adicionaria a lógica de validação de formulário
            // e envio dos dados para o backend
            
            // Exemplo simples de validação
            let valid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (valid) {
                // Simulação de envio bem-sucedido
                const successMessage = document.createElement('div');
                successMessage.classList.add('success-message');
                successMessage.textContent = 'Formulário enviado com sucesso! Em breve entraremos em contato.';
                
                form.reset();
                form.appendChild(successMessage);
                
                // Remover a mensagem após 5 segundos
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    });
});

// Obter parâmetros da URL para pré-selecionar planos
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const plano = urlParams.get('plano');
    
    if (plano) {
        const planoRadio = document.querySelector(`input[name="plano"][value="${plano}"]`);
        if (planoRadio) {
            planoRadio.checked = true;
        }
    }
});
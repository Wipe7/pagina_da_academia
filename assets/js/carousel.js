/**
 * FitLife Academia - Script do carrossel de depoimentos
 */

// DOM Elements
const testimonialSlider = document.querySelector('.testimonial-slider');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.prev-testimonial');
const nextBtn = document.querySelector('.next-testimonial');

// Variáveis
let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
const cardWidth = 100; // 100% da largura do contêiner
const totalCards = testimonialCards.length;

// Funções
// Inicializar o carrossel
function initCarousel() {
    if (testimonialSlider && testimonialCards.length > 0) {
        // Configurar o slider
        updateCarousel();
        
        // Adicionar event listeners
        prevBtn.addEventListener('click', showPrevSlide);
        nextBtn.addEventListener('click', showNextSlide);
        
        // Adicionar suporte para touch (mobile)
        testimonialSlider.addEventListener('touchstart', handleTouchStart, false);
        testimonialSlider.addEventListener('touchend', handleTouchEnd, false);
        
        // Configurar autoplay
        startAutoplay();
    }
}

// Atualizar a posição do carrossel
function updateCarousel() {
    testimonialSlider.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
}

// Mostrar o slide anterior
function showPrevSlide() {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalCards - 1;
    updateCarousel();
    resetAutoplay();
}

// Mostrar o próximo slide
function showNextSlide() {
    currentIndex = (currentIndex < totalCards - 1) ? currentIndex + 1 : 0;
    updateCarousel();
    resetAutoplay();
}

// Manipular evento de início de toque (touchstart)
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

// Manipular evento de fim de toque (touchend)
function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
}

// Processar o gesto de swipe
function handleSwipe() {
    const swipeThreshold = 50; // Mínimo de pixels para considerar um swipe
    const swipeDistance = touchStartX - touchEndX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe para a esquerda: próximo slide
            showNextSlide();
        } else {
            // Swipe para a direita: slide anterior
            showPrevSlide();
        }
    }
}

// Variáveis para autoplay
let autoplayInterval;
const autoplayDelay = 5000; // 5 segundos

// Iniciar autoplay
function startAutoplay() {
    autoplayInterval = setInterval(showNextSlide, autoplayDelay);
}

// Reiniciar autoplay
function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
}

// Parar autoplay ao interagir com a página
function stopAutoplay() {
    clearInterval(autoplayInterval);
}

// Event Listeners adicionais
testimonialSlider.addEventListener('mouseenter', stopAutoplay);
testimonialSlider.addEventListener('mouseleave', startAutoplay);

// Inicializar o carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initCarousel);
/**
 * instructors.js - Script específico para a página de gerenciamento de instrutores
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar elementos da página
    initializePage();
    
    // Configurar os cards de instrutores
    setupInstructorCards();
    
    // Configurar modal de adicionar instrutor
    setupAddInstructorModal();
    
    // Configurar filtros
    setupFilters();
    
    // Configurar ações individuais
    setupInstructorActions();
});

/**
 * Inicializa elementos básicos da página
 */
function initializePage() {
    // Inicializar elementos compartilhados
    if (window.dashboardUtils && window.dashboardUtils.initializeElements) {
        window.dashboardUtils.initializeElements();
    }
    
    // Inicializar dropdowns específicos da página de instrutores
    document.querySelectorAll('.action-btn.menu-toggle').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Fechar outros dropdowns
            document.querySelectorAll('.action-dropdown').forEach(dropdown => {
                if (dropdown !== this.nextElementSibling) {
                    dropdown.hidden = true;
                }
            });
            
            // Toggle do dropdown atual
            const dropdown = this.nextElementSibling;
            dropdown.hidden = !dropdown.hidden;
        });
    });
    
    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', function() {
        document.querySelectorAll('.action-dropdown').forEach(dropdown => {
            dropdown.hidden = true;
        });
    });
}

/**
 * Configura cards de instrutores com interatividade
 */
function setupInstructorCards() {
    // Fazer os cards clicáveis para abrir detalhes
    document.querySelectorAll('.instructor-card').forEach(card => {
        // Evitar que clique em botões de ação abra o card
        const actionBtns = card.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
        
        // Tornar o card clicável
        card.addEventListener('click', function() {
            // Obter ID do instrutor a partir do botão de visualização
            const viewBtn = this.querySelector('[data-action="view"]');
            if (viewBtn) {
                const instructorId = viewBtn.getAttribute('data-instructor-id');
                viewInstructor(instructorId);
            }
        });
    });
}

/**
 * Configura o modal de adicionar instrutor
 */
function setupAddInstructorModal() {
    const addInstructorBtn = document.getElementById('add-instructor-btn');
    const addInstructorModal = document.getElementById('add-instructor-modal');
    const cancelAddInstructorBtn = document.getElementById('cancel-add-instructor');
    const addInstructorForm = document.getElementById('add-instructor-form');
    
    if (addInstructorBtn && addInstructorModal) {
        // Abrir modal ao clicar no botão
        addInstructorBtn.addEventListener('click', function() {
            addInstructorModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impedir rolagem
        });
        
        // Fechar modal ao clicar no backdrop
        addInstructorModal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        // Fechar modal ao clicar no botão de fechar
        addInstructorModal.querySelector('.modal-close').addEventListener('click', closeModal);
        
        // Fechar modal ao clicar no botão cancelar
        if (cancelAddInstructorBtn) {
            cancelAddInstructorBtn.addEventListener('click', closeModal);
        }
        
        // Manipular envio do formulário
        if (addInstructorForm) {
            addInstructorForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar formulário
                if (validateForm(this)) {
                    // Em uma aplicação real, aqui você enviaria os dados via AJAX
                    saveNewInstructor(this);
                }
            });
        }
        
        function closeModal() {
            addInstructorModal.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar rolagem
            
            // Resetar formulário
            if (addInstructorForm) {
                addInstructorForm.reset();
            }
        }
    }
}

/**
 * Configura filtros da página
 */
function setupFilters() {
    const statusFilter = document.getElementById('status-filter');
    const specialtyFilter = document.getElementById('specialty-filter');
    const searchInput = document.querySelector('.filter-search input');
    const searchButton = document.querySelector('.filter-search button');
    
    // Aplicar filtros ao alterar seleções
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', applyFilters);
    }
    
    // Aplicar filtro ao pressionar Enter no campo de busca
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    }
    
    // Aplicar filtro ao clicar no botão de busca
    if (searchButton) {
        searchButton.addEventListener('click', applyFilters);
    }
    
    function applyFilters() {
        const status = statusFilter ? statusFilter.value : 'all';
        const specialty = specialtyFilter ? specialtyFilter.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        // Filtrar cards de instrutores
        document.querySelectorAll('.instructor-card').forEach(card => {
            let visible = true;
            
            // Filtro por status
            if (status !== 'all') {
                const cardStatus = card.querySelector('.instructor-status').classList.contains(status);
                if (!cardStatus) {
                    visible = false;
                }
            }
            
            // Filtro por especialidade
            if (specialty !== 'all' && visible) {
                const badges = Array.from(card.querySelectorAll('.specialty-badge'));
                const hasSpecialty = badges.some(badge => badge.textContent.toLowerCase() === specialty);
                if (!hasSpecialty) {
                    visible = false;
                }
            }
            
            // Filtro por termo de busca
            if (searchTerm && visible) {
                const instructorName = card.querySelector('.instructor-name').textContent.toLowerCase();
                if (!instructorName.includes(searchTerm)) {
                    visible = false;
                }
            }
            
            // Exibir ou ocultar o card
            card.style.display = visible ? '' : 'none';
        });
        
        // Em uma aplicação real, aqui você poderia fazer uma chamada AJAX
        // para buscar dados filtrados do servidor em vez de filtrar no cliente
        
        // Mostrar mensagem quando não há resultados
        const visibleCards = document.querySelectorAll('.instructor-card[style=""]').length;
        showNoResultsMessage(visibleCards === 0);
    }
    
    function showNoResultsMessage(show) {
        // Remover mensagem existente, se houver
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        if (show) {
            const grid = document.querySelector('.instructor-grid');
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.style.textAlign = 'center';
            message.style.padding = '30px';
            message.style.gridColumn = '1 / -1';
            message.innerHTML = '<i class="fas fa-search" style="font-size: 2rem; margin-bottom: 15px; color: var(--text-light);"></i>' +
                               '<p>Nenhum instrutor encontrado com os filtros selecionados.</p>' +
                               '<button class="btn-tertiary reset-filters">Limpar Filtros</button>';
            
            grid.appendChild(message);
            
            // Adicionar evento para resetar filtros
            message.querySelector('.reset-filters').addEventListener('click', resetFilters);
        }
    }
    
    function resetFilters() {
        if (statusFilter) statusFilter.value = 'all';
        if (specialtyFilter) specialtyFilter.value = 'all';
        if (searchInput) searchInput.value = '';
        
        applyFilters();
    }
}

/**
 * Configura ações individuais para cada instrutor
 */
function setupInstructorActions() {
    // Botões de ação rápida (visualizar e editar)
    document.querySelectorAll('.action-btn[data-action]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Impedir que o evento chegue ao card
            
            const instructorId = this.getAttribute('data-instructor-id');
            const action = this.getAttribute('data-action');
            
            switch (action) {
                case 'view':
                    viewInstructor(instructorId);
                    break;
                case 'edit':
                    editInstructor(instructorId);
                    break;
            }
        });
    });
    
    // Ações do menu dropdown
    document.querySelectorAll('.action-dropdown a[data-action]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Impedir que o evento chegue ao card
            
            const instructorId = this.getAttribute('data-instructor-id');
            const action = this.getAttribute('data-action');
            
            switch (action) {
                case 'schedule':
                    viewSchedule(instructorId);
                    break;
                case 'vacation':
                    registerVacation(instructorId);
                    break;
                case 'return':
                    registerReturn(instructorId);
                    break;
                case 'deactivate':
                    if (confirm('Tem certeza que deseja desativar este instrutor?')) {
                        deactivateInstructor(instructorId);
                    }
                    break;
                case 'activate':
                    activateInstructor(instructorId);
                    break;
                case 'remove':
                    if (confirm('Tem certeza que deseja remover este instrutor? Esta ação não pode ser desfeita.')) {
                        removeInstructor(instructorId);
                    }
                    break;
            }
        });
    });
}

/**
 * Validar formulário de instrutor
 */
function validateForm(form) {
    // Validação básica de campos obrigatórios
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
            
            // Adicionar feedback visual
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Este campo é obrigatório';
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
            }
        } else {
            field.classList.remove('error');
            
            // Remover mensagem de erro se existir
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                field.nextElementSibling.remove();
            }
        }
    });
    
    // Validar se pelo menos uma especialidade foi selecionada
    const specialties = form.querySelectorAll('input[name="specialties[]"]:checked');
    if (specialties.length === 0) {
        const specialtiesContainer = form.querySelector('.specialty-options');
        isValid = false;
        
        // Adicionar feedback visual
        if (!specialtiesContainer.nextElementSibling || !specialtiesContainer.nextElementSibling.classList.contains('error-message')) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Selecione pelo menos uma especialidade';
            specialtiesContainer.parentNode.appendChild(errorMessage);
        }
    } else {
        const specialtiesContainer = form.querySelector('.specialty-options');
        if (specialtiesContainer.nextElementSibling && specialtiesContainer.nextElementSibling.classList.contains('error-message')) {
            specialtiesContainer.nextElementSibling.remove();
        }
    }
    
    return isValid;
}

// Funções simuladas para ações de instrutores

/**
 * Salvar novo instrutor
 */
function saveNewInstructor(form) {
    // Obter dados do formulário
    const formData = new FormData(form);
    const instructorData = {};
    
    formData.forEach((value, key) => {
        if (key === 'specialties[]') {
            if (!instructorData.specialties) {
                instructorData.specialties = [];
            }
            instructorData.specialties.push(value);
        } else {
            instructorData[key] = value;
        }
    });
    
    console.log('Salvando novo instrutor:', instructorData);
    
    // Em uma aplicação real, aqui você enviaria os dados para o servidor via AJAX
    
    // Simular sucesso após 1 segundo
    setTimeout(() => {
        // Fechar modal
        document.getElementById('add-instructor-modal').classList.remove('active');
        document.body.style.overflow = '';
        
        // Resetar formulário
        form.reset();
        
        // Mostrar notificação de sucesso
        showNotification('Instrutor adicionado com sucesso!', 'success');
        
        // Simular recarregamento da tabela ou adição dinâmica do novo instrutor
        // Em uma aplicação real, você atualizaria a UI com os dados retornados pelo servidor
    }, 1000);
}

/**
 * Visualizar detalhes do instrutor
 */
function viewInstructor(instructorId) {
    console.log(`Visualizando instrutor ID: ${instructorId}`);
    
    // Em uma aplicação real, você buscaria os detalhes do instrutor do servidor
    // e carregaria no modal de visualização
    
    // Simular carregamento de dados
    showNotification('Carregando dados do instrutor...', 'info');
    
    // Na aplicação real, você teria uma chamada AJAX aqui
    
    // Para simulação, vamos apenas exibir uma mensagem
    setTimeout(() => {
        alert(`Um modal com os detalhes do instrutor ID: ${instructorId} seria exibido aqui.`);
    }, 500);
}

/**
 * Editar dados do instrutor
 */
function editInstructor(instructorId) {
    console.log(`Editando instrutor ID: ${instructorId}`);
    
    // Em uma aplicação real, você buscaria os dados do instrutor do servidor
    // e preencheria um formulário de edição
    
    // Simular carregamento de dados
    showNotification('Carregando formulário de edição...', 'info');
    
    // Na aplicação real, você teria uma chamada AJAX aqui
    
    // Para simulação, vamos apenas exibir uma mensagem
    setTimeout(() => {
        alert(`Um formulário de edição para o instrutor ID: ${instructorId} seria exibido aqui.`);
    }, 500);
}

/**
 * Visualizar agenda do instrutor
 */
function viewSchedule(instructorId) {
    console.log(`Visualizando agenda do instrutor ID: ${instructorId}`);
    
    // Simular visualização de agenda
    showNotification('Carregando agenda do instrutor...', 'info');
    
    // Para simulação, vamos apenas exibir uma mensagem
    setTimeout(() => {
        alert(`A agenda do instrutor ID: ${instructorId} seria exibida aqui.`);
    }, 500);
}

/**
 * Registrar férias para o instrutor
 */
function registerVacation(instructorId) {
    console.log(`Registrando férias para o instrutor ID: ${instructorId}`);
    
    // Em uma aplicação real, você abriria um formulário para registrar datas de férias
    
    // Para simulação, vamos apenas exibir um prompt
    const startDate = prompt("Data de início das férias (dd/mm/aaaa):", "01/04/2025");
    const endDate = prompt("Data de término das férias (dd/mm/aaaa):", "15/04/2025");
    
    if (startDate && endDate) {
        // Simular sucesso
        showNotification(`Férias registradas de ${startDate} até ${endDate}`, 'success');
        
        // Em uma aplicação real, você atualizaria o status do instrutor para "Férias"
        // após uma chamada bem-sucedida ao servidor
        
        // Simulando atualização na UI
        const instructorCard = document.querySelector(`[data-instructor-id="${instructorId}"]`).closest('.instructor-card');
        if (instructorCard) {
            const statusBadge = instructorCard.querySelector('.instructor-status');
            statusBadge.className = 'instructor-status vacation';
            statusBadge.textContent = 'Férias';
        }
    }
}

/**
 * Registrar retorno de férias
 */
function registerReturn(instructorId) {
    console.log(`Registrando retorno de férias para o instrutor ID: ${instructorId}`);
    
    // Em uma aplicação real, você confirmaria a data de retorno
    
    // Para simulação, vamos apenas exibir uma confirmação
    if (confirm("Confirmar retorno do instrutor às atividades?")) {
        // Simular sucesso
        showNotification('Retorno registrado com sucesso', 'success');
        
        // Em uma aplicação real, você atualizaria o status do instrutor para "Ativo"
        // após uma chamada bem-sucedida ao servidor
        
        // Simulando atualização na UI
        const instructorCard = document.querySelector(`[data-instructor-id="${instructorId}"]`).closest('.instructor-card');
        if (instructorCard) {
            const statusBadge = instructorCard.querySelector('.instructor-status');
            statusBadge.className = 'instructor-status active';
            statusBadge.textContent = 'Ativo';
        }
    }
}

/**
 * Desativar instrutor
 */
function deactivateInstructor(instructorId) {
    console.log(`Desativando instrutor ID: ${instructorId}`);
    
    // Simular chamada ao servidor
    showNotification('Desativando instrutor...', 'info');
    
    // Em uma aplicação real, você enviaria uma solicitação para o servidor
    
    // Simular sucesso após 1 segundo
    setTimeout(() => {
        // Mostrar notificação de sucesso
        showNotification('Instrutor desativado com sucesso', 'success');
        
        // Atualizar status na UI
        const instructorCard = document.querySelector(`[data-instructor-id="${instructorId}"]`).closest('.instructor-card');
        if (instructorCard) {
            const statusBadge = instructorCard.querySelector('.instructor-status');
            statusBadge.className = 'instructor-status inactive';
            statusBadge.textContent = 'Inativo';
            
            // Atualizar dropdown de ações (remover opção de desativar, adicionar opção de ativar)
            const dropdown = instructorCard.querySelector('.action-dropdown');
            const deactivateLink = dropdown.querySelector('[data-action="deactivate"]');
            
            if (deactivateLink) {
                const activateLink = document.createElement('a');
                activateLink.href = '#ativar';
                activateLink.setAttribute('data-instructor-id', instructorId);
                activateLink.setAttribute('data-action', 'activate');
                activateLink.className = 'text-success';
                activateLink.innerHTML = '<i class="fas fa-user-check" aria-hidden="true"></i> Ativar';
                
                // Adicionar evento ao novo link
                activateLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    activateInstructor(instructorId);
                });
                
                // Substituir link no dropdown
                deactivateLink.parentNode.replaceChild(activateLink, deactivateLink);
            }
        }
    }, 1000);
}

/**
 * Ativar instrutor
 */
function activateInstructor(instructorId) {
    console.log(`Ativando instrutor ID: ${instructorId}`);
    
    // Simular chamada ao servidor
    showNotification('Ativando instrutor...', 'info');
    
    // Em uma aplicação real, você enviaria uma solicitação para o servidor
    
    // Simular sucesso após 1 segundo
    setTimeout(() => {
        // Mostrar notificação de sucesso
        showNotification('Instrutor ativado com sucesso', 'success');
        
        // Atualizar status na UI
        const instructorCard = document.querySelector(`[data-instructor-id="${instructorId}"]`).closest('.instructor-card');
        if (instructorCard) {
            const statusBadge = instructorCard.querySelector('.instructor-status');
            statusBadge.className = 'instructor-status active';
            statusBadge.textContent = 'Ativo';
            
            // Atualizar dropdown de ações (remover opção de ativar, adicionar opção de desativar)
            const dropdown = instructorCard.querySelector('.action-dropdown');
            const activateLink = dropdown.querySelector('[data-action="activate"]');
            
            if (activateLink) {
                const deactivateLink = document.createElement('a');
                deactivateLink.href = '#desativar';
                deactivateLink.setAttribute('data-instructor-id', instructorId);
                deactivateLink.setAttribute('data-action', 'deactivate');
                deactivateLink.className = 'text-danger';
                deactivateLink.innerHTML = '<i class="fas fa-user-slash" aria-hidden="true"></i> Desativar';
                
                // Adicionar evento ao novo link
                deactivateLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm('Tem certeza que deseja desativar este instrutor?')) {
                        deactivateInstructor(instructorId);
                    }
                });
                
                // Substituir link no dropdown
                activateLink.parentNode.replaceChild(deactivateLink, activateLink);
            }
        }
    }, 1000);
}

/**
 * Remover instrutor
 */
function removeInstructor(instructorId) {
    console.log(`Removendo instrutor ID: ${instructorId}`);
    
    // Simular chamada ao servidor
    showNotification('Removendo instrutor...', 'info');
    
    // Em uma aplicação real, você enviaria uma solicitação para o servidor
    
    // Simular sucesso após 1 segundo
    setTimeout(() => {
        // Mostrar notificação de sucesso
        showNotification('Instrutor removido com sucesso', 'success');
        
        // Remover o card da UI
        const instructorCard = document.querySelector(`[data-instructor-id="${instructorId}"]`).closest('.instructor-card');
        if (instructorCard) {
            // Adicionar classe para animar a saída
            instructorCard.style.opacity = '0';
            instructorCard.style.transform = 'scale(0.8)';
            
            // Remover o elemento após a animação
            setTimeout(() => {
                instructorCard.remove();
                
                // Verificar se há instrutores restantes
                const remainingCards = document.querySelectorAll('.instructor-card').length;
                if (remainingCards === 0) {
                    // Mostrar mensagem de "nenhum instrutor"
                    const grid = document.querySelector('.instructor-grid');
                    const message = document.createElement('div');
                    message.className = 'no-results-message';
                    message.style.textAlign = 'center';
                    message.style.padding = '30px';
                    message.style.gridColumn = '1 / -1';
                    message.innerHTML = '<i class="fas fa-user-slash" style="font-size: 2rem; margin-bottom: 15px; color: var(--text-light);"></i>' +
                                       '<p>Nenhum instrutor encontrado.</p>' +
                                       '<button class="btn-primary" id="add-new-instructor">Adicionar Instrutor</button>';
                    
                    grid.appendChild(message);
                    
                    // Adicionar evento para abrir modal de novo instrutor
                    message.querySelector('#add-new-instructor').addEventListener('click', function() {
                        document.getElementById('add-instructor-btn').click();
                    });
                }
            }, 300);
        }
    }, 1000);
}

/**
 * Função para exibir mensagens de notificação
 */
function showNotification(message, type = 'info') {
    // Usar a função global se disponível
    if (window.dashboardUtils && window.dashboardUtils.showNotification) {
        window.dashboardUtils.showNotification(message, type);
        return;
    }
    
    // Implementação local caso a função global não esteja disponível
    console.log(`Notificação (${type}): ${message}`);
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="notification-message">${message}</div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Fechar automaticamente após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        
        // Remover do DOM após a animação
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        
        // Remover do DOM após a animação
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}
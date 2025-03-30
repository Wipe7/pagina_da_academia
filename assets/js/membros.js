/**
 * members.js - Script específico para a página de gerenciamento de membros
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar elementos da página
    initializePage();
    
    // Configurar tabela de membros
    setupMembersTable();
    
    // Configurar modal de adicionar membro
    setupAddMemberModal();
    
    // Configurar ações em massa
    setupBulkActions();
    
    // Configurar ações individuais
    setupMemberActions();
});

/**
 * Inicializa elementos básicos da página
 */
function initializePage() {
    // Inicializar elementos e componentes compartilhados
    if (window.dashboardUtils && window.dashboardUtils.initializeElements) {
        window.dashboardUtils.initializeElements();
    }
    
    // Inicializar dropdowns específicos da página de membros
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
    
    // Inicializar tooltips se houver bibliotecas de UI
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    }
}

/**
 * Configura a tabela de membros com funcionalidades de ordenação, filtragem, etc
 */
function setupMembersTable() {
    // Configurar seleção de todos os checkboxes
    const selectAllCheckbox = document.getElementById('select-all');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            
            // Habilitar/desabilitar ações em massa
            updateBulkActionsState();
        });
    }
    
    // Atualizar estado do "selecionar todos" quando checkboxes individuais são alterados
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Verificar se todos estão marcados
            const allChecked = [...rowCheckboxes].every(cb => cb.checked);
            const someChecked = [...rowCheckboxes].some(cb => cb.checked);
            
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate = someChecked && !allChecked;
            }
            
            // Habilitar/desabilitar ações em massa
            updateBulkActionsState();
        });
    });
    
    // Configurar ordenação das colunas
    const sortableHeaders = document.querySelectorAll('th.sortable');
    
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Remover classes de ordenação de todas as colunas
            sortableHeaders.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            
            // Adicionar classe de ordenação à coluna clicada
            if (!this.classList.contains('sort-asc') && !this.classList.contains('sort-desc')) {
                this.classList.add('sort-asc');
            } else if (this.classList.contains('sort-asc')) {
                this.classList.remove('sort-asc');
                this.classList.add('sort-desc');
            } else {
                this.classList.remove('sort-desc');
                this.classList.add('sort-asc');
            }
            
            // Ordenar a tabela (simulado, em uma aplicação real seria uma chamada AJAX)
            sortTable(this.getAttribute('data-sort'), this.classList.contains('sort-asc'));
        });
    });
    
    // Configurar filtros
    const filterInputs = document.querySelectorAll('.filter-bar select, .filter-bar input');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Em uma aplicação real, isso acionaria uma chamada AJAX para filtrar os dados
            applyFilters();
        });
    });
    
    // Configurar paginação
    document.querySelectorAll('.pagination-btn').forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                // Remover classe ativa de todos os botões
                document.querySelectorAll('.pagination-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Adicionar classe ativa ao botão clicado (exceto para botões de navegação)
                if (!this.querySelector('.fas')) {
                    this.classList.add('active');
                }
                
                // Carregar a página selecionada (simulado)
                loadPage(this.textContent.trim());
            });
        }
    });
}
/**
 * Configura o modal de adicionar membro
 */
function setupAddMemberModal() {
    const addMemberBtn = document.getElementById('add-member-btn');
    const addMemberModal = document.getElementById('add-member-modal');
    const cancelAddMemberBtn = document.getElementById('cancel-add-member');
    const addMemberForm = document.getElementById('add-member-form');
    
    if (addMemberBtn && addMemberModal) {
        // Abrir modal ao clicar no botão
        addMemberBtn.addEventListener('click', function() {
            addMemberModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impedir rolagem
        });
        
        // Fechar modal ao clicar no backdrop
        addMemberModal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        // Fechar modal ao clicar no botão de fechar
        addMemberModal.querySelector('.modal-close').addEventListener('click', closeModal);
        
        // Fechar modal ao clicar no botão cancelar
        if (cancelAddMemberBtn) {
            cancelAddMemberBtn.addEventListener('click', closeModal);
        }
        
        // Manipular envio do formulário
        if (addMemberForm) {
            addMemberForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar formulário
                if (validateForm(this)) {
                    // Em uma aplicação real, aqui você enviaria os dados via AJAX
                    saveNewMember(this);
                }
            });
        }
        
        function closeModal() {
            addMemberModal.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar rolagem
            
            // Resetar formulário
            if (addMemberForm) {
                addMemberForm.reset();
            }
        }
    }
}

/**
 * Configura as ações em massa
 */
function setupBulkActions() {
    const bulkActionSelect = document.getElementById('bulk-action-select');
    const applyBtn = document.querySelector('.btn-apply');
    
    if (bulkActionSelect && applyBtn) {
        // Aplicar ação selecionada
        applyBtn.addEventListener('click', function() {
            if (bulkActionSelect.value) {
                const selectedIds = getSelectedMemberIds();
                
                if (selectedIds.length > 0) {
                    // Confirmar ação potencialmente perigosa
                    if (bulkActionSelect.value === 'delete') {
                        if (!confirm(`Tem certeza que deseja excluir ${selectedIds.length} membros?`)) {
                            return;
                        }
                    }
                    
                    // Executar ação em massa (simulado)
                    executeBulkAction(bulkActionSelect.value, selectedIds);
                }
            }
        });
    }
}

/**
 * Configura ações individuais para cada membro
 */
function setupMemberActions() {
    // Botões de ação rápida (visualizar e editar)
    document.querySelectorAll('.action-btn[data-action]').forEach(button => {
        button.addEventListener('click', function() {
            const memberId = this.getAttribute('data-member-id');
            const action = this.getAttribute('data-action');
            
            switch (action) {
                case 'view':
                    viewMember(memberId);
                    break;
                case 'edit':
                    editMember(memberId);
                    break;
            }
        });
    });
    
    // Ações do menu dropdown
    document.querySelectorAll('.action-dropdown a[data-action]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const memberId = this.getAttribute('data-member-id');
            const action = this.getAttribute('data-action');
            
            switch (action) {
                case 'email':
                    sendEmail(memberId);
                    break;
                case 'renew':
                    renewPlan(memberId);
                    break;
                case 'pause':
                    pauseMembership(memberId);
                    break;
                case 'cancel':
                    if (confirm('Tem certeza que deseja cancelar esta matrícula?')) {
                        cancelMembership(memberId);
                    }
                    break;
            }
        });
    });
}

/**
 * Atualiza o estado dos botões de ação em massa
 */
function updateBulkActionsState() {
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const bulkActionSelect = document.getElementById('bulk-action-select');
    const applyBtn = document.querySelector('.btn-apply');
    
    const anyChecked = [...rowCheckboxes].some(cb => cb.checked);
    
    if (bulkActionSelect && applyBtn) {
        bulkActionSelect.disabled = !anyChecked;
        applyBtn.disabled = !anyChecked || !bulkActionSelect.value;
    }
}

/**
 * Retorna um array com IDs dos membros selecionados
 */
function getSelectedMemberIds() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    return Array.from(selectedCheckboxes).map(checkbox => {
        const row = checkbox.closest('tr');
        const actionBtn = row.querySelector('.action-btn[data-member-id]');
        return actionBtn ? actionBtn.getAttribute('data-member-id') : null;
    }).filter(id => id !== null);
}
/**
 * Função simulada - ordenação da tabela
 */
function sortTable(column, isAscending) {
    console.log(`Ordenando por ${column} em ordem ${isAscending ? 'ascendente' : 'descendente'}`);
    
    // Em uma aplicação real, aqui você faria uma chamada AJAX para recarregar os dados ordenados
    // ou ordenaria os dados no cliente usando JavaScript
    
    // Simulação de notificação de sucesso
    showNotification(`Tabela ordenada por ${column}`);
}

/**
 * Função simulada - aplicar filtros
 */
function applyFilters() {
    const statusFilter = document.getElementById('status-filter').value;
    const planFilter = document.getElementById('plan-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const searchFilter = document.querySelector('.filter-search input').value;
    
    console.log('Aplicando filtros:', {
        status: statusFilter,
        plan: planFilter,
        date: dateFilter,
        search: searchFilter
    });
    
    // Em uma aplicação real, aqui você faria uma chamada AJAX para recarregar os dados filtrados
    
    // Simulação de notificação de sucesso
    showNotification('Filtros aplicados com sucesso');
}

/**
 * Função simulada - carregar página da tabela
 */
function loadPage(page) {
    console.log(`Carregando página ${page}`);
    
    // Em uma aplicação real, aqui você faria uma chamada AJAX para carregar os dados da página
    
    // Simulação de notificação de sucesso
    showNotification(`Carregando página ${page}`);
}

/**
 * Função simulada - validar formulário
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
    
    return isValid;
}

/**
 * Função simulada - salvar novo membro
 */
function saveNewMember(form) {
    // Obter dados do formulário
    const formData = new FormData(form);
    const memberData = {};
    
    formData.forEach((value, key) => {
        memberData[key] = value;
    });
    
    console.log('Salvando novo membro:', memberData);
    
    // Em uma aplicação real, aqui você enviaria os dados para o servidor via AJAX
    
    // Simular sucesso após 1 segundo
    setTimeout(() => {
        // Fechar modal
        document.getElementById('add-member-modal').classList.remove('active');
        document.body.style.overflow = '';
        
        // Resetar formulário
        form.reset();
        
        // Mostrar notificação de sucesso
        showNotification('Membro adicionado com sucesso!', 'success');
        
        // Simular recarregamento da tabela
        console.log('Recarregando tabela...');
    }, 1000);
}

/**
 * Função simulada - executar ação em massa
 */
function executeBulkAction(action, memberIds) {
    console.log(`Executando ação "${action}" nos membros:`, memberIds);
    
    // Em uma aplicação real, aqui você enviaria a ação para o servidor via AJAX
    
    // Simular sucesso após 1 segundo
    setTimeout(() => {
        // Mostrar notificação de sucesso
        showNotification(`Ação "${action}" executada com sucesso em ${memberIds.length} membros`, 'success');
        
        // Desmarcar todos os checkboxes
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        document.getElementById('select-all').checked = false;
        
        // Atualizar estado dos botões
        updateBulkActionsState();
    }, 1000);
}

/**
 * Funções simuladas para ações individuais
 */
function viewMember(memberId) {
    console.log(`Visualizando membro ID: ${memberId}`);
    alert(`A visualização detalhada do membro ID: ${memberId} seria exibida em um modal.`);
}

function editMember(memberId) {
    console.log(`Editando membro ID: ${memberId}`);
    alert(`Um formulário de edição para o membro ID: ${memberId} seria exibido em um modal.`);
}

function sendEmail(memberId) {
    console.log(`Enviando email para membro ID: ${memberId}`);
    alert(`Um formulário de email para o membro ID: ${memberId} seria exibido.`);
}

function renewPlan(memberId) {
    console.log(`Renovando plano do membro ID: ${memberId}`);
    alert(`O plano do membro ID: ${memberId} seria renovado.`);
}

function pauseMembership(memberId) {
    console.log(`Pausando matrícula do membro ID: ${memberId}`);
    alert(`A matrícula do membro ID: ${memberId} seria pausada.`);
}

function cancelMembership(memberId) {
    console.log(`Cancelando matrícula do membro ID: ${memberId}`);
    
    // Simulação de cancelamento
    setTimeout(() => {
        showNotification(`Matrícula do membro ID: ${memberId} cancelada com sucesso`, 'success');
        
        // Em uma aplicação real, você atualizaria a interface ou recarregaria os dados
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
    alert(message);
}
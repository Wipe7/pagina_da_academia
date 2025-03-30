/**
 * classes.js - Script específico para a página de gerenciamento de aulas
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar elementos da página
    initializePage();
    
    // Configurar alteração de visualização (calendário/lista)
    setupViewToggle();
    
    // Configurar navegação de datas
    setupDateNavigation();
    
    // Configurar modal de adicionar aula
    setupAddClassModal();
    
    // Configurar modal de participantes
    setupParticipantsModal();
    
    // Configurar ações das aulas
    setupClassActions();
});

/**
 * Inicializa elementos básicos da página
 */
function initializePage() {
    // Inicializar elementos e componentes compartilhados
    if (window.dashboardUtils && window.dashboardUtils.initializeElements) {
        window.dashboardUtils.initializeElements();
    }
    
    // Aplicar filtros iniciais
    const filterInputs = document.querySelectorAll('.filter-bar select');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            applyFilters();
        });
    });
    
    // Configurar ações em massa para a visualização de lista
    setupBulkActions();
}

/**
 * Configura alteração entre visualização de calendário e lista
 */
function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const calendarView = document.getElementById('calendar-view');
    const listView = document.getElementById('list-view');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe ativa de todos os botões
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            this.classList.add('active');
            
            // Mostrar a visualização selecionada
            const view = this.getAttribute('data-view');
            if (view === 'calendar') {
                calendarView.style.display = 'block';
                listView.style.display = 'none';
            } else {
                calendarView.style.display = 'none';
                listView.style.display = 'block';
            }
        });
    });
}

/**
 * Configura navegação de datas do calendário
 */
function setupDateNavigation() {
    const prevDateBtn = document.getElementById('prev-date');
    const nextDateBtn = document.getElementById('next-date');
    const todayDateBtn = document.getElementById('today-date');
    const currentDateEl = document.getElementById('current-date');
    
    // Data atual sendo visualizada
    let currentDate = new Date();
    
    // Atualizar o texto da data atual
    updateDateDisplay();
    
    // Botão de data anterior
    if (prevDateBtn) {
        prevDateBtn.addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() - 7); // Voltar uma semana
            updateDateDisplay();
            loadCalendarData();
        });
    }
    
    // Botão de próxima data
    if (nextDateBtn) {
        nextDateBtn.addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() + 7); // Avançar uma semana
            updateDateDisplay();
            loadCalendarData();
        });
    }
    
    // Botão de hoje
    if (todayDateBtn) {
        todayDateBtn.addEventListener('click', function() {
            currentDate = new Date(); // Redefinir para a data atual
            updateDateDisplay();
            loadCalendarData();
        });
    }
    
    function updateDateDisplay() {
        if (currentDateEl) {
            const month = currentDate.toLocaleString('pt-BR', { month: 'long' });
            const year = currentDate.getFullYear();
            currentDateEl.textContent = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
        }
    }
}
/**
 * Configura o modal de adicionar aula
 */
function setupAddClassModal() {
    const addClassBtn = document.getElementById('add-class-btn');
    const addClassModal = document.getElementById('add-class-modal');
    const cancelAddClassBtn = document.getElementById('cancel-add-class');
    const addClassForm = document.getElementById('add-class-form');
    const classRecurringCheckbox = document.getElementById('class-recurring');
    const recurringOptions = document.querySelectorAll('.recurring-options');
    
    if (addClassBtn && addClassModal) {
        // Abrir modal ao clicar no botão
        addClassBtn.addEventListener('click', function() {
            addClassModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impedir rolagem
        });
        
        // Fechar modal ao clicar no backdrop
        addClassModal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        // Fechar modal ao clicar no botão de fechar
        addClassModal.querySelector('.modal-close').addEventListener('click', closeModal);
        
        // Fechar modal ao clicar no botão cancelar
        if (cancelAddClassBtn) {
            cancelAddClassBtn.addEventListener('click', closeModal);
        }
        
        // Toggle de opções recorrentes
        if (classRecurringCheckbox) {
            classRecurringCheckbox.addEventListener('change', function() {
                recurringOptions.forEach(option => {
                    option.style.display = this.checked ? 'block' : 'none';
                });
            });
        }
        
        // Manipular envio do formulário
        if (addClassForm) {
            addClassForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar formulário
                if (validateForm(this)) {
                    // Em uma aplicação real, aqui você enviaria os dados via AJAX
                    saveNewClass(this);
                }
            });
        }
        
        function closeModal() {
            addClassModal.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar rolagem
            
            // Resetar formulário
            if (addClassForm) {
                addClassForm.reset();
                
                // Ocultar opções recorrentes
                recurringOptions.forEach(option => {
                    option.style.display = 'none';
                });
            }
        }
    }
}

/**
 * Configura o modal de participantes
 */
function setupParticipantsModal() {
    const participantsModal = document.getElementById('participants-modal');
    const viewParticipantsBtns = document.querySelectorAll('.action-btn[data-action="view-participants"]');
    
    if (participantsModal && viewParticipantsBtns.length > 0) {
        // Abrir modal ao clicar no botão
        viewParticipantsBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const classId = this.getAttribute('data-class-id');
                
                // Em uma aplicação real, aqui você carregaria os dados via AJAX
                loadParticipantsData(classId);
                
                participantsModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Impedir rolagem
            });
        });
        
        // Fechar modal ao clicar no backdrop
        participantsModal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        // Fechar modal ao clicar no botão de fechar
        participantsModal.querySelector('.modal-close').addEventListener('click', closeModal);
        
        function closeModal() {
            participantsModal.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar rolagem
        }
    }
}

/**
 * Configura ações das aulas
 */
function setupClassActions() {
    // Botões de edição nos cards do calendário
    document.querySelectorAll('.class-card .action-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Impedir propagação para o card
            
            const action = this.querySelector('i').classList.contains('fa-edit') ? 'edit' : 'delete';
            const classCard = this.closest('.class-card');
            
            if (action === 'edit') {
                editClass(classCard);
            } else if (action === 'delete') {
                if (confirm('Tem certeza que deseja excluir esta aula?')) {
                    deleteClass(classCard);
                }
            }
        });
    });
    
    // Ações na visualização de lista
    document.querySelectorAll('.classes-table .action-btn[data-action]').forEach(button => {
        button.addEventListener('click', function() {
            const classId = this.getAttribute('data-class-id');
            const action = this.getAttribute('data-action');
            
            switch (action) {
                case 'edit':
                    editClassById(classId);
                    break;
                // Outros casos já manipulados em funções anteriores
            }
        });
    });
    
    // Ações do dropdown na visualização de lista
    document.querySelectorAll('.action-dropdown a[data-action]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const classId = this.getAttribute('data-class-id');
            const action = this.getAttribute('data-action');
            
            switch (action) {
                case 'notify':
                    notifyStudents(classId);
                    break;
                case 'duplicate':
                    duplicateClass(classId);
                    break;
                case 'cancel':
                    if (confirm('Tem certeza que deseja cancelar esta aula?')) {
                        cancelClass(classId);
                    }
                    break;
            }
        });
    });
    
    // Clique nos cards de aula para ver detalhes
    document.querySelectorAll('.class-card').forEach(card => {
        card.addEventListener('click', function() {
            const className = this.querySelector('.class-name').textContent;
            const instructor = this.querySelector('.class-instructor').textContent;
            
            alert(`Detalhes da aula: ${className} com ${instructor}`);
            // Em uma aplicação real, você abriria um modal com detalhes completos
        });
    });
}

/**
 * Configura as ações em massa
 */
function setupBulkActions() {
    const selectAllCheckbox = document.getElementById('select-all');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const bulkActionSelect = document.getElementById('bulk-action-select');
    const applyBtn = document.querySelector('.btn-apply');
    
    if (selectAllCheckbox && rowCheckboxes.length > 0) {
        // Selecionar/deselecionar todos
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            
            updateBulkActionsState();
        });
        
        // Atualizar estado quando checkboxes individuais são alterados
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const allChecked = [...rowCheckboxes].every(cb => cb.checked);
                const someChecked = [...rowCheckboxes].some(cb => cb.checked);
                
                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate = someChecked && !allChecked;
                
                updateBulkActionsState();
            });
        });
        
        // Aplicar ação em massa
        if (applyBtn && bulkActionSelect) {
            applyBtn.addEventListener('click', function() {
                if (bulkActionSelect.value) {
                    const selectedIds = getSelectedClassIds();
                    
                    if (selectedIds.length > 0) {
                        // Confirmar ação potencialmente perigosa
                        if (bulkActionSelect.value === 'cancel') {
                            if (!confirm(`Tem certeza que deseja cancelar ${selectedIds.length} aulas?`)) {
                                return;
                            }
                        }
                        
                        // Executar ação em massa
                        executeBulkAction(bulkActionSelect.value, selectedIds);
                    }
                }
            });
        }
    }
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
 * Retorna um array com IDs das aulas selecionadas
 */
function getSelectedClassIds() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    return Array.from(selectedCheckboxes).map(checkbox => {
        const row = checkbox.closest('tr');
        const actionBtn = row.querySelector('.action-btn[data-class-id]');
        return actionBtn ? actionBtn.getAttribute('data-class-id') : null;
    }).filter(id => id !== null);
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
    
    // Validar horário e data
    if (isValid) {
        const dateField = form.querySelector('#class-date');
        const timeField = form.querySelector('#class-time');
        
        if (dateField && timeField) {
            const selectedDate = new Date(dateField.value + 'T' + timeField.value);
            const now = new Date();
            
            if (selectedDate < now) {
                timeField.classList.add('error');
                isValid = false;
                
                if (!timeField.nextElementSibling || !timeField.nextElementSibling.classList.contains('error-message')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Não é possível agendar aulas no passado';
                    timeField.parentNode.insertBefore(errorMessage, timeField.nextSibling);
                }
            }
        }
    }
    
    return isValid;
}

/**
 * Função simulada - salvar nova aula
 */
function saveNewClass(form) {
    // Obter dados do formulário
    const formData = new FormData(form);
    const classData = {};
    
    formData.forEach((value, key) => {
        classData[key] = value;
    });
    
    // Verificar se é aula recorrente
    const recurring = form.querySelector('#class-recurring').checked;
    
    if (recurring) {
        const weekdays = [];
        form.querySelectorAll('input[name="weekdays[]"]:checked').forEach(checkbox => {
            weekdays.push(checkbox.value);
        });
        classData.weekdays = weekdays;
    }
    
    console.log('Salvando nova aula:', classData);
    
    // Em uma aplicação real, aqui você enviaria os dados para o servidor via AJAX
    
    // Simular sucesso após 1 segundo
    setTimeout(() => {
        // Fechar modal
        document.getElementById('add-class-modal').classList.remove('active');
        document.body.style.overflow = '';
        
        // Resetar formulário
        form.reset();
        
        // Ocultar opções recorrentes
        document.querySelectorAll('.recurring-options').forEach(option => {
            option.style.display = 'none';
        });
        
        // Mostrar notificação de sucesso
        showNotification('Aula adicionada com sucesso!', 'success');
        
        // Simular recarregamento do calendário
        console.log('Recarregando calendário...');
    }, 1000);
}

/**
 * Função simulada - carregar dados do calendário
 */
function loadCalendarData() {
    console.log('Carregando dados do calendário...');
    
    // Em uma aplicação real, aqui você faria uma chamada AJAX para buscar os dados das aulas
    
    // Simulação de carregamento
    showNotification('Calendário atualizado', 'info');
}

/**
 * Função simulada - carregar participantes de uma aula
 */
function loadParticipantsData(classId) {
    console.log(`Carregando participantes da aula ID: ${classId}`);
    
    // Em uma aplicação real, aqui você faria uma chamada AJAX para buscar os participantes
    
    // Atualizar informações simuladas no modal
    const classTitle = document.getElementById('class-title');
    const modalInstructor = document.getElementById('modal-instructor');
    const modalDate = document.getElementById('modal-date');
    const modalTime = document.getElementById('modal-time');
    const modalRoom = document.getElementById('modal-room');
    const modalCapacity = document.getElementById('modal-capacity');
    
    // Dados simulados
    if (classTitle) classTitle.textContent = 'Spinning';
    if (modalInstructor) modalInstructor.textContent = 'Rodrigo Almeida';
    if (modalDate) modalDate.textContent = '29/03/2025';
    if (modalTime) modalTime.textContent = '06:00 - 06:45';
    if (modalRoom) modalRoom.textContent = 'Sala 1';
    if (modalCapacity) modalCapacity.textContent = '15/20';
}

/**
 * Função simulada - aplicar filtros
 */
function applyFilters() {
    const classFilter = document.getElementById('class-filter').value;
    const instructorFilter = document.getElementById('instructor-filter').value;
    const roomFilter = document.getElementById('room-filter').value;
    
    console.log('Aplicando filtros:', {
        class: classFilter,
        instructor: instructorFilter,
        room: roomFilter
    });
    
    // Em uma aplicação real, aqui você faria uma chamada AJAX para recarregar os dados filtrados
    
    // Simulação de notificação de sucesso
    showNotification('Filtros aplicados com sucesso');
}

/**
 * Função simulada - executar ação em massa
 */
function executeBulkAction(action, classIds) {
    console.log(`Executando ação "${action}" nas aulas:`, classIds);
    
    // Em uma aplicação real, aqui você enviaria a ação para o servidor via AJAX
    
    // Simular sucesso após 1 segundo
    setTimeout(() => {
        // Mostrar notificação de sucesso
        showNotification(`Ação "${action}" executada com sucesso em ${classIds.length} aulas`, 'success');
        
        // Desmarcar todos os checkboxes
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        if (document.getElementById('select-all')) {
            document.getElementById('select-all').checked = false;
        }
        
        // Atualizar estado dos botões
        updateBulkActionsState();
    }, 1000);
}

/**
 * Funções simuladas para ações de aulas
 */
function editClass(classCard) {
    const className = classCard.querySelector('.class-name').textContent;
    const instructor = classCard.querySelector('.class-instructor').textContent;
    
    console.log(`Editando aula: ${className} com ${instructor}`);
    alert(`Um formulário de edição para a aula "${className}" seria exibido em um modal.`);
}

function deleteClass(classCard) {
    const className = classCard.querySelector('.class-name').textContent;
    
    console.log(`Excluindo aula: ${className}`);
    
    // Simulação de exclusão
    classCard.style.opacity = '0.5';
    setTimeout(() => {
        classCard.remove();
        showNotification(`Aula "${className}" excluída com sucesso`, 'success');
    }, 1000);
}

function editClassById(classId) {
    console.log(`Editando aula ID: ${classId}`);
    alert(`Um formulário de edição para a aula ID: ${classId} seria exibido em um modal.`);
}

function notifyStudents(classId) {
    console.log(`Notificando alunos da aula ID: ${classId}`);
    alert(`Um formulário para enviar notificações aos alunos da aula ID: ${classId} seria exibido.`);
}

function duplicateClass(classId) {
    console.log(`Duplicando aula ID: ${classId}`);
    
    // Simulação de duplicação
    setTimeout(() => {
        showNotification(`Aula ID: ${classId} duplicada com sucesso`, 'success');
    }, 1000);
}

function cancelClass(classId) {
    console.log(`Cancelando aula ID: ${classId}`);
    
    // Simulação de cancelamento
    setTimeout(() => {
        showNotification(`Aula ID: ${classId} cancelada com sucesso`, 'success');
        
        // Em uma aplicação real, você atualizaria a interface ou recarregaria os dados
        const row = document.querySelector(`.action-btn[data-class-id="${classId}"]`).closest('tr');
        if (row) {
            row.style.opacity = '0.5';
            setTimeout(() => {
                row.remove();
            }, 500);
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
    alert(message);
}
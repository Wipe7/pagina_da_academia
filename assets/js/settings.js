/**
 * settings.js - Script específico para a página de configurações
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar elementos da página
    initializePage();
    
    // Configurar navegação entre abas de configurações
    setupSettingsTabs();
    
    // Manipular formulários de configurações
    setupSettingsForms();
    
    // Configurar recursos de backup
    setupBackupFeatures();
    
    // Configurar recursos visuais
    setupVisualFeatures();
});

/**
 * Inicializa elementos básicos da página
 */
function initializePage() {
    // Inicializar elementos e componentes compartilhados
    if (window.dashboardUtils && window.dashboardUtils.initializeElements) {
        window.dashboardUtils.initializeElements();
    }
}

/**
 * Configura a navegação entre abas de configurações
 */
function setupSettingsTabs() {
    const tabs = document.querySelectorAll('.settings-tab');
    const sections = document.querySelectorAll('.settings-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover classe ativa de todas as abas e seções
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Adicionar classe ativa à aba clicada
            this.classList.add('active');
            
            // Mostrar a seção correspondente
            const tabId = this.getAttribute('data-tab');
            const section = document.getElementById(`${tabId}-settings`);
            if (section) {
                section.classList.add('active');
            }
            
            // Atualizar URL com hash para manter a aba selecionada após recarregar
            window.location.hash = tabId;
        });
    });
    
    // Verificar se há um hash na URL para selecionar a aba correspondente
    const hash = window.location.hash.substring(1);
    if (hash) {
        const tab = document.querySelector(`.settings-tab[data-tab="${hash}"]`);
        if (tab) {
            tab.click();
        }
    }
}

/**
 * Configura os formulários de configurações
 */
function setupSettingsForms() {
    // Formulário de configurações gerais
    const generalForm = document.getElementById('general-settings-form');
    if (generalForm) {
        generalForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Formulário de aparência
    const appearanceForm = document.getElementById('appearance-settings-form');
    if (appearanceForm) {
        appearanceForm.addEventListener('submit', handleFormSubmit);
        
        // Atualizar visualização das cores
        const colorInputs = appearanceForm.querySelectorAll('input[type="color"]');
        colorInputs.forEach(input => {
            input.addEventListener('input', updateColorPreview);
        });
    }
    
    // Formulário de notificações
    const notificationsForm = document.getElementById('notifications-settings-form');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', handleFormSubmit);
        
        // Botão de teste de e-mail
        const testEmailBtn = document.getElementById('test-email-btn');
        if (testEmailBtn) {
            testEmailBtn.addEventListener('click', sendTestEmail);
        }
    }
    
    // Formulário de permissões
    const permissionsForm = document.getElementById('permissions-settings-form');
    if (permissionsForm) {
        permissionsForm.addEventListener('submit', handleFormSubmit);
    }
}

/**
 * Manipulador de envio de formulários
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Obter ID do formulário para identificar qual está sendo enviado
    const formId = this.id;
    
    // Obter dados do formulário
    const formData = new FormData(this);
    const settingsData = {};
    
    formData.forEach((value, key) => {
        settingsData[key] = value;
    });
    
    console.log(`Salvando configurações de ${formId}:`, settingsData);
    
    // Em uma aplicação real, aqui você enviaria os dados para o servidor via AJAX
    
    // Simular sucesso após 1 segundo
    const submitBtn = this.querySelector('.btn-save');
    const originalText = submitBtn.textContent;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Exibir notificação de sucesso
        showNotification('Configurações salvas com sucesso!', 'success');
        
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

/**
 * Atualiza a visualização das cores ao selecionar no seletor de cores
 */
function updateColorPreview() {
    const colorPreview = this.parentNode.querySelector('.color-preview');
    if (colorPreview) {
        colorPreview.style.backgroundColor = this.value;
    }
    
    // Em uma aplicação real, você poderia atualizar as variáveis CSS em tempo real
    // para demonstrar as alterações de cores
    if (this.id === 'primary-color') {
        // Exemplo de atualização de variável CSS
        document.documentElement.style.setProperty('--primary-color', this.value);
    }
}

/**
 * Envia e-mail de teste
 */
function sendTestEmail() {
    const smtpHost = document.getElementById('smtp-host').value;
    const smtpPort = document.getElementById('smtp-port').value;
    const smtpUser = document.getElementById('smtp-user').value;
    const smtpPassword = document.getElementById('smtp-password').value;
    const emailSender = document.getElementById('email-sender').value;
    const emailReply = document.getElementById('email-reply').value;
    
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !emailSender || !emailReply) {
        showNotification('Por favor, preencha todos os campos de configuração de e-mail', 'error');
        return;
    }
    
    // Em uma aplicação real, você enviaria uma solicitação para o servidor
    // para testar as configurações de e-mail
    
    // Simular o envio
    const originalText = this.textContent;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    this.disabled = true;
    
    setTimeout(() => {
        // Simular resposta de sucesso
        showNotification('E-mail de teste enviado com sucesso!', 'success');
        
        // Restaurar botão
        this.innerHTML = originalText;
        this.disabled = false;
    }, 2000);
}

/**
 * Configura os recursos de backup
 */
function setupBackupFeatures() {
    // Botão de criar backup
    const createBackupBtn = document.getElementById('create-backup-btn');
    if (createBackupBtn) {
        createBackupBtn.addEventListener('click', createBackup);
    }
    
    // Botões de ações de backup
    const backupActions = document.querySelectorAll('.backup-item-actions button');
    backupActions.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const backupItem = this.closest('.backup-item');
            const backupName = backupItem.querySelector('.backup-item-info span').textContent;
            
            if (this.classList.contains('delete-btn')) {
                deleteBackup(backupItem, backupName);
            } else if (this.querySelector('.fa-download')) {
                downloadBackup(backupName);
            } else if (this.querySelector('.fa-undo-alt')) {
                if (confirm(`Tem certeza que deseja restaurar o backup ${backupName}? Isso substituirá todos os dados atuais.`)) {
                    restoreBackup(backupName);
                }
            }
        });
    });
    
    // Campo de importação de backup
    const importBackupInput = document.getElementById('import-backup');
    const restoreBackupBtn = document.getElementById('restore-backup-btn');
    
    if (importBackupInput && restoreBackupBtn) {
        importBackupInput.addEventListener('change', function() {
            restoreBackupBtn.disabled = !this.files.length;
        });
        
        restoreBackupBtn.addEventListener('click', function() {
            if (importBackupInput.files.length) {
                const fileName = importBackupInput.files[0].name;
                
                if (confirm(`Tem certeza que deseja restaurar o backup ${fileName}? Isso substituirá todos os dados atuais.`)) {
                    // Em uma aplicação real, você enviaria o arquivo para o servidor
                    
                    // Simular a restauração
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Restaurando...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        showNotification('Backup restaurado com sucesso!', 'success');
                        
                        // Restaurar botão
                        this.innerHTML = '<i class="fas fa-undo-alt"></i> Restaurar Backup';
                        this.disabled = true;
                        importBackupInput.value = '';
                    }, 3000);
                }
            }
        });
    }
}

/**
 * Cria novo backup do sistema
 */
function createBackup() {
    // Em uma aplicação real, você enviaria uma solicitação para o servidor
    // para criar um backup dos dados
    
    // Simular o processo
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando backup...';
    this.disabled = true;
    
    setTimeout(() => {
        // Adicionar novo backup à lista
        const backupList = document.querySelector('.backup-list');
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
        const fileName = `backup_${currentDate.getDate().toString().padStart(2, '0')}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getFullYear()}_${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}.zip`;
        
        const newBackupItem = document.createElement('div');
        newBackupItem.className = 'backup-item';
        newBackupItem.innerHTML = `
            <div class="backup-item-info">
                <i class="fas fa-file-archive"></i>
                <span>${fileName}</span>
                <span class="backup-item-date">${formattedDate} (Manual)</span>
            </div>
            <div class="backup-item-actions">
                <button type="button" aria-label="Fazer download do backup">
                    <i class="fas fa-download"></i>
                </button>
                <button type="button" aria-label="Restaurar backup">
                    <i class="fas fa-undo-alt"></i>
                </button>
                <button type="button" class="delete-btn" aria-label="Excluir backup">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        // Adicionar evento aos novos botões
        const buttons = newBackupItem.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const backupItem = this.closest('.backup-item');
                const backupName = backupItem.querySelector('.backup-item-info span').textContent;
                
                if (this.classList.contains('delete-btn')) {
                    deleteBackup(backupItem, backupName);
                } else if (this.querySelector('.fa-download')) {
                    downloadBackup(backupName);
                } else if (this.querySelector('.fa-undo-alt')) {
                    if (confirm(`Tem certeza que deseja restaurar o backup ${backupName}? Isso substituirá todos os dados atuais.`)) {
                        restoreBackup(backupName);
                    }
                }
            });
        });
        
        backupList.insertBefore(newBackupItem, backupList.firstChild);
        
        // Exibir notificação
        showNotification('Backup criado com sucesso!', 'success');
        
        // Restaurar botão
        this.innerHTML = '<i class="fas fa-download"></i> Criar Novo Backup';
        this.disabled = false;
    }, 2000);
}

/**
 * Exclui um backup
 */
function deleteBackup(backupItem, backupName) {
    if (confirm(`Tem certeza que deseja excluir o backup ${backupName}?`)) {
        // Em uma aplicação real, você enviaria uma solicitação para o servidor
        // para excluir o arquivo de backup
        
        // Animar remoção do item
        backupItem.style.opacity = '0';
        backupItem.style.height = '0';
        backupItem.style.padding = '0';
        backupItem.style.margin = '0';
        backupItem.style.overflow = 'hidden';
        backupItem.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            backupItem.remove();
            showNotification('Backup excluído com sucesso!', 'success');
        }, 300);
    }
}

/**
 * Simula o download de um backup
 */
function downloadBackup(backupName) {
    // Em uma aplicação real, você geraria um link de download
    // para o arquivo de backup no servidor
    
    showNotification(`Iniciando o download de ${backupName}...`, 'info');
    
    // Simular download iniciado pelo navegador
    setTimeout(() => {
        // Criar um link de download fictício
        const link = document.createElement('a');
        link.href = '#';
        link.download = backupName;
        link.click();
    }, 500);
}

/**
 * Simula a restauração de um backup
 */
function restoreBackup(backupName) {
    // Em uma aplicação real, você enviaria uma solicitação para o servidor
    // para restaurar os dados a partir do arquivo de backup
    
    showNotification(`Restaurando backup ${backupName}...`, 'info');
    
    // Simular tempo de processamento
    setTimeout(() => {
        showNotification('Backup restaurado com sucesso! A página será recarregada.', 'success');
        
        // Simular recarregamento da página após a restauração
        setTimeout(() => {
            // Em uma aplicação real, a página seria recarregada
            // window.location.reload();
            
            // Para simulação, apenas mostrar outra notificação
            showNotification('Sistema restaurado e pronto para uso!', 'success');
        }, 2000);
    }, 3000);
}

/**
 * Configura recursos visuais da página
 */
function setupVisualFeatures() {
    // Atualizar pré-visualizações de cores
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        const colorPreview = input.parentNode.querySelector('.color-preview');
        if (colorPreview) {
            colorPreview.style.backgroundColor = input.value;
        }
    });
    
    // Alternar modo de manutenção
    const maintenanceMode = document.getElementById('maintenance-mode');
    if (maintenanceMode) {
        maintenanceMode.addEventListener('change', function() {
            if (this.checked) {
                showNotification('Modo de manutenção ativado. O sistema estará inacessível para usuários comuns.', 'warning');
            } else {
                showNotification('Modo de manutenção desativado. O sistema está disponível para todos os usuários.', 'success');
            }
        });
    }
    
    // Alternar tema
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            const theme = this.value;
            
            // Em uma aplicação real, você aplicaria o tema imediatamente
            // para demonstrar as alterações
            
            document.body.classList.remove('light-theme', 'dark-theme');
            
            if (theme === 'light') {
                document.body.classList.add('light-theme');
                showNotification('Tema claro aplicado!', 'info');
            } else if (theme === 'dark') {
                document.body.classList.add('dark-theme');
                showNotification('Tema escuro aplicado!', 'info');
            } else {
                showNotification('Tema automático aplicado! Baseado nas preferências do usuário.', 'info');
            }
        });
    }
    
    // Alternar posição da barra lateral
    const sidebarPosition = document.getElementById('sidebar-position');
    if (sidebarPosition) {
        sidebarPosition.addEventListener('change', function() {
            showNotification(`Posição da barra lateral alterada para: ${this.value === 'left' ? 'Esquerda' : 'Direita'}. Será aplicada após recarregar a página.`, 'info');
        });
    }
    
    // Alternar barra lateral compacta
    const compactSidebar = document.getElementById('compact-sidebar');
    if (compactSidebar) {
        compactSidebar.addEventListener('change', function() {
            const sidebar = document.getElementById('sidebar');
            
            if (sidebar) {
                if (this.checked) {
                    sidebar.classList.add('compact');
                    showNotification('Barra lateral compacta ativada!', 'info');
                } else {
                    sidebar.classList.remove('compact');
                    showNotification('Barra lateral normal ativada!', 'info');
                }
            }
        });
    }
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
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
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
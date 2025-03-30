// dashboard.js - Principal arquivo de script para o painel admin

document.addEventListener('DOMContentLoaded', function() {
    // Toggle Sidebar
    const toggleSidebar = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('full-width');
        });
    }
    
    // Toggle Dropdowns
    setupDropdowns();
    
    // Setup Chart.js
    setupCharts();
    
    // Filtro de datas
    setupDateFilter();
    
    // Ações nas tabelas
    setupTableActions();
    
    // Pesquisa
    setupSearch();
});

// Configuração de dropdowns (notificações e usuário)
function setupDropdowns() {
    // Dropdown de usuário
    const userProfile = document.getElementById('user-profile');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', function(event) {
            event.stopPropagation();
            userDropdown.hidden = !userDropdown.hidden;
            
            // Fechar outros dropdowns
            document.querySelectorAll('.notification-dropdown').forEach(el => {
                el.hidden = true;
            });
            document.querySelectorAll('.action-dropdown').forEach(el => {
                el.hidden = true;
            });
        });
    }
    
    // Dropdown de notificações
    const notificationBtn = document.getElementById('notification-btn');
    const notificationDropdown = document.getElementById('notification-dropdown');
    
    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            notificationDropdown.hidden = !notificationDropdown.hidden;
            
            // Fechar outros dropdowns
            if (userDropdown) userDropdown.hidden = true;
            document.querySelectorAll('.action-dropdown').forEach(el => {
                el.hidden = true;
            });
        });
    }
    
    // Botão "Marcar todas como lidas"
    const markAllReadBtn = document.querySelector('.mark-all-read');
    
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            
            // Atualizar o contador de notificações
            const badge = document.querySelector('.notifications .badge');
            if (badge) {
                badge.textContent = '0';
                badge.style.display = 'none';
            }
        });
    }
    
    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', function() {
        if (userDropdown) userDropdown.hidden = true;
        if (notificationDropdown) notificationDropdown.hidden = true;
        document.querySelectorAll('.action-dropdown').forEach(el => {
            el.hidden = true;
        });
    });
}

// Configuração dos gráficos
function setupCharts() {
    // Chart.js - Gráfico de Frequência
    const frequencyChartEl = document.getElementById('frequencyChart');
    
    if (frequencyChartEl) {
        const frequencyCtx = frequencyChartEl.getContext('2d');
        const frequencyChart = new Chart(frequencyCtx, {
            type: 'line',
            data: {
                labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
                datasets: [{
                    label: 'Frequência Diária',
                    data: [85, 120, 105, 95, 130, 90, 40],
                    backgroundColor: 'rgba(255, 69, 0, 0.1)',
                    borderColor: 'rgba(255, 69, 0, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Period Selector
        const periodButtons = document.querySelectorAll('.chart-period');
        
        periodButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                periodButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update chart data based on selected period
                const period = button.getAttribute('data-period');
                
                let newData;
                let newLabels;
                
                if (period === 'day') {
                    newData = [32, 45, 80, 120, 95, 75, 35, 55, 40, 30, 20, 15];
                    newLabels = ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '21h', '22h', '23h', '24h'];
                } else if (period === 'week') {
                    newData = [85, 120, 105, 95, 130, 90, 40];
                    newLabels = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
                } else if (period === 'month') {
                    newData = [320, 380, 425, 390, 450, 400, 380, 420, 390, 405, 440, 460];
                    newLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                }
                
                frequencyChart.data.datasets[0].data = newData;
                frequencyChart.data.labels = newLabels;
                frequencyChart.update();
            });
        });
    }
    
    // Chart.js - Gráfico de Distribuição de Planos
    const plansChartEl = document.getElementById('plansChart');
    
    if (plansChartEl) {
        const plansCtx = plansChartEl.getContext('2d');
        const plansChart = new Chart(plansCtx, {
            type: 'doughnut',
            data: {
                labels: ['Básico', 'Premium', 'Master'],
                datasets: [{
                    data: [120, 180, 58],
                    backgroundColor: [
                        'rgba(0, 191, 255, 1)',
                        'rgba(255, 69, 0, 1)',
                        'rgba(40, 167, 69, 1)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }
}

// Configuração do filtro de datas
function setupDateFilter() {
    const dateRangeSelect = document.getElementById('date-range-select');
    const customDateRange = document.getElementById('custom-date-range');
    
    if (dateRangeSelect && customDateRange) {
        dateRangeSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDateRange.hidden = false;
            } else {
                customDateRange.hidden = true;
                
                // Aqui você aplicaria o filtro baseado na seleção
                // Simulação de atualização dos dados
                console.log('Aplicando filtro: ' + this.value);
            }
        });
    }
}

// Configuração das ações nas tabelas
function setupTableActions() {
    // Toggle dos dropdowns de ações
    const actionMenuButtons = document.querySelectorAll('.action-btn.menu-toggle');
    
    actionMenuButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            
            // Fechar todos os outros dropdowns
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
    
    // Filtros das tabelas
    document.querySelectorAll('.table-filter select').forEach(select => {
        select.addEventListener('change', function() {
            // Aqui você aplicaria o filtro nas tabelas
            console.log('Aplicando filtro: ' + this.value);
        });
    });
    
    // Paginação
    document.querySelectorAll('.pagination-btn').forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                // Remover classe ativa de todos os botões
                document.querySelectorAll('.pagination-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Adicionar classe ativa ao botão clicado se não for botão de navegação
                if (!this.querySelector('.fas')) {
                    this.classList.add('active');
                }
                
                // Aqui você carregaria os dados da página selecionada
                console.log('Carregando página: ' + this.textContent.trim());
            });
        }
    });
}

// Configuração da funcionalidade de pesquisa
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        searchInput.addEventListener('focus', function() {
            // Simulação de resultados de pesquisa
            if (this.value.length >= 2) {
                displaySearchResults(this.value);
            }
        });
        
        searchInput.addEventListener('input', function() {
            if (this.value.length >= 2) {
                displaySearchResults(this.value);
            } else {
                searchResults.hidden = true;
            }
        });
        
        searchInput.addEventListener('blur', function() {
            // Pequeno delay para permitir clicar nos resultados
            setTimeout(() => {
                searchResults.hidden = true;
            }, 200);
        });
    }
    
    function displaySearchResults(query) {
        // Em uma aplicação real, aqui você faria uma requisição AJAX para buscar os resultados
        // Mock de resultados para demonstração
        const mockResults = [
            { type: 'member', name: 'Ana Silva', id: '123', url: 'membros.html?id=123' },
            { type: 'member', name: 'André Silva', id: '124', url: 'membros.html?id=124' },
            { type: 'class', name: 'Aula de Yoga', id: '456', url: 'aulas.html?id=456' },
            { type: 'instructor', name: 'Amanda Souza', id: '789', url: 'instrutores.html?id=789' }
        ];
        
        // Filtrar resultados baseado na query
        const filteredResults = mockResults.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        
        // Exibir resultados
        if (filteredResults.length > 0) {
            searchResults.innerHTML = '';
            filteredResults.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.setAttribute('role', 'option');
                
                // Ícone baseado no tipo
                let icon = '';
                switch(result.type) {
                    case 'member':
                        icon = '<i class="fas fa-user"></i>';
                        break;
                    case 'class':
                        icon = '<i class="fas fa-dumbbell"></i>';
                        break;
                    case 'instructor':
                        icon = '<i class="fas fa-user-tie"></i>';
                        break;
                }
                
                resultItem.innerHTML = `
                    <a href="${result.url}">
                        <div class="search-result-icon">${icon}</div>
                        <div class="search-result-content">
                            <div class="search-result-name">${result.name}</div>
                            <div class="search-result-type">${getTypeLabel(result.type)}</div>
                        </div>
                    </a>
                `;
                
                searchResults.appendChild(resultItem);
            });
            
            searchResults.hidden = false;
        } else {
            searchResults.innerHTML = '<div class="search-no-results">Nenhum resultado encontrado</div>';
            searchResults.hidden = false;
        }
    }
    
    function getTypeLabel(type) {
        switch(type) {
            case 'member':
                return 'Membro';
            case 'class':
                return 'Aula';
            case 'instructor':
                return 'Instrutor';
            default:
                return type;
        }
    }
}

// Inicialização para elementos específicos que podem ser carregados após o DOMContentLoaded
function initializeElements() {
    // Inicializar tooltips
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.setAttribute('title', el.getAttribute('data-tooltip'));
    });
    
    // Marcar a página atual no menu
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Função para exibir mensagens de notificação temporárias
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="notification-message">${message}</div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Adicionar classe para animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Inicializações adicionais, como configuração de modais
function setupModals() {
    // Para cada trigger de modal no documento
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('modal-open');
                
                // Fechar modal ao clicar no backdrop ou botão de fechar
                modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
                modal.querySelector('.modal-close').addEventListener('click', closeModal);
                
                function closeModal() {
                    modal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                }
            }
        });
    });
}

// Export das funções para uso em outros arquivos
window.dashboardUtils = {
    showNotification,
    initializeElements,
    setupModals
};
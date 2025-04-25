// clientes.js - Script para la gestión de clientes

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando aplicación de clientes...');
    
    // Inicializar la aplicación
    initClientesApp();
});

/**
 * Inicializa la aplicación de gestión de clientes
 */
function initClientesApp() {
    try {
        console.log('Cargando estadísticas y clientes iniciales...');
        
        // Cargar estadísticas iniciales
        loadStatistics();
        
        // Cargar todos los clientes al iniciar
        loadAllClients();
        
        // Configurar paneles y formularios
        setupPanelVisibility();
        
        // Configurar escuchas de eventos para los botones del panel de control
        setupEventListeners();
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
}

/**
 * Carga las estadísticas de clientes
 */
function loadStatistics() {
    fetch('/api/clientes/conteo')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener estadísticas');
            return response.json();
        })
        .then(data => {
            console.log('Estadísticas cargadas:', data);
            document.getElementById('total-clientes').textContent = data.total;
            document.getElementById('clientes-activos').textContent = data.activos;
            document.getElementById('clientes-inactivos').textContent = data.inactivos;
        })
        .catch(error => {
            console.error('Error cargando estadísticas:', error);
            showNotification('Error al cargar estadísticas', true);
            
            // Valores por defecto en caso de error
            document.getElementById('total-clientes').textContent = '0';
            document.getElementById('clientes-activos').textContent = '0';
            document.getElementById('clientes-inactivos').textContent = '0';
        });
}

/**
 * Carga todos los clientes
 */
function loadAllClients() {
    console.log('Cargando lista de clientes...');
    
    fetch('/api/clientes/listar')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener clientes');
            return response.json();
        })
        .then(data => {
            console.log(`${data.length} clientes cargados`);
            renderClientTable(data);
        })
        .catch(error => {
            console.error('Error cargando clientes:', error);
            showNotification('Error al cargar clientes: ' + error.message, true);
            
            // Limpiar tabla en caso de error
            const tbody = document.getElementById('clientes-table-body');
            if (tbody) tbody.innerHTML = '';
        });
}

/**
 * Renderiza la tabla de clientes con los datos proporcionados
 * @param {Array} clients - Lista de clientes a mostrar
 */
function renderClientTable(clients) {
    const tbody = document.getElementById('clientes-table-body');
    if (!tbody) {
        console.error('No se encontró el elemento clientes-table-body');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (clients.length === 0) {
        showNotification('No se encontraron clientes', false);
        return;
    }
    
    clients.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre || ''}</td>
            <td>${cliente.email || ''}</td>
            <td>${cliente.telefono || ''}</td>
            <td>${cliente.activo ? '<span class="status-active">Activo</span>' : '<span class="status-inactive">Inactivo</span>'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" data-id="${cliente.id}">Editar</button>
                    <button class="btn-action btn-delete" data-id="${cliente.id}">Eliminar</button>
                    <button class="btn-action" data-id="${cliente.id}" data-action="view">Ver</button>
                    <button class="btn-action" data-id="${cliente.id}" data-action="toggle-status">
                        ${cliente.activo ? 'Desactivar' : 'Activar'}
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Agregar escuchas de eventos a los botones de acción
    addActionButtonListeners();
}

/**
 * Agrega escuchas de eventos a los botones de acción en la tabla
 */
function addActionButtonListeners() {
    console.log('Agregando listeners a botones de acción...');
    
    // Botón de editar
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-id');
            console.log('Editando cliente:', clientId);
            loadClientForEditing(clientId);
        });
    });
    
    // Botón de eliminar
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-id');
            console.log('Eliminando cliente:', clientId);
            deleteClient(clientId);
        });
    });
    
    // Botón de ver detalles
    document.querySelectorAll('[data-action="view"]').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-id');
            console.log('Viendo detalles de cliente:', clientId);
            showClientDetails(clientId);
        });
    });
    
    // Botón de cambiar estado
    document.querySelectorAll('[data-action="toggle-status"]').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-id');
            const isCurrentlyActive = this.textContent.trim() === 'Desactivar';
            console.log(`Cambiando estado de cliente ${clientId} a: ${!isCurrentlyActive}`);
            toggleClientStatus(clientId, !isCurrentlyActive);
        });
    });
}

/**
 * Configura la visibilidad inicial de paneles y formularios
 */
function setupPanelVisibility() {
    console.log('Configurando visibilidad inicial de paneles...');
    
    // Ocultar todos los formularios inicialmente
    const forms = document.querySelectorAll('.hidden-form');
    forms.forEach(form => form.style.display = 'none');
    
    // Mostrar contenido principal
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.style.display = 'block';
}

/**
 * Configura escuchas de eventos para todos los botones de control
 */
function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Agregar Cliente
    const btnAgregar = document.getElementById('btn-agregar');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', function() {
            console.log('Clic en Agregar Cliente');
            hideAllForms();
            const formAgregar = document.getElementById('form-agregar');
            if (formAgregar) formAgregar.style.display = 'block';
        });
    }
    
    // Volver al listado desde formulario agregar
    const backToList = document.getElementById('back-to-list');
    if (backToList) {
        backToList.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
        });
    }
    
    // Enviar formulario nuevo cliente
    const clienteForm = document.getElementById('cliente-form');
    if (clienteForm) {
        clienteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario de cliente enviado');
            addNewClient(this);
        });
    }
    
    // Listar Clientes
    const btnListar = document.getElementById('btn-listar');
    if (btnListar) {
        btnListar.addEventListener('click', function() {
            console.log('Clic en Listar Clientes');
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
            loadAllClients();
        });
    }
    
    // Botón Buscar Cliente en caja de búsqueda
    const btnBuscar = document.getElementById('btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', function() {
            console.log('Clic en Buscar');
            searchClientsByName();
        });
    }
    
    // Botón Buscar Cliente en panel
    const btnBuscarPanel = document.getElementById('btn-buscar-panel');
    if (btnBuscarPanel) {
        btnBuscarPanel.addEventListener('click', function() {
            console.log('Clic en Buscar Cliente (panel)');
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.style.display = 'block';
                const searchInput = document.getElementById('search-nombre');
                if (searchInput) searchInput.focus();
            }
        });
    }
    
    // Panel Actualizar Cliente
    const btnActualizarPanel = document.getElementById('btn-actualizar-panel');
    if (btnActualizarPanel) {
        btnActualizarPanel.addEventListener('click', function() {
            console.log('Clic en Actualizar Cliente (panel)');
            hideAllForms();
            const formActualizar = document.getElementById('form-actualizar');
            if (formActualizar) formActualizar.style.display = 'block';
        });
    }
    
    // Cargar Cliente para actualizar
    const btnCargarCliente = document.getElementById('btn-cargar-cliente');
    if (btnCargarCliente) {
        btnCargarCliente.addEventListener('click', function() {
            const idInput = document.getElementById('id-actualizar');
            if (!idInput) return;
            
            const clientId = idInput.value;
            if (clientId) {
                console.log('Cargando cliente para actualizar:', clientId);
                loadClientForEditing(clientId);
            } else {
                showNotification('Por favor ingrese un ID de cliente', true);
            }
        });
    }
    
    // Enviar formulario actualizar cliente
    const actualizarForm = document.getElementById('actualizar-form');
    if (actualizarForm) {
        actualizarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario de actualización enviado');
            updateClient();
        });
    }
    
    // Volver desde formulario actualizar
    const backFromActualizar = document.getElementById('back-from-actualizar');
    if (backFromActualizar) {
        backFromActualizar.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
        });
    }
    
    // Panel Ver Detalles
    const btnDetallesPanel = document.getElementById('btn-detalles-panel');
    if (btnDetallesPanel) {
        btnDetallesPanel.addEventListener('click', function() {
            console.log('Clic en Ver Detalles (panel)');
            hideAllForms();
            const formDetalles = document.getElementById('form-detalles');
            if (formDetalles) formDetalles.style.display = 'block';
        });
    }
    
    // Buscar detalles de cliente
    const btnBuscarDetalles = document.getElementById('btn-buscar-detalles');
    if (btnBuscarDetalles) {
        btnBuscarDetalles.addEventListener('click', function() {
            const idInput = document.getElementById('id-detalles');
            if (!idInput) return;
            
            const clientId = idInput.value;
            if (clientId) {
                console.log('Buscando detalles de cliente:', clientId);
                loadClientDetails(clientId);
            } else {
                showNotification('Por favor ingrese un ID de cliente', true);
            }
        });
    }
    
    // Volver desde detalles
    const backFromDetalles = document.getElementById('back-from-detalles');
    if (backFromDetalles) {
        backFromDetalles.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
        });
    }
    
    // Panel Enviar Oferta
    const btnOfertaPanel = document.getElementById('btn-oferta-panel');
    if (btnOfertaPanel) {
        btnOfertaPanel.addEventListener('click', function() {
            console.log('Clic en Enviar Oferta (panel)');
            hideAllForms();
            const formOferta = document.getElementById('form-oferta');
            if (formOferta) formOferta.style.display = 'block';
        });
    }
    
    // Botón enviar oferta
    const btnEnviarOferta = document.getElementById('btn-enviar-oferta');
    if (btnEnviarOferta) {
        btnEnviarOferta.addEventListener('click', function() {
            const idInput = document.getElementById('id-oferta');
            if (!idInput) return;
            
            const clientId = idInput.value;
            if (clientId) {
                console.log('Enviando oferta a cliente:', clientId);
                sendOfferToClient(clientId);
            } else {
                showNotification('Por favor ingrese un ID de cliente', true);
            }
        });
    }
    
    // Volver desde oferta
    const backFromOferta = document.getElementById('back-from-oferta');
    if (backFromOferta) {
        backFromOferta.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
        });
    }
    
    // Clientes Frecuentes
    const btnFrecuentes = document.getElementById('btn-frecuentes');
    if (btnFrecuentes) {
        btnFrecuentes.addEventListener('click', function() {
            console.log('Clic en Clientes Frecuentes');
            loadFrequentClients();
        });
    }
    
    // Gestión de Quejas
    const btnQuejas = document.getElementById('btn-quejas');
    if (btnQuejas) {
        btnQuejas.addEventListener('click', function() {
            console.log('Clic en Gestión de Quejas');
            showNotification('Funcionalidad de gestión de quejas aún no implementada', false);
        });
    }
    
    // Generar Reporte
    const btnReporte = document.getElementById('btn-reporte');
    if (btnReporte) {
        btnReporte.addEventListener('click', function() {
            console.log('Clic en Generar Reporte');
            showNotification('Funcionalidad de reporte de clientes aún no implementada', false);
        });
    }
}

/**
 * Oculta todos los formularios y muestra el contenido principal
 */
function hideAllForms() {
    console.log('Ocultando todos los formularios...');
    
    const forms = document.querySelectorAll('.hidden-form');
    forms.forEach(form => form.style.display = 'none');
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.style.display = 'none';
}

/**
 * Muestra una notificación en la interfaz
 * @param {string} message - Mensaje a mostrar
 * @param {boolean} isError - Indica si es un mensaje de error
 */
function showNotification(message, isError = false) {
    console.log(`Notificación ${isError ? 'ERROR' : 'INFO'}: ${message}`);
    
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) {
        console.error('No se encontró el área de notificaciones');
        return;
    }
    
    notificationArea.innerHTML = '';
    
    const notification = document.createElement('div');
    notification.className = isError ? 'notification error-notification' : 'notification';
    notification.textContent = message;
    
    notificationArea.appendChild(notification);
    
    // Auto-ocultar notificación después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * Agrega un nuevo cliente
 * @param {HTMLFormElement} form - Formulario con los datos del cliente
 */
function addNewClient(form) {
    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }
    
    console.log('Agregando nuevo cliente...');
    
    const formData = new FormData(form);
    const data = {
        nombre: formData.get('nombre'),
        apellido: formData.get('apellido') || '',
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        direccion: formData.get('direccion'),
        password: formData.get('password'),
        activo: true
    };
    
    console.log('Datos del nuevo cliente:', data);

    fetch('/api/clientes/agregar', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar cliente');
        }
        return response.json();
    })
    .then(data => {
        console.log('Cliente agregado:', data);
        showNotification('Cliente agregado con éxito');
        form.reset();
        setTimeout(() => {
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
            loadAllClients();
            loadStatistics();
        }, 1500);
    })
    .catch(error => {
        console.error('Error al agregar cliente:', error);
        showNotification('Error al agregar cliente: ' + error.message, true);
    });
}

/**
 * Busca clientes por nombre
 */
function searchClientsByName() {
    const searchInput = document.getElementById('search-nombre');
    if (!searchInput) {
        console.error('Input de búsqueda no encontrado');
        return;
    }
    
    const nombre = searchInput.value;
    console.log('Buscando clientes con nombre:', nombre);
    
    if (!nombre) {
        loadAllClients();
        return;
    }
    
    fetch(`/api/clientes/buscar?nombre=${encodeURIComponent(nombre)}`)
        .then(response => response.json())
        .then(data => {
            console.log(`Se encontraron ${data.length} clientes`);
            renderClientTable(data);
            if (data.length === 0) {
                showNotification('No se encontraron clientes con ese nombre', false);
            }
        })
        .catch(error => {
            console.error('Error al buscar clientes:', error);
            showNotification('Error al buscar clientes: ' + error.message, true);
        });
}

/**
 * Carga datos de un cliente para edición
 * @param {string} clientId - ID del cliente a editar
 */
function loadClientForEditing(clientId) {
    console.log('Cargando cliente para edición:', clientId);
    
    fetch(`/api/clientes/detalles/${clientId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Cliente no encontrado');
            }
            return response.json();
        })
        .then(cliente => {
            console.log('Datos del cliente cargados:', cliente);
            hideAllForms();
            const formActualizar = document.getElementById('form-actualizar');
            if (formActualizar) formActualizar.style.display = 'block';
            
            const idInput = document.getElementById('actualizar-id');
            const nombreInput = document.getElementById('actualizar-nombre');
            const emailInput = document.getElementById('actualizar-email');
            const telefonoInput = document.getElementById('actualizar-telefono');
            const direccionInput = document.getElementById('actualizar-direccion');
            const activoSelect = document.getElementById('actualizar-activo');
            const actualizarForm = document.getElementById('actualizar-form');
            
            if (idInput) idInput.value = cliente.id;
            if (nombreInput) nombreInput.value = cliente.nombre || '';
            if (emailInput) emailInput.value = cliente.email || '';
            if (telefonoInput) telefonoInput.value = cliente.telefono || '';
            if (direccionInput) direccionInput.value = cliente.direccion || '';
            if (activoSelect) activoSelect.value = cliente.activo ? 'true' : 'false';
            
            if (actualizarForm) actualizarForm.style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar cliente:', error);
            showNotification(error.message, true);
        });
}

/**
 * Actualiza un cliente
 */
function updateClient() {
    const idInput = document.getElementById('actualizar-id');
    const nombreInput = document.getElementById('actualizar-nombre');
    const emailInput = document.getElementById('actualizar-email');
    const telefonoInput = document.getElementById('actualizar-telefono');
    const direccionInput = document.getElementById('actualizar-direccion');
    const activoSelect = document.getElementById('actualizar-activo');
    
    if (!idInput || !nombreInput || !emailInput || !telefonoInput || !direccionInput || !activoSelect) {
        console.error('Formulario incompleto');
        showNotification('Error: formulario incompleto', true);
        return;
    }
    
    const clientId = idInput.value;
    console.log('Actualizando cliente:', clientId);
    
    const datosActualizados = {
        nombre: nombreInput.value,
        email: emailInput.value,
        telefono: telefonoInput.value,
        direccion: direccionInput.value,
        activo: activoSelect.value === 'true'
    };
    
    console.log('Datos actualizados:', datosActualizados);
    
    fetch(`/api/clientes/actualizar/${clientId}`, {
        method: 'PUT',
        body: JSON.stringify(datosActualizados),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(message => {
        console.log('Respuesta de actualización:', message);
        showNotification(message);
        hideAllForms();
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.style.display = 'block';
        loadAllClients();
        loadStatistics();
    })
    .catch(error => {
        console.error('Error al actualizar cliente:', error);
        showNotification('Error al actualizar cliente: ' + error.message, true);
    });
}

/**
 * Elimina un cliente
 * @param {string} clientId - ID del cliente a eliminar
 */
function deleteClient(clientId) {
    if (!confirm('¿Está seguro de que desea eliminar este cliente?')) {
        return;
    }
    
    console.log('Eliminando cliente:', clientId);
    
    fetch(`/api/clientes/eliminar/${clientId}`, {
        method: 'DELETE'
    })
    .then(response => response.text())
    .then(message => {
        console.log('Respuesta de eliminación:', message);
        showNotification(message);
        loadAllClients();
        loadStatistics();
    })
    .catch(error => {
        console.error('Error al eliminar cliente:', error);
        showNotification('Error al eliminar cliente: ' + error.message, true);
    });
}

/**
 * Muestra los detalles de un cliente en la vista de detalles
 * @param {string} clientId - ID del cliente
 */
function showClientDetails(clientId) {
    console.log('Mostrando detalles del cliente:', clientId);
    
    hideAllForms();
    const formDetalles = document.getElementById('form-detalles');
    const idInput = document.getElementById('id-detalles');
    
    if (formDetalles) formDetalles.style.display = 'block';
    if (idInput) idInput.value = clientId;
    
    loadClientDetails(clientId);
}

/**
 * Carga los detalles de un cliente
 * @param {string} clientId - ID del cliente
 */
function loadClientDetails(clientId) {
    console.log('Cargando detalles del cliente:', clientId);
    
    fetch(`/api/clientes/detalles/${clientId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Cliente no encontrado');
            }
            return response.json();
        })
        .then(cliente => {
            console.log('Detalles del cliente cargados:', cliente);
            
            const nombreElement = document.getElementById('detalles-nombre');
            const idElement = document.getElementById('detalles-id');
            const emailElement = document.getElementById('detalles-email');
            const telefonoElement = document.getElementById('detalles-telefono');
            const direccionElement = document.getElementById('detalles-direccion');
            const estadoElement = document.getElementById('detalles-estado');
            const contenidoElement = document.getElementById('detalles-contenido');
            
            if (nombreElement) nombreElement.textContent = cliente.nombre || '';
            if (idElement) idElement.textContent = cliente.id;
            if (emailElement) emailElement.textContent = cliente.email || 'No disponible';
            if (telefonoElement) telefonoElement.textContent = cliente.telefono || 'No disponible';
            if (direccionElement) direccionElement.textContent = cliente.direccion || 'No disponible';
            
            if (estadoElement) {
                estadoElement.textContent = cliente.activo ? 'Activo' : 'Inactivo';
                estadoElement.className = cliente.activo ? 'detail-value status-active' : 'detail-value status-inactive';
            }
            
            if (contenidoElement) contenidoElement.style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar detalles del cliente:', error);
            showNotification(error.message, true);
            
            const contenidoElement = document.getElementById('detalles-contenido');
            if (contenidoElement) contenidoElement.style.display = 'none';
        });
}

/**
 * Envía una oferta a un cliente
 * @param {string} clientId - ID del cliente
 */
function sendOfferToClient(clientId) {
    console.log('Enviando oferta al cliente:', clientId);
    
    fetch(`/api/clientes/enviar-oferta/${clientId}`, {
        method: 'POST'
    })
    .then(response => response.text())
    .then(message => {
        console.log('Respuesta de envío de oferta:', message);
        showNotification(message);
    })
    .catch(error => {
        console.error('Error al enviar oferta:', error);
        showNotification('Error al enviar oferta: ' + error.message, true);
    });
}

/**
 * Cambia el estado activo de un cliente
 * @param {string} clientId - ID del cliente
 * @param {boolean} newActiveStatus - Nuevo estado (activo/inactivo)
 */
function toggleClientStatus(clientId, newActiveStatus) {
    console.log(`Cambiando estado del cliente ${clientId} a ${newActiveStatus ? 'activo' : 'inactivo'}`);
    
    fetch(`/api/clientes/${clientId}/estado?activo=${newActiveStatus}`, {
        method: 'PATCH'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cambiar estado del cliente');
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta de cambio de estado:', data);
        showNotification(`Cliente ${newActiveStatus ? 'activado' : 'desactivado'} exitosamente`);
        loadAllClients();
        loadStatistics();
    })
    .catch(error => {
        console.error('Error al cambiar estado del cliente:', error);
        showNotification(error.message, true);
    });
}

/**
 * Carga los clientes frecuentes
 */
function loadFrequentClients() {
    console.log('Cargando clientes frecuentes...');
    
    fetch('/api/clientes/frecuentes')
        .then(response => response.text())
        .then(message => {
            console.log('Clientes frecuentes cargados');
            
            // Crear una visualización formateada para el mensaje
            hideAllForms();
            const contentArea = document.getElementById('main-content');
            if (!contentArea) return;
            
            contentArea.style.display = 'block';
            contentArea.innerHTML = `
                <h3 class="panel-title">Clientes Frecuentes</h3>
                <div class="client-details">
                    <pre style="white-space: pre-wrap; color: #e0e6ef; font-family: inherit;">${message}</pre>
                </div>
                <button class="submit-btn" id="btn-back-frequent">Volver al Listado</button>
            `;
            
            // Agregar el evento después de crear el botón
            const btnBackFrequent = document.getElementById('btn-back-frequent');
            if (btnBackFrequent) {
                btnBackFrequent.addEventListener('click', function() {
                    console.log('Volviendo al listado desde clientes frecuentes');
                    hideAllForms();
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) mainContent.style.display = 'block';
                    loadAllClients();
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar clientes frecuentes:', error);
        });
}

// empleados.js - Script para la gestión de empleados

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando aplicación de empleados...');
    
    // Inicializar la aplicación
    initEmpleadosApp();
});

/**
 * Inicializa la aplicación de gestión de empleados
 */
function initEmpleadosApp() {
    try {
        console.log('Cargando estadísticas y empleados iniciales...');
        
        // Cargar estadísticas iniciales
        loadStatistics();
        
        // Cargar todos los empleados al iniciar
        loadAllEmployees();
        
        // Configurar paneles y formularios
        setupPanelVisibility();
        
        // Configurar escuchas de eventos para los botones del panel de control
        setupEventListeners();
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
}

/**
 * Carga las estadísticas de empleados
 */
function loadStatistics() {
    fetch('/empleados/listar')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener empleados');
            return response.json();
        })
        .then(data => {
            console.log('Estadísticas cargadas');
            const totalEmpleados = data.length;
            const activosEmpleados = data.filter(emp => emp.activo).length;
            const inactivosEmpleados = totalEmpleados - activosEmpleados;
            
            document.getElementById('total-empleados').textContent = totalEmpleados;
            document.getElementById('empleados-activos').textContent = activosEmpleados;
            document.getElementById('empleados-inactivos').textContent = inactivosEmpleados;
        })
        .catch(error => {
            console.error('Error cargando estadísticas:', error);
            showNotification('Error al cargar estadísticas', true);
            
            // Valores por defecto en caso de error
            document.getElementById('total-empleados').textContent = '0';
            document.getElementById('empleados-activos').textContent = '0';
            document.getElementById('empleados-inactivos').textContent = '0';
        });
}

/**
 * Carga todos los empleados
 */
function loadAllEmployees() {
    console.log('Cargando lista de empleados...');
    
    fetch('/empleados/listar')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener empleados');
            return response.json();
        })
        .then(data => {
            console.log(`${data.length} empleados cargados`);
            renderEmployeeTable(data);
        })
        .catch(error => {
            console.error('Error cargando empleados:', error);
            showNotification('Error al cargar empleados: ' + error.message, true);
            
            // Limpiar tabla en caso de error
            const tbody = document.getElementById('empleados-table-body');
            if (tbody) tbody.innerHTML = '';
        });
}

/**
 * Renderiza la tabla de empleados con los datos proporcionados
 * @param {Array} employees - Lista de empleados a mostrar
 */
function renderEmployeeTable(employees) {
    const tbody = document.getElementById('empleados-table-body');
    if (!tbody) {
        console.error('No se encontró el elemento empleados-table-body');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (employees.length === 0) {
        showNotification('No se encontraron empleados', false);
        return;
    }
    
    employees.forEach(empleado => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${empleado.id}</td>
            <td>${empleado.nombre || ''}</td>
            <td>${empleado.apellido || ''}</td>
            <td>${empleado.email || ''}</td>
            <td>${empleado.telefono || ''}</td>
            <td>${empleado.rol || ''}</td>
            <td>${empleado.activo ? '<span class="status-active">Activo</span>' : '<span class="status-inactive">Inactivo</span>'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" data-id="${empleado.id}">Editar</button>
                    <button class="btn-action btn-delete" data-id="${empleado.id}">Eliminar</button>
                    <button class="btn-action" data-id="${empleado.id}" data-action="view">Ver</button>
                    <button class="btn-action" data-id="${empleado.id}" data-action="toggle-status">
                        ${empleado.activo ? 'Desactivar' : 'Activar'}
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
            const employeeId = this.getAttribute('data-id');
            console.log('Editando empleado:', employeeId);
            loadEmployeeForEditing(employeeId);
        });
    });
    
    // Botón de eliminar
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const employeeId = this.getAttribute('data-id');
            console.log('Eliminando empleado:', employeeId);
            deleteEmployee(employeeId);
        });
    });
    
    // Botón de ver detalles
    document.querySelectorAll('[data-action="view"]').forEach(button => {
        button.addEventListener('click', function() {
            const employeeId = this.getAttribute('data-id');
            console.log('Viendo detalles de empleado:', employeeId);
            showEmployeeDetails(employeeId);
        });
    });
    
    // Botón de cambiar estado
    document.querySelectorAll('[data-action="toggle-status"]').forEach(button => {
        button.addEventListener('click', function() {
            const employeeId = this.getAttribute('data-id');
            const isCurrentlyActive = this.textContent.trim() === 'Desactivar';
            console.log(`Cambiando estado de empleado ${employeeId} a: ${!isCurrentlyActive}`);
            toggleEmployeeStatus(employeeId, !isCurrentlyActive);
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
    
    // Agregar Empleado
    const btnAgregar = document.getElementById('btn-agregar');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', function() {
            console.log('Clic en Agregar Empleado');
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
    
    // Enviar formulario nuevo empleado
    const empleadoForm = document.getElementById('empleado-form');
    if (empleadoForm) {
        empleadoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario de empleado enviado');
            addNewEmployee(this);
        });
    }
    
    // Listar Empleados
    const btnListar = document.getElementById('btn-listar');
    if (btnListar) {
        btnListar.addEventListener('click', function() {
            console.log('Clic en Listar Empleados');
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
            loadAllEmployees();
        });
    }
    
    // Botón Buscar Empleado en caja de búsqueda
    const btnBuscar = document.getElementById('btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', function() {
            console.log('Clic en Buscar');
            searchEmployeesByName();
        });
    }
    
    // Botón Buscar Empleado en panel
    const btnBuscarPanel = document.getElementById('btn-buscar-panel');
    if (btnBuscarPanel) {
        btnBuscarPanel.addEventListener('click', function() {
            console.log('Clic en Buscar Empleado (panel)');
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.style.display = 'block';
                const searchInput = document.getElementById('search-empleado');
                if (searchInput) searchInput.focus();
            }
        });
    }
    
    // Panel Actualizar Empleado
    const btnActualizarPanel = document.getElementById('btn-actualizar-panel');
    if (btnActualizarPanel) {
        btnActualizarPanel.addEventListener('click', function() {
            console.log('Clic en Actualizar Empleado (panel)');
            hideAllForms();
            const formActualizar = document.getElementById('form-actualizar');
            if (formActualizar) formActualizar.style.display = 'block';
        });
    }
    
    // Cargar Empleado para actualizar
    const btnCargarEmpleado = document.getElementById('btn-cargar-empleado');
    if (btnCargarEmpleado) {
        btnCargarEmpleado.addEventListener('click', function() {
            const idInput = document.getElementById('id-actualizar');
            if (!idInput) return;
            
            const employeeId = idInput.value;
            if (employeeId) {
                console.log('Cargando empleado para actualizar:', employeeId);
                loadEmployeeForEditing(employeeId);
            } else {
                showNotification('Por favor ingrese un ID de empleado', true);
            }
        });
    }
    
    // Enviar formulario actualizar empleado
    const actualizarForm = document.getElementById('actualizar-form');
    if (actualizarForm) {
        actualizarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario de actualización enviado');
            updateEmployee();
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
    
    // Buscar detalles de empleado
    const btnBuscarDetalles = document.getElementById('btn-buscar-detalles');
    if (btnBuscarDetalles) {
        btnBuscarDetalles.addEventListener('click', function() {
            const idInput = document.getElementById('id-detalles');
            if (!idInput) return;
            
            const employeeId = idInput.value;
            if (employeeId) {
                console.log('Buscando detalles de empleado:', employeeId);
                loadEmployeeDetails(employeeId);
            } else {
                showNotification('Por favor ingrese un ID de empleado', true);
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
    
    // Panel Asignar Rol
    const btnAsignarRol = document.getElementById('btn-asignar-rol');
    if (btnAsignarRol) {
        btnAsignarRol.addEventListener('click', function() {
            console.log('Clic en Asignar Rol');
            hideAllForms();
            const formAsignarRol = document.getElementById('form-asignar-rol');
            if (formAsignarRol) formAsignarRol.style.display = 'block';
        });
    }
    
    // Botón asignar rol submit
    const btnAsignarRolSubmit = document.getElementById('btn-asignar-rol-submit');
    if (btnAsignarRolSubmit) {
        btnAsignarRolSubmit.addEventListener('click', function() {
            const idInput = document.getElementById('id-rol');
            const rolInput = document.getElementById('nuevo-rol');
            if (!idInput || !rolInput) return;
            
            const employeeId = idInput.value;
            const nuevoRol = rolInput.value;
            if (employeeId && nuevoRol) {
                console.log(`Asignando rol "${nuevoRol}" a empleado:`, employeeId);
                assignRoleToEmployee(employeeId, nuevoRol);
            } else {
                showNotification('Por favor complete todos los campos', true);
            }
        });
    }
    
    // Volver desde asignar rol
    const backFromRol = document.getElementById('back-from-rol');
    if (backFromRol) {
        backFromRol.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
        });
    }
    
    // Generar Reporte
    const btnReporte = document.getElementById('btn-reporte');
    if (btnReporte) {
        btnReporte.addEventListener('click', function() {
            console.log('Clic en Generar Reporte');
            generateReport();
        });
    }
    
    // Exportar Datos
    const btnExportar = document.getElementById('btn-exportar');
    if (btnExportar) {
        btnExportar.addEventListener('click', function() {
            console.log('Clic en Exportar Datos');
            exportEmployeeData();
        });
    }
}

/**
 * Oculta todos los formularios
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
 * Agrega un nuevo empleado
 * @param {HTMLFormElement} form - Formulario con los datos del empleado
 */
function addNewEmployee(form) {
    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }
    
    console.log('Agregando nuevo empleado...');
    
    const nuevoEmpleado = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        rol: document.getElementById('rol').value,
        activo: document.getElementById('activo').checked,
        password: document.getElementById('password').value
    };
    
    console.log('Datos del nuevo empleado:', nuevoEmpleado);

    fetch('/empleados/agregar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoEmpleado)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar empleado');
        }
        return response.json();
    })
    .then(data => {
        console.log('Empleado agregado:', data);
        showNotification('Empleado agregado con éxito');
        form.reset();
        setTimeout(() => {
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
            loadAllEmployees();
            loadStatistics();
        }, 1500);
    })
    .catch(error => {
        console.error('Error al agregar empleado:', error);
        showNotification('Error al agregar empleado: ' + error.message, true);
    });
}

/**
 * Busca empleados por nombre o apellido
 */
function searchEmployeesByName() {
    const searchInput = document.getElementById('search-empleado');
    if (!searchInput) {
        console.error('Input de búsqueda no encontrado');
        return;
    }
    
    const filtro = searchInput.value;
    console.log('Buscando empleados con filtro:', filtro);
    
    if (!filtro) {
        loadAllEmployees();
        return;
    }
    
    fetch(`/empleados/buscar?filtro=${encodeURIComponent(filtro)}`)
        .then(response => response.json())
        .then(data => {
            console.log(`Se encontraron ${data.length} empleados`);
            renderEmployeeTable(data);
            if (data.length === 0) {
                showNotification('No se encontraron empleados con ese criterio', false);
            }
        })
        .catch(error => {
            console.error('Error al buscar empleados:', error);
            showNotification('Error al buscar empleados: ' + error.message, true);
        });
}

/**
 * Carga datos de un empleado para edición
 * @param {string} employeeId - ID del empleado a editar
 */
function loadEmployeeForEditing(employeeId) {
    console.log('Cargando empleado para edición:', employeeId);
    
    fetch(`/empleados/detalles/${employeeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Empleado no encontrado');
            }
            return response.json();
        })
        .then(empleado => {
            console.log('Datos del empleado cargados:', empleado);
            const formActualizar = document.getElementById('form-actualizar');
            if (formActualizar) formActualizar.style.display = 'block';
            
            const idInput = document.getElementById('actualizar-id');
            const nombreInput = document.getElementById('actualizar-nombre');
            const apellidoInput = document.getElementById('actualizar-apellido');
            const emailInput = document.getElementById('actualizar-email');
            const telefonoInput = document.getElementById('actualizar-telefono');
            const rolInput = document.getElementById('actualizar-rol');
            const activoSelect = document.getElementById('actualizar-activo');
            const actualizarForm = document.getElementById('actualizar-form');
            
            if (idInput) idInput.value = empleado.id;
            if (nombreInput) nombreInput.value = empleado.nombre || '';
            if (apellidoInput) apellidoInput.value = empleado.apellido || '';
            if (emailInput) emailInput.value = empleado.email || '';
            if (telefonoInput) telefonoInput.value = empleado.telefono || '';
            if (rolInput) rolInput.value = empleado.rol || '';
            if (activoSelect) activoSelect.value = empleado.activo ? 'true' : 'false';
            
            if (actualizarForm) actualizarForm.style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar empleado:', error);
            showNotification(error.message, true);
        });
}

/**
 * Actualiza un empleado
 */
function updateEmployee() {
    const idInput = document.getElementById('actualizar-id');
    const nombreInput = document.getElementById('actualizar-nombre');
    const apellidoInput = document.getElementById('actualizar-apellido');
    const emailInput = document.getElementById('actualizar-email');
    const telefonoInput = document.getElementById('actualizar-telefono');
    const rolInput = document.getElementById('actualizar-rol');
    const activoSelect = document.getElementById('actualizar-activo');
    
    if (!idInput || !nombreInput || !apellidoInput || !emailInput || !telefonoInput || !rolInput || !activoSelect) {
        console.error('Formulario incompleto');
        showNotification('Error: formulario incompleto', true);
        return;
    }
    
    const employeeId = idInput.value;
    console.log('Actualizando empleado:', employeeId);
    
    const datosActualizados = {
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        email: emailInput.value,
        telefono: telefonoInput.value,
        rol: rolInput.value,
        activo: activoSelect.value === 'true'
    };
    
    console.log('Datos actualizados:', datosActualizados);
    
    fetch(`/empleados/actualizar/${employeeId}`, {
        method: 'PUT',
        body: JSON.stringify(datosActualizados),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(message => {
        console.log('Respuesta de actualización:', message);
        showNotification(message || 'Empleado actualizado con éxito');
        hideAllForms();
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.style.display = 'block';
        loadAllEmployees();
        loadStatistics();
    })
    .catch(error => {
        console.error('Error al actualizar empleado:', error);
        showNotification('Error al actualizar empleado: ' + error.message, true);
    });
}

/**
 * Elimina un empleado
 * @param {string} employeeId - ID del empleado a eliminar
 */
function deleteEmployee(employeeId) {
    if (!confirm('¿Está seguro de que desea eliminar este empleado?')) {
        return;
    }
    
    console.log('Eliminando empleado:', employeeId);
    
    fetch(`/empleados/eliminar/${employeeId}`, {
        method: 'DELETE'
    })
    .then(response => response.text())
    .then(message => {
        console.log('Respuesta de eliminación:', message);
        showNotification(message || 'Empleado eliminado con éxito');
        loadAllEmployees();
        loadStatistics();
    })
    .catch(error => {
        console.error('Error al eliminar empleado:', error);
        showNotification('Error al eliminar empleado: ' + error.message, true);
    });
}

/**
 * Muestra los detalles de un empleado en la vista de detalles
 * @param {string} employeeId - ID del empleado
 */
function showEmployeeDetails(employeeId) {
    console.log('Mostrando detalles del empleado:', employeeId);
    
    hideAllForms();
    const formDetalles = document.getElementById('form-detalles');
    const idInput = document.getElementById('id-detalles');
    
    if (formDetalles) formDetalles.style.display = 'block';
    if (idInput) idInput.value = employeeId;
    
    loadEmployeeDetails(employeeId);
}

/**
 * Carga los detalles de un empleado
 * @param {string} employeeId - ID del empleado
 */
function loadEmployeeDetails(employeeId) {
    console.log('Cargando detalles del empleado:', employeeId);
    
    fetch(`/empleados/detalles/${employeeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Empleado no encontrado');
            }
            return response.json();
        })
        .then(empleado => {
            console.log('Detalles del empleado cargados:', empleado);
            
            const nombreCompletoElement = document.getElementById('detalles-nombre-completo');
            const idElement = document.getElementById('detalles-id');
            const nombreElement = document.getElementById('detalles-nombre');
            const apellidoElement = document.getElementById('detalles-apellido');
            const emailElement = document.getElementById('detalles-email');
            const telefonoElement = document.getElementById('detalles-telefono');
            const rolElement = document.getElementById('detalles-rol');
            const estadoElement = document.getElementById('detalles-estado');
            const contenidoElement = document.getElementById('detalles-contenido');
            
            if (nombreCompletoElement) nombreCompletoElement.textContent = `${empleado.nombre || ''} ${empleado.apellido || ''}`;
            if (idElement) idElement.textContent = empleado.id;
            if (nombreElement) nombreElement.textContent = empleado.nombre || '';
            if (apellidoElement) apellidoElement.textContent = empleado.apellido || '';
            if (emailElement) emailElement.textContent = empleado.email || 'No disponible';
            if (telefonoElement) telefonoElement.textContent = empleado.telefono || 'No disponible';
            if (rolElement) rolElement.textContent = empleado.rol || 'No asignado';
            
            if (estadoElement) {
                estadoElement.textContent = empleado.activo ? 'Activo' : 'Inactivo';
                estadoElement.className = empleado.activo ? 'detail-value status-active' : 'detail-value status-inactive';
            }
            
            if (contenidoElement) contenidoElement.style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar detalles del empleado:', error);
            showNotification(error.message, true);
            
            const contenidoElement = document.getElementById('detalles-contenido');
            if (contenidoElement) contenidoElement.style.display = 'none';
        });
}

/**
 * Cambia el estado activo de un empleado
 * @param {string} employeeId - ID del empleado
 * @param {boolean} newActiveStatus - Nuevo estado (activo/inactivo)
 */
function toggleEmployeeStatus(employeeId, newActiveStatus) {
    console.log(`Cambiando estado del empleado ${employeeId} a ${newActiveStatus ? 'activo' : 'inactivo'}`);
    
    fetch(`/empleados/alternar-estado/${employeeId}`, {
        method: 'PUT'
    })
    .then(response => response.text())
    .then(message => {
        console.log('Respuesta de cambio de estado:', message);
        showNotification(message || `Empleado ${newActiveStatus ? 'activado' : 'desactivado'} exitosamente`);
        loadAllEmployees();
        loadStatistics();
    })
    .catch(error => {
        console.error('Error al cambiar estado del empleado:', error);
        showNotification('Error al cambiar estado del empleado: ' + error.message, true);
    });
}

/**
 * Asigna un rol a un empleado
 * @param {string} employeeId - ID del empleado
 * @param {string} role - Nuevo rol
 */
function assignRoleToEmployee(employeeId, role) {
    console.log(`Asignando rol "${role}" al empleado ${employeeId}`);
    
    fetch(`/empleados/asignar-rol/${employeeId}?nuevoRol=${encodeURIComponent(role)}`, {
        method: 'PUT'
    })
    .then(response => response.text())
    .then(message => {
        console.log('Respuesta de asignación de rol:', message);
        showNotification(message || 'Rol actualizado exitosamente');
        
        // Limpiar formulario
        const idInput = document.getElementById('id-rol');
        const rolInput = document.getElementById('nuevo-rol');
        if (idInput) idInput.value = '';
        if (rolInput) rolInput.value = '';
        
        // Volver al listado y actualizar datos
        setTimeout(() => {
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
            loadAllEmployees();
        }, 1500);
    })
    .catch(error => {
        console.error('Error al asignar rol:', error);
        showNotification('Error al asignar rol: ' + error.message, true);
    });
}

/**
 * Genera un reporte de empleados
 */
function generateReport() {
    console.log('Generando reporte de empleados...');
    
    fetch('/empleados/reporte')
        .then(response => response.text())
        .then(message => {
            console.log('Respuesta de generación de reporte:', message);
            showNotification(message || 'Reporte generado exitosamente');
        })
        .catch(error => {
            console.error('Error al generar reporte:', error);
            showNotification('Funcionalidad de reporte aún no implementada completamente', false);
        });
}

/**
 * Exporta datos de empleados
 */
function exportEmployeeData() {
    console.log('Exportando datos de empleados...');
    
    fetch('/empleados/exportar')
        .then(response => response.text())
        .then(message => {
            console.log('Respuesta de exportación:', message);
            showNotification(message || 'Datos exportados exitosamente');
        })
        .catch(error => {
            console.error('Error al exportar datos:', error);
            showNotification('Funcionalidad de exportación aún no implementada completamente', false);
        });
}
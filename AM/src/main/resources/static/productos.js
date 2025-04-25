// productos.js - Script para la gestión de productos

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando aplicación de productos...');
    
    // Inicializar la aplicación
    initProductosApp();
});

/**
 * Inicializa la aplicación de gestión de productos
 */
function initProductosApp() {
    try {
        console.log('Cargando estadísticas y productos iniciales...');
        
        // Cargar estadísticas iniciales
        loadStatistics();
        
        // Cargar todos los productos al iniciar
        loadAllProducts();
        
        // Configurar paneles y formularios
        setupPanelVisibility();
        
        // Configurar escuchas de eventos para los botones del panel de control
        setupEventListeners();
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
}

/**
 * Carga las estadísticas de productos
 */
function loadStatistics() {
    fetch('/productos')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener productos');
            return response.json();
        })
        .then(data => {
            console.log('Estadísticas cargadas');
            const totalProductos = data.length;
            const activosProductos = data.filter(prod => prod.activo).length;
            let stockTotal = 0;
            
            data.forEach(producto => {
                if (producto.stock) {
                    stockTotal += producto.stock;
                }
            });
            
            document.getElementById('total-productos').textContent = totalProductos;
            document.getElementById('productos-activos').textContent = activosProductos;
            document.getElementById('stock-total').textContent = stockTotal;
        })
        .catch(error => {
            console.error('Error cargando estadísticas:', error);
            showNotification('Error al cargar estadísticas', true);
            
            // Valores por defecto en caso de error
            document.getElementById('total-productos').textContent = '0';
            document.getElementById('productos-activos').textContent = '0';
            document.getElementById('stock-total').textContent = '0';
        });
}

/**
 * Carga todos los productos
 */
function loadAllProducts() {
    console.log('Cargando lista de productos...');
    
    fetch('/productos')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener productos');
            return response.json();
        })
        .then(data => {
            console.log(`${data.length} productos cargados`);
            renderProductTable(data);
        })
        .catch(error => {
            console.error('Error cargando productos:', error);
            showNotification('Error al cargar productos: ' + error.message, true);
            
            // Limpiar tabla en caso de error
            const tbody = document.getElementById('productos-table-body');
            if (tbody) tbody.innerHTML = '';
        });
}

/**
 * Renderiza la tabla de productos con los datos proporcionados
 * @param {Array} products - Lista de productos a mostrar
 */
function renderProductTable(products) {
    const tbody = document.getElementById('productos-table-body');
    if (!tbody) {
        console.error('No se encontró el elemento productos-table-body');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        showNotification('No se encontraron productos', false);
        return;
    }
    
    products.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre || ''}</td>
            <td>${producto.descripcion || ''}</td>
            <td>$${formatPrice(producto.precio)}</td>
            <td>${producto.stock || 0}</td>
            <td>${producto.activo ? '<span class="status-active">Activo</span>' : '<span class="status-inactive">Inactivo</span>'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" data-id="${producto.id}">Editar</button>
                    <button class="btn-action btn-delete" data-id="${producto.id}">Eliminar</button>
                    <button class="btn-action btn-inventory" data-id="${producto.id}" data-action="inventory">Inventario</button>
                    <button class="btn-action" data-id="${producto.id}" data-action="toggle-status">
                        ${producto.activo ? 'Desactivar' : 'Activar'}
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
 * Formatea un precio como string con dos decimales
 * @param {number} price - Precio a formatear
 * @returns {string} - Precio formateado
 */
function formatPrice(price) {
    if (price === null || price === undefined) return '0.00';
    return parseFloat(price).toFixed(2);
}

/**
 * Agrega escuchas de eventos a los botones de acción en la tabla
 */
function addActionButtonListeners() {
    console.log('Agregando listeners a botones de acción...');
    
    // Botón de editar
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            console.log('Editando producto:', productId);
            loadProductForEditing(productId);
        });
    });
    
    // Botón de eliminar
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            console.log('Eliminando producto:', productId);
            deleteProduct(productId);
        });
    });
    
    // Botón de inventario
    document.querySelectorAll('[data-action="inventory"]').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            console.log('Gestionando inventario para producto:', productId);
            showInventoryForm(productId);
        });
    });
    
    // Botón de cambiar estado (activar/desactivar)
    document.querySelectorAll('[data-action="toggle-status"]').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const isCurrentlyActive = this.textContent.trim() === 'Desactivar';
            console.log(`Cambiando estado de producto ${productId} a ${isCurrentlyActive ? 'inactivo' : 'activo'}`);
            toggleProductStatus(productId, !isCurrentlyActive);
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
    
    // Agregar Producto
    const btnAgregar = document.getElementById('btn-agregar');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', function() {
            console.log('Clic en Agregar Producto');
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
    
    // Enviar formulario nuevo producto
    const productoForm = document.getElementById('producto-form');
    if (productoForm) {
        productoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario de producto enviado');
            addNewProduct(this);
        });
    }
    
    // Listar Productos
    const btnListar = document.getElementById('btn-listar');
    if (btnListar) {
        btnListar.addEventListener('click', function() {
            console.log('Clic en Listar Productos');
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
            loadAllProducts();
        });
    }
    
    // Botón Buscar Producto en caja de búsqueda
    const btnBuscar = document.getElementById('btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', function() {
            console.log('Clic en Buscar');
            searchProductsByName();
        });
    }
    
    // Botón Buscar Producto en panel
    const btnBuscarPanel = document.getElementById('btn-buscar-panel');
    if (btnBuscarPanel) {
        btnBuscarPanel.addEventListener('click', function() {
            console.log('Clic en Buscar Producto (panel)');
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.style.display = 'block';
                const searchInput = document.getElementById('search-producto');
                if (searchInput) searchInput.focus();
            }
        });
    }
    
    // Panel Actualizar Producto
    const btnActualizarPanel = document.getElementById('btn-actualizar-panel');
    if (btnActualizarPanel) {
        btnActualizarPanel.addEventListener('click', function() {
            console.log('Clic en Actualizar Producto (panel)');
            hideAllForms();
            const formActualizar = document.getElementById('form-actualizar');
            if (formActualizar) formActualizar.style.display = 'block';
        });
    }
    
    // Cargar Producto para actualizar
    const btnCargarProducto = document.getElementById('btn-cargar-producto');
    if (btnCargarProducto) {
        btnCargarProducto.addEventListener('click', function() {
            const idInput = document.getElementById('id-actualizar');
            if (!idInput) return;
            
            const productId = idInput.value;
            if (productId) {
                console.log('Cargando producto para actualizar:', productId);
                loadProductForEditing(productId);
            } else {
                showNotification('Por favor ingrese un ID de producto', true);
            }
        });
    }
    
    // Enviar formulario actualizar producto
    const actualizarForm = document.getElementById('actualizar-form');
    if (actualizarForm) {
        actualizarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario de actualización enviado');
            updateProduct();
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
    
    // Panel Gestionar Inventario
    const btnInventarioPanel = document.getElementById('btn-inventario-panel');
    if (btnInventarioPanel) {
        btnInventarioPanel.addEventListener('click', function() {
            console.log('Clic en Gestionar Inventario (panel)');
            hideAllForms();
            const formInventario = document.getElementById('form-inventario');
            if (formInventario) formInventario.style.display = 'block';
        });
    }
    
    // Actualizar Inventario
    const btnActualizarInventario = document.getElementById('btn-actualizar-inventario');
    if (btnActualizarInventario) {
        btnActualizarInventario.addEventListener('click', function() {
            updateInventory();
        });
    }
    
    // Volver desde formulario inventario
    const backFromInventario = document.getElementById('back-from-inventario');
    if (backFromInventario) {
        backFromInventario.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
        });
    }
    
    // Panel Filtrar por Precio
    const btnFiltrarPrecio = document.getElementById('btn-filtrar-precio');
    if (btnFiltrarPrecio) {
        btnFiltrarPrecio.addEventListener('click', function() {
            console.log('Clic en Filtrar por Precio');
            hideAllForms();
            const formFiltrarPrecio = document.getElementById('form-filtrar-precio');
            if (formFiltrarPrecio) formFiltrarPrecio.style.display = 'block';
        });
    }
    
    // Aplicar Filtro de Precio
    const btnAplicarFiltro = document.getElementById('btn-aplicar-filtro');
    if (btnAplicarFiltro) {
        btnAplicarFiltro.addEventListener('click', function() {
            filterProductsByPrice();
        });
    }
    
    // Volver desde formulario filtro de precio
    const backFromFiltro = document.getElementById('back-from-filtro');
    if (backFromFiltro) {
        backFromFiltro.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
        });
    }
    
    // Productos Más Vendidos
    const btnMasVendidos = document.getElementById('btn-mas-vendidos');
    if (btnMasVendidos) {
        btnMasVendidos.addEventListener('click', function() {
            console.log('Clic en Productos Más Vendidos');
            loadTopSellingProducts(true);
        });
    }
    
    // Productos Baja Existencia
    const btnBajaExistencia = document.getElementById('btn-baja-existencia');
    if (btnBajaExistencia) {
        btnBajaExistencia.addEventListener('click', function() {
            console.log('Clic en Productos Baja Existencia');
            loadLowStockProducts();
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
 * Agrega un nuevo producto
 * @param {HTMLFormElement} form - Formulario con los datos del producto
 */
function addNewProduct(form) {
    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }
    
    console.log('Agregando nuevo producto...');
    
    const nuevoProducto = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value, 10),
        activo: true
    };
    
    console.log('Datos del nuevo producto:', nuevoProducto);

    fetch('/productos/agregar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar producto');
        }
        return response.text();
    })
    .then(message => {
        console.log('Producto agregado:', message);
        showNotification(message || 'Producto agregado con éxito');
        form.reset();
        setTimeout(() => {
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
            loadAllProducts();
            loadStatistics();
        }, 1500);
    })
    .catch(error => {
        console.error('Error al agregar producto:', error);
        showNotification('Error al agregar producto: ' + error.message, true);
    });
}

/**
 * Busca productos por nombre
 */
function searchProductsByName() {
    const searchInput = document.getElementById('search-producto');
    if (!searchInput) {
        console.error('Input de búsqueda no encontrado');
        return;
    }
    
    const nombre = searchInput.value;
    console.log('Buscando productos con nombre:', nombre);
    
    if (!nombre) {
        loadAllProducts();
        return;
    }
    
    fetch(`/productos/buscar?nombre=${encodeURIComponent(nombre)}`)
        .then(response => response.json())
        .then(data => {
            console.log(`Se encontraron ${data.length} productos`);
            renderProductTable(data);
            if (data.length === 0) {
                showNotification('No se encontraron productos con ese nombre', false);
            }
        })
        .catch(error => {
            console.error('Error al buscar productos:', error);
            showNotification('Error al buscar productos: ' + error.message, true);
        });
}

/**
 * Carga datos de un producto para edición
 * @param {string} productId - ID del producto a editar
 */
function loadProductForEditing(productId) {
    console.log('Cargando producto para edición:', productId);
    
    // Como no hay un endpoint específico para obtener producto por ID,
    // obtenemos todos los productos y filtramos el que necesitamos
    fetch('/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener productos');
            }
            return response.json();
        })
        .then(productos => {
            const producto = productos.find(p => p.id == productId);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }
            
            console.log('Datos del producto cargados:', producto);
            hideAllForms();
            const formActualizar = document.getElementById('form-actualizar');
            if (formActualizar) formActualizar.style.display = 'block';
            
            document.getElementById('actualizar-id').value = producto.id;
            document.getElementById('actualizar-nombre').value = producto.nombre || '';
            document.getElementById('actualizar-descripcion').value = producto.descripcion || '';
            document.getElementById('actualizar-precio').value = producto.precio || 0;
            document.getElementById('actualizar-stock').value = producto.stock || 0;
            document.getElementById('actualizar-activo').value = producto.activo ? 'true' : 'false';
            
            document.getElementById('actualizar-form').style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar producto:', error);
            showNotification(error.message, true);
        });
}

/**
 * Actualiza un producto
 */
function updateProduct() {
    const idInput = document.getElementById('actualizar-id');
    const nombreInput = document.getElementById('actualizar-nombre');
    const descripcionInput = document.getElementById('actualizar-descripcion');
    const precioInput = document.getElementById('actualizar-precio');
    const stockInput = document.getElementById('actualizar-stock');
    const activoSelect = document.getElementById('actualizar-activo');
    
    if (!idInput || !nombreInput || !descripcionInput || !precioInput || !stockInput || !activoSelect) {
        console.error('Formulario incompleto');
        showNotification('Error: formulario incompleto', true);
        return;
    }
    
    const productId = idInput.value;
    console.log('Actualizando producto:', productId);
    
    const datosActualizados = {
        nombre: nombreInput.value,
        descripcion: descripcionInput.value,
        precio: parseFloat(precioInput.value),
        stock: parseInt(stockInput.value, 10),
        activo: activoSelect.value === 'true'
    };
    
    console.log('Datos actualizados:', datosActualizados);
    
    fetch(`/productos/actualizar/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(datosActualizados),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(message => {
        console.log('Respuesta de actualización:', message);
        showNotification(message || 'Producto actualizado con éxito');
        hideAllForms();
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.style.display = 'block';
        loadAllProducts();
        loadStatistics();
    })
    .catch(error => {
        console.error('Error al actualizar producto:', error);
        showNotification('Error al actualizar producto: ' + error.message, true);
    });
}

/**
 * Elimina un producto
 * @param {string} productId - ID del producto a eliminar
 */
function deleteProduct(productId) {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) {
        return;
    }
    
    console.log('Eliminando producto:', productId);
    
    fetch(`/productos/${productId}`, {
        method: 'DELETE'
    })
    .then(response => response.text())
    .then(message => {
        console.log('Respuesta de eliminación:', message);
        showNotification(message || 'Producto eliminado con éxito');
        loadAllProducts();
        loadStatistics();
    })
    .catch(error => {
        console.error('Error al eliminar producto:', error);
        showNotification('Error al eliminar producto: ' + error.message, true);
    });
}

/**
 * Cambia el estado (activo/inactivo) de un producto
 * @param {string} productId - ID del producto
 * @param {boolean} newStatus - Nuevo estado (true = activo, false = inactivo)
 */
function toggleProductStatus(productId, newStatus) {
    if (!confirm(`¿Está seguro de que desea ${newStatus ? 'activar' : 'desactivar'} este producto?`)) {
        return;
    }
    
    console.log(`Cambiando estado del producto ${productId} a ${newStatus ? 'activo' : 'inactivo'}`);
    
    // Como no hay un endpoint específico para cambiar estado, 
    // primero cargamos el producto existente y luego lo actualizamos
    fetch('/productos')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener productos');
            return response.json();
        })
        .then(productos => {
            const producto = productos.find(p => p.id == productId);
            if (!producto) throw new Error('Producto no encontrado');
            
            // Actualizar el estado del producto
            producto.activo = newStatus;
            
            // Enviar la actualización
            return fetch(`/productos/actualizar/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });
        })
        .then(response => response.text())
        .then(message => {
            console.log('Respuesta de cambio de estado:', message);
            showNotification(message || `Producto ${newStatus ? 'activado' : 'desactivado'} con éxito`);
            loadAllProducts();
            loadStatistics();
        })
        .catch(error => {
            console.error('Error al cambiar estado del producto:', error);
            showNotification('Error al cambiar estado del producto: ' + error.message, true);
        });
}

/**
 * Muestra el formulario de gestión de inventario
 * @param {string} productId - ID del producto
 */
function showInventoryForm(productId) {
    hideAllForms();
    const formInventario = document.getElementById('form-inventario');
    if (formInventario) {
        formInventario.style.display = 'block';
        document.getElementById('id-inventario').value = productId;
        document.getElementById('cantidad-inventario').value = '1';
        document.getElementById('agregar-stock').checked = true;
    }
}

/**
 * Actualiza el inventario de un producto
 */
function updateInventory() {
    const productId = document.getElementById('id-inventario').value;
    const cantidad = parseInt(document.getElementById('cantidad-inventario').value, 10);
    const agregar = document.querySelector('input[name="tipo-operacion"]:checked').value === 'true';
    
    if (!productId || isNaN(cantidad) || cantidad <= 0) {
        showNotification('Por favor ingrese un ID de producto y una cantidad válida', true);
        return;
    }
    
    console.log(`Actualizando inventario del producto ${productId}: ${agregar ? 'Agregando' : 'Quitando'} ${cantidad} unidades`);
    
    fetch(`/productos/inventario/${productId}?cantidad=${cantidad}&agregar=${agregar}`, {
        method: 'PUT'
    })
    .then(response => response.text())
    .then(message => {
        console.log('Respuesta de actualización de inventario:', message);
        showNotification(message || 'Inventario actualizado con éxito');
        
        // Limpiar formulario
        document.getElementById('id-inventario').value = '';
        document.getElementById('cantidad-inventario').value = '1';
        
        setTimeout(() => {
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.display = 'block';
            loadAllProducts();
            loadStatistics();
        }, 1500);
    })
    .catch(error => {
        console.error('Error al actualizar inventario:', error);
        showNotification('Error al actualizar inventario: ' + error.message, true);
    });
}

/**
 * Filtra productos por rango de precio
 */
function filterProductsByPrice() {
    const precioMin = parseFloat(document.getElementById('precio-min').value);
    const precioMax = parseFloat(document.getElementById('precio-max').value);
    
    if (isNaN(precioMin) || isNaN(precioMax) || precioMin < 0 || precioMax < 0 || precioMin > precioMax) {
        showNotification('Por favor ingrese un rango de precios válido', true);
        return;
    }
    
    console.log(`Filtrando productos por precio: $${precioMin} - $${precioMax}`);
    
    fetch(`/productos/filtrar/precio?min=${precioMin}&max=${precioMax}`)
        .then(response => response.json())
        .then(data => {
            console.log(`Se encontraron ${data.length} productos en el rango`);
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.style.display = 'block';
                renderProductTable(data);
                
                if (data.length === 0) {
                    showNotification('No se encontraron productos en ese rango de precios', false);
                } else {
                    showNotification(`Se encontraron ${data.length} productos entre $${precioMin} y $${precioMax}`, false);
                }
            }
        })
        .catch(error => {
            console.error('Error al filtrar productos por precio:', error);
            showNotification('Error al filtrar productos: ' + error.message, true);
        });
}

/**
 * Carga los productos más vendidos
 * @param {boolean} top - true para obtener los más vendidos, false para los menos vendidos
 */
function loadTopSellingProducts(top = true) {
    console.log(`Cargando productos ${top ? 'más' : 'menos'} vendidos`);
    
    fetch(`/productos/mas-vendidos?top=${top}`)
        .then(response => response.json())
        .then(data => {
            console.log('Productos más vendidos cargados:', data);
            
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (!mainContent) return;
            
            mainContent.style.display = 'block';
            
            // Transformar el formato de datos
            let productosTransformados = [];
            data.forEach(item => {
                if (Array.isArray(item) && item.length >= 2) {
                    const producto = item[0];
                    const cantidad = item[1];
                    
                    productosTransformados.push({
                        id: producto.id,
                        nombre: producto.nombre,
                        descripcion: producto.descripcion,
                        precio: producto.precio,
                        stock: producto.stock,
                        activo: producto.activo,
                        ventas: cantidad
                    });
                }
            });
            
            // Si no hay productos transformados, mostrar mensaje
            if (productosTransformados.length === 0) {
                mainContent.innerHTML = `
                    <div class="panel-title">Productos Más Vendidos</div>
                    <div class="form-container">
                        <p>No hay datos de ventas disponibles.</p>
                        <button class="submit-btn" id="back-to-main">Volver al Listado</button>
                    </div>
                `;
                
                // FIX: Agregar listener después de crear el elemento en el DOM
                setTimeout(() => {
                    const backButton = document.getElementById('back-to-main');
                    if (backButton) {
                        backButton.addEventListener('click', function() {
                            console.log('Volviendo al listado desde productos más vendidos');
                            showMainProductList();
                        });
                    }
                }, 100);
                
                return;
            }
            
            // Crear vista de ranking
            let rankingHTML = `
                <div class="panel-title">Productos Más Vendidos</div>
                <div class="form-container">
                    <div class="top-products">
                        <h3 class="top-products-title">Top ${productosTransformados.length} Productos con Mayores Ventas</h3>
            `;
            
            productosTransformados.forEach((producto, index) => {
                rankingHTML += `
                    <div class="product-rank-item">
                        <div class="product-rank-name">
                            <span class="product-rank-position">${index + 1}</span>
                            ${producto.nombre}
                        </div>
                        <div class="product-rank-sales">
                            ${producto.ventas} unidades
                        </div>
                    </div>
                `;
            });
            
            rankingHTML += `
                    </div>
                    <button class="submit-btn" id="back-to-main">Volver al Listado</button>
                </div>
            `;
            
            mainContent.innerHTML = rankingHTML;
            
            // FIX: Agregar listener después de crear el elemento en el DOM
            setTimeout(() => {
                const backButton = document.getElementById('back-to-main');
                if (backButton) {
                    backButton.addEventListener('click', function() {
                        console.log('Volviendo al listado desde productos más vendidos');
                        showMainProductList();
                    });
                }
            }, 100);
        })
        .catch(error => {
            console.error('Error cargando productos más vendidos:', error);
            showNotification('Error al cargar productos más vendidos: ' + error.message, true);
        });
}

/**
 * Función auxiliar para mostrar el listado principal de productos
 */
function showMainProductList() {
    // Restaurar la estructura HTML original del main-content
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    mainContent.innerHTML = `
        <div class="search-box">
            <input type="text" class="search-input" id="search-producto" placeholder="Buscar producto por nombre...">
            <button class="search-button" id="btn-buscar">Buscar</button>
        </div>
        
        <div id="notification-area"></div>
        
        <div class="product-table-container">
            <table class="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="productos-table-body">
                    <!-- Los productos se cargarán aquí dinámicamente -->
                </tbody>
            </table>
        </div>
    `;
    
    // Agregar de nuevo el evento al botón de búsqueda
    const btnBuscar = document.getElementById('btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', searchProductsByName);
    }
    
    // Cargar la lista de productos
    loadAllProducts();
}

/**
 * Carga los productos con baja existencia
 */
function loadLowStockProducts() {
    console.log('Cargando productos con baja existencia');
    
    fetch('/productos/baja-existencia')
        .then(response => response.json())
        .then(data => {
            console.log(`Se encontraron ${data.length} productos con baja existencia`);
            hideAllForms();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.style.display = 'block';
                renderProductTable(data);
                showNotification(`Mostrando productos ordenados por stock (menor a mayor)`, false);
            }
        })
        .catch(error => {
            console.error('Error cargando productos con baja existencia:', error);
            showNotification('Error al cargar productos con baja existencia: ' + error.message, true);
        });
}
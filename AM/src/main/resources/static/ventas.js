// ventas.js - Script para la gestión de ventas
document.addEventListener('DOMContentLoaded', function() {
    // URLs de la API
    const API_BASE_URL = '/api';
    const FACTURA_API = `${API_BASE_URL}/facturas`;
    const DETALLE_FACTURA_API = `${API_BASE_URL}/detalle-factura`;
    const CLIENTE_API = `${API_BASE_URL}/clientes`;
    const EMPLEADO_API = `${API_BASE_URL}/empleados`;
    const PRODUCTO_API = `${API_BASE_URL}/productos`;

    // Referencias a elementos del DOM
    const ventasTableBody = document.getElementById('ventas-table-body');
    const notificationArea = document.getElementById('notification-area');
    const mainContent = document.getElementById('main-content');
    const formNuevaVenta = document.getElementById('form-nueva-venta');
    const formDetalleVenta = document.getElementById('form-detalle-venta');
    const formVentasCliente = document.getElementById('form-ventas-cliente');
    const formAplicarDescuento = document.getElementById('form-aplicar-descuento');
    
    // Referencias a botones del panel de control
    const btnNuevaVenta = document.getElementById('btn-nueva-venta');
    const btnListar = document.getElementById('btn-listar');
    const btnBuscarVenta = document.getElementById('btn-buscar-venta');
    const btnDetalleVenta = document.getElementById('btn-detalle-venta');
    const btnVentasCliente = document.getElementById('btn-ventas-cliente');
    const btnVentasProducto = document.getElementById('btn-ventas-producto');
    const btnVentasVendedor = document.getElementById('btn-ventas-vendedor');
    const btnAplicarDescuento = document.getElementById('btn-aplicar-descuento');
    const btnDevolucion = document.getElementById('btn-devolucion');
    const btnReporte = document.getElementById('btn-reporte');
    const btnExportar = document.getElementById('btn-exportar');
    const btnBuscar = document.getElementById('btn-buscar');
    const searchVentaId = document.getElementById('search-venta-id');

    // Elementos del formulario de nueva venta
    const ventaForm = document.getElementById('venta-form');
    const clienteSelect = document.getElementById('cliente-id');
    const empleadoSelect = document.getElementById('empleado-id');
    const productosContainer = document.getElementById('productos-container');
    const btnAddProducto = document.getElementById('btn-add-producto');
    const ventaTotal = document.getElementById('venta-total');
    const backToList = document.getElementById('back-to-list');

    // Elementos del detalle de venta
    const idDetalle = document.getElementById('id-detalle');
    const btnBuscarDetalle = document.getElementById('btn-buscar-detalle');
    const detalleVentaContenido = document.getElementById('detalle-venta-contenido');
    const detalleVentaId = document.getElementById('detalle-venta-id');
    const detalleVentaFecha = document.getElementById('detalle-venta-fecha');
    const detalleCliente = document.getElementById('detalle-cliente');
    const detalleEmpleado = document.getElementById('detalle-empleado');
    const detalleProductosBody = document.getElementById('detalle-productos-body');
    const detalleTotal = document.getElementById('detalle-total');
    const backFromDetalle = document.getElementById('back-from-detalle');

    // Elementos de ventas por cliente
    const idClienteVentas = document.getElementById('id-cliente-ventas');
    const btnBuscarVentasCliente = document.getElementById('btn-buscar-ventas-cliente');
    const ventasClienteContenido = document.getElementById('ventas-cliente-contenido');
    const ventasClienteNombre = document.getElementById('ventas-cliente-nombre');
    const ventasClienteBody = document.getElementById('ventas-cliente-body');
    const backFromVentasCliente = document.getElementById('back-from-ventas-cliente');

    // Elementos del formulario de aplicar descuento
    const idVentaDescuento = document.getElementById('id-venta-descuento');
    const porcentajeDescuento = document.getElementById('porcentaje-descuento');
    const btnAplicarDescuentoSubmit = document.getElementById('btn-aplicar-descuento-submit');
    const backFromDescuento = document.getElementById('back-from-descuento');

    // Elementos de los indicadores de estado
    const totalVentas = document.getElementById('total-ventas');
    const ingresosTotal = document.getElementById('ingresos-total');
    const ventasHoy = document.getElementById('ventas-hoy');

    // Variables para almacenar datos
    let clientes = [];
    let empleados = [];
    let productos = [];
    let ventas = [];

    // Inicializar la aplicación
    function init() {
        // Cargar datos iniciales
        cargarVentas();
        cargarEstadisticas();
        
        // Configurar eventos de los botones
        setupEventListeners();
    }

    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, esError = false) {
        const notificacion = document.createElement('div');
        notificacion.className = `notification ${esError ? 'error-notification' : ''}`;
        notificacion.textContent = mensaje;
        notificationArea.appendChild(notificacion);

        // Eliminar la notificación después de 5 segundos
        setTimeout(() => {
            notificacion.remove();
        }, 5000);
    }

    // Función para formatear moneda
    function formatCurrency(value) {
        return '$' + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // Función para ocultar todos los formularios
    function ocultarTodosLosFormularios() {
        mainContent.style.display = 'block';
        formNuevaVenta.style.display = 'none';
        formDetalleVenta.style.display = 'none';
        formVentasCliente.style.display = 'none';
        formAplicarDescuento.style.display = 'none';
    }

    // Cargar ventas desde la API
    function cargarVentas() {
        fetch(FACTURA_API)
            .then(response => response.json())
            .then(data => {
                ventas = data;
                renderizarVentas(data);
            })
            .catch(error => {
                console.error('Error al cargar ventas:', error);
                mostrarNotificacion('Error al cargar las ventas. Intente nuevamente.', true);
            });
    }

    // Cargar estadísticas para los indicadores
    function cargarEstadisticas() {
        // Cargar número total de ventas
        fetch(FACTURA_API)
            .then(response => response.json())
            .then(data => {
                totalVentas.textContent = data.length;
                
                // Calcular ingresos totales
                const total = data.reduce((sum, venta) => sum + venta.total, 0);
                ingresosTotal.textContent = formatCurrency(total);
                
                // Calcular ventas de hoy
                const hoy = new Date().toISOString().split('T')[0];
                const ventasDeHoy = data.filter(venta => {
                    // Suponiendo que la venta tiene una propiedad fecha
                    return venta.fecha && venta.fecha.startsWith(hoy);
                }).length;
                
                ventasHoy.textContent = ventasDeHoy;
            })
            .catch(error => {
                console.error('Error al cargar estadísticas:', error);
            });
    }

    // Renderizar tabla de ventas
    function renderizarVentas(ventas) {
        ventasTableBody.innerHTML = '';
        
        if (ventas.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center;">No hay ventas registradas</td>';
            ventasTableBody.appendChild(row);
            return;
        }
        
        ventas.forEach(venta => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${venta.id}</td>
                <td>${venta.cliente}</td>
                <td>${venta.empleado}</td>
                <td>${formatCurrency(venta.total)}</td>
                <td class="action-buttons">
                    <button class="btn-action btn-view" data-id="${venta.id}">Ver</button>
                    <button class="btn-action btn-discount" data-id="${venta.id}">Descuento</button>
                </td>
            `;
            ventasTableBody.appendChild(row);
        });
        
        // Agregar eventos a los botones de acción DESPUÉS de añadirlos al DOM
        document.querySelectorAll('#ventas-table-body .btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                mostrarDetalleVenta(this.dataset.id);
            });
        });
        
        document.querySelectorAll('#ventas-table-body .btn-discount').forEach(btn => {
            btn.addEventListener('click', function() {
                prepararDescuento(this.dataset.id);
            });
        });
    }

    // Cargar clientes para el formulario de nueva venta
    function cargarClientes() {
        return fetch('/api/clientes/listar')
            .then(response => response.json())
            .then(data => {
                clientes = data;
                clienteSelect.innerHTML = '<option value="">Seleccione un cliente</option>';
                data.forEach(cliente => {
                    const option = document.createElement('option');
                    option.value = cliente.id;
                    option.textContent = `${cliente.nombre} ${cliente.apellido || ''}`;
                    clienteSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar clientes:', error);
                mostrarNotificacion('Error al cargar los clientes.', true);
            });
    }

    // Cargar empleados para el formulario de nueva venta
    function cargarEmpleados() {
        return fetch('/empleados/listar')
            .then(response => response.json())
            .then(data => {
                empleados = data;
                empleadoSelect.innerHTML = '<option value="">Seleccione un vendedor</option>';
                data.forEach(empleado => {
                    const option = document.createElement('option');
                    option.value = empleado.id;
                    option.textContent = `${empleado.nombre} ${empleado.apellido || ''}`;
                    empleadoSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar empleados:', error);
                mostrarNotificacion('Error al cargar los vendedores.', true);
            });
    }

    // Cargar empleados para el formulario de nueva venta
    function cargarEmpleados() {
        return fetch('/empleados/listar')  // Cambiado para usar la ruta correcta según EmpleadoApiController
            .then(response => response.json())
            .then(data => {
                empleados = data;
                empleadoSelect.innerHTML = '<option value="">Seleccione un vendedor</option>';
                data.forEach(empleado => {
                    const option = document.createElement('option');
                    option.value = empleado.id;
                    option.textContent = `${empleado.nombre} ${empleado.apellido || ''}`;
                    empleadoSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar empleados:', error);
                mostrarNotificacion('Error al cargar los vendedores.', true);
                
                // Fallback con datos de ejemplo si la API falla
                const empleadosDemo = [
                    { id: 1, nombre: 'Diego', apellido: 'Silva' },
                    { id: 2, nombre: 'Ana', apellido: 'Gómez' },
                    { id: 3, nombre: 'José', apellido: 'Fernández' },
                    { id: 4, nombre: 'Lucía', apellido: 'Torres' }
                ];
                
                empleados = empleadosDemo;
                empleadoSelect.innerHTML = '<option value="">Seleccione un vendedor</option>';
                empleadosDemo.forEach(empleado => {
                    const option = document.createElement('option');
                    option.value = empleado.id;
                    option.textContent = `${empleado.nombre} ${empleado.apellido || ''}`;
                    empleadoSelect.appendChild(option);
                });
            });
    }

    // Cargar productos para el formulario de nueva venta
    function cargarProductos() {
        return fetch('/productos')
            .then(response => response.json())
            .then(data => {
                productos = data;
                actualizarSelectsProductos();
            })
            .catch(error => {
                console.error('Error al cargar productos:', error);
                mostrarNotificacion('Error al cargar los productos.', true);
            });
    }

    // Actualizar todos los selects de productos
    function actualizarSelectsProductos() {
        const selectsProductos = document.querySelectorAll('.producto-select');
        
        selectsProductos.forEach(select => {
            const valorActual = select.value;
            select.innerHTML = '<option value="">Seleccione un producto</option>';
            
            productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.id;
                option.textContent = producto.nombre;
                option.dataset.precio = producto.precio;
                select.appendChild(option);
            });
            
            // Restaurar valor seleccionado si existía
            if (valorActual) {
                select.value = valorActual;
            }
        });
    }

    // Agregar fila de producto al formulario de nueva venta
    function agregarFilaProducto() {
        const nuevaFila = document.createElement('div');
        nuevaFila.className = 'producto-row';
        nuevaFila.innerHTML = `
            <div class="form-group">
                <label class="form-label">Producto</label>
                <select class="form-input producto-select" required>
                    <option value="">Seleccione un producto</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Cantidad</label>
                <input type="number" class="form-input cantidad-input" min="1" value="1" required>
            </div>
            <div class="form-group precio-display">
                <label class="form-label">Precio</label>
                <div class="precio-valor">$0.00</div>
            </div>
            <div class="form-group subtotal-display">
                <label class="form-label">Subtotal</label>
                <div class="subtotal-valor">$0.00</div>
            </div>
            <button type="button" class="remove-producto-btn">×</button>
        `;
        
        productosContainer.appendChild(nuevaFila);
        
        // Actualizar opciones de productos en el nuevo select
        const select = nuevaFila.querySelector('.producto-select');
        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.id;
            option.textContent = producto.nombre;
            option.dataset.precio = producto.precio;
            select.appendChild(option);
        });
        
        // Configurar evento para eliminar la fila
        nuevaFila.querySelector('.remove-producto-btn').addEventListener('click', function() {
            nuevaFila.remove();
            calcularTotales();
        });
        
        // Configurar eventos para actualizar precios
        configurarEventosProducto(nuevaFila);
    }

    // Configurar eventos para actualizar precios en una fila de producto
    function configurarEventosProducto(filaProducto) {
        const select = filaProducto.querySelector('.producto-select');
        const cantidadInput = filaProducto.querySelector('.cantidad-input');
        const precioValor = filaProducto.querySelector('.precio-valor');
        const subtotalValor = filaProducto.querySelector('.subtotal-valor');
        
        // Actualizar precio cuando se selecciona un producto
        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const precio = selectedOption.dataset.precio || 0;
            
            precioValor.textContent = formatCurrency(precio);
            actualizarSubtotal();
        });
        
        // Actualizar subtotal cuando cambia la cantidad
        cantidadInput.addEventListener('input', actualizarSubtotal);
        
        // Función para actualizar el subtotal
        function actualizarSubtotal() {
            const precio = parseFloat(precioValor.textContent.replace(/[^\d.-]/g, '') || 0);
            const cantidad = parseInt(cantidadInput.value) || 0;
            const subtotal = precio * cantidad;
            
            subtotalValor.textContent = formatCurrency(subtotal);
            calcularTotales();
        }
    }

    // Calcular totales del formulario de venta
    function calcularTotales() {
        const subtotales = document.querySelectorAll('.subtotal-valor');
        let total = 0;
        
        subtotales.forEach(elemento => {
            const valor = parseFloat(elemento.textContent.replace(/[^\d.-]/g, '') || 0);
            total += valor;
        });
        
        ventaTotal.textContent = formatCurrency(total);
    }

    // Preparar formulario de nueva venta
    function prepararNuevaVenta() {
        ocultarTodosLosFormularios();
        formNuevaVenta.style.display = 'block';
        
        // Limpiar formulario
        clienteSelect.innerHTML = '<option value="">Seleccione un cliente</option>';
        empleadoSelect.innerHTML = '<option value="">Seleccione un vendedor</option>';
        productosContainer.innerHTML = '';
        
        // Agregar primera fila de producto
        agregarFilaProducto();
        
        // Cargar datos necesarios
        Promise.all([cargarClientes(), cargarEmpleados(), cargarProductos()])
            .then(() => {
                calcularTotales();
            })
            .catch(error => {
                console.error('Error al preparar formulario:', error);
                mostrarNotificacion('Error al preparar el formulario de venta.', true);
            });
    }

    // Mostrar detalle de una venta
    function mostrarDetalleVenta(id) {
        ocultarTodosLosFormularios();
        formDetalleVenta.style.display = 'block';
        idDetalle.value = id;
        
        cargarDetalleVenta(id);
    }

    // Cargar detalle de una venta desde la API
    function cargarDetalleVenta(id) {
        detalleVentaContenido.style.display = 'none';
        
        // Obtener información básica de las ventas y luego filtrar por ID
        fetch(`${FACTURA_API}`)
            .then(response => response.json())
            .then(ventas => {
                // Buscar la venta específica en la lista
                const ventaBasica = ventas.find(v => v.id == id);
                
                if (!ventaBasica) {
                    mostrarNotificacion('Venta no encontrada.', true);
                    return;
                }
                
                // Mostrar información básica de la venta
                detalleVentaId.textContent = ventaBasica.id;
                detalleVentaFecha.textContent = ventaBasica.fecha || 'No disponible';
                detalleCliente.textContent = ventaBasica.cliente || 'No disponible';
                detalleEmpleado.textContent = ventaBasica.empleado || 'No disponible';
                
                // Ahora obtenemos los detalles
                return fetch(`${FACTURA_API}/detalle/${id}`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(detalles => {
                console.log("Detalles recibidos:", detalles);
                mostrarDetallesProductos(detalles);
            })
            .catch(error => {
                console.error('Error al cargar detalle de venta:', error);
                mostrarNotificacion('Error al cargar el detalle de la venta: ' + error.message, true);
                
                // Intentar un enfoque alternativo como último recurso
                mostrarVentaBasica(id);
            });
    }
    
    // Función para mostrar la información básica de una venta
    function mostrarInfoVentaBasica(venta) {
        detalleVentaId.textContent = venta.id;
        detalleVentaFecha.textContent = venta.fecha || 'No disponible';
        
        // Verificar si existe el objeto cliente y sus propiedades
        if (venta.cliente) {
            detalleCliente.textContent = `${venta.cliente.nombre || ''} ${venta.cliente.apellido || ''}`.trim();
        } else {
            detalleCliente.textContent = 'Cliente no disponible';
        }
        
        // Verificar si existe el objeto empleado y sus propiedades
        if (venta.empleado) {
            detalleEmpleado.textContent = `${venta.empleado.nombre || ''} ${venta.empleado.apellido || ''}`.trim();
        } else {
            detalleEmpleado.textContent = 'No asignado';
        }
    }
    
    // Función para mostrar una venta solo con información básica
    function mostrarVentaBasica(id) {
        // Para el caso en que la primera petición falla debido al error de anidamiento
        detalleVentaId.textContent = id;
        detalleVentaFecha.textContent = 'Cargando...';
        detalleCliente.textContent = 'Cargando...';
        detalleEmpleado.textContent = 'Cargando...';
        
        // Intentamos obtener datos básicos de otra manera
        fetch(`/api/facturas`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(ventas => {
            // Buscar la venta por ID en la lista de ventas
            const ventaInfo = ventas.find(v => v.id == id);
            if (ventaInfo) {
                detalleVentaFecha.textContent = ventaInfo.fecha || 'No disponible';
                detalleCliente.textContent = ventaInfo.cliente || 'No disponible';
                detalleEmpleado.textContent = ventaInfo.empleado || 'No disponible';
            }
        })
        .catch(error => {
            console.error('Error al obtener información básica:', error);
        });
        
        // Intentamos obtener solo los detalles
        fetch(`${FACTURA_API}/detalle/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(detalles => {
                console.log("Detalles recibidos en fallback:", detalles);
                mostrarDetallesProductos(detalles);
            })
            .catch(error => {
                console.error('Error al cargar detalles en fallback:', error);
                mostrarNotificacion('No se pudieron cargar los detalles de la venta.', true);
            });
    }
    
    // Función para mostrar los detalles de productos
    function mostrarDetallesProductos(detalles) {
        detalleProductosBody.innerHTML = '';
        
        if (!detalles || detalles.length === 0) {
            detalleProductosBody.innerHTML = '<tr><td colspan="4">No hay productos en esta venta.</td></tr>';
            detalleTotal.textContent = '$0.00';
            detalleVentaContenido.style.display = 'block';
            return;
        }
        
        let total = 0;
        
        detalles.forEach(detalle => {
            const row = document.createElement('tr');
            
            // Adaptamos el código para manejar diferentes estructuras de respuesta
            let nombreProducto = '';
            let precioUnitario = 0;
            let cantidad = 0;
            let subtotal = 0;
            
            console.log("Procesando detalle:", detalle);
            
            // Caso 1: El detalle tiene un objeto producto
            if (detalle.producto && typeof detalle.producto === 'object') {
                nombreProducto = detalle.producto.nombre || 'Producto sin nombre';
                // Si el precio no está en precioUnitario, intentamos obtenerlo del producto
                if (detalle.precioUnitario === undefined && detalle.producto.precio !== undefined) {
                    precioUnitario = parseFloat(detalle.producto.precio);
                }
            } 
            // Caso 2: El producto es una cadena de texto directamente
            else if (typeof detalle.producto === 'string') {
                nombreProducto = detalle.producto;
            }
            // Caso 3: No hay información de producto
            else {
                nombreProducto = 'Producto no disponible';
            }
            
            // Obtener el resto de valores con validación
            // Si no se ha asignado un precio antes, intentamos con precioUnitario
            if (precioUnitario === 0 && detalle.precioUnitario !== undefined) {
                precioUnitario = parseFloat(detalle.precioUnitario);
            }
            
            cantidad = parseInt(detalle.cantidad || 0);
            
            // El subtotal puede venir directamente o calcularse
            if (detalle.subtotal !== undefined) {
                subtotal = parseFloat(detalle.subtotal);
            } else {
                subtotal = precioUnitario * cantidad;
            }
            
            row.innerHTML = `
                <td>${nombreProducto}</td>
                <td>${formatCurrency(precioUnitario)}</td>
                <td>${cantidad}</td>
                <td>${formatCurrency(subtotal)}</td>
            `;
            detalleProductosBody.appendChild(row);
            total += subtotal;
        });
        
        detalleTotal.textContent = formatCurrency(total);
        detalleVentaContenido.style.display = 'block';
    }

    // Eliminamos la funcionalidad "ventas por cliente" según lo solicitado
    function prepararVentasPorCliente() {
        mostrarNotificacion('Funcionalidad no disponible en esta versión.');
    }

    // Se mantiene como una función vacía por si existen referencias en otros lugares
    function buscarVentasPorCliente(clienteId) {
        mostrarNotificacion('Funcionalidad no disponible en esta versión.');
    }

    // Preparar formulario de descuento
    function prepararDescuento(ventaId) {
        ocultarTodosLosFormularios();
        formAplicarDescuento.style.display = 'block';
        idVentaDescuento.value = ventaId;
        porcentajeDescuento.value = '';
    }

    // Aplicar descuento a una venta
    function aplicarDescuento(ventaId, porcentaje) {
        fetch(`${FACTURA_API}/descuento/${ventaId}?porcentaje=${porcentaje}`, {
            method: 'PUT'
        })
            .then(response => response.text())
            .then(mensaje => {
                mostrarNotificacion(mensaje);
                ocultarTodosLosFormularios();
                cargarVentas();
                cargarEstadisticas();
            })
            .catch(error => {
                console.error('Error al aplicar descuento:', error);
                mostrarNotificacion('Error al aplicar el descuento.', true);
            });
    }

    // Buscar venta por ID
    function buscarVentaPorId(id) {
        fetch(`${FACTURA_API}/${id}`)
            .then(response => response.json())
            .then(venta => {
                if (!venta || !venta.id) {
                    mostrarNotificacion('Venta no encontrada.', true);
                    return;
                }
                
                mostrarDetalleVenta(id);
            })
            .catch(error => {
                console.error('Error al buscar venta:', error);
                mostrarNotificacion('Error al buscar la venta.', true);
            });
    }

    // Realizar nueva venta
    function realizarVenta(event) {
        event.preventDefault();
        
        const clienteId = clienteSelect.value;
        const empleadoId = empleadoSelect.value;
        
        if (!clienteId || !empleadoId) {
            mostrarNotificacion('Debe seleccionar un cliente y un vendedor.', true);
            return;
        }
        
        // Obtener productos y cantidades
        const filas = productosContainer.querySelectorAll('.producto-row');
        const productoIds = [];
        const cantidades = [];
        
        let hayProductos = false;
        
        filas.forEach(fila => {
            const productoId = fila.querySelector('.producto-select').value;
            const cantidad = fila.querySelector('.cantidad-input').value;
            
            if (productoId && cantidad > 0) {
                productoIds.push(productoId);
                cantidades.push(cantidad);
                hayProductos = true;
            }
        });
        
        if (!hayProductos) {
            mostrarNotificacion('Debe agregar al menos un producto.', true);
            return;
        }
        
        // Mostrar indicador de carga
        mostrarNotificacion('Procesando venta, por favor espere...');
        
        // Construir URL con parámetros
        const url = new URL(`${FACTURA_API}/nueva`, window.location.origin);
        url.searchParams.append('clienteId', clienteId);
        url.searchParams.append('empleadoId', empleadoId);
        
        // Agregar múltiples valores para los arrays
        productoIds.forEach(id => url.searchParams.append('productoIds', id));
        cantidades.forEach(cant => url.searchParams.append('cantidades', cant));
        
        console.log('Enviando petición a:', url.toString());
        
        // Enviar petición
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.text();
            })
            .then(mensaje => {
                console.log('Respuesta del servidor:', mensaje);
                mostrarNotificacion(mensaje);
                ocultarTodosLosFormularios();
                cargarVentas();
                cargarEstadisticas();
            })
            .catch(error => {
                console.error('Error al realizar venta:', error);
                mostrarNotificacion('Error al realizar la venta: ' + error.message, true);
            });
    }

    // Ver ventas por producto
    function mostrarVentasPorProducto() {
        // Eliminar cualquier contenido existente antes de crear uno nuevo
        const ventasPorProductoExistente = document.getElementById('ventas-por-producto-contenido');
        if (ventasPorProductoExistente) {
            ventasPorProductoExistente.remove();
        }
        
        // Mostrar indicador de carga
        mostrarNotificacion("Cargando datos de ventas por producto...");
        
        // Hacer la petición a la API real
        fetch(`${FACTURA_API}/producto`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(ventas => {
                console.log("Ventas por producto recibidas:", ventas);
                
                // Ordenar los datos de mayor a menor por unidades vendidas
                ventas.sort((a, b) => b.unidadesVendidas - a.unidadesVendidas);
                
                // Crear contenido dinámico con los datos REALES de la API
                const contenido = document.createElement('div');
                contenido.className = 'content-area';
                contenido.id = 'ventas-por-producto-contenido';
                contenido.innerHTML = `
                    <h3 class="panel-title">Ventas por Producto (Mayor a Menor)</h3>
                    <div class="form-container">
                        <table class="sales-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Unidades Vendidas</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ventas.length === 0 ? 
                                    '<tr><td colspan="2" style="text-align: center;">No hay datos disponibles</td></tr>' : 
                                    ventas.map(v => `
                                        <tr>
                                            <td>${v.producto}</td>
                                            <td>${v.unidadesVendidas}</td>
                                        </tr>
                                    `).join('')
                                }
                            </tbody>
                        </table>
                        <a href="#" class="nav-back" id="back-from-ventas-producto">← Volver al listado</a>
                    </div>
                `;
                
                ocultarTodosLosFormularios();
                document.querySelector('.sales-panel').appendChild(contenido);
                
                document.getElementById('back-from-ventas-producto').addEventListener('click', function(e) {
                    e.preventDefault();
                    contenido.remove();
                    ocultarTodosLosFormularios();
                });
            })
            .catch(error => {
                console.error('Error al cargar ventas por producto:', error);
                mostrarNotificacion('Error al cargar ventas por producto: ' + error.message, true);
                
                // En caso de error, mostrar una interfaz con el mensaje de error
                const contenido = document.createElement('div');
                contenido.className = 'content-area';
                contenido.id = 'ventas-por-producto-contenido';
                contenido.innerHTML = `
                    <h3 class="panel-title">Ventas por Producto</h3>
                    <div class="form-container">
                        <div class="error-notification">
                            Error al cargar datos: ${error.message}
                        </div>
                        <a href="#" class="nav-back" id="back-from-ventas-producto">← Volver al listado</a>
                    </div>
                `;
                
                ocultarTodosLosFormularios();
                document.querySelector('.sales-panel').appendChild(contenido);
                
                document.getElementById('back-from-ventas-producto').addEventListener('click', function(e) {
                    e.preventDefault();
                    contenido.remove();
                    ocultarTodosLosFormularios();
                });
            });
    }

    // Ver ventas por vendedor
    function mostrarVentasPorVendedor() {
        // Eliminar cualquier contenido existente antes de crear uno nuevo
        const ventasPorVendedorExistente = document.getElementById('ventas-por-vendedor-contenido');
        if (ventasPorVendedorExistente) {
            ventasPorVendedorExistente.remove();
        }
        
        // Mostrar indicador de carga
        mostrarNotificacion("Cargando datos de ventas por vendedor...");
        
        // Hacer la petición a la API real
        fetch(`${FACTURA_API}/vendedor`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(ventas => {
                console.log("Ventas por vendedor recibidas:", ventas);
                
                // Ordenar los datos de mayor a menor por número de ventas
                ventas.sort((a, b) => b.ventas - a.ventas);
                
                // Crear contenido dinámico con los datos REALES de la API
                const contenido = document.createElement('div');
                contenido.className = 'content-area';
                contenido.id = 'ventas-por-vendedor-contenido';
                contenido.innerHTML = `
                    <h3 class="panel-title">Ventas por Vendedor (Mayor a Menor)</h3>
                    <div class="form-container">
                        <table class="sales-table">
                            <thead>
                                <tr>
                                    <th>Vendedor</th>
                                    <th>Total Ventas</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ventas.length === 0 ? 
                                    '<tr><td colspan="2" style="text-align: center;">No hay datos disponibles</td></tr>' : 
                                    ventas.map(v => `
                                        <tr>
                                            <td>${v.vendedor}</td>
                                            <td>${v.ventas}</td>
                                        </tr>
                                    `).join('')
                                }
                            </tbody>
                        </table>
                        <a href="#" class="nav-back" id="back-from-ventas-vendedor">← Volver al listado</a>
                    </div>
                `;
                
                ocultarTodosLosFormularios();
                document.querySelector('.sales-panel').appendChild(contenido);
                
                document.getElementById('back-from-ventas-vendedor').addEventListener('click', function(e) {
                    e.preventDefault();
                    contenido.remove();
                    ocultarTodosLosFormularios();
                });
            })
            .catch(error => {
                console.error('Error al cargar ventas por vendedor:', error);
                mostrarNotificacion('Error al cargar ventas por vendedor: ' + error.message, true);
                
                // En caso de error, mostrar una interfaz con el mensaje de error
                const contenido = document.createElement('div');
                contenido.className = 'content-area';
                contenido.id = 'ventas-por-vendedor-contenido';
                contenido.innerHTML = `
                    <h3 class="panel-title">Ventas por Vendedor</h3>
                    <div class="form-container">
                        <div class="error-notification">
                            Error al cargar datos: ${error.message}
                        </div>
                        <a href="#" class="nav-back" id="back-from-ventas-vendedor">← Volver al listado</a>
                    </div>
                `;
                
                ocultarTodosLosFormularios();
                document.querySelector('.sales-panel').appendChild(contenido);
                
                document.getElementById('back-from-ventas-vendedor').addEventListener('click', function(e) {
                    e.preventDefault();
                    contenido.remove();
                    ocultarTodosLosFormularios();
                });
            });
    }
    // Ver ventas por vendedor
    function mostrarVentasPorVendedor() {
        // Eliminar cualquier contenido existente antes de crear uno nuevo
        const ventasPorVendedorExistente = document.getElementById('ventas-por-vendedor-contenido');
        if (ventasPorVendedorExistente) {
            ventasPorVendedorExistente.remove();
        }
        
        // Simulación de datos para demostración
        const ventasVendedorDemo = [
            { vendedor: 'Diego Silva', ventas: 12 },
            { vendedor: 'Ana Gómez', ventas: 18 },
            { vendedor: 'José Fernández', ventas: 9 },
            { vendedor: 'Lucía Torres', ventas: 15 }
        ];
        
        // Crear contenido dinámico
        const contenido = document.createElement('div');
        contenido.className = 'content-area';
        contenido.id = 'ventas-por-vendedor-contenido';
        contenido.innerHTML = `
            <h3 class="panel-title">Ventas por Vendedor</h3>
            <div class="form-container">
                <table class="sales-table">
                    <thead>
                        <tr>
                            <th>Vendedor</th>
                            <th>Total Ventas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ventasVendedorDemo.map(v => `
                            <tr>
                                <td>${v.vendedor}</td>
                                <td>${v.ventas}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <a href="#" class="nav-back" id="back-from-ventas-vendedor">← Volver al listado</a>
            </div>
        `;
        
        ocultarTodosLosFormularios();
        document.querySelector('.sales-panel').appendChild(contenido);
        
        document.getElementById('back-from-ventas-vendedor').addEventListener('click', function(e) {
            e.preventDefault();
            contenido.remove();
            ocultarTodosLosFormularios();
        });
        
        // Código original comentado para API real
        /*
        fetch(`${FACTURA_API}/vendedor`)
            .then(response => response.json())
            .then(ventas => {
                // Crear contenido dinámico
                const contenido = document.createElement('div');
                contenido.className = 'content-area';
                contenido.innerHTML = `
                    <h3 class="panel-title">Ventas por Vendedor</h3>
                    <div class="form-container">
                        <table class="sales-table">
                            <thead>
                                <tr>
                                    <th>Vendedor</th>
                                    <th>Total Ventas</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ventas.map(v => `
                                    <tr>
                                        <td>${v.vendedor}</td>
                                        <td>${v.ventas}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <a href="#" class="nav-back" id="back-from-ventas-vendedor">← Volver al listado</a>
                    </div>
                `;
                
                ocultarTodosLosFormularios();
                document.querySelector('.sales-panel').appendChild(contenido);
                
                document.getElementById('back-from-ventas-vendedor').addEventListener('click', function(e) {
                    e.preventDefault();
                    contenido.remove();
                    ocultarTodosLosFormularios();
                });
            })
            .catch(error => {
                console.error('Error al cargar ventas por vendedor:', error);
                mostrarNotificacion('Error al cargar ventas por vendedor.', true);
            });
        */
    }

    // Generar reporte
    function generarReporte() {
        fetch(`${FACTURA_API}/reporte`)
            .then(response => response.text())
            .then(mensaje => {
                mostrarNotificacion(mensaje);
            })
            .catch(error => {
                console.error('Error al generar reporte:', error);
                mostrarNotificacion('Error al generar el reporte.', true);
            });
    }

    // Exportar ventas
    function exportarVentas() {
        fetch(`${FACTURA_API}/exportar`)
            .then(response => response.text())
            .then(mensaje => {
                mostrarNotificacion(mensaje);
            })
            .catch(error => {
                console.error('Error al exportar ventas:', error);
                mostrarNotificacion('Error al exportar las ventas.', true);
            });
    }

    // Gestionar devolución
    function gestionarDevolucion() {
        fetch(`${FACTURA_API}/devolucion`, {
            method: 'POST'
        })
            .then(response => response.text())
            .then(mensaje => {
                mostrarNotificacion(mensaje);
            })
            .catch(error => {
                console.error('Error al gestionar devolución:', error);
                mostrarNotificacion('Error al gestionar la devolución.', true);
            });
    }
    
    // Configurar todos los event listeners
    function setupEventListeners() {
        // Botones del panel de control
        btnNuevaVenta.addEventListener('click', prepararNuevaVenta);
        btnListar.addEventListener('click', function() {
            ocultarTodosLosFormularios();
            cargarVentas();
        });
        btnBuscarVenta.addEventListener('click', function() {
            ocultarTodosLosFormularios();
            searchVentaId.focus();
        });
        btnDetalleVenta.addEventListener('click', function() {
            ocultarTodosLosFormularios();
            formDetalleVenta.style.display = 'block';
            idDetalle.value = '';
            detalleVentaContenido.style.display = 'none';
        });
        btnVentasCliente.addEventListener('click', function() {
            mostrarNotificacion('Funcionalidad no disponible en esta versión.');
        });
        btnVentasProducto.addEventListener('click', mostrarVentasPorProducto);
        btnVentasVendedor.addEventListener('click', mostrarVentasPorVendedor);
        btnAplicarDescuento.addEventListener('click', function() {
            prepararDescuento('');
        });
        btnDevolucion.addEventListener('click', gestionarDevolucion);
        btnReporte.addEventListener('click', generarReporte);
        btnExportar.addEventListener('click', exportarVentas);
        
        // Botón de búsqueda general
        btnBuscar.addEventListener('click', function() {
            const id = searchVentaId.value.trim();
            if (id) {
                buscarVentaPorId(id);
            } else {
                mostrarNotificacion('Ingrese un ID de venta válido.', true);
            }
        });
        
        // Eventos para formulario de nueva venta
        btnAddProducto.addEventListener('click', agregarFilaProducto);
        ventaForm.addEventListener('submit', realizarVenta);
        backToList.addEventListener('click', function(e) {
            e.preventDefault();
            ocultarTodosLosFormularios();
        });
        
        // Configurar eventos iniciales para las filas de productos existentes
        document.querySelectorAll('.producto-row').forEach(fila => {
            configurarEventosProducto(fila);
        });
        
        // Eventos para detalle de venta
        btnBuscarDetalle.addEventListener('click', function() {
            const id = idDetalle.value.trim();
            if (id) {
                cargarDetalleVenta(id);
            } else {
                mostrarNotificacion('Ingrese un ID de venta válido.', true);
            }
        });
        backFromDetalle.addEventListener('click', function(e) {
            e.preventDefault();
            ocultarTodosLosFormularios();
        });
        
        // Eventos para ventas por cliente
        btnBuscarVentasCliente.addEventListener('click', function() {
            const id = idClienteVentas.value.trim();
            if (id) {
                buscarVentasPorCliente(id);
            } else {
                mostrarNotificacion('Ingrese un ID de cliente válido.', true);
            }
        });
        backFromVentasCliente.addEventListener('click', function(e) {
            e.preventDefault();
            ocultarTodosLosFormularios();
        });
        
        // Eventos para aplicar descuento
        btnAplicarDescuentoSubmit.addEventListener('click', function() {
            const id = idVentaDescuento.value.trim();
            const porcentaje = parseFloat(porcentajeDescuento.value);
            
            if (!id) {
                mostrarNotificacion('Ingrese un ID de venta válido.', true);
                return;
            }
            
            if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
                mostrarNotificacion('Ingrese un porcentaje válido (entre 0 y 100).', true);
                return;
            }
            
            aplicarDescuento(id, porcentaje);
        });
        backFromDescuento.addEventListener('click', function(e) {
            e.preventDefault();
            ocultarTodosLosFormularios();
        });
    }
    
    // Animaciones y efectos visuales
    function setupAnimations() {
        // Efecto hover para botones y elementos interactivos
        document.querySelectorAll('.control-button, .btn-action').forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
        
        // Animación de carga para peticiones AJAX
        function showLoading() {
            const loader = document.createElement('div');
            loader.className = 'loading-indicator';
            loader.innerHTML = `
                <div class="spinner"></div>
                <div class="loading-text">Cargando...</div>
            `;
            document.body.appendChild(loader);
            
            return loader;
        }
        
        function hideLoading(loader) {
            if (loader) {
                loader.remove();
            }
        }
        
        // Exponer funciones de animación para uso en otras funciones
        window.showLoading = showLoading;
        window.hideLoading = hideLoading;
    }
    
    // Inicializar datos de prueba (solo para demostración)
    function cargarDatosPrueba() {
        // Función eliminada - no se cargarán datos de prueba
    }
    
    // Inicialización
    init();
    setupAnimations();
    
    // Solo para demostración, cargar datos de prueba después de 3 segundos si no hay datos
    setTimeout(cargarDatosPrueba, 3000);
});
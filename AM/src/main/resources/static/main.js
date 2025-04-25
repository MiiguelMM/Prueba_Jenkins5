// dashboard.js - Script simple para actualizar el dashboard con datos reales
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando dashboard...');
    
    // Cargar datos para las tarjetas del dashboard
    cargarDatosClientes();
    cargarDatosEmpleados();
    cargarDatosProductos();
    cargarDatosVentas();
    
    // Cargar actividades recientes
    cargarActividadesRecientes();
    
    // Configurar botón de simulación de compra
    const buyButton = document.querySelector('.buy-button');
    if (buyButton) {
        buyButton.addEventListener('click', function() {
            alert('Función de simulación de compra en desarrollo');
        });
    }
});

// Función para cargar datos de clientes
function cargarDatosClientes() {
    fetch('/api/clientes/conteo')
        .then(response => response.json())
        .then(data => {
            const cardValue = document.querySelector('.dashboard-card:nth-child(1) .card-value');
            const cardTrend = document.querySelector('.dashboard-card:nth-child(1) .card-trend');
            
            if (cardValue) {
                cardValue.textContent = data.total || 0;
            }
            
            if (cardTrend) {
                const porcentajeActivos = data.total > 0 ? 
                    Math.round((data.activos / data.total) * 100) : 0;
                cardTrend.textContent = `↑ ${porcentajeActivos}%`;
                cardTrend.className = 'card-trend positive';
            }
        })
        .catch(error => {
            console.error('Error al cargar datos de clientes:', error);
        });
}

// Función para cargar datos de empleados
function cargarDatosEmpleados() {
    fetch('/empleados/listar')
        .then(response => response.json())
        .then(empleados => {
            const cardValue = document.querySelector('.dashboard-card:nth-child(2) .card-value');
            const cardTrend = document.querySelector('.dashboard-card:nth-child(2) .card-trend');
            
            if (cardValue) {
                cardValue.textContent = empleados.length || 0;
            }
            
            if (cardTrend) {
                const empleadosActivos = empleados.filter(emp => emp.activo).length;
                const porcentajeActivos = empleados.length > 0 ? 
                    Math.round((empleadosActivos / empleados.length) * 100) : 0;
                
                cardTrend.textContent = `↑ ${porcentajeActivos}%`;
                cardTrend.className = 'card-trend positive';
            }
        })
        .catch(error => {
            console.error('Error al cargar datos de empleados:', error);
        });
}

// Función para cargar datos de productos
function cargarDatosProductos() {
    fetch('/productos')
        .then(response => response.json())
        .then(productos => {
            const cardValue = document.querySelector('.dashboard-card:nth-child(3) .card-value');
            const cardTrend = document.querySelector('.dashboard-card:nth-child(3) .card-trend');
            
            if (cardValue) {
                cardValue.textContent = productos.length || 0;
            }
            
            if (cardTrend) {
                const productosBajoStock = productos.filter(prod => prod.stock < 10).length;
                const porcentajeBuen = productos.length > 0 ? 
                    Math.round(((productos.length - productosBajoStock) / productos.length) * 100) : 0;
                
                cardTrend.textContent = `↑ ${porcentajeBuen}%`;
                cardTrend.className = 'card-trend positive';
            }
        })
        .catch(error => {
            console.error('Error al cargar datos de productos:', error);
        });
}

// Función para cargar datos de ventas
function cargarDatosVentas() {
    fetch('/api/facturas')
        .then(response => response.json())
        .then(facturas => {
            const cardValue = document.querySelector('.dashboard-card:nth-child(4) .card-value');
            const cardTrend = document.querySelector('.dashboard-card:nth-child(4) .card-trend');
            
            // Calcular total de ventas
            let totalVentas = 0;
            facturas.forEach(factura => {
                totalVentas += factura.total || 0;
            });
            
            if (cardValue) {
                // Formatear como moneda
                cardValue.textContent = formatearMoneda(totalVentas);
            }
            
            if (cardTrend) {
                cardTrend.textContent = `${facturas.length} facturas`;
                cardTrend.className = 'card-trend positive';
            }
        })
        .catch(error => {
            console.error('Error al cargar datos de ventas:', error);
        });
}

// Función para cargar actividades recientes
function cargarActividadesRecientes() {
    fetch('/api/facturas')
        .then(response => response.json())
        .then(facturas => {
            const activityList = document.querySelector('.activity-list');
            if (!activityList) return;
            
            // Limpiar lista actual
            activityList.innerHTML = '';
            
            // Si no hay facturas, mostrar mensaje
            if (!facturas || facturas.length === 0) {
                activityList.innerHTML = `
                    <div class="activity-item">
                        <div class="activity-icon">📝</div>
                        <div class="activity-content">
                            <p class="activity-text">No hay actividades recientes</p>
                            <p class="activity-time">-</p>
                        </div>
                    </div>
                `;
                return;
            }
            
            // Mostrar últimas 4 facturas como actividades
            const ultimasFacturas = facturas.slice(0, 4);
            const tiemposActividad = ['Hace 5 minutos', 'Hace 27 minutos', 'Hace 43 minutos', 'Hace 1 hora'];
            
            ultimasFacturas.forEach((factura, index) => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <div class="activity-icon">💰</div>
                    <div class="activity-content">
                        <p class="activity-text">Venta realizada <span class="highlight">#${factura.id}</span> 
                           a <span class="highlight">${factura.cliente}</span></p>
                        <p class="activity-time">${tiemposActividad[index]}</p>
                    </div>
                `;
                activityList.appendChild(activityItem);
            });
        })
        .catch(error => {
            console.error('Error al cargar actividades recientes:', error);
        });
}

// Función para formatear números como moneda
function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(valor);
}
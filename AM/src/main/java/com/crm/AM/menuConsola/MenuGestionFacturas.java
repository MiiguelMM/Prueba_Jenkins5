package com.crm.AM.menuConsola;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.crm.AM.entities.Cliente;
import com.crm.AM.entities.DetalleFactura;
import com.crm.AM.entities.Empleado;
import com.crm.AM.entities.Factura;
import com.crm.AM.entities.Producto;
import com.crm.AM.repository.ClienteRepository;
import com.crm.AM.repository.DetalleFacturaRespository;
import com.crm.AM.repository.EmpleadoRepository;
import com.crm.AM.repository.FacturaRepository;
import com.crm.AM.repository.ProductoRepository;

@Component
public class MenuGestionFacturas {

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private DetalleFacturaRespository detalleFacturaRespository;

    @Autowired
    private DetalleFacturaRespository detalleFacturaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    public void menuGestionFacturas() {
        Scanner n = new Scanner(System.in);
        boolean salir = false;

        while (!salir) {
            System.out.println("Menu de gestión de ventas");
            System.out.println("1. Realizar nueva venta");
            System.out.println("2. Buscar venta");
            System.out.println("3. Listar ventas");
            System.out.println("4. Generar reporte de ventas");
            System.out.println("5. Buscar ventas por cliente");
            System.out.println("6. Ver detalle de venta");
            System.out.println("7. Aplicar descuento a venta");
            System.out.println("8. Gestionar devoluciones de venta");
            System.out.println("9. Ver ventas por producto");
            System.out.println("10. Ver ventas por vendedor");
            System.out.println("11. Exportar ventas");
            System.out.println("12. Salir");

            int opcion = n.nextInt();
            switch (opcion) {
                case 1:
                    realizarNuevaVenta();
                    break;
                case 2:
                    buscarVenta();
                    break;
                case 3:
                    listarVentas();
                    break;
                case 4:
                    generarReporteVentas();
                    break;
                case 5:
                    buscarVentasPorCliente();
                    break;
                case 6:
                    verDetalleVenta();
                    break;
                case 7:
                    aplicarDescuentoVenta();
                    break;
                case 8:
                    gestionarDevoluciones();
                    break;
                case 9:
                    verVentasPorProducto();
                    break;
                case 10:
                    verVentasPorVendedor();
                    break;
                case 11:
                    exportarVentas();
                    break;
                case 12:
                    salir = true;
                    break;
                default:
                    System.out.println("Opción no válida, intenta nuevamente.");
            }
        }
    }

    void realizarNuevaVenta() {
        Scanner n = new Scanner(System.in);
        
        System.out.println("Ingrese el ID del cliente: ");
        Long clienteId = n.nextLong();
        Cliente cliente = clienteRepository.findById(clienteId).orElse(null);

        if (cliente == null) {
            System.out.println("Cliente no encontrado.");
            return;
        }

        System.out.println("Ingrese el ID del empleado (vendedor): ");
        Long empleadoId = n.nextLong();
        Empleado empleado = empleadoRepository.findById(empleadoId).orElse(null);


        System.out.println("Ingrese el número de productos en la venta: ");
        int numProductos = n.nextInt();
        if (numProductos <= 0) {
            System.out.println("No puedes vender 0 o Valores negativos");
            return;
        }
        Double totalVenta = 0.0;
        List<DetalleFactura> detalles = new ArrayList<>();

        for (int i = 0; i < numProductos; i++) {
            System.out.println("Ingrese el ID del producto: ");
            Long productoId = n.nextLong();
            Producto producto = productoRepository.findById(productoId).orElse(null);

            if (producto == null) {
                System.out.println("Producto no encontrado.");
                return;
            }

            System.out.println("Ingrese la cantidad: ");
            int cantidad = n.nextInt();

            Double subtotal = producto.getPrecio() * cantidad;
            totalVenta += subtotal;

            DetalleFactura detalle = new DetalleFactura(null, null, producto, cantidad, producto.getPrecio(), subtotal);
            detalles.add(detalle);
        }

        Factura factura = new Factura(null, cliente, empleado, totalVenta, detalles);
        facturaRepository.save(factura);

        for (DetalleFactura detalle : detalles) {
            detalle.setFactura(factura);
            detalleFacturaRespository.save(detalle);
        }

        System.out.println("Venta realizada con éxito. Total: " + totalVenta);
    }

    void buscarVenta() {
        Scanner n = new Scanner(System.in);
        System.out.println("Ingrese el ID de la venta a buscar: ");
        Long ventaId = n.nextLong();
        Factura factura = facturaRepository.findById(ventaId).orElse(null);

        if (factura != null) {
            System.out.println("Venta encontrada: " + factura);
        } else {
            System.out.println("Venta no encontrada.");
        }
    }

    void listarVentas() {
        List<Factura> ventas = facturaRepository.findAll();
        String nombreEmpleado;
        for (Factura venta : ventas) {
            nombreEmpleado = venta.getEmpleado().getNombre();
            if (nombreEmpleado != null) {
                System.out.println("Factura ID: " + venta.getId() + ", Cliente: " + venta.getCliente().getNombre() +
                ", Empleado: " + nombreEmpleado + ", Total: " + venta.getTotal());
            }
            else{
                System.out.println("Factura ID: " + venta.getId() + ", Cliente: " + venta.getCliente().getNombre() + ", Total: " + venta.getTotal());
            }
        
        }
    }

    void generarReporteVentas() {
        // Implementar lógica para generar reporte de ventas
        System.out.println("Reporte de ventas generado.");
    }

    void buscarVentasPorCliente() {
        Scanner n = new Scanner(System.in);
        System.out.println("Ingrese el ID del cliente: ");
        Long clienteId = n.nextLong();
        List<Factura> ventas = facturaRepository.findByClienteId(clienteId);

        if (ventas.isEmpty()) {
            System.out.println("No se encontraron ventas para este cliente.");
        } else {
            for (Factura venta : ventas) {
                System.out.println("Factura ID: " + venta.getId() + ", Total: " + venta.getTotal());
            }
        }
    }

    void verDetalleVenta() {
        Scanner n = new Scanner(System.in);
        System.out.println("Ingrese el ID de la venta: ");
        Long ventaId = n.nextLong();
        Factura factura = facturaRepository.findById(ventaId).orElse(null);

        if (factura != null) {
            System.out.println("Detalles de la venta:");
            for (DetalleFactura detalle : factura.getDetalles()) {
                System.out.println("Producto: " + detalle.getProducto().getNombre() + ", Cantidad: " +
                    detalle.getCantidad() + ", Subtotal: " + detalle.getSubtotal());
            }
        } else {
            System.out.println("Venta no encontrada.");
        }
    }

    void aplicarDescuentoVenta() {
        Scanner n = new Scanner(System.in);
        System.out.println("Ingrese el ID de la venta: ");
        Long ventaId = n.nextLong();
        Factura factura = facturaRepository.findById(ventaId).orElse(null);

        if (factura != null) {
            System.out.println("Ingrese el porcentaje de descuento: ");
            double descuento = n.nextDouble();
            double descuentoAmount = factura.getTotal() * (descuento / 100);
            double totalConDescuento = factura.getTotal() - descuentoAmount;
            factura.setTotal(totalConDescuento);
            facturaRepository.save(factura);

            System.out.println("Descuento aplicado. Nuevo total: " + totalConDescuento);
        } else {
            System.out.println("Venta no encontrada.");
        }
    }

    void gestionarDevoluciones() {
        // Implementar lógica para gestionar devoluciones
        System.out.println("Devolución gestionada.");
    }

    void verVentasPorProducto() {
        List<Object[]> resultados = detalleFacturaRepository.findVentasPorProducto();
    
        System.out.println("Ventas por producto:");
        for (Object[] fila : resultados) {
            Producto producto = (Producto) fila[0];
            Long totalVendidas = (Long) fila[1];
    
            System.out.println(producto.getNombre() + " → " + totalVendidas + " unidades vendidas");
        }
    }
    
    void verVentasPorVendedor() {
        List<Object[]> resultados = facturaRepository.findVentasPorVendedor();
    
        System.out.println("Ventas por vendedor:");
        for (Object[] fila : resultados) {
            Empleado empleado = (Empleado) fila[0];
            Long totalVentas = (Long) fila[1];
    
            System.out.println(empleado.getNombre() + " " + empleado.getApellido() + " → " + totalVentas + " ventas");
        }
    }
    

    void exportarVentas() {
        // Implementar lógica para exportar ventas
        System.out.println("Ventas exportadas.");
    }
}

package com.crm.AM.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

@RestController
@RequestMapping("/api/facturas")
public class FacturaApiController {

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private DetalleFacturaRespository detalleFacturaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    // Realizar nueva venta
    @PostMapping("/nueva")
    public String realizarNuevaVenta(
            @RequestParam Long clienteId,
            @RequestParam Long empleadoId,
            @RequestParam List<Long> productoIds,
            @RequestParam List<Integer> cantidades) {

        if (productoIds.size() != cantidades.size()) {
            return "Cantidad de productos y cantidades no coinciden.";
        }

        Cliente cliente = clienteRepository.findById(clienteId).orElse(null);
        Empleado empleado = empleadoRepository.findById(empleadoId).orElse(null);
        if (cliente == null || empleado == null) {
            return "Cliente o empleado no encontrado.";
        }

        List<DetalleFactura> detalles = new ArrayList<>();
        double totalVenta = 0.0;

        for (int i = 0; i < productoIds.size(); i++) {
            Producto producto = productoRepository.findById(productoIds.get(i)).orElse(null);
            if (producto == null) return "Producto no encontrado: ID " + productoIds.get(i);

            int cantidad = cantidades.get(i);
            double subtotal = producto.getPrecio() * cantidad;
            totalVenta += subtotal;

            DetalleFactura detalle = new DetalleFactura(null, null, producto, cantidad, producto.getPrecio(), subtotal);
            detalles.add(detalle);
        }

        Factura factura = new Factura(null, cliente, empleado, totalVenta, detalles);
        facturaRepository.save(factura);

        for (DetalleFactura detalle : detalles) {
            detalle.setFactura(factura);
            detalleFacturaRepository.save(detalle);
        }

        return "Venta realizada con éxito. Total: " + totalVenta;
    }

    // Buscar venta por ID
    @GetMapping("/{id}")
    public Object buscarVenta(@PathVariable Long id) {
        return facturaRepository.findById(id).orElse(null);
    }

    // Listar todas las ventas
    @GetMapping
    public List<Map<String, Object>> listarVentas() {
        List<Factura> ventas = facturaRepository.findAll();
        List<Map<String, Object>> respuesta = new ArrayList<>();

        for (Factura venta : ventas) {
            Map<String, Object> datos = new HashMap<>();
            datos.put("id", venta.getId());
            datos.put("cliente", venta.getCliente().getNombre());
            datos.put("empleado", venta.getEmpleado() != null ? venta.getEmpleado().getNombre() : "No asignado");
            datos.put("total", venta.getTotal());
            respuesta.add(datos);
        }
        return respuesta;
    }

    // Generar reporte de ventas
    @GetMapping("/reporte")
    public String generarReporteVentas() {
        return "Reporte de ventas generado (lógica aún no implementada).";
    }

    // Buscar ventas por cliente ID
    @GetMapping("/cliente/{clienteId}")
    public List<Factura> buscarVentasPorCliente(@PathVariable Long clienteId) {
        return facturaRepository.findByClienteId(clienteId);
    }

    // Ver detalle de una venta
    @GetMapping("/detalle/{facturaId}")
    public Object verDetalleVenta(@PathVariable Long facturaId) {
        Factura factura = facturaRepository.findById(facturaId).orElse(null);
        if (factura == null) return "Venta no encontrada.";

        List<Map<String, Object>> detalles = new ArrayList<>();
        for (DetalleFactura d : factura.getDetalles()) {
            Map<String, Object> item = new HashMap<>();
            item.put("producto", d.getProducto().getNombre());
            item.put("cantidad", d.getCantidad());
            item.put("subtotal", d.getSubtotal());
            detalles.add(item);
        }

        return detalles;
    }

    // Aplicar descuento a una venta
    @PutMapping("/descuento/{facturaId}")
    public String aplicarDescuento(
            @PathVariable Long facturaId,
            @RequestParam double porcentaje) {

        Factura factura = facturaRepository.findById(facturaId).orElse(null);
        if (factura == null) return "Factura no encontrada.";

        double descuento = factura.getTotal() * (porcentaje / 100);
        factura.setTotal(factura.getTotal() - descuento);
        facturaRepository.save(factura);
        return "Descuento aplicado. Nuevo total: " + factura.getTotal();
    }

    // Gestionar devoluciones
    @PostMapping("/devolucion")
    public String gestionarDevoluciones() {
        return "Devolución gestionada (falta lógica).";
    }

    // Ver ventas por producto
    @GetMapping("/producto")
    public List<Map<String, Object>> verVentasPorProducto() {
        List<Object[]> resultados = detalleFacturaRepository.findVentasPorProducto();
        List<Map<String, Object>> lista = new ArrayList<>();

        for (Object[] fila : resultados) {
            Producto producto = (Producto) fila[0];
            Long totalVendidas = (Long) fila[1];
            Map<String, Object> item = new HashMap<>();
            item.put("producto", producto.getNombre());
            item.put("unidadesVendidas", totalVendidas);
            lista.add(item);
        }
        return lista;
    }

    // Ver ventas por vendedor
    @GetMapping("/vendedor")
    public List<Map<String, Object>> verVentasPorVendedor() {
        List<Object[]> resultados = facturaRepository.findVentasPorVendedor();
        List<Map<String, Object>> lista = new ArrayList<>();

        for (Object[] fila : resultados) {
            Empleado empleado = (Empleado) fila[0];
            Long totalVentas = (Long) fila[1];
            Map<String, Object> item = new HashMap<>();
            item.put("vendedor", empleado.getNombre() + " " + empleado.getApellido());
            item.put("ventas", totalVentas);
            lista.add(item);
        }
        return lista;
    }

    // Exportar ventas
    @GetMapping("/exportar")
    public String exportarVentas() {
        return "Ventas exportadas (falta lógica).";
    }
}

package com.crm.AM.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crm.AM.entities.DetalleFactura;
import com.crm.AM.entities.Factura;
import com.crm.AM.entities.Producto;
import com.crm.AM.repository.DetalleFacturaRespository;
import com.crm.AM.repository.FacturaRepository;
import com.crm.AM.repository.ProductoRepository;

@RestController
@RequestMapping("/api/detalle-factura")
public class DetalleFacturaApiController {

    @Autowired
    private DetalleFacturaRespository detalleFacturaRespository;

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    // Crear un nuevo detalle de factura
    @PostMapping
    public ResponseEntity<String> crearDetalleFactura(@RequestParam Long facturaId,
                                                      @RequestParam Long productoId,
                                                      @RequestParam int cantidad) {
        Factura factura = facturaRepository.findById(facturaId).orElse(null);
        Producto producto = productoRepository.findById(productoId).orElse(null);

        if (factura == null || producto == null) {
            return ResponseEntity.badRequest().body("Factura o Producto no encontrado.");
        }

        DetalleFactura detalle = new DetalleFactura();
        detalle.setFactura(factura);
        detalle.setProducto(producto);
        detalle.setCantidad(cantidad);
        detalle.setPrecioUnitario(producto.getPrecio()); // opcional: tomar el precio actual

        detalleFacturaRespository.save(detalle);
        return ResponseEntity.ok("Detalle de factura creado con éxito.");
    }

    // Obtener todos los detalles de una factura
    @GetMapping("/{facturaId}")
    public ResponseEntity<Optional<DetalleFactura>> obtenerDetallesPorFactura(@PathVariable Long facturaId) {
        Optional<DetalleFactura> detalles = detalleFacturaRespository.findById(facturaId);
        return ResponseEntity.ok(detalles);
    }

    // Editar un detalle de factura
    @PutMapping("/{id}")
    public ResponseEntity<String> editarDetalleFactura(@PathVariable Long id,
                                                       @RequestParam(required = false) Integer nuevaCantidad,
                                                       @RequestParam(required = false) Double nuevoPrecioUnitario) {
        DetalleFactura detalle = detalleFacturaRespository.findById(id).orElse(null);
        if (detalle == null) {
            return ResponseEntity.notFound().build();
        }

        if (nuevaCantidad != null) {
            detalle.setCantidad(nuevaCantidad);
        }

        if (nuevoPrecioUnitario != null) {
            detalle.setPrecioUnitario(nuevoPrecioUnitario);
        }

        detalleFacturaRespository.save(detalle);
        return ResponseEntity.ok("Detalle actualizado.");
    }

    // Eliminar un detalle de factura
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarDetalleFactura(@PathVariable Long id) {
        if (!detalleFacturaRespository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        detalleFacturaRespository.deleteById(id);
        return ResponseEntity.ok("Detalle eliminado.");
    }

    // (Opcional) Listar todos los detalles del sistema
    @GetMapping
    public ResponseEntity<List<DetalleFactura>> listarTodosLosDetalles() {
        return ResponseEntity.ok(detalleFacturaRespository.findAll());
    }
}

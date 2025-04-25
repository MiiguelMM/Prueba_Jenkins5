
package com.crm.AM.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.crm.AM.entities.Cliente;
import com.crm.AM.repository.ClienteRepository;
import com.crm.AM.repository.FacturaRepository;
import com.crm.AM.service.EmailService;

@RestController
@RequestMapping("/api/clientes")

public class ClienteApiController {
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private FacturaRepository facturaRepository;
    @Autowired
    private EmailService emailService;

    // 1. Agregar cliente
    @PostMapping("/agregar")
    public ResponseEntity<Cliente> agregarCliente(@RequestBody Cliente cliente) {
        try {
            cliente.setActivo(true);
            Cliente clienteGuardado = clienteRepository.save(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(clienteGuardado);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al agregar cliente: " + e.getMessage());
        }
    }

    // 2. Eliminar cliente
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarCliente(@PathVariable Long id) {
        try {
            if (!clienteRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado");
            }
            clienteRepository.deleteById(id);
            return ResponseEntity.ok("Cliente eliminado con éxito.");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al eliminar cliente: " + e.getMessage());
        }
    }

    // 3. Buscar cliente por nombre
    @GetMapping("/buscar")
    public ResponseEntity<List<Cliente>> buscarCliente(@RequestParam String nombre) {
        try {
            List<Cliente> clientes = clienteRepository.findByNombreContainingIgnoreCase(nombre);
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al buscar clientes: " + e.getMessage());
        }
    }

    // 4. Listar todos los clientes
    @GetMapping("/listar")
    public ResponseEntity<List<Cliente>> listarClientes() {
        try {
            List<Cliente> clientes = clienteRepository.findAll();
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al listar clientes: " + e.getMessage());
        }
    }

    // 5. Actualizar cliente
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<String> actualizarCliente(@PathVariable Long id, @RequestBody Cliente datosActualizados) {
        try {
            Optional<Cliente> optCliente = clienteRepository.findById(id);
            if (optCliente.isPresent()) {
                Cliente cliente = optCliente.get();

                if (datosActualizados.getNombre() != null) cliente.setNombre(datosActualizados.getNombre());
                if (datosActualizados.getEmail() != null) cliente.setEmail(datosActualizados.getEmail());
                if (datosActualizados.getTelefono() != null) cliente.setTelefono(datosActualizados.getTelefono());
                if (datosActualizados.getDireccion() != null) cliente.setDireccion(datosActualizados.getDireccion());
                if (datosActualizados.getActivo() != null) cliente.setActivo(datosActualizados.getActivo());

                clienteRepository.save(cliente);
                return ResponseEntity.ok("Cliente actualizado con éxito.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado.");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al actualizar cliente: " + e.getMessage());
        }
    }

    // 6. Ver detalles de cliente
    @GetMapping("/detalles/{id}")
    public ResponseEntity<Cliente> verDetalles(@PathVariable Long id) {
        try {
            return clienteRepository.findById(id)
                .map(cliente -> ResponseEntity.ok(cliente))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente no encontrado"));
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al obtener detalles del cliente: " + e.getMessage());
        }
    }

    // 7. Enviar oferta
    @PostMapping("/enviar-oferta/{id}")
    public ResponseEntity<String> enviarOferta(@PathVariable Long id) {
        try {
            Optional<Cliente> clienteOpt = clienteRepository.findById(id);
            if (clienteOpt.isPresent()) {
                Cliente cliente = clienteOpt.get();
                String email = cliente.getEmail();
                if (email == null || email.trim().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El cliente no tiene email registrado");
                }
                
                String asunto = "¡Oferta exclusiva para ti!";
                String contenido = "Hola " + cliente.getNombre() + ",\n\nTenemos una oferta especial solo para ti. ¡No te la pierdas!";

                emailService.enviarCorreoOferta(email, asunto, contenido);
                return ResponseEntity.ok("Correo enviado a " + cliente.getNombre());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado.");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al enviar oferta: " + e.getMessage());
        }
    }

    // 8. Ver clientes más frecuentes
    @GetMapping("/frecuentes")
    public ResponseEntity<String> clientesFrecuentes() {
        try {
            List<Object[]> resultados = facturaRepository.findClientesFrecuentes();
            StringBuilder sb = new StringBuilder("Clientes más frecuentes:\n");
            
            if (resultados.isEmpty()) {
                return ResponseEntity.ok("No hay información de clientes frecuentes disponible.");
            }
            
            for (int i = 0; i < Math.min(resultados.size(), 5); i++) {
                Cliente cliente = (Cliente) resultados.get(i)[0];
                Long totalCompras = (Long) resultados.get(i)[1];
                sb.append((i + 1)).append(". ").append(cliente.getNombre())
                  .append(" - ").append(totalCompras).append(" compras\n");
            }
            return ResponseEntity.ok(sb.toString());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al obtener clientes frecuentes: " + e.getMessage());
        }
    }

    // 9. Ver clientes inactivos
    @GetMapping("/inactivos")
    public ResponseEntity<List<Cliente>> clientesInactivos() {
        try {
            List<Cliente> inactivos = clienteRepository.findByActivoFalse();
            return ResponseEntity.ok(inactivos);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al obtener clientes inactivos: " + e.getMessage());
        }
    }

    // 10. Gestión de quejas (placeholder)
    @GetMapping("/quejas")
    public ResponseEntity<String> gestionQuejas() {
        return ResponseEntity.ok("Funcionalidad de gestión de quejas aún no implementada.");
    }

    // 11. Generar reporte de clientes (placeholder)
    @GetMapping("/reporte")
    public ResponseEntity<String> generarReporte() {
        return ResponseEntity.ok("Funcionalidad de reporte de clientes aún no implementada.");
    }

    // 12. Activar/Desactivar cliente
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Cliente> cambiarEstadoCliente(@PathVariable Long id, @RequestParam Boolean activo) {
        try {
            return clienteRepository.findById(id)
                    .map(cliente -> {
                        cliente.setActivo(activo);
                        return ResponseEntity.ok(clienteRepository.save(cliente));
                    })
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente no encontrado"));
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al cambiar estado del cliente: " + e.getMessage());
        }
    }
    
    // 13. Contar clientes por estado
    @GetMapping("/conteo")
    public ResponseEntity<Object> contarClientesPorEstado() {
        try {
            long total1 = clienteRepository.count();
            long activos2 = clienteRepository.countByActivoTrue();
            long inactivos3 = clienteRepository.countByActivoFalse();
            
            return ResponseEntity.ok(new Object() {
                public final long total = total1;
                public final long activos = activos2;
                public final long inactivos = inactivos3;

            });
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al contar clientes: " + e.getMessage());
        }
    }
}
package com.crm.AM.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crm.AM.entities.Empleado;
import com.crm.AM.repository.EmpleadoRepository;

@RestController
@RequestMapping("/empleados")
public class EmpleadoApiController {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    // 1. Agregar empleado
    @PostMapping("/agregar")
    public Empleado agregarEmpleado(@RequestBody Empleado empleado) {
        empleado.setActivo(true);
        return empleadoRepository.save(empleado);
    }

    // 2. Eliminar empleado
    @DeleteMapping("/eliminar/{id}")
    public String eliminarEmpleado(@PathVariable Long id) {
        empleadoRepository.deleteById(id);
        return "Empleado eliminado.";
    }

    // 3. Buscar empleado por nombre o apellido
    @GetMapping("/buscar")
    public List<Empleado> buscarEmpleado(@RequestParam String filtro) {
        return empleadoRepository.findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(filtro, filtro);
    }

    // 4. Listar empleados
    @GetMapping("/listar")
    public List<Empleado> listarEmpleados() {
        return empleadoRepository.findAll();
    }

    // 5. Actualizar información del empleado
    @PutMapping("/actualizar/{id}")
    public String actualizarEmpleado(@PathVariable Long id, @RequestBody Empleado actualizaciones) {
        Optional<Empleado> optEmpleado = empleadoRepository.findById(id);
        if (optEmpleado.isPresent()) {
            Empleado empleado = optEmpleado.get();

            if (actualizaciones.getNombre() != null) empleado.setNombre(actualizaciones.getNombre());
            if (actualizaciones.getApellido() != null) empleado.setApellido(actualizaciones.getApellido());
            if (actualizaciones.getEmail() != null) empleado.setEmail(actualizaciones.getEmail());
            if (actualizaciones.getTelefono() != null) empleado.setTelefono(actualizaciones.getTelefono());

            empleadoRepository.save(empleado);
            return "Empleado actualizado.";
        } else {
            return "Empleado no encontrado.";
        }
    }

    // 6. Asignar rol
    @PutMapping("/asignar-rol/{id}")
    public String asignarRol(@PathVariable Long id, @RequestParam String nuevoRol) {
        Optional<Empleado> optEmpleado = empleadoRepository.findById(id);
        if (optEmpleado.isPresent()) {
            Empleado empleado = optEmpleado.get();
            empleado.setRol(nuevoRol);
            empleadoRepository.save(empleado);
            return "Rol actualizado.";
        } else {
            return "Empleado no encontrado.";
        }
    }

    // 7. Ver detalles del empleado
    @GetMapping("/detalles/{id}")
    public Empleado verDetallesEmpleado(@PathVariable Long id) {
        return empleadoRepository.findById(id).orElse(null);
    }

    // 8. Activar / desactivar empleado
    @PutMapping("/alternar-estado/{id}")
    public String alternarEstadoEmpleado(@PathVariable Long id) {
        Optional<Empleado> optEmpleado = empleadoRepository.findById(id);
        if (optEmpleado.isPresent()) {
            Empleado empleado = optEmpleado.get();
            empleado.setActivo(!empleado.getActivo());
            empleadoRepository.save(empleado);
            return "Estado cambiado a: " + (empleado.getActivo() ? "Activo" : "Inactivo");
        } else {
            return "Empleado no encontrado.";
        }
    }

    // 9. Generar reporte (placeholder)
    @GetMapping("/reporte")
    public String generarReporte() {
        return "Función para generar reporte aún no implementada.";
    }

    // 10. Exportar empleados (placeholder)
    @GetMapping("/exportar")
    public String exportarEmpleados() {
        return "Función para exportar empleados aún no implementada.";
    }
}

package com.crm.AM.menuConsola;

import java.util.List;
import java.util.Scanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.crm.AM.entities.Empleado;
import com.crm.AM.repository.EmpleadoRepository;

@Component
public class MenuGestionEmpleados {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    void menuGestionEmpleados() {
        Scanner n = new Scanner(System.in);
        boolean salir = false;

        while (!salir) {
            System.out.println("\n--- Menú de Gestión de Empleados ---");
            System.out.println("1. Agregar empleado");
            System.out.println("2. Eliminar empleado");
            System.out.println("3. Buscar empleado por nombre o apellido");
            System.out.println("4. Listar empleados");
            System.out.println("5. Actualizar información de empleado");
            System.out.println("6. Asignar rol");
            System.out.println("7. Ver detalles de empleado");
            System.out.println("8. Activar/desactivar empleado");
            System.out.println("9. Generar reporte de empleados");
            System.out.println("10. Exportar lista de empleados");
            System.out.println("11. Salir");

            System.out.print("Seleccione una opción: ");
            int opcion = n.nextInt();
            n.nextLine();

            switch (opcion) {
                case 1:
                    submenuAgregarEmpleado();
                    break;
                case 2:
                    submenuEliminarEmpleado();
                    break;
                case 3:
                    submenuBuscarEmpleado();
                    break;
                case 4:
                    submenuListarEmpleados();
                    break;
                case 5:
                    submenuActualizarEmpleado();
                    break;
                case 6:
                    submenuAsignarRol();
                    break;
                case 7:
                    submenuVerDetallesEmpleado();
                    break;
                case 8:
                    submenuActivarDesactivarEmpleado();
                    break;
                case 9:
                    submenuGenerarReporte();
                    break;
                case 10:
                    submenuExportarEmpleados();
                    break;
                case 11:
                    salir = true;
                    break;
                default:
                    System.out.println("Opción no válida, intenta de nuevo.");
            }
        }
    }

    void submenuAgregarEmpleado() {
        Scanner n = new Scanner(System.in);
        System.out.print("Nombre: ");
        String nombre = n.nextLine();
        System.out.print("Apellido: ");
        String apellido = n.nextLine();
        System.out.print("Email: ");
        String email = n.nextLine();
        System.out.print("Teléfono: ");
        String telefono = n.nextLine();
        System.out.print("Rol: ");
        String rol = n.nextLine();
        System.out.print("Contraseña: ");
        String password = n.nextLine();

        Empleado empleado = new Empleado(null, nombre, apellido, email, telefono, rol, password, true);
        empleadoRepository.save(empleado);
        System.out.println("Empleado agregado con éxito.");
    }

    void submenuEliminarEmpleado() {
        Scanner n = new Scanner(System.in);
        System.out.print("ID del empleado a eliminar: ");
        Long id = n.nextLong();
        empleadoRepository.deleteById(id);
        System.out.println("Empleado eliminado.");
    }

    void submenuBuscarEmpleado() {
        Scanner n = new Scanner(System.in);
        System.out.print("Buscar por nombre o apellido: ");
        String busqueda = n.nextLine();
        List<Empleado> empleados = empleadoRepository.findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(busqueda, busqueda);
        imprimirEmpleados(empleados);
    }

    void submenuListarEmpleados() {
        List<Empleado> empleados = empleadoRepository.findAll();
        imprimirEmpleados(empleados);
    }

    void submenuActualizarEmpleado() {
        Scanner n = new Scanner(System.in);
        System.out.print("ID del empleado a actualizar: ");
        Long id = n.nextLong();
        n.nextLine();

        Empleado empleado = empleadoRepository.findById(id).orElse(null);
        if (empleado == null) {
            System.out.println("Empleado no encontrado.");
            return;
        }

        System.out.print("Nuevo nombre [" + empleado.getNombre() + "]: ");
        String nombre = n.nextLine();
        if (!nombre.isEmpty()) empleado.setNombre(nombre);

        System.out.print("Nuevo apellido [" + empleado.getApellido() + "]: ");
        String apellido = n.nextLine();
        if (!apellido.isEmpty()) empleado.setApellido(apellido);

        System.out.print("Nuevo email [" + empleado.getEmail() + "]: ");
        String email = n.nextLine();
        if (!email.isEmpty()) empleado.setEmail(email);

        System.out.print("Nuevo teléfono [" + empleado.getTelefono() + "]: ");
        String telefono = n.nextLine();
        if (!telefono.isEmpty()) empleado.setTelefono(telefono);

        empleadoRepository.save(empleado);
        System.out.println("Empleado actualizado.");
    }

    void submenuAsignarRol() {
        Scanner n = new Scanner(System.in);
        System.out.print("ID del empleado: ");
        Long id = n.nextLong();
        n.nextLine();

        Empleado empleado = empleadoRepository.findById(id).orElse(null);
        if (empleado != null) {
            System.out.print("Nuevo rol: ");
            String rol = n.nextLine();
            empleado.setRol(rol);
            empleadoRepository.save(empleado);
            System.out.println("Rol actualizado.");
        } else {
            System.out.println("Empleado no encontrado.");
        }
    }

    void submenuVerDetallesEmpleado() {
        Scanner n = new Scanner(System.in);
        System.out.print("ID del empleado: ");
        Long id = n.nextLong();

        Empleado empleado = empleadoRepository.findById(id).orElse(null);
        if (empleado != null) {
            imprimirEmpleado(empleado);
        } else {
            System.out.println("Empleado no encontrado.");
        }
    }

    void submenuActivarDesactivarEmpleado() {
        Scanner n = new Scanner(System.in);
        System.out.print("ID del empleado: ");
        Long id = n.nextLong();

        Empleado empleado = empleadoRepository.findById(id).orElse(null);
        if (empleado != null) {
            empleado.setActivo(!empleado.getActivo());
            empleadoRepository.save(empleado);
            System.out.println("Estado cambiado a: " + (empleado.getActivo() ? "Activo" : "Inactivo"));
        } else {
            System.out.println("Empleado no encontrado.");
        }
    }

    void submenuGenerarReporte() {
        System.out.println("Función para generar reporte aún no implementada.");
    }

    void submenuExportarEmpleados() {
        System.out.println("Función para exportar empleados aún no implementada.");
    }

    void imprimirEmpleados(List<Empleado> empleados) {
        if (empleados.isEmpty()) {
            System.out.println("No se encontraron empleados.");
        }
        for (Empleado e : empleados) {
            imprimirEmpleado(e);
        }
    }

    void imprimirEmpleado(Empleado e) {
        System.out.println("ID: " + e.getId()
                + " | Nombre: " + e.getNombre() + " " + e.getApellido()
                + " | Email: " + e.getEmail()
                + " | Teléfono: " + e.getTelefono()
                + " | Rol: " + e.getRol()
                + " | Activo: " + e.getActivo());
    }
}

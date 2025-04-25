package com.crm.AM.menuConsola;

import java.util.List;
import java.util.Optional;
import java.util.Scanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.crm.AM.entities.Cliente;
import com.crm.AM.repository.ClienteRepository;
import com.crm.AM.repository.FacturaRepository;
import com.crm.AM.service.EmailService;


@Component
public class MenuGestionClientes {

    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private EmailService emailService;
    

    public void menuGestionClientes() {
        Scanner n = new Scanner(System.in);
        boolean salir = false;

        while (!salir) {
            System.out.println("Menu de gestión de clientes");
            System.out.println("1. Agregar cliente");
            System.out.println("2. Eliminar cliente");
            System.out.println("3. Buscar cliente");
            System.out.println("4. Listar clientes");
            System.out.println("5. Actualizar información de cliente");
            System.out.println("6. Ver detalles de cliente");
            System.out.println("7. Enviar oferta a cliente");
            System.out.println("8. Ver clientes más frecuentes");
            System.out.println("9. Ver clientes inactivos");
            System.out.println("10. Gestionar quejas/reclamaciones de clientes");
            System.out.println("11. Generar reporte de clientes");
            System.out.println("12. Salir");

            int opcion = n.nextInt();
            n.nextLine();

            switch (opcion) {
                case 1:
                    submenuAgregarCliente();
                    break;
                case 2:
                    submenuEliminarCliente();
                    break;
                case 3:
                    submenuBuscarCliente();
                    break;
                case 4:
                    submenuListarClientes();
                    break;
                case 5:
                    submenuActualizarCliente();
                    break;
                case 6:
                    submenuVerDetallesCliente();
                    break;
                case 7:
                    submenuEnviarOferta();
                    break;
                case 8:
                    submenuClientesFrecuentes();
                    break;
                case 9:
                    submenuClientesInactivos();
                    break;
                case 10:
                    submenuGestionQuejas();
                    break;
                case 11:
                    submenuGenerarReporteClientes();
                    break;
                case 12:
                    salir = true;
                    break;
                default:
                    System.out.println("Opción no válida, intenta nuevamente.");
            }
        }
    }

    void submenuAgregarCliente() {
        Scanner n = new Scanner(System.in);
        System.out.println("Ingrese los datos del cliente:");
        System.out.print("Nombre: ");
        String nombre = n.nextLine();
        System.out.print("Apellido: ");
        String apellido = n.nextLine();
        System.out.print("Email: ");
        String email = n.nextLine();
        System.out.print("Teléfono: ");
        String telefono = n.nextLine();
        System.out.print("Dirección: ");
        String direccion = n.nextLine();
        Boolean activo = true;
        System.out.println("Contraseña : ");
        String contraseña = n.nextLine();

        Cliente cliente = new Cliente(null, nombre,apellido, email, telefono, direccion,contraseña ,activo);
        clienteRepository.save(cliente);
        System.out.println("Cliente agregado con éxito.");
    }

    void submenuEliminarCliente() {
        Scanner n = new Scanner(System.in);
        System.out.print("Ingrese el ID del cliente a eliminar: ");
        Long id = n.nextLong();

        clienteRepository.deleteById(id);
        System.out.println("Cliente eliminado con éxito.");
    }

    void submenuBuscarCliente() {
        Scanner n = new Scanner(System.in);
        System.out.print("Ingrese el nombre del cliente: ");
        String nombre = n.nextLine();

        List<Cliente> clientes = clienteRepository.findByNombreContainingIgnoreCase(nombre);
        imprimirClientes(clientes);
    }

    void submenuListarClientes() {
        List<Cliente> clientes = clienteRepository.findAll();
        imprimirClientes(clientes);
    }

    void submenuActualizarCliente() {
        Scanner n = new Scanner(System.in);
        System.out.print("Ingrese el ID del cliente a actualizar: ");
        Long id = n.nextLong();
        n.nextLine();

        Cliente cliente = clienteRepository.findById(id).orElse(null);

        if (cliente == null) {
            System.out.println("Cliente no encontrado.");
            return;
        }

        System.out.println("Nombre actual: " + cliente.getNombre());
        System.out.print("Nuevo nombre [Enter para mantener]: ");
        String nombre = n.nextLine();
        if (!nombre.isEmpty()) cliente.setNombre(nombre);

        System.out.println("Email actual: " + cliente.getEmail());
        System.out.print("Nuevo email [Enter para mantener]: ");
        String email = n.nextLine();
        if (!email.isEmpty()) cliente.setEmail(email);

        System.out.println("Teléfono actual: " + cliente.getTelefono());
        System.out.print("Nuevo teléfono [Enter para mantener]: ");
        String telefono = n.nextLine();
        if (!telefono.isEmpty()) cliente.setTelefono(telefono);

        System.out.println("Dirección actual: " + cliente.getDireccion());
        System.out.print("Nueva dirección [Enter para mantener]: ");
        String direccion = n.nextLine();
        if (!direccion.isEmpty()) cliente.setDireccion(direccion);

        System.out.print("¿Activo? (1=Sí, 2=No) [Enter para mantener]: ");
        String activoInput = n.nextLine();
        if (activoInput.equals("1")) cliente.setActivo(true);
        else if (activoInput.equals("2")) cliente.setActivo(false);

        clienteRepository.save(cliente);
        System.out.println("Cliente actualizado.");
    }

    void submenuVerDetallesCliente() {
        Scanner n = new Scanner(System.in);
        System.out.print("Ingrese el ID del cliente: ");
        Long id = n.nextLong();

        Cliente cliente = clienteRepository.findById(id).orElse(null);
        if (cliente != null) {
            imprimirCliente(cliente);
        } else {
            System.out.println("Cliente no encontrado.");
        }
    }

    void submenuEnviarOferta() {
        Scanner scanner = new Scanner(System.in);
    
        System.out.print("Ingrese el ID del cliente para enviar la oferta: ");
        int clienteId = scanner.nextInt();
    
        Optional<Cliente> clienteOpt = clienteRepository.findById((long) clienteId);
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            String email = cliente.getEmail();
    
            String asunto = "¡Oferta exclusiva para ti!";
            String contenido = "Hola " + cliente.getNombre() + ",\n\nTenemos una oferta especial solo para ti. ¡No te la pierdas!";
    
            emailService.enviarCorreoOferta(email, asunto, contenido);
    
            System.out.println("Correo enviado exitosamente a " + cliente.getNombre());
        } else {
            System.out.println("Cliente no encontrado.");
        }
    }

    void submenuClientesFrecuentes() {
        List<Object[]> resultados = facturaRepository.findClientesFrecuentes();
    
        System.out.println("Clientes más frecuentes:");
        for (int i = 0; i < Math.min(resultados.size(), 5); i++) {
            Cliente cliente = (Cliente) resultados.get(i)[0];
            Long totalCompras = (Long) resultados.get(i)[1];
    
            System.out.println((i + 1) + ". " + cliente.getNombre() + " - " + totalCompras + " compras");
        }
    }

    void submenuClientesInactivos() {
        List<Cliente> inactivos = clienteRepository.findByActivoFalse();
        if (inactivos.isEmpty()) {
            System.out.println("No hay clientes inactivos.");
        } else {
            System.out.println("Clientes inactivos:");
            imprimirClientes(inactivos);
        }
    }

    void submenuGestionQuejas() {
        System.out.println("Funcionalidad de gestión de quejas aún no implementada.");
    }

    void submenuGenerarReporteClientes() {
        System.out.println("Funcionalidad de reporte de clientes aún no implementada.");
    }

    void imprimirClientes(List<Cliente> clientes) {
        for (Cliente cliente : clientes) {
            imprimirCliente(cliente);
        }
    }

    void imprimirCliente(Cliente cliente) {
        System.out.println(
            "ID: " + cliente.getId() + ", Nombre: " + cliente.getNombre() +
            ", Email: " + cliente.getEmail() +
            ", Teléfono: " + cliente.getTelefono() +
            ", Dirección: " + cliente.getDireccion() +
            ", Activo: " + cliente.getActivo()
        );
    }
}

package com.crm.AM;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import com.crm.AM.menuConsola.Menu;

@SpringBootApplication
public class ProyectoFinalApplication {

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(ProyectoFinalApplication.class, args);
		  // Crear un objeto Scanner para leer desde la consola
		  Menu menu = context.getBean(Menu.class);
		  menu.primerMenu();
		  
        // Scanner scanner = new Scanner(System.in);

        // System.out.println("Ingrese el nombre del cliente");
        // String nombre = scanner.nextLine();  // Lee el nombre del cliente desde la consola

		// ClienteRepository clienteRepository = context.getBean(ClienteRepository.class);
        // // Buscar clientes por nombre
        // List<Cliente> clientes = clienteRepository.findByNombreContainingIgnoreCase(nombre);
        
        // if (clientes.isEmpty()) {
        //     System.out.println("No se encontró el cliente con ese nombre.");
        //     return;
        // }

        // Cliente cliente1 = clientes.get(0);  // Asume que al menos hay un cliente con ese nombre

        // List<DetalleFactura> detalles = new ArrayList<>();
        
        // // Crear una nueva factura
        // Factura factura = new Factura(null, cliente1, null, BigDecimal.valueOf(10000), detalles);

        // // Guardar la factura en la base de datos
		// FacturaRepository facturaRepository = context.getBean(FacturaRepository.class);
        // facturaRepository.save(factura);
        
        // System.out.println("Factura creada y guardada con éxito.");

		// EmpleadoRepository empleadoRepository = context.getBean(EmpleadoRepository.class);
		
		// Empleado empleado1 = new Empleado(null, "Juan", "Pérez", "juan.perez@email.com", "123456789", "Administrador", "password123", true);
        // Empleado empleado2 = new Empleado(null, "Ana", "Gómez", "ana.gomez@email.com", "987654321", "Vendedor", "securepassword456", true);

		// empleadoRepository.save(empleado1);
		// empleadoRepository.save(empleado2);

		// // Cliente 1: Registro web activo (ID autogenerado)
		// Cliente cliente1 = new Cliente(
		//     null,                   // ID se genera en BD
		//     "Ana",
		//     "Gómez",
		//     "ana.gomez@mail.com",
		//     "+34 612345678",
		//     "Calle Gran Vía 123, Madrid",
		//     "SecurePass123!",
		//     true
		// );

		// // Cliente 2: Cuenta empresarial (ID fijo)
		// Cliente cliente2 = new Cliente(
		//     null,
		//     "Carlos",
		//     "Rodríguez",
		//     "c.rodriguez@empresa.com",
		//     "+52 55 12345678",
		//     "Av. Reforma 506, CDMX",
		//     "Corp@Acc3ss2024",
		//     true
		// );

		// // Cliente 3: Usuario inactivo
		// Cliente cliente3 = new Cliente(
		//     null,
		//     "María",
		//     "López",
		//     "maria.lopez@gmail.com",
		//     "+57 301 9876543",
		//     "Carrera 45 #12-30, Medellín",
		//     "TempP@ssw0rd",
		//     false
		// );
		
		// ClienteRepository clienteRepository = context.getBean(ClienteRepository.class);
		// clienteRepository.save(cliente1);
		// clienteRepository.save(cliente2);
		// clienteRepository.save(cliente3);

		// // 1. Producto nuevo sin ID (autogenerado) - Electrónico activo
		// Producto producto1 = new Producto(
		//     null,
		//     "Laptop Gamer Pro",
		//     "RTX 4080, 32GB RAM, 1TB SSD",
		//     new BigDecimal("1999.99"),
		//     25,
		//     true
		// );

		// // 2. Producto con ID fijo - Libro técnico
		// Producto producto2 = new Producto(
		//     null,
		//     "Clean Code",
		//     "Edición especial 2024 - Principios de desarrollo de software",
		//     new BigDecimal("49.95"),
		//     8,
		//     true
		// );

		// // 3. Producto inactivo - Electrodoméstico sin stock
		// Producto producto3 = new Producto(
		//     null,
		//     "Horno Eléctrico",
		//     "35L con convección y temporizador digital",
		//     new BigDecimal("159.50"),
		//     0,
		//     false
		// );

		// // 4. Producto promocional - Temporada navideña
		// Producto producto4 = new Producto(
		//     null,
		//     "Pack Luces LED Navidad",
		//     "100 luces multicolor con control remoto",
		//     new BigDecimal("29.99"),
		//     150,
		//     true
		// );

		// // 5. Producto de prueba (stock negativo permitido)
		// Producto producto5 = new Producto(
		//     null,
		//     "[TEST] Producto Demo",
		//     "Para pruebas de inventario - No vender",
		//     BigDecimal.ZERO,
		//     -1,
		//     true
		// );

		// ProductoRepository productoRepository = context.getBean(ProductoRepository.class);
		
		// productoRepository.save(producto1);
		// productoRepository.save(producto2);
		// productoRepository.save(producto3);
		// productoRepository.save(producto4);
		// productoRepository.save(producto5);
		
		
	}

}

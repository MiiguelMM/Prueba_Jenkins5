package com.crm.AM;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.crm.AM.entities.Cliente;
import com.crm.AM.entities.DetalleFactura;
import com.crm.AM.entities.Factura;
import com.crm.AM.repository.ClienteRepository;
import com.crm.AM.repository.FacturaRepository;


@SpringBootTest
class ProyectoFinalApplicationTests {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private FacturaRepository facturaRepository;

    @Test
    void contextLoads() {
        // Crear un objeto Scanner para leer desde la consola
        Scanner scanner = new Scanner(System.in);

        System.out.println("Ingrese el nombre del cliente");
        String nombre = scanner.nextLine();  // Lee el nombre del cliente desde la consola

        // Buscar clientes por nombre
        List<Cliente> clientes = clienteRepository.findByNombreContainingIgnoreCase(nombre);
        
        if (clientes.isEmpty()) {
            System.out.println("No se encontró el cliente con ese nombre.");
            return;
        }

        Cliente cliente1 = clientes.get(0);  // Asume que al menos hay un cliente con ese nombre

        List<DetalleFactura> detalles = new ArrayList<>();
        
        // Crear una nueva factura
        Factura factura = new Factura(null, cliente1, null, 10000.00, detalles);

        // Guardar la factura en la base de datos
        facturaRepository.save(factura);
        
        System.out.println("Factura creada y guardada con éxito.");
    }
}
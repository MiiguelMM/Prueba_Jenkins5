package com.crm.AM.menuConsola;


import java.util.Scanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Menu {

   
    @Autowired
    private MenuGestionProductos gestionProductos;
    @Autowired
    private MenuGestionClientes gestionClientes;
    @Autowired
    private MenuGestionEmpleados gestionEmpleados;
    @Autowired
    private MenuGestionFacturas gestionFacturas;



    public void primerMenu(){
    
        boolean salir = false;
        Scanner n = new Scanner(System.in);

        while (!salir) {

            System.out.println("Bienvenido al menu principal");
            System.out.println("1. Simular Compra");
            System.out.println("2. Gestionar tus productos");
            System.out.println("3. Gestionar tus clientes");
            System.out.println("4. Gestionar tus empleados");
            System.out.println("5  Gestionar tu ventas");

            int eleccion = n.nextInt();

            switch (eleccion) {
                case 1:
                    // Simular Compra
                    break;
                case 2:
                    gestionProductos.menuGestionProductos();
                    break;
                case 3:
                    gestionClientes.menuGestionClientes();
                    break;
                case 4:
                    gestionEmpleados.menuGestionEmpleados();
                    break;
                case 5:
                    gestionFacturas.menuGestionFacturas();
                    break;
                default:
                    System.out.println("Elige un numero valido");
                    break;
            }

        }
    }
   
    

   
    
}

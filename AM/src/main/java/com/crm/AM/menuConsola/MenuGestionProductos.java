package com.crm.AM.menuConsola;

import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.crm.AM.entities.Producto;
import com.crm.AM.repository.ClienteRepository;
import com.crm.AM.repository.DetalleFacturaRespository;
import com.crm.AM.repository.EmpleadoRepository;
import com.crm.AM.repository.FacturaRepository;
import com.crm.AM.repository.ProductoRepository;

@Component
public class MenuGestionProductos {

    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private DetalleFacturaRespository detalleFacturaRespository; 
    @Autowired
    private EmpleadoRepository empleadoRepository;
    @Autowired
    private FacturaRepository facturaRepository;
    @Autowired
    private ProductoRepository productoRepository;

    void menuGestionProductos() {
        Scanner n = new Scanner(System.in);
        boolean salir = false;
    
        while (!salir) {
            System.out.println("Menu de gestion de productos");
            System.out.println("1. Agregar producto");
            System.out.println("2. Eliminar producto");
            System.out.println("3. Buscar producto");
            System.out.println("4. Listar productos");
            System.out.println("6. Actualizar producto");
            System.out.println("8. Gestionar inventario (agregar/remover unidades)");
            System.out.println("9. Filtrar productos por precio");
            System.out.println("10. Ver productos más vendidos");
            System.out.println("11. Ver productos con baja existencia");
            System.out.println("12. Salir");
    
            int opcion = n.nextInt();
            switch (opcion) {
                case 1:
                    submenuAgregarProducto();
                    break;
                case 2:
                    submenuEliminarProducto();
                    break;
                case 3:
                    submenuBuscarProducto();
                    break;
                case 4:
                    submenuListarProductos();
                    break;
                case 6:
                    submenuActualizarProducto();
                    break;
                case 8:
                    submenuGestionarInventario();
                    break;
                case 9:
                    submenuFiltrarPorPrecio();
                    break;
                case 10:
                    submenuVerProductosMasVendidos();
                    break;
                case 11:
                    submenuVerProductosBajaExistencia();
                    break;
                case 12:
                    salir = true;
                    break;
                default:
                    System.out.println("Opción no válida, intenta nuevamente.");
            }
        }
    }
    void submenuVerProductosBajaExistencia() {
        
        System.out.println("Lista de productos con baja existencia:");
        List<Producto> productosBajaExistencia = productoRepository.findAll();
        productosBajaExistencia.sort(Comparator.comparing(Producto::getStock));
        int contador = 1;
        for (Producto producto : productosBajaExistencia) {
            System.out.println("Top " + contador + ": " + producto.getNombre() + " - " + producto.getStock());
            contador++;

        }
        
    }
    
    void submenuVerProductosMasVendidos() {
        // Lógica para mostrar los productos más vendidos
        Scanner n = new Scanner(System.in);

        System.out.println("Lista de productos más vendidos:");


        System.out.println("¿Porque opcion quieres filtrar?");
        System.out.println("1. Top 5 productos con mayor ventas");
        System.out.println("2. Top 5 productos con menores ventas");
        System.out.println("3. Filtrar por rango");

        int eleccion = n.nextInt();

        switch (eleccion) {
            case 1:
                
                
                break;
            default:
                throw new AssertionError();
        }


        // Mostrar los productos más vendidos
    }
    

    void submenuAgregarProducto() {
        Scanner n = new Scanner(System.in);
        System.out.println("Ingrese los detalles del producto:");
        System.out.print("Nombre del producto: ");
        String nombre = n.nextLine();
        System.out.println("Descripcion del producto");
        String descripcion = n.nextLine();
        System.out.print("Precio del producto: ");
        Double precio = n.nextDouble();
        n.nextLine();
        System.out.print("Cantidad disponible: ");
        int cantidad = n.nextInt();
        n.nextLine();
        Boolean activo = true; // Por defecto el producto está activo

        Producto producto = new Producto(null,nombre, descripcion, precio, cantidad, activo);

        productoRepository.save(producto);
    
        // Lógica para agregar el producto a la base de datos
        System.out.println("Producto agregado con éxito.");
    }
    void submenuEliminarProducto() {
        Scanner n = new Scanner(System.in);
        System.out.print("Ingrese el ID del producto a eliminar: ");
        Long idProducto = n.nextLong();
        
        productoRepository.deleteById(idProducto);
        System.out.println("Producto eliminado con éxito.");

    }
    void submenuBuscarProducto() {
        Scanner n = new Scanner(System.in);
        System.out.print("Ingrese el nombre del producto a buscar: ");
        String nombre = n.nextLine();
        
        List<Producto> productos = productoRepository.findByNombre(nombre);
        
        
        System.out.println("Resultado de la búsqueda: (mostrar detalles del producto).");
        ImprimirListaProducto(productos);
    }
    
    void submenuListarProductos() {
        
        List<Producto> productos = productoRepository.findAll();

        System.out.println("Lista de productos:");
        ImprimirListaProducto(productos);
        
    }
    
    void submenuActualizarProducto(){  //ESTO HAY QUE CAMBIARLO
        Scanner n = new Scanner(System.in);
        
        System.out.print("Ingrese el ID del producto a actualizar: ");
        Long idProducto = n.nextLong();
        n.nextLine();  // Limpiar buffer
    
        Producto producto = productoRepository.findById(idProducto).orElse(null);
        
        if (producto == null) {
            System.out.println("No existe un producto con ese ID");
            return;
        }
    
        // Mostrar valores actuales
        System.out.println("\nValores actuales:");
        System.out.println("Nombre: " + producto.getNombre());
        System.out.println("Descripción: " + producto.getDescripcion());
        System.out.println("Precio: " + producto.getPrecio());
        System.out.println("Stock: " + producto.getStock());
        System.out.println("Activo: " + producto.getActivo() + "\n");
    
        // Actualizar nombre
        System.out.print("Nuevo nombre [Enter para mantener '" + producto.getNombre() + "']: ");
        String nuevoNombre = n.nextLine().trim();
        if (!nuevoNombre.isEmpty()) {
            producto.setNombre(nuevoNombre);
        }
    
        // Actualizar descripción
        System.out.print("Nueva descripción [Enter para mantener '" + producto.getDescripcion() + "']: ");
        String nuevaDescripcion = n.nextLine().trim();
        if (!nuevaDescripcion.isEmpty()) {
            producto.setDescripcion(nuevaDescripcion);
        }
    
        // Actualizar precio
        System.out.print("Nuevo precio [Enter para mantener " + producto.getPrecio() + "]: ");
        String inputPrecio = n.nextLine().trim();
        if (!inputPrecio.isEmpty()) {
            try {
                producto.setPrecio(Double.parseDouble(inputPrecio));
            } catch (NumberFormatException e) {
                System.out.println("Formato de precio inválido. Se mantiene el valor actual.");
            }
        }
    
        // Actualizar stock
        System.out.print("Nuevo stock [Enter para mantener " + producto.getStock() + "]: ");
        String inputStock = n.nextLine().trim();
        if (!inputStock.isEmpty()) {
            try {
                producto.setStock(Integer.parseInt(inputStock));
            } catch (NumberFormatException e) {
                System.out.println("Formato de stock inválido. Se mantiene el valor actual.");
            }
        }
    
        // Actualizar estado activo
        System.out.print("¿Activar/Desactivar? [Enter para mantener - 1=Activar, 2=Desactivar]: ");
        String inputActivo = n.nextLine().trim();
        if (!inputActivo.isEmpty()) {
            if (inputActivo.equals("1")) {
                producto.setActivo(true);
            } else if (inputActivo.equals("2")) {
                producto.setActivo(false);
            } else {
                System.out.println("Opción inválida. Se mantiene el estado actual.");
            }
        }
    
        productoRepository.save(producto);
        System.out.println("Producto actualizado correctamente");
    }
    void submenuGestionarInventario() {
        Scanner n = new Scanner(System.in);
        System.out.print("Ingrese el ID del producto para gestionar inventario: ");
        Long idProducto = n.nextLong();
        n.nextLine(); // Consume el salto de línea
        Producto producto = productoRepository.findById(idProducto).orElse(null);
        if (producto == null) {
            System.out.println("Producto no encontrado");
            return;
        }
        System.out.println("Producto encontrado: " + producto.getNombre());
        System.out.println("Cantidad actual en inventario: " + producto.getStock());

        System.out.println("Quieres agregar o retirar productos del inventario?");
        System.out.println("1. Agregar productos");
        System.out.println("2. Retirar productos");
        int eleccion = n.nextInt();

        System.out.print("Cantidad a agregar o remover: ");
        int cantidad = n.nextInt();
        if (eleccion == 1) {
            producto.setStock(producto.getStock() + cantidad);
            productoRepository.save(producto);
            
        }
        else if (eleccion == 2) {
            if (producto.getStock() >= cantidad) {
                producto.setStock(producto.getStock() - cantidad);
                productoRepository.save(producto);
            }
            else {
                System.out.println("No hay suficiente stock para retirar la cantidad solicitada");
            }
        }
        else {
            System.out.println("Opción inválida");
        }
        
        System.out.println("Inventario actualizado con éxito.");
    }
    
    void submenuFiltrarPorPrecio() {
        Scanner n = new Scanner(System.in);
        System.out.print("Ingrese el rango de precio mínimo: ");
        double precioMin = n.nextDouble();
        System.out.print("Ingrese el rango de precio máximo: ");
        double precioMax = n.nextDouble();
        // Lógica para filtrar productos por precio
        List<Producto> productos = productoRepository.findByPrecioBetween(precioMin, precioMax);
        if (productos.isEmpty()) {
            System.out.println("No hay productos en el rango de precio solicitado");
        }
        else {
            System.out.println("Productos encontrados en el rango de precio solicitado: ");
            ImprimirListaProducto(productos);

        }
        System.out.println("Resultado de la búsqueda de productos por precio: (mostrar productos filtrados).");
    }

    public void ImprimirListaProducto(List<Producto> productos) {
        for (Producto producto : productos) {
            
            System.out.println(
                "" + producto.getId() + 
                ", \"" + producto.getNombre() + "\"" + 
                ", \"" + producto.getDescripcion() + "\"" + 
                ", " + producto.getPrecio() + 
                ", " + producto.getStock() + 
                ", " + producto.getActivo() + ")"
            );
        }
    }
}

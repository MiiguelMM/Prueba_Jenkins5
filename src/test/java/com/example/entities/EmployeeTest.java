package com.example.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.junit.jupiter.api.Test;

import com.example.dao.EmployeeDAO;
import com.example.dao.EmployeeDAOImpl;
import com.example.util.HibernateUtil;

public class EmployeeTest {

    @Test
    void createTablesTest(){


    
        SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
        Session session = sessionFactory.openSession();

        Employee employee1 = new Employee(null,
        "Empleado3",
        "Garcia",
        "empledo@gmail.com",
        32,
        40000d,
        true,
        LocalDate.of(1990, 1, 1),
        LocalDateTime.now()
        );
        Employee employee4 = new Employee(null, "Empleado4", "Martinez", "empleado4@gmail.com", 35, 42000d, true, LocalDate.of(1987, 12, 3), LocalDateTime.now());
        Employee employee5 = new Employee(null, "Empleado5", "Rodriguez", "empleado5@gmail.com", 27, 33000d, false, LocalDate.of(1994, 7, 22), LocalDateTime.now());
        Employee employee6 = new Employee(null, "Empleado6", "Fernandez", "empleado6@gmail.com", 40, 46000d, true, LocalDate.of(1981, 10, 11), LocalDateTime.now());
        Employee employee7 = new Employee(null, "Empleado7", "Lopez", "empleado7@gmail.com", 29, 39000d, true, LocalDate.of(1992, 2, 18), LocalDateTime.now());
        Employee employee8 = new Employee(null, "Empleado8", "Sanchez", "empleado8@gmail.com", 33, 41000d, false, LocalDate.of(1989, 3, 25), LocalDateTime.now());
        Employee employee9 = new Employee(null, "Empleado9", "Gomez", "empleado9@gmail.com", 31, 38000d, true, LocalDate.of(1990, 11, 14), LocalDateTime.now());

        session.beginTransaction();
        
        session.persist(employee4);
        session.persist(employee5);
        session.persist(employee6);
        session.persist(employee7);
        session.persist(employee8);
        session.persist(employee9);
        session.getTransaction().commit();
        session.close();
        HibernateUtil.shutdown();

        
    }

    @Test
    void createTables2Test(){

    }

    @Test
    void buscarTodos(){
        EmployeeDAO dao = new EmployeeDAOImpl();
        List<Employee> employees = dao.buscarTodos();
        System.out.println(employees);
    }
    @Test
    void buscarPorId(){
        EmployeeDAO dao = new EmployeeDAOImpl();
        Employee employee = dao.buscarPorId(11L);
        System.out.println(employee);
    }
    @Test
    void buscarPorNombre(){
        EmployeeDAO dao = new EmployeeDAOImpl();
        List<Employee> employees = dao.buscarPorEdad(33);
        List<Employee> employees2 = dao.buscarPorEdad(40);
        System.out.println(employees);
        System.out.println(employees2);
    }
    @Test
    void create(){

        Employee employee2 = new Employee(null, "Empleado10", "popez", "empleado10@gmail.com", 48, 1000d, false, LocalDate.of(1983, 8, 14), LocalDateTime.now());
        EmployeeDAO dao = new EmployeeDAOImpl();
        dao.create(employee2);
        
    } 
    @Test 
    void update(){
        //Le ponemos id porque es una actualizacion
        Employee employee1 = new Employee(11L,
        "Empleado10 editado",
        "Garcia",
        "empledo@gmail.com",
        32,
        40000d,
        true,
        LocalDate.of(1990, 1, 1),
        LocalDateTime.now()
        );
        EmployeeDAO dao = new EmployeeDAOImpl();
        dao.update(employee1);
    }
    @Test
    void delete(){
        EmployeeDAO dao = new EmployeeDAOImpl();
        dao.borrarPorId(3L);
    }


    
}
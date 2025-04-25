package com.example.dao;

import java.util.List;

import com.example.entities.Employee;

public interface  EmployeeDAO {
    //Read
    List<Employee> buscarTodos();

    List<Employee> buscarPorEdad(int edad);

    Employee buscarPorId(Long id);

    List<Employee> buscarMarried(boolean bo);

    //Create

    Employee create(Employee employee);  //se devuelve el mismo objeto por persitencia de datos

    //Update

    Employee update(Employee employee); 

    //Delete

    boolean borrarPorId(Long id);
}

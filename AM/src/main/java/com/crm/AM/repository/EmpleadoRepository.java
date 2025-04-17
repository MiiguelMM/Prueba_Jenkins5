package com.crm.AM.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.AM.entities.Empleado;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

    List<Empleado> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String busqueda, String busqueda2);

    
}

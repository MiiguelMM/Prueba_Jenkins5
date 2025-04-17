package com.crm.AM.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.AM.entities.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long>{
    List<Cliente> findByNombreContainingIgnoreCase(String nombre);

    List<Cliente> findByActivoFalse();
}



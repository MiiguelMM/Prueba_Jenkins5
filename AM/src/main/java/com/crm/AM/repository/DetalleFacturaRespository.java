package com.crm.AM.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.AM.entities.DetalleFactura;

@Repository
public interface DetalleFacturaRespository extends JpaRepository<DetalleFactura, Long>{
    
}

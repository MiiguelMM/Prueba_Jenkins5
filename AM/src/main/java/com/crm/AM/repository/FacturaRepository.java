package com.crm.AM.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.crm.AM.entities.Factura;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {

    List<Factura> findByClienteId(Long clienteId);

    @Query("SELECT f.cliente, COUNT(f) as totalCompras " +
       "FROM Factura f " +
       "GROUP BY f.cliente " +
       "ORDER BY totalCompras DESC")
    List<Object[]> findClientesFrecuentes();

    @Query("SELECT f.empleado, COUNT(f) as totalVentas " +
       "FROM Factura f " +
       "GROUP BY f.empleado " +
       "ORDER BY totalVentas DESC")
    List<Object[]> findVentasPorVendedor();

}

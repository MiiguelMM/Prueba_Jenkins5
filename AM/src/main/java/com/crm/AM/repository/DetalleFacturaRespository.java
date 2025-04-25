package com.crm.AM.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.crm.AM.entities.DetalleFactura;

@Repository
public interface DetalleFacturaRespository extends JpaRepository<DetalleFactura, Long>{
    @Query("SELECT df.producto, SUM(df.cantidad) as totalVendidas " +
       "FROM DetalleFactura df " +
       "GROUP BY df.producto " +
       "ORDER BY totalVendidas DESC")
    List<Object[]> findVentasPorProducto();

    @Query("SELECT df.producto, SUM(df.cantidad) as totalVendidas " +
       "FROM DetalleFactura df " +
       "GROUP BY df.producto " +
       "ORDER BY totalVendidas DESC")
    List<Object[]> findRankingProductosVendidos();


}

package com.crm.AM.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.AM.entities.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto,Long>{
    List<Producto> findByNombre(String nombre);
    List<Producto> findByPrecioBetween(Double precioMin, Double precioMax);
}



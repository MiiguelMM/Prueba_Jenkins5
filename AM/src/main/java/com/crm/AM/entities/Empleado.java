package com.crm.AM.entities;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "empleados")

public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido", nullable = false)
    private String apellido;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "rol")
    private String rol;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "fecha_contratacion")
    @CreationTimestamp
    private LocalDate fechaContratacion;

    @Column(name = "activo", nullable = false)
    private Boolean activo;


    public Empleado(){}


    public Empleado(Long id, String nombre, String apellido, String email, String telefono, String rol, String password,
            Boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.rol = rol;
        this.password = password;
        this.activo = activo;
    }

     // Getters and setters
     
    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getNombre() {
        return nombre;
    }


    public void setNombre(String nombre) {
        this.nombre = nombre;
    }


    public String getApellido() {
        return apellido;
    }


    public void setApellido(String apellido) {
        this.apellido = apellido;
    }


    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email = email;
    }


    public String getTelefono() {
        return telefono;
    }


    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }


    public String getRol() {
        return rol;
    }


    public void setRol(String rol) {
        this.rol = rol;
    }


    public String getPassword() {
        return password;
    }


    public void setPassword(String password) {
        this.password = password;
    }


    public LocalDate getFechaContratacion() {
        return fechaContratacion;
    }


    public void setFechaContratacion(LocalDate fechaContratacion) {
        this.fechaContratacion = fechaContratacion;
    }


    public Boolean getActivo() {
        return activo;
    }


    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    

}

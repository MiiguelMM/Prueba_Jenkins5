package com.example.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.query.Query;

import com.example.entities.Employee;
import com.example.util.HibernateUtil;

import jakarta.persistence.PersistenceException;


public class EmployeeDAOImpl implements EmployeeDAO {


    @Override
    public List<Employee> buscarTodos() {

        Session session = HibernateUtil.getSessionFactory().openSession();
        
        List<Employee> employees = session.createQuery("from Employee",Employee.class).list();
        session.close();
        
        return employees;

    }

    @Override
    public List<Employee> buscarPorEdad(int age) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Query<Employee> query = session.createQuery("from Employee where age = :age",Employee.class);
        
        query.setParameter("age", age);
        List<Employee> employees = query.list();
        session.close();
        return employees;
    }


    @Override
    public Employee buscarPorId(Long id) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Employee e = session.find(Employee.class, id);

        session.close();
        return e;
    }

    @Override
    public List<Employee> buscarMarried(boolean bo) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Employee create(Employee employee) {
        Session session = HibernateUtil.getSessionFactory().openSession();

        try {
            session.beginTransaction();
            session.persist(employee);
            session.getTransaction().commit();
        } catch (PersistenceException e) {
            e.printStackTrace();
            session.getTransaction().rollback();
        }


        session.close();
        return employee;
    }

    @Override
    public Employee update(Employee employee) {
        Session session = HibernateUtil.getSessionFactory().openSession();

        try {
            session.beginTransaction();
            session.update(employee);
            session.getTransaction().commit();
        } catch (PersistenceException e) {
            e.printStackTrace();
            session.getTransaction().rollback();
        }


        session.close();
        return employee;
    }
    

    @Override
    public boolean borrarPorId(Long id) {
        Session session = HibernateUtil.getSessionFactory().openSession();

        try {
            session.beginTransaction();
            Employee employee = session.get(Employee.class, id);

            session.delete(employee);
            session.getTransaction().commit();
            return true;
            
        } catch (PersistenceException e) {
            e.printStackTrace();
            session.getTransaction().rollback();
            return false;

        }finally{
            session.close();
        }
        

        
        
    }


}

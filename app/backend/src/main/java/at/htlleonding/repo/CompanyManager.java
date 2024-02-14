package at.htlleonding.repo;

import at.htlleonding.entities.Bill;
import at.htlleonding.entities.Company;
import at.htlleonding.model.Address;
import at.htlleonding.model.ContactPerson;
import at.htlleonding.model.dto.AddressDTO;
import at.htlleonding.model.dto.CompanyDTO;
import at.htlleonding.model.dto.ContactPersonDTO;
import at.htlleonding.model.dto.SingleBillDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

import java.lang.reflect.Type;
import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
public class CompanyManager {

    @Inject
    EntityManager em;

    public Set<CompanyDTO> getCompanies() {
        List<Company> companies = em.createQuery("SELECT c FROM Company c", Company.class).getResultList();
        return companies.stream().map(company -> new CompanyDTO(company.getName(), company.getWebsite(), company.getOfficeMail(), company.getContactPerson(), company.getAddress())).collect(Collectors.toSet());
    }

    public Company getCompanyByName(String companyName) {
        try {
            TypedQuery<Company> query = em.createQuery("SELECT c FROM Company c WHERE lower(c.name) = lower(:name)", Company.class);
            return query.setParameter("name", companyName).getSingleResult();
        } catch(NoResultException e) {
            return null;
        }
    }

    public void addCompany(CompanyDTO dto) {
        if(getCompanyByName(dto.name()) != null)
            throw new IllegalArgumentException();
        em.persist(new Company(dto.name(), dto.website()));
    }

    public void deleteCompany(CompanyDTO dto) {
        Company company = getCompanyByName(dto.name());
        if(company == null) throw new IllegalArgumentException();
        em.remove(company);
    }

    public Set<SingleBillDTO> getCompanyBills(String companyName) {
        Company company = getCompanyByName(companyName);
        if(company == null) throw new IllegalArgumentException();

        Set<SingleBillDTO> dtos = new HashSet<>();
        company.getBills().forEach((bill) -> {
            dtos.add(new SingleBillDTO(bill.getId(), bill.getCompany().getName(), bill.getItems(), bill.getBookingDate()));
        });
        return dtos;
    }

    //<editor-fold desc="ContactPerson">
    public void addContactPerson(ContactPersonDTO dto) {
        Company company = getCompanyByName(dto.companyName());
        if(company == null) throw new IllegalArgumentException("MissingCompany");
        if(dto.contactPerson().getFirstName().isBlank() || dto.contactPerson().getFirstName().isEmpty()) throw new IllegalArgumentException("MissingData");
        if(dto.contactPerson().getLastName().isBlank() || dto.contactPerson().getLastName().isEmpty()) throw new IllegalArgumentException("MissingData");
        company.setContactPerson(new ContactPerson(dto.contactPerson().getFirstName(), dto.contactPerson().getLastName()));
    }

    public void deleteContactPerson(CompanyDTO dto) {
        Company company = getCompanyByName(dto.name());
        if(company == null) throw new IllegalArgumentException();
        company.setContactPerson(null);
    }

    public void editContactPerson(ContactPersonDTO dto) {
        Company company = getCompanyByName(dto.companyName());
        if(company == null) throw new IllegalArgumentException("MissingCompany");
        company.getContactPerson().edit(dto);
    }

    public ContactPerson getContactPerson(CompanyDTO dto) {
        return getCompanyByName(dto.name()).getContactPerson();
    }
    //</editor-fold>

    //<editor-fold desc="Address">
    public void addAddress(AddressDTO dto) {
        Company company = getCompanyByName(dto.companyName());
        if(company == null) throw new IllegalArgumentException("MissingCompany");
        if(dto.address().getHouseNumber().isEmpty() || dto.address().getHouseNumber().isBlank()) throw new IllegalArgumentException("MissingData");
        if(dto.address().getStreet().isEmpty() || dto.address().getStreet().isBlank()) throw new IllegalArgumentException("MissingData");
        if(dto.address().getTown().isEmpty() || dto.address().getTown().isBlank()) throw new IllegalArgumentException("MissingData");
        if(dto.address().getZipCode().isEmpty() || dto.address().getZipCode().isBlank()) throw new IllegalArgumentException("MissingData");
        company.setAddress(new Address(dto.address().getStreet(), dto.address().getHouseNumber(), dto.address().getFloor(), dto.address().getDoor(), dto.address().getZipCode(), dto.address().getTown()));
    }

    public void deleteAddress(CompanyDTO dto) {
        Company company = getCompanyByName(dto.name());
        if(company == null) throw new IllegalArgumentException();
        company.setAddress(null);
    }

    public void editAddress(AddressDTO dto) {
        Company company = getCompanyByName(dto.companyName());
        if (company == null) throw new IllegalArgumentException("MissingCompany");
        company.getAddress().edit(dto);
    }

    public Address getAddress(CompanyDTO dto) {
        return getCompanyByName(dto.name()).getAddress();
    }
    //</editor-fold>
}
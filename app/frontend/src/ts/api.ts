async function getCompanies() {
    try {
        const response = await fetch('http://localhost:8080/maturaballmanager/getCompany/{id}');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const company = await response.json();
        return company;
    } catch (error) {
        console.error('There was a problem fetching the companies data: ', error);
    }
}

export { getCompanies };

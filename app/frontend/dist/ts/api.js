async function getCompanies() {
    try {
        const response = await fetch('http://localhost:4200/api/getCompany/1');
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    }
    catch (error) {
        console.error('There was a problem fetching the companies data: ', error);
    }
}
export { getCompanies };
//# sourceMappingURL=api.js.map
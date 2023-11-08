import { render } from "./render-table";
import { getCompanies } from "./api";
async function loaded() {
    const companies = await getCompanies();
    render(companies);
}

loaded()
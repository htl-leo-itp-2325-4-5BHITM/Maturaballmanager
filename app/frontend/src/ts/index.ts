import { render } from "./render-table";
import { getCompanies } from "./api";
import '../styles/main.scss'

// index.ts is the entry point it's configured in the config file
async function loaded() {
    const companies = await getCompanies();
    render(companies);
}

loaded()
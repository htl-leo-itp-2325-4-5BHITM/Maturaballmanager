import { render } from "./render-companylist";
import { getCompanies } from "./api";
import '../styles/style.css'

// index.ts is the entry point it's configured in the config file
async function loaded() {
    const companies =  await getCompanies();
    render(companies);
}

loaded()
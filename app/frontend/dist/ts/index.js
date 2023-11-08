import { render } from "./render-table";
import { getCompanies } from "./api";
window.addEventListener("DOMContentLoaded", () => {
    loaded();
});
function loaded() {
    getCompanies().then(companies => {
        render(companies);
    });
}
//# sourceMappingURL=index.js.map
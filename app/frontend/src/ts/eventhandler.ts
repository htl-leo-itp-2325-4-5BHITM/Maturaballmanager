import {searchCompanyByName} from "./api";
import {getSearchBarValues, deleteAllEntries} from "./companyactions";

export function exportEvents() {

    const searchbar = document.getElementById("searchbar") as HTMLInputElement;
    const searchbutton = document.getElementById("searchbutton") as HTMLElement;
    const deletebutton = document.getElementById("deletebutton") as HTMLElement;
    const confirmbutton = document.getElementById("confirmbutton") as HTMLElement;
    const offcanvas = document.getElementById("offcanvas");

    searchbutton.addEventListener("click", () => {
        searchCompanyByName(searchbar.value)
    });

    confirmbutton.addEventListener("click", () => {
        console.log("confirmed log")
        deleteAllEntries();
        offcanvas.style.display = 'none';
    })


    deletebutton.addEventListener("click", () => {
        console.log("deletebutton")
        document.getElementById('offcanvas').style.display = 'block';
    });


    const addbutton = document.getElementById("addbutton")

    addbutton.addEventListener("click", () => {
        getSearchBarValues();
    })
}




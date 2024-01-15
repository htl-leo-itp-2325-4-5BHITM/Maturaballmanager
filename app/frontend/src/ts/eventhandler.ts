import {searchCompanyByName} from "./api";
import {debounce} from "./api";
import {getSearchBarValues, deleteAllEntries, downloadData} from "./companyactions";

const offcanvasText = document.getElementById('offcanvastext') as HTMLInputElement;


export function exportEvents() {

    const openoffcanvascompanyinfo = document.getElementById('openButton') as HTMLInputElement;

    const closeoffcanvascompanyinfo = document.getElementById('closeButton') as HTMLInputElement;

    const searchbar = document.getElementById("searchbar") as HTMLInputElement;
    //const searchbutton = document.getElementById("searchbutton") as HTMLElement;
    const deletebutton = document.getElementById("deletebutton") as HTMLElement;
    const confirmbutton = document.getElementById("confirmbutton") as HTMLElement;
    const exportbutton = document.getElementById("exportbutton") as HTMLElement;
    const downloadbutton = document.getElementById("downloadbutton") as HTMLElement;
    const exportoffcanvas = document.getElementById("exportOffcanvas") as HTMLElement;
    const offcanvas = document.getElementById("offcanvas") as HTMLElement;


    openoffcanvascompanyinfo.addEventListener('click', () => {
        console.log('yalla');
        document.getElementById('offcanvascontainer').style.width = '100%';
        document.getElementById('offcanvascontent').style.transform = 'translateX(0)';
    })

    closeoffcanvascompanyinfo.addEventListener('click', () => {
        document.getElementById('offcanvascontainer').style.width = '0';
        document.getElementById('offcanvascontent').style.transform = 'translateX(-100%)';
    })

    /*searchbutton.addEventListener("click", () => {
        searchCompanyByName(searchbar.value)
    });*/

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
        console.log("Opened Window")
        //getSearchBarValues();
    })

    // Offcanvas for Add Button
    const addOffcanvas = document.getElementById("addOffcanvas") as HTMLElement;
    const newField1 = document.getElementById("newField1") as HTMLInputElement;
    const newField2 = document.getElementById("newField2") as HTMLInputElement;
    const newField3 = document.getElementById("newField3") as HTMLInputElement;
    const confirmAddButton = document.getElementById("confirmAddButton") as HTMLElement;
    const cancelAddButton = document.getElementById("cancelAddButton") as HTMLElement;

    // Function to open the Add Offcanvas
    const openAddOffcanvas = () => {
        addOffcanvas.style.display = 'block';
    };

    const openExportOffCanvas = () => {
        exportoffcanvas.style.display = 'block';
    }

    const closeExportOffCanvas = () => {
        exportoffcanvas.style.display = 'none';
    }

// Function to close the Add Offcanvas
    const closeAddOffcanvas = () => {
        addOffcanvas.style.display = 'none';
        // Clear input fields after closing
        newField1.value = '';
        newField2.value = '';
        newField3.value = '';
    };

// Add event listener for click event on the Add button
    addbutton.addEventListener("click", () => {
        openAddOffcanvas();
    });

    exportbutton.addEventListener("click", () => {
        openExportOffCanvas();
    })

// Add event listener for click event on the Confirm Add button
    confirmAddButton.addEventListener("click", () => {
        // Add logic to handle the new entry
        console.log("Adding new entry");
        getSearchBarValues();
        // You can call your addCompany function or perform any necessary actions
        // Clear input fields after adding
        newField1.value = '';
        newField2.value = '';
        newField3.value = '';
        closeAddOffcanvas();
    });

    downloadbutton.addEventListener("click", () => {
        downloadData();
        closeAddOffcanvas();
    })

// Add event listener for click event on the Cancel Add button
    cancelAddButton.addEventListener("click", () => {
        closeAddOffcanvas();
    });

    searchbar.addEventListener('input', (event) => {
        console.log("search")
        const searchTerm = (event.target as HTMLInputElement).value;
        searchCompanyByName(searchTerm);
    });
}

export const openPopup = (tempopen: string) => {
    console.log(tempopen);
    offcanvasText.value = tempopen;
}

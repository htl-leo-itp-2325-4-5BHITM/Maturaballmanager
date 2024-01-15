import {html} from "lit-html";

export const style = html`
    <style>
        h2 {
            color: blue;
        }
        #addOffcanvas,
        #offcanvas, #exportOffcanvas {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff; /* Solid background color */
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 999; /* Ensure the offcanvas appears above the overlay */
        }

        /* Equivalent styles for Tailwind CSS classes */
        .py-6 {
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
        }

        .px-6 {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }

        .text-center {
            text-align: center;
        }

        .input-field {
            width: calc(33.33% - 1rem);
        }

        /* Added styles for scrollable table */
        .table-container {
            height: 60vh;
            overflow-y: auto;
        }

        #overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
        }

        .offcanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 100%;
            overflow: hidden;
            transition: 0.5s;
            background-color: rgba(0, 0, 0, 0.9); /* Semi-transparent background */
        }

        .offcanvascontent {
            position: fixed;
            width: 80%;
            max-width: 400px;
            height: 100%;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            transform: translateX(-100%);
            transition: 0.5s;
        }

        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 20px;
            cursor: pointer;
        }
    </style>
`
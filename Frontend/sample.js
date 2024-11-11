const params1 = new URLSearchParams(window.location.search); 
const Email1 = params1.get('value'); 
console.log(Email1);


window.displayAllData();

const statusmessage ="Request is Pending";

//Retrive the UserName through Email
function RetriveUserNAme() {

    const data = {
        Email:Email1
    };
    fetch("https://localhost:7035/api/UserLogins/RetriveUserName", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorMessage => {
                throw new Error(errorMessage || "Network response was not ok");
            });
        }
        return response.text();
    })
    .then(message => {
        document.getElementById("UserNAme").innerHTML=message;
    })
    
    .catch(error => {
         alert(error);
         document.getElementById("message").textContent = error;
    });
}


//Save the Work Update in Database
function WorkUpdated() {
    const date = document.getElementById('dateSelect').value;
    const workUpdate = document.getElementById('workUpdate').value;
    const workUpdateLink = document.getElementById('workUpdateLink').value;
    feedbackmessage ="Request is Pending";
    const data = {
        Email:Email1,
        date: date,
        WorkUpdates: workUpdate,
        TaskLinks: workUpdateLink, 
        statusmessage :statusmessage,
        feedbackmessage:feedbackmessage
    };

    console.log(data);
    fetch("https://localhost:7035/api/WorkUpdate/WorkUpdate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorMessage => {
                throw new Error(errorMessage || "Network response was not ok");
            });
        }
        return response.text();
    })
    .then(message => {
        
        displayAllData();
        document.getElementById("dateSelect").value = "";
        document.getElementById("workUpdate").value = "";
        document.getElementById("workUpdateLink").value = "";
        location.reload();
    })
    
    .catch(error => {
         alert(error);
         document.getElementById("message").textContent = error;
    });
}

//Retrive the Data from Database through Email
function displayAllData() {
    fetch(`https://localhost:7035/api/WorkUpdate/${encodeURIComponent(Email1)}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    throw new Error(errorMessage || "Network response was not ok");
                });
            }
            return response.json(); 
        })
        .then(data => { 
            RetriveUserNAme();
            if (Array.isArray(data)) {
                populateTable(data); 
            } else {
                alert("Unexpected data format");
            }
        })
        .catch(error => {
            document.getElementById("dataTable").style.display = "none";
        });
}        

// Update populateTable to handle async responses
async function populateTable(data) {
    const tableBody = document.getElementById("dataTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Clearing the Existing Row

    let serial_number = 1;
    for (const item of data) {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = serial_number++;
        row.appendChild(idCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = item.date;
        row.appendChild(dateCell);

        const workUpdatesCell = document.createElement("td");
        workUpdatesCell.textContent = item.workUpdates;
        row.appendChild(workUpdatesCell);

        const taskLinksCell = document.createElement("td");
        const link = document.createElement("a");
        link.href = item.taskLinks;
        link.textContent = item.taskLinks;
        link.target = "_blank";
        taskLinksCell.appendChild(link);
        row.appendChild(taskLinksCell);

        const editCell = document.createElement("td"); 
        const editButton = document.createElement("button"); 
        editButton.textContent = "Edit"; 
        editButton.onclick = function() {
            edit(item.id, item.date, item.workUpdates, item.taskLinks);
        };
        editButton.setAttribute("data-toggle", "modal");
        editButton.setAttribute("data-target", "#exampleModalCenter");
        editCell.appendChild(editButton);
        row.appendChild(editCell);

        // Create the status cell
        const statusCell = document.createElement("td");
        const statusButton = document.createElement("button");
        statusButton.textContent = "Show";
        statusButton.classList.add("btn", "btn-warning", "btn-sm");

        const popover = document.createElement("div");
        popover.classList.add("popover", "popover-bs", "bg-dark", "text-white", "p-2", "rounded", "shadow-lg");
        popover.style.position = "absolute";
        popover.style.visibility = "hidden";
        popover.style.zIndex = "1000";
        document.body.appendChild(popover);

        statusButton.addEventListener("click", async () => {
            const rect = statusButton.getBoundingClientRect();
            popover.style.left = `${rect.right + 10}px`;
            popover.style.top = `${rect.top}px`;

            // const resmessage ="Request is Pending"
            const resmessage = await AdminValidateResponse(item.id);
            console.log(resmessage)
            popover.textContent = resmessage;
            popover.style.visibility = (popover.style.visibility === "hidden") ? "visible" : "hidden";
        });

        document.addEventListener("click", (event) => {
            if (event.target !== statusButton && event.target !== popover) {
                popover.style.visibility = "hidden";
            }
        });

        statusCell.appendChild(statusButton);
        row.appendChild(statusCell);

        tableBody.appendChild(row);
    }
}

//This Function is used for Edit the Existing Data
function edit(id, date, workUpdate, workUpdateLink) {
    // Populate modal fields with existing values
    document.getElementById("dateSelect").value = date;
    document.getElementById("workUpdate").value = workUpdate;
    document.getElementById("workUpdateLink").value = workUpdateLink;

    // Change the modal action button to "Edit"
    const actionButton = document.getElementById("modalActionButton");
    actionButton.textContent = "Edit";
    actionButton.onclick = function() {
        updateWorkDetails(id); // Call the function to update details
    };

}

// Function to handle saving changes for an existing entry
function updateWorkDetails(id) {


    const date = document.getElementById('dateSelect').value;
    const workUpdate = document.getElementById('workUpdate').value;
    const workUpdateLink = document.getElementById('workUpdateLink').value;
   
    feedbackmessage="Request is Pending"
    const data = {
        Id:id,
        Email:Email1,
        date: date,
        WorkUpdates: workUpdate,
        TaskLinks: workUpdateLink, 
        statusmessage:statusmessage,
        feedbackmessage:feedbackmessage
    };
   

    console.log(data);
    fetch("https://localhost:7035/api/WorkUpdate/ExistingDetailsUpdate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorMessage => {
                throw new Error(errorMessage || "Network response was not ok");
            });
        }
        return response.text();
    })
    .then(message => {
        displayAllData();
        document.getElementById("dateSelect").value = "";
        document.getElementById("workUpdate").value = "";
        document.getElementById("workUpdateLink").value = "";
    })
    
    .catch(error => {
         alert(error);
         document.getElementById("message").textContent = error;
    });
}
    
function AdminValidateResponse(id) {
    const data = {
        Id: id,
        statusmessage: "",
        feedbackmessage: ""
    };

    return fetch("https://localhost:7035/api/WorkUpdate/AdminValidateResponse", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorMessage => {
                throw new Error(errorMessage || "Network response was not ok");
            });
        }
        return response.text();
    })
    .catch(error => {
        console.error(error);
        return "Error occurred";
    });
}
window.displayAllData();
window.displayAllUserName();
const statusmessage = "Request is Pending"
document.getElementById('toggleTableButton').onclick = function() {
    var table = document.getElementById('dataTable');
    if (table.style.display === 'none') {
        table.style.display = 'block'; // Show the table
    } else {
        table.style.display = 'none'; // Hide the table
    }
};

// Retrieve the UserName through Email
async function RetriveUserNAme(Email1) {
    const data = { Email: Email1 };
    
    try {
        const response = await fetch("https://localhost:7035/api/Admin/RetriveUserName", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const message = await response.text();
        return message; // Return the username
    } catch (error) {
        alert(error);
        document.getElementById("message").textContent = error;
        return ""; // Return empty string in case of error
    }
}

//Retrive all Data from Database 
async function displayAllData() {
    try {
        const response = await fetch(`https://localhost:7035/api/Admin`);
        
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || "Network response was not ok");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            // console.log(data)
            populateTable(data); 
        } else {
            alert("Unexpected data format");
        }
    } catch (error) {
        alert(error);
    }
}

// PopulateTable() Function store the retrive datas in Table Format 
async function populateTable(data) {
    const tableBody = document.getElementById("dataTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    let serial_number = 1;

    for (let item of data) 
    {
        
        console.log(item)
        const unqiuevalue = item.id;
        const emailres = item.email;
        const workstatusres = item.workUpdates;
        const taskLinksres = item.taskLinks;
        const dateres = item.date;
        var feedbackmessage= item.feedbackmessage;
        var responsemessage =item.statusmessage;
        


 //serial Number
        const row = document.createElement("tr");
        var idCell = document.createElement("td");
        idCell.textContent = serial_number;
        serial_number = serial_number + 1;
        row.appendChild(idCell);

// Create username column
        const name = document.createElement("td");
        const email_Id = item.email;
        const username = await RetriveUserNAme(email_Id); 
        name.textContent = username;
        row.appendChild(name);

 // Create date column
         const date = document.createElement("td");
        date.textContent = item.date;
        row.appendChild(date);

// Create work updates column
        const workUpdates = document.createElement("td");
        workUpdates.textContent = item.workUpdates;
        row.appendChild(workUpdates);

 // Create task links column
        const taskLinks = document.createElement("td");
        const link = document.createElement("a");
        link.href = item.taskLinks; 
        link.textContent = item.taskLinks; 
        link.target = "_blank"; 
        taskLinks.appendChild(link);
        row.appendChild(taskLinks); 


 //workstatus dropdown
        const status = document.createElement("td");
        const statusDropdown = document.createElement("select");
        statusDropdown.classList.add("form-select", "form-select-sm");
        statusDropdown.style.border = "none";
        
        // Define the options for the dropdown
        const options = [
            { value: "Pending", text: "Pending", class: "btn-warning" },
            { value: "Success", text: "Success", class: "btn-success" },
            { value: "Rejected", text: "Rejected", class: "btn-danger" },
        ];
        
        // Populate the dropdown with options
        options.forEach(optionData => {
            const option = document.createElement("option");
            option.value = optionData.value;
            option.textContent = optionData.text;
            option.classList.add(optionData.class);
            if (optionData.value === responsemessage) {
                option.selected = true; 
            }
            statusDropdown.appendChild(option);
        });
        
        // statusDropdown.className = "form-select form-select-sm " + options.find(o => o.value === "Pending").class;
        const feedbackBox = document.createElement("div");
        feedbackBox.classList.add("feedback-box", "bg-light", "p-3", "rounded", "shadow-lg");
        feedbackBox.style.position = "absolute";
        feedbackBox.style.visibility = "hidden";
        feedbackBox.style.zIndex = "950"; 
        feedbackBox.style.width = "150px"; 
        feedbackBox.style.maxWidth = "50%"; 
        
        // Add a heading for the feedback box
        const feedbackTitle = document.createElement("h6");
        feedbackTitle.textContent = "Feedback";
        feedbackBox.appendChild(feedbackTitle);
        
        // Add an input for feedback inside the box
        const feedbackInput = document.createElement("textarea");
        feedbackInput.placeholder = "Write your feedback here...";
        feedbackInput.classList.add("form-control", "mb-2");
        feedbackInput.style.height = "100px"; 
        feedbackBox.appendChild(feedbackInput);
        
        // Create the "OK" button to close the box
        const okButton = document.createElement("button");
        okButton.textContent = "OK";
        okButton.classList.add("btn", "btn-primary", "btn-sm");
        feedbackBox.appendChild(okButton);
        
       
        const showFeedbackBox = () => {
            const rect = statusDropdown.getBoundingClientRect();
            feedbackBox.style.left = `${rect.right + 10}px`; 
            feedbackBox.style.top = `${rect.top}px`;
            feedbackBox.style.visibility = "visible"; 
        };
        
        const hideFeedbackBox = () => {
            feedbackBox.style.visibility = "hidden"; 
        };
        
        //feedback textarea selected 
        okButton.addEventListener("click", () => {
            const feedback = feedbackInput.value; 
            feedbackmessage = "Rejected : "  + feedback;
            updateResponseMessage(responsemessage,feedbackmessage, unqiuevalue,emailres,workstatusres,taskLinksres,dateres);
            hideFeedbackBox(); 
        });
        
        //dropdown box change
        statusDropdown.addEventListener("change", () => {
            //statusDropdown.classList.remove("btn-warning", "btn-success", "btn-danger");
            responsemessage =statusDropdown.value;
            const selectedOption = options.find(o => o.value === statusDropdown.value);
            statusDropdown.classList.add(selectedOption.class);
        
            
            if (statusDropdown.value === "Rejected") 
            {
                document.body.appendChild(feedbackBox);  
                showFeedbackBox();  
            } else {
                hideFeedbackBox();  
            }

            if(statusDropdown.value === "Success"){
                feedbackmessage = "Approved";
                updateResponseMessage(responsemessage,feedbackmessage, unqiuevalue,emailres,workstatusres,taskLinksres,dateres);
                statusDropdown.classList("btn-success");
            }
            else if(statusDropdown.value === "Pending"){
                feedbackmessage = "Request is Pending";
                updateResponseMessage(responsemessage,feedbackmessage, unqiuevalue,emailres,workstatusres,taskLinksres,dateres);
                statusDropdown.classList("btn-warning");
            }
          
        });
    

        // Append the dropdown to the status cell
        status.appendChild(statusDropdown);
        
        // Append the status cell to the row
        row.appendChild(status);
        
        // Append the row to the table body
        tableBody.appendChild(row);
        
    }
}


function updateResponseMessage(responsemessage,feedbackmessage, unqiuevalue,emailres,workstatusres,taskLinksres,dateres) {        

        const data = {
            Id:unqiuevalue,
            Email:emailres,
            date:dateres,
            WorkUpdates:workstatusres,
            TaskLinks:taskLinksres,
            statusmessage:responsemessage,
            feedbackmessage: feedbackmessage 
        };
        console.log(data);
    
        fetch("https://localhost:7035/api/Admin/updateResponseMessage", {
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
        })
        
        .catch(error => {
           
        });
    

}

// Retrieve the Data from Database through Email
async function displayAllUserName() {
    try {
        const response = await fetch(`https://localhost:7035/api/Admin/ListOfUserNames`);
        
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || "Network response was not ok");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            ListUserName(data); 
        } else {
            alert("Unexpected data format");
        }
    } catch (error) {
        alert(error);
    }
}


 async function ListUserName(data) {
    const listbody = document.getElementById("EmployeeName");
    listbody.className = "dropdown-menu";

   
    for (let item of data) {
        const listelement = document.createElement("li");
        listelement.textContent = item;
        listelement.style.cursor = 'pointer';

      
        listelement.onclick = function() {
            handleListItemClick(item); 
        };

        listbody.appendChild(listelement);
    }
}

async function handleListItemClick(itemValue) {
    document.getElementById("user1").innerHTML = itemValue;user1
    var table = document.getElementById('dataTable1');
    if (table.style.display === 'none') {
        table.style.display = 'block'; // Show the table
     }
    var email = await RetriveEmailthroughUserName(itemValue);
    console.log(email);
    displayAllDatabasedEmail(email);

}
 
 //Retrieve the UserName through Email
async function RetriveEmailthroughUserName(value) {
    const data = { UserName: value };
    
    try {
        const response = await fetch("https://localhost:7035/api/Admin/RetriveEmailthroughUserName", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const message = await response.text();
        var emailID = message;
        return emailID; // Return the username
    } catch (error) {
        alert(error);
        document.getElementById("message").textContent = error;
        return ""; // Return empty string in case of error
    }
}


 //Retrive the Data from Database through Email
function displayAllDatabasedEmail(Email1) {
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
            console.log(data);
            if (Array.isArray(data)) {
                populateTablebasedEmail(data); 
            } else {
                alert("Unexpected data format");
            }
        })
        .catch(error => {
            document.getElementById("dataTable").style.display = "none";
        });
}  


// PopulateTable() Function store the retrive datas in Table Format 
async function populateTablebasedEmail(data) {
    const tableBody = document.getElementById("dataTable1").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    let serial_number = 1;

    for (let item of data) 
    {
        
        console.log(item)
        const unqiuevalue = item.id;
        const emailres = item.email;
        const workstatusres = item.workUpdates;
        const taskLinksres = item.taskLinks;
        const dateres = item.date;
        var feedbackmessage= item.feedbackmessage;
        var responsemessage =item.statusmessage;


 //serial Number
        const row = document.createElement("tr");
        var idCell = document.createElement("td");
        idCell.textContent = serial_number;
        serial_number = serial_number + 1;
        row.appendChild(idCell);


 // Create date column
         const date = document.createElement("td");
        date.textContent = item.date;
        row.appendChild(date);

// Create work updates column
        const workUpdates = document.createElement("td");
        workUpdates.textContent = item.workUpdates;
        row.appendChild(workUpdates);

 // Create task links column
        const taskLinks = document.createElement("td");
        const link = document.createElement("a");
        link.href = item.taskLinks; 
        link.textContent = item.taskLinks; 
        link.target = "_blank"; 
        taskLinks.appendChild(link);
        row.appendChild(taskLinks); 


 //workstatus dropdown
        const status = document.createElement("td");
        const statusDropdown = document.createElement("select");
        statusDropdown.classList.add("form-select", "form-select-sm");
        statusDropdown.style.border = "none";
        
        // Define the options for the dropdown
        const options = [
            { value: "Pending", text: "Pending", class: "btn-warning" },
            { value: "Success", text: "Success", class: "btn-success" },
            { value: "Rejected", text: "Rejected", class: "btn-danger" },
        ];
        
        // Populate the dropdown with options
        options.forEach(optionData => {
            const option = document.createElement("option");
            option.value = optionData.value;
            option.textContent = optionData.text;
            option.classList.add(optionData.class);
            if (optionData.value === responsemessage) {
                option.selected = true; 
            }
            statusDropdown.appendChild(option);
        });
        
        // statusDropdown.className = "form-select form-select-sm " + options.find(o => o.value === "Pending").class;
        const feedbackBox = document.createElement("div");
        feedbackBox.classList.add("feedback-box", "bg-light", "p-3", "rounded", "shadow-lg");
        feedbackBox.style.position = "absolute";
        feedbackBox.style.visibility = "hidden";
        feedbackBox.style.zIndex = "950"; 
        feedbackBox.style.width = "150px"; 
        feedbackBox.style.maxWidth = "50%"; 
        
        // Add a heading for the feedback box
        const feedbackTitle = document.createElement("h6");
        feedbackTitle.textContent = "Feedback";
        feedbackBox.appendChild(feedbackTitle);
        
        // Add an input for feedback inside the box
        const feedbackInput = document.createElement("textarea");
        feedbackInput.placeholder = "Write your feedback here...";
        feedbackInput.classList.add("form-control", "mb-2");
        feedbackInput.style.height = "100px"; 
        feedbackBox.appendChild(feedbackInput);
        
        // Create the "OK" button to close the box
        const okButton = document.createElement("button");
        okButton.textContent = "OK";
        okButton.classList.add("btn", "btn-primary", "btn-sm");
        feedbackBox.appendChild(okButton);
        
       
        const showFeedbackBox = () => {
            const rect = statusDropdown.getBoundingClientRect();
            feedbackBox.style.left = `${rect.right + 10}px`; 
            feedbackBox.style.top = `${rect.top}px`;
            feedbackBox.style.visibility = "visible"; 
        };
        
        const hideFeedbackBox = () => {
            feedbackBox.style.visibility = "hidden"; 
        };
        
        // var responsemessage ="";
        // var feedbackmessage = "";

        //feedback textarea selected 
        okButton.addEventListener("click", () => {
            const feedback = feedbackInput.value; 
            feedbackmessage = feedback;
            console.log(responsemessage);
            console.log(feedbackmessage);
             updateResponseMessage(responsemessage,feedbackmessage, unqiuevalue,emailres,workstatusres,taskLinksres,dateres);
             
            hideFeedbackBox(); 
        });
        
        //dropdown box change
        statusDropdown.addEventListener("change", () => {
            statusDropdown.classList.remove("btn-warning", "btn-success", "btn-danger");
            responsemessage =statusDropdown.value;
            const selectedOption = options.find(o => o.value === statusDropdown.value);
            statusDropdown.classList.add(selectedOption.class);
        
            
            if (statusDropdown.value === "Rejected") 
            {
                document.body.appendChild(feedbackBox);  
                showFeedbackBox();  
            } else {
                hideFeedbackBox();  
            }

            if(statusDropdown.value === "Success"){
                feedbackmessage = "";
                updateResponseMessage(responsemessage,feedbackmessage, unqiuevalue,emailres,workstatusres,taskLinksres,dateres);
            }
            else if(statusDropdown.value === "Pending"){
                console.log(responsemessage);
                console.log(feedbackmessage);
                feedbackmessage = "";
                updateResponseMessage(responsemessage,feedbackmessage, unqiuevalue,emailres,workstatusres,taskLinksres,dateres);
            }
          
        });
    

        // Append the dropdown to the status cell
        status.appendChild(statusDropdown);
        
        // Append the status cell to the row
        row.appendChild(status);
        
        // Append the row to the table body
        tableBody.appendChild(row);
        
    }
}

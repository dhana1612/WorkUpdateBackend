
function Register(event) {
    const username = document.getElementById('username').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    // Data to be sent to the backend
    const data = {
        username: username,
        phoneNumber: phoneNumber,
        email: email,
        password: password,
        confirmPassword:confirmPassword
    };

    console.log(data)

    fetch("https://localhost:7035/api/UserLogins", {
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
        // Display the backend response message
        alert(message);
        document.getElementById("message").textContent = message;
        document.getElementById("form").reset();  

        window.location.href = "Login.html";
       
    })
    
    .catch(error => {
         alert(error);
         document.getElementById("message").textContent = error;
    });
    
}

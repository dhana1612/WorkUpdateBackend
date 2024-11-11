function ForgetPsd() {
    const email = document.getElementById('email').value;

    const data = {
        Email: email,
    };

    console.log(data);
    fetch("https://localhost:7035/api/UserLogins/EmailCheck", {
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
        document.getElementById("form").reset();  
        window.location.href = `UpdatePsd.html?value=${encodeURIComponent(email)}`;
       
    })
    
    .catch(error => {
         document.getElementById("message").textContent = error;
    });

}
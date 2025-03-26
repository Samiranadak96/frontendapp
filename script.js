function toggleOtherSkillInput(checkbox) {
    const otherSkillInput = document.getElementById('other_skill_input');
    if (checkbox.checked) {
        otherSkillInput.style.display = 'block';
    } else {
        otherSkillInput.style.display = 'none';
        otherSkillInput.value = ''; 
    }
}

function validateForm(event) {
    event.preventDefault();
    let isValid = true;

    document.getElementById('name_error').innerHTML = "";
    document.getElementById('email_error').innerHTML = "";
    document.getElementById('phone_error').innerHTML = "";
    document.getElementById('gender_error').innerHTML = "";
    document.getElementById('department_error').innerHTML = "";
    document.getElementById('skill_error').innerHTML = "";

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const country_code = document.getElementById('country_code').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked');
    const department = document.getElementById('department').value;
    const id = document.getElementById('employee_id').value;

    const skills = [];
    document.querySelectorAll('input[type="checkbox"][name="skill"]:checked').forEach((checkbox) => {
        if (checkbox.value === "Other") {
            const otherSkill = document.getElementById('other_skill_input').value.trim();
            if (otherSkill === "") {
                document.getElementById('skill_error').innerHTML = "Please enter your skill for 'Other'.";
                isValid = false;
            } else {
                skills.push(otherSkill);
            }
        } else {
            skills.push(checkbox.value);
        }
    });

    if (name === "") {
        document.getElementById('name_error').innerHTML = "Please enter your name.";
        isValid = false;
    }

    if (email === "") {
        document.getElementById('email_error').innerHTML = "Please enter your email.";
        isValid = false;
    } else {
        const atIndex = email.indexOf("@");
        const dotIndex = email.lastIndexOf(".");
        if (atIndex < 1 || atIndex === email.length - 1) {
            document.getElementById('email_error').innerHTML = "Please enter a valid email.";
            isValid = false;
        } else if (dotIndex < atIndex + 2 || dotIndex === email.length - 1) {
            document.getElementById('email_error').innerHTML = "Please enter a valid email.";
            isValid = false;
        }
    }

    if (phone === "") {
        document.getElementById('phone_error').innerHTML = "Please enter your phone number.";
        isValid = false;
    } else if (phone.length !== 10) {
        document.getElementById('phone_error').innerHTML = "Please enter a valid phone number with exactly 10 digits.";
        isValid = false;
    } else {
        let isNumeric = true;
        for (let i = 0; i < phone.length; i++) {
            if (phone[i] < '0' || phone[i] > '9') {
                isNumeric = false;
                break;
            }
        }
        if (!isNumeric) {
            document.getElementById('phone_error').innerHTML = "Please enter a valid phone number with numeric characters only.";
            isValid = false;
        }
    }

    if (!gender) {
        document.getElementById('gender_error').innerHTML = "Please select your gender.";
        isValid = false;
    }

    if (department === "" || department === null) {
        document.getElementById('department_error').innerHTML = "Please select a department.";
        isValid = false;
    }

    if (skills.length === 0) {
        document.getElementById('skill_error').innerHTML = "Please select at least one skill.";
        isValid = false;
    }

    if (isValid) {
        const employeeData = {
            id: id,
            name: name,
            email: email,
            phone: country_code + phone,
            gender: gender.value,
            department: department,
            skills: skills.join(", ")
        };

        fetch("https://employeeapiupdated-grd3d5fjfabadgfk.canadacentral-01.azurewebsites.net/Employee/UpsertEmployee", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employeeData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to save employee data.");
            }
        })
        .then(data => {
            displaySuccessMessage();
            // addDataToTable(id, name, email, country_code, phone, gender.value, department, skills);
            //const table = document.getElementById("data_table");
            //table.style.display = "table";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while saving employee data.");
        });
    }
}

function displaySuccessMessage() {
    const successMessage = document.getElementById('success_message');
    successMessage.style.display = 'block';
    successMessage.innerHTML = "Employee data saved successfully!";
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

function addDataToTable(id, name, email, country_code, phone, gender, department, skills) {
    const tableBody = document.querySelector('#data_table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${email}</td>
        <td>${country_code + phone}</td>
        <td>${gender}</td>
        <td>${department}</td>
        <td>${skills.join(", ")}</td>
    `;
    tableBody.appendChild(newRow);
}

function showTable() {
    fetch("https://employeeapiupdated-grd3d5fjfabadgfk.canadacentral-01.azurewebsites.net/Employee/GetEmployees", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to fetch employee data.");
        }
    })
    .then(data => {
        const table = document.getElementById("data_table");
        const tableBody = table.querySelector("tbody");

        // Clear existing rows in the table body
        tableBody.innerHTML = "";

        // Populate the table with data
        data.forEach(employee => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.phone}</td>
                <td>${employee.gender}</td>
                <td>${employee.department}</td>
                <td>${employee.skills}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteRow(${employee.id}, this)">Delete</button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });

        // Make the table visible
        table.style.display = "table";
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while fetching employee data.");
    });
}

function deleteRow(employeeId, button) {
    if (confirm("Are you sure you want to delete this employee?")) {
        fetch(`https://employeeapiupdated-grd3d5fjfabadgfk.canadacentral-01.azurewebsites.net/Employee/DeleteEmployee/${employeeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                // Remove the row from the table
                const row = button.closest("tr");
                row.remove();
                alert("Employee deleted successfully.");
            } else {
                throw new Error("Failed to delete employee.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while deleting the employee.");
        });
    }
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login_email').value.trim();
    const password = document.getElementById('login_password').value.trim();

    const loginData = {
        email: email,
        password: password
    };

    fetch("https://your-api-endpoint.com/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Login failed. Please check your credentials.");
        }
    })
    .then(data => {
        alert("Login successful!");
        // Redirect to another page (e.g., dashboard)
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred during login.");
    });
}

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('register_name').value.trim();
    const email = document.getElementById('register_email').value.trim();
    const password = document.getElementById('register_password').value.trim();

    const registerData = {
        name: name,
        email: email,
        password: password
    };

    fetch("https://your-api-endpoint.com/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Registration failed. Please try again.");
        }
    })
    .then(data => {
        alert("Registration successful! You can now log in.");
        // Optionally clear the form
        document.getElementById('registerForm').reset();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred during registration.");
    });
}
/* ==================================================
   OASIS INFOBYTE
   Task 4 - Login Authentication System
   Front-end Authentication Demo
================================================== */


/* =========================
   STORAGE KEYS
========================= */

const USERS_KEY = "secureSpaceUsers";

const SESSION_KEY = "secureSpaceSession";


/* =========================
   GET USERS
========================= */

function getUsers() {

    const storedUsers =
        localStorage.getItem(USERS_KEY);


    if (!storedUsers) {

        return [];

    }


    try {

        return JSON.parse(storedUsers);

    } catch (error) {

        return [];

    }

}


/* =========================
   SAVE USERS
========================= */

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


/* =========================
   SHA-256 HASH
========================= */

async function hashPassword(password) {

    const encoder =
        new TextEncoder();


    const data =
        encoder.encode(password);


    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );


    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );


    return hashArray
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");

}


/* =========================
   EMAIL VALIDATION
========================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================
   PASSWORD VALIDATION
========================= */

function isValidPassword(password) {

    /*
       Minimum 8 characters
       At least one number
    */

    return (
        password.length >= 8 &&
        /\d/.test(password)
    );

}


/* =========================
   SHOW ERROR
========================= */

function showError(element, message) {

    element.textContent =
        message;

    element.style.display =
        "block";

}


/* =========================
   HIDE ERROR
========================= */

function hideMessage(element) {

    element.textContent =
        "";

    element.style.display =
        "none";

}


/* =========================
   REGISTRATION
========================= */

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const username =
                document
                    .getElementById(
                        "registerUsername"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            const errorElement =
                document.getElementById(
                    "registerError"
                );


            const successElement =
                document.getElementById(
                    "registerSuccess"
                );


            hideMessage(
                errorElement
            );

            hideMessage(
                successElement
            );


            /* EMPTY VALIDATION */

            if (
                username === "" ||
                email === "" ||
                password === ""
            ) {

                showError(
                    errorElement,
                    "Please fill in all fields."
                );

                return;

            }


            /* USERNAME VALIDATION */

            if (username.length < 3) {

                showError(
                    errorElement,
                    "Username must contain at least 3 characters."
                );

                return;

            }


            /* EMAIL VALIDATION */

            if (!isValidEmail(email)) {

                showError(
                    errorElement,
                    "Please enter a valid email address."
                );

                return;

            }


            /* PASSWORD VALIDATION */

            if (!isValidPassword(password)) {

                showError(
                    errorElement,
                    "Password must be at least 8 characters and contain at least 1 number."
                );

                return;

            }


            /* GET EXISTING USERS */

            const users =
                getUsers();


            /* DUPLICATE CHECK */

            const duplicateUser =
                users.some(
                    user =>
                        user.username.toLowerCase()
                            === username.toLowerCase()
                        ||
                        user.email
                            === email
                );


            if (duplicateUser) {

                showError(
                    errorElement,
                    "An account with this username or email already exists."
                );

                return;

            }


            /* HASH PASSWORD */

            const hashedPassword =
                await hashPassword(
                    password
                );


            /* CREATE USER */

            const newUser = {

                username:
                    username,

                email:
                    email,

                passwordHash:
                    hashedPassword,

                createdAt:
                    new Date().toISOString()

            };


            users.push(
                newUser
            );


            saveUsers(
                users
            );


            /* SUCCESS */

            successElement.textContent =
                "Registration successful! Redirecting to login...";

            successElement.style.display =
                "block";


            registerForm.reset();


            setTimeout(
                function() {

                    window.location.href =
                        "index.html";

                },
                1200
            );

        }
    );

}


/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const loginUser =
                document
                    .getElementById(
                        "loginUser"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            const errorElement =
                document.getElementById(
                    "loginError"
                );


            hideMessage(
                errorElement
            );


            /* EMPTY VALIDATION */

            if (
                loginUser === "" ||
                password === ""
            ) {

                showError(
                    errorElement,
                    "Please enter your username/email and password."
                );

                return;

            }


            /* GET USERS */

            const users =
                getUsers();


            /*
               Search username OR email.
            */

            const user =
                users.find(
                    item =>
                        item.username.toLowerCase()
                            === loginUser.toLowerCase()
                        ||
                        item.email
                            === loginUser.toLowerCase()
                );


            /*
               Always show the same message
               for incorrect credentials.
            */

            if (!user) {

                showError(
                    errorElement,
                    "Invalid username/email or password."
                );

                return;

            }


            /* HASH ENTERED PASSWORD */

            const enteredHash =
                await hashPassword(
                    password
                );


            /* COMPARE HASHES */

            if (
                enteredHash
                !== user.passwordHash
            ) {

                showError(
                    errorElement,
                    "Invalid username/email or password."
                );

                return;

            }


            /* CREATE SESSION */

            const session = {

                username:
                    user.username,

                email:
                    user.email,

                loginTime:
                    new Date().toISOString()

            };


            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(session)
            );


            /* REDIRECT */

            window.location.href =
                "dashboard.html";

        }
    );

}


/* =========================
   PROTECTED DASHBOARD
========================= */

const dashboardUsername =
    document.getElementById(
        "dashboardUsername"
    );


if (dashboardUsername) {

    const session =
        getSession();


    /*
       If no session exists,
       redirect to login.
    */

    if (!session) {

        window.location.href =
            "index.html";

    } else {

        dashboardUsername.textContent =
            session.username;

    }

}


/* =========================
   GET SESSION
========================= */

function getSession() {

    const sessionData =
        localStorage.getItem(
            SESSION_KEY
        );


    if (!sessionData) {

        return null;

    }


    try {

        return JSON.parse(
            sessionData
        );

    } catch (error) {

        return null;

    }

}


/* =========================
   LOGOUT
========================= */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                SESSION_KEY
            );


            window.location.href =
                "index.html";

        }
    );

}
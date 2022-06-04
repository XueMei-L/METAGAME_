import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref , onValue, child, set, update, get, push } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js'; 
import * as firebaseAuth from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8C7FZP3oD1cAtjEt_GNi0SqyDRqtO1ps",
  authDomain: "metagame-9b42d.firebaseapp.com",
  databaseURL: "https://metagame-9b42d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "metagame-9b42d",
  storageBucket: "metagame-9b42d.appspot.com",
  messagingSenderId: "77098664441",
  appId: "1:77098664441:web:fc5001254ba7f8eeffbd28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Set up our register function
export async function register () {
  let email = $("#email").val()
  let password = $("#password").val()
  let repeatPassword = $("#re-password").val()
  let username = $("#username").val()
  let dni = $("#dni").val()
  let birthdate = $("#birthdate").val()

  if (validate_email(email) == false) {
    alert('El campo correo no tiene un correo valido')
    return
  }
  if (validate_field(username) == false) {
    alert('Se tiene que introducir un usuario')
    return
  }
  if (validate_field(birthdate) == false) {
    alert('Se tiene que introducir la fecha de nacimiento')
    return
  }
  if (validate_dni(dni) == false) {
    alert('Se tiene que introducir un DNI valido (12345678A)')
    return
  }
  if (validate_password(password) == false) {
    alert('Contraseña invalida, debe tener longitud mayor de 6')
    return
  }
  if (validate_repeatPassword(password, repeatPassword) == false) {
    alert('Las contraseñas no coinciden')
    return
  }
  let database_ref = getDatabase();
  const auth = firebaseAuth.getAuth();
  await firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
  .then(async function() {
    let user = auth.currentUser
    let discount = 0;
    let biography = '';
    let payment_method = {
      method : 'none',
      accountNumber: ''
    }
    let user_data = {
      email : email,
      username : username,
      discount: discount,
      dni : dni,
      birthdate: birthdate,
      payment_method : payment_method,
      bio : biography,
      last_login : Date.now()
    }
    await set(ref(database_ref, 'users/' + user.uid),user_data);

    if(!alert('Usuario creado correctamente, se le redirigira al inicio de sesion')) {
      location.href = "/METAGAME V 5.0.0 Wai-Aria/login.html"
    }
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_message = error.message

    alert(error_message)
  })
}

// Set up our login function
export async function login () {
  // Initialize variables
  const auth = firebaseAuth.getAuth();
  // Get all our input fields
  let email = $("#email").val()
  let password = $("#password").val()


  await firebaseAuth.signInWithEmailAndPassword(auth, email, password)
  .then(async function(userCredential) {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = getDatabase();

    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    // Push to Firebase Database
    await set(ref(database_ref, 'users/' + user.uid + '/last_login'),user_data)

    // Done
    if(!alert('Inicio de sesion correcto')) {
      location.href = "/METAGAME V 5.0.0 Wai-Aria/index.html"
    }

  })
  .catch(function(error) {
    var error_message = error.message

    alert(error_message)
  })
}




// Validate Functions
function validate_email(email) {
  if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    return true
  } else {
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_repeatPassword(password, repeatpassword) {
  // Firebase only accepts lengths greater than 6
  if (password !== repeatpassword) {
    return false
  } else {
    return true
  }
}

function validate_dni(dni) {
  let nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  if (!(dni.match(nifRegex))) {
    return false
  } else {
    return true
  }
} 


function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
} 
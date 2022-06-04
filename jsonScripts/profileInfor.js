import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref , onValue, child, set, update, get, push } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js'; 
import * as firebaseAuth from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

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

export function showProfileData() {
    const currentDB = ref(getDatabase());
    const auth = firebaseAuth.getAuth();
    auth.onAuthStateChanged(function(user) {
    if (user) {
        get(child(currentDB, `users/${user.uid}`)).then((snapshot) => {
            // let dbUsername = snapshot.val();
            let dbUsername = snapshot.val();
            $("#database-username").html(dbUsername.username);
            $("#database-dni").html(dbUsername.dni);
            $("#database-email").html(dbUsername.email);
            $("#database-username").html(dbUsername.account);
            $("#database-birthdate").html(dbUsername.birthdate);
            $("#database-bio").html(dbUsername.bio);
            const pfpTag = document.getElementById('pfp');
            if (dbUsername.pfp === undefined) {
              pfpTag.src='./img/nopfp.png'
            } else {
              pfpTag.src=dbUsername.pfp
            }
            if (dbUsername.product_history !== undefined){
              //console.log(dbUsername.product_history)
              loadUserProductHistory(dbUsername.product_history);
            } else {
              $("#products-history").html('<p>El usuario no ha comprado ningun producto</p>');
            }
        }).catch((error) => {
            // $("#database-username").text('Get User data failed.');
        });
    } else {
    }
  });
}

export function isUserLogged() {
    const app = initializeApp(firebaseConfig);
    // Initialize variables
    const auth = firebaseAuth.getAuth();
    auth.onAuthStateChanged(function(user) {
    if (user) {
        location.href = "/METAGAME_/profile.html"
    } else {
        location.href = "/METAGAME_/login.html"
    }
  });
}

export function getLoginStatusToProfile() {
    // Initialize variables
    const auth = firebaseAuth.getAuth();
    auth.onAuthStateChanged(function(user) {
    if (user) {
      location.href = "/METAGAME_/profile.html"
    } else {
      alert('No hay usuario conectado, inicie sesion primero');
    }
  });
}

export function signOutProfile() {
    const auth = firebaseAuth.getAuth();
    auth.signOut(auth).then(() => {
     if (!alert('Se ha cerrado la sesion')) {
      location.href= "/METAGAME_/login.html"
     }
    }).catch((error) => {
    // An error happened.
    });
}

export function showType(fileInput) {
  const files = fileInput.files;

  for (let i = 0; i < files.length; i++) {
    const name = files[i].name;
    //console.log(files[i])
    const type = files[i].type;
    alert("Filename: " + name + " , Type: " + type);
  }
}

export async function loadPFP() {
  const file = document.getElementById('pfpImageUpload').files[0];
  if (file.type !== "image/jpeg") {
    if(!alert('El fichero introducido no se trata de un jpeg')){
      return
    }
  }
  const reader = new FileReader();
  let imgDimensions =  await checkPFPDimensions(file);
  if (imgDimensions.width > 250 || imgDimensions.height > 250) {
    if(!alert('La imagen tiene un tamaño superior a 250x250, vuelve a intentarlo')) {
      return
    }
  }
  reader.readAsDataURL(file)
  reader.onload = function() {
    let imgBase64 = reader.result
    const auth = firebaseAuth.getAuth();  
    var database_ref = getDatabase();
    auth.onAuthStateChanged(function(user) {
      if (user) {
        get(child(ref(database_ref), `users/${user.uid}/pfp`)).then((snapshot) => {
          //console.log(snapshot.val())
          
          let pfp = imgBase64;
          // Push to Firebase Database
          set(ref(database_ref, 'users/' + user.uid + '/pfp'),pfp)
          if(!alert('Imagen subida, se recargara la página')){
            location.reload(); 
          }
          //console.log(current_cart)
        }).catch((error) => {
        });
      } else {
        alert('No hay usuario conectado, inicie sesion primero');
      }
    });
  }
}


async function checkPFPDimensions(file) {
  return new Promise((resolve, reject) =>  {
    try {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        const img = new Image()

        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }

        img.src = fileReader.result
      }

      fileReader.readAsDataURL(file)
    } catch (e) {
      reject(e)
    }
  });
}

export function isUserLoggedProfileButton() {
  const currentDB = ref(getDatabase());
  const auth = firebaseAuth.getAuth();
  auth.onAuthStateChanged(function(user) {
  if (user) {
    get(child(currentDB, `users/${user.uid}`)).then((snapshot) => {
      let dbUsername = snapshot.val();
      if (dbUsername.pfp !== undefined) {
        $("#profileButton").html(`<img style="margin-top:8px" height="20px" width="20px" src = ${dbUsername.pfp} alt="foto de perfil de usuario"></img>`);
      }
    });
  } else {
     
  }
});
}


function loadUserProductHistory(product_history) {
  let tableTitle = '<table class=\'centered\' highlight> <thead> <tr> <th>Nº</th> <th>Producto</th> <th>Precio</th> </tr> </thead> <tbody> ';
  let numOfProduct = 1;
  product_history.forEach((item) => {
    if (item.price !== 'Gratis') {
      tableTitle += '<tr> <td>' + numOfProduct  + '</td> <td>' + item.product + '</td> <td>' +  ` ${item.price}` + ' €' + '</td></tr>'
    } else {
      tableTitle += '<tr> <td>' + numOfProduct  + '</td> <td>' + item.product + '</td> <td>' +  ` ${item.price}` + '</td></tr>'
    }
    numOfProduct++;
  });
  tableTitle += '</tbody> </table>';
  $("#products-history").html('<h2 style="margin-left:10px">Tu historial de compras</h2>' +tableTitle);

}

export function userUpdateProfile() {
  let biography = $("#biography").val();
  let username = $("#username").val();
  let birthdate = $("#birthdate").val();
  var database_ref = getDatabase();
  const auth = firebaseAuth.getAuth(); 
    auth.onAuthStateChanged(function(user) {
      if (user) {
        get(child(ref(database_ref), `users/${user.uid}`)).then(async (snapshot) => {
          //console.log(snapshot.val())
          let userDB = snapshot.val();
          if (biography !== "" && biography !== " ") {
            userDB.bio = biography;
          }
          if (username !== "" && username !== " ") {
            userDB.username = username;
          }
          if (birthdate !== "" && birthdate !== " ") {
            userDB.birthdate = birthdate;
          }
          //console.log(user);
          if (document.getElementById('pfpImageUpload').files[0] !== undefined) {
            await loadPFP();
          }
          // Push to Firebase Database
          await set(ref(database_ref, 'users/' + user.uid),userDB);
          if(!alert('Informacion actualizada, se le redirigira al perfil')){
            location.href = "/METAGAME_/profile.html"; 
          }
          //console.log(current_cart)
        }).catch((error) => {
        });
      } else {
        alert('No hay usuario conectado, inicie sesion primero');
      }
    });
}
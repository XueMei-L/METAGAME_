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

export function getPricesFromDB() {
  const db = getDatabase();
  const productsReference = ref(db, 'products/');
  onValue(productsReference, (snapshot) => {
    $("#ark-price").text(snapshot.val().ARK.price + '€');
    $("#eldenring-price").text(snapshot.val()["Elden Ring"].price + '€');
    $("#gta-price").text(snapshot.val().GTAV.price + '€');
    $("#overcooked-price").text(snapshot.val().Overcooked.price + '€');
    $("#valheim-price").text(snapshot.val().Valheim.price + '€');
    $("#lostark-price").text(snapshot.val()["Lost Ark"].price);
    $("#dyinglight2-price").html('<strike>'+(snapshot.val()["Dying Light 2"].price)+'</strike>' + ' ' + ((snapshot.val()["Dying Light 2"].price)-(snapshot.val()["Dying Light 2"].price)*(snapshot.val()["Dying Light 2"].discount)).toFixed(2).toString() + '€');
    $("#citiesskylines-price").html('<strike>'+(snapshot.val()["Cities Skylines"].price)+'</strike>' + ' ' + ((snapshot.val()["Cities Skylines"].price)-(snapshot.val()["Cities Skylines"].price)*(snapshot.val()["Cities Skylines"].discount)).toFixed(2).toString() + '€');
    $("#stardew-price").html('<strike>'+(snapshot.val()["Stardew Valley"].price)+'</strike>' + ' ' + ((snapshot.val()["Stardew Valley"].price)-(snapshot.val()["Stardew Valley"].price)*(snapshot.val()["Stardew Valley"].discount)).toFixed(2).toString() + '€');
  });
}


export function purgeCartFromDB(user) {
  const currentDB = ref(getDatabase());
  const db = getDatabase();
  get(child(currentDB, `users/${user}/current_cart`)).then((snapshot) => {
    let current_cart = snapshot.val()
    if (current_cart.length < 1) {
      // alert('El carro esta vacio')
      return;
    }
    //console.log(snapshot.val())
    current_cart = []
    
    //console.log(current_cart)
    const updates = {};
    updates['users/' + user + '/current_cart'] = current_cart;
    update(ref(db), updates)
    alert('Se han borrado todos los elementos del carro')
    location.href = '/METAGAME_/shoppingCart.html'
  }).catch((error) => {
  });
}


export function getCartFromDB(user) {
  const currentDB = ref(getDatabase());
  get(child(currentDB, `users/${user}/current_cart`)).then((snapshot) => {
    //console.log(snapshot.val())
    let current_cart = snapshot.val()
    let totalPrice = 0;
    let numOfProduct = 1;
    let tableTitle = '<table class=\'centered\' highlight> <thead> <tr> <th>Nº</th> <th>Product</th> <th>Item Price</th> </tr> </thead> <tbody> ';
    
    current_cart.forEach((item) => {
      if (item.price !== 'Gratis') {
        tableTitle += '<tr> <td>' + numOfProduct  + '</td> <td>' + item.product + '</td> <td>' +  ` ${item.price}` + ' €' + '</td></tr>'
        totalPrice += item.price;
      } else {
        tableTitle += '<tr> <td>' + numOfProduct  + '</td> <td>' + item.product + '</td> <td>' +  ` ${item.price}` + '</td></tr>'
      }
      numOfProduct++;
    });
    tableTitle += '</tbody> </table>';
    $("#cart-Paragraph-Title").html(tableTitle);
    $("#cart-Price").html('Precio Total: '+totalPrice.toFixed(2) + ' €');
  
  }).catch((error) => {
    $("#cart-Paragraph-Title").text('El carro esta vacio');
    // alert('El carro esta vacio')
  });
}



export async function getProductFromDB(name) {
  const db = getDatabase();
  let price = 0;
  const currentDB = ref(getDatabase());
  await get(child(currentDB, 'products/' + name)).then((snapshot) => {
    price = snapshot.val().price;
    if (snapshot.val().discount != null) {
      price = +((price - (price * snapshot.val().discount)).toFixed(2));
    }
  });
  //console.log(price);
  return price;
}

export async function getProductPriceToBuyButton(game) {
  let price = await getProductFromDB(game);
  if (price == "Gratis"){
    $("#buy-button").html('<i class="material-icons left">add_shopping_cart</i>' + price + ' COMPRAR');
  } else {
    $("#buy-button").html('<i class="material-icons left">add_shopping_cart</i>' + price + '€ COMPRAR');
  }
  
}



export function getAllProductsFromDB(searchText, tag = undefined) {
  localStorage.removeItem("searchText");
  localStorage.removeItem("tag");
  const currentDB = ref(getDatabase());
  get(child(currentDB, `products`)).then((snapshot) => {
    //console.log(snapshot.val())
    let numOfProduct = 1;
    let tagsToFilter = [];
    let index = 1;
    if (tag != undefined) {
      tagsToFilter.push(tag);
    } else {
      while ($(`#check${index}`).val() != undefined) {
        if ($(`#check${index}`)[0].checked == true) {
          tagsToFilter.push($(`#check${index}`).val());
        }
        index++;
      }
    }
    let productsNames = Object.keys(snapshot.val());
    let products = snapshot.val();
    let tableTitle = `<h1 id ="searchResultTitle" class="center" style="font-size:2em;color: white;">Resultados de la busqueda</h1>` + '<table class=\'centered\' highlight> <thead> <tr> <th style="color: white;">Product</th> <th style="color: white;">Item Price</th> </tr> </thead> <tbody> ';
    for (let i = 0; i < productsNames.length; i++) {
      if (productsNames[i].toLowerCase().includes(searchText.toLowerCase())) {
        if (tagsToFilter.length > 0) {
          if(tagsToFilter.every(ai => products[`${productsNames[i]}`].tags.includes(ai))) {
            tableTitle += `<tr> <td> <a href="${snapshot.val()[productsNames[i]].page}">` + productsNames[i] + '</a> </td> <td style="color: white;">' +  ` ${snapshot.val()[productsNames[i]].price}` + ' €' + '</td></tr>'
            //wholeString += '<p class="flow-text">' + numOfProduct + ' | '   + item.product + ` ${item.price}`  + '€' + '</p>'
            numOfProduct++;
          }
        }else {
          tableTitle += `<tr> <td> <a href="${snapshot.val()[productsNames[i]].page}">` + productsNames[i] + '</a> </td> <td style="color: white;">' +  ` ${snapshot.val()[productsNames[i]].price}` + ' €' + '</td></tr>'
          //wholeString += '<p class="flow-text">' + numOfProduct + ' | '   + item.product + ` ${item.price}`  + '€' + '</p>'
          numOfProduct++;
        }
      }
    }
    tableTitle += '</tbody> </table>';
    $("#searchResultContainer").html(tableTitle);
    //console.log(current_cart)
  }).catch((error) => {
  });
}


export function getCartFromUser() {
  const auth = firebaseAuth.getAuth();
  auth.onAuthStateChanged(function(user) {
    if (user) {
      getCartFromDB(user.uid)
    } else {
      alert('No hay usuario conectado, inicie sesion primero para añadir un juego');
    }
  });
  
}


export function purgeCartFromUser() {
  const auth = firebaseAuth.getAuth();
  auth.onAuthStateChanged(function(user) {
    if (user) {
      purgeCartFromDB(user.uid)
    } else {
      alert('No hay usuario conectado, inicie sesion primero para añadir un juego');
    }
  });
}

export function addProductToUser(product) {
  const auth = firebaseAuth.getAuth();
  auth.onAuthStateChanged(function(user) {
    if (user) {
      addProductToDB(product, user.uid)
    } else {
      alert('No hay usuario conectado, inicie sesion primero para añadir un juego');
    }
  });
  
}
export function addCartToUserProductHistory() {
  const auth = firebaseAuth.getAuth();
  auth.onAuthStateChanged(function(user) {
    if (user) {
      alert('Se ha realizado la compra del carrito, se va a vaciar su contenido');
      addCartToDBProductHistory(user.uid);
    } else {
      alert('No hay usuario conectado, inicie sesion primero para comprar');
    }
  });
}

export async function addCartToDBProductHistory(id) {
  const db = getDatabase();
  const currentDB = ref(getDatabase());

  get(child(currentDB, `users/${id}/current_cart`)).then((snapshot) => {
    let current_cart = snapshot.val()
    get(child(currentDB, `users/${id}/product_history`)).then(async (snapshot) => {
      let product_history = snapshot.val()
      product_history = product_history.concat(current_cart);
      let updates = {};
      updates['users/' + `${id}` + '/product_history'] = product_history;
      await update(ref(db), updates)
      current_cart = []
      updates = {};
      updates['users/' + `${id}` + '/current_cart'] = current_cart;
      update(ref(db), updates)
      location.reload();
    }).catch(async(error) => {
      let updates = {};
      let product_history = current_cart;
      updates['users/' + `${id}` + '/product_history'] = product_history;
      await update(ref(db), updates);
      current_cart = []
      updates = {};
      updates['users/' + `${id}` + '/current_cart'] = current_cart;
      update(ref(db), updates)
      location.reload();
    });
  });
}



export async function addProductToDB(product, id) {
  const db = getDatabase();
  let price = await getProductFromDB(product);
  const currentDB = ref(getDatabase());

  get(child(currentDB, `users/${id}/current_cart`)).then((snapshot) => {
    let current_cart = snapshot.val()
    current_cart.push({
      "price": price,
      "product": product
    })
    //console.log(current_cart)
    const updates = {};
    updates['users/' + id + '/current_cart'] = current_cart;
    update(ref(db), updates)
  }).catch((error) => {
    const updates = {};
    let current_cart = [];
    current_cart.push({
      "price": price,
      "product": product
    })
    updates['users/' + id + '/current_cart'] = current_cart;
    update(ref(db), updates);
  });
  alert(product + ' añadido')
}


export function addComment(page, comment) {
  const auth = firebaseAuth.getAuth();
  auth.onAuthStateChanged(function(user) {
    if(comment == null) {
      alert('El comentario no puede estar vacio.');
    }
    
    if (user) {
      const currentDB = ref(getDatabase());
      const db = getDatabase();
      
      get(child(currentDB, `comments/${page}`)).then((snapshot) => {
        let comments = snapshot.val()
        comments.push({
          "uid":user.uid,
          "comment": comment,
          "date" : Date.now()
        });
          const updates = {};
          updates['comments/' + `${page}`] = comments;
          update(ref(db), updates)
        }).catch((error) => {
          const updates = {};
          let comments = [];
          comments.push({
            "uid":user.uid,
            "comment": comment,
            "date" : Date.now()
          });
          updates['comments/' + `${page}`] = comments;
          update(ref(db), updates);
      });

      get(child(currentDB, `users/${user.uid}/comments`)).then((snapshot) => {
        let comments = snapshot.val()
        comments.push({
          "page": page,
          "comment": comment,
          "date" : Date.now()
        });
          const updates = {};
          updates['users/' + `${user.uid}` + '/comments'] = comments;
          update(ref(db), updates)
          location.reload();
        }).catch((error) => {
          const updates = {};
          let comments = [];
          comments.push({
            "page": page,
            "comment": comment,
            "date" : Date.now()
          });
          updates['users/' + `${user.uid}` + '/comments'] = comments;
          update(ref(db), updates);
          location.reload();
      });
    } else {
      alert('No hay usuario conectado, inicie sesion primero para añadir un comentario');
    }
  });
}

export function getAllCommentsFromDB(page) {
  const currentDB = ref(getDatabase());
  get(child(currentDB, `comments/${page}`)).then((snapshot) => {
    // COMMENTS ES UN ARRAY
    let comments = snapshot.val();
    let commentsBlock = '';
    comments.forEach((entry, index) => {
      let userID = entry.uid;
      let comment = entry.comment;
      let date = new Date(entry.date).toLocaleString('es-ES', { timeZone: 'Atlantic/Canary' });
      let html = '';
      get(child(currentDB, `users/${userID}`)).then((snapshot) => {
        let dbUsername = snapshot.val();
        if (dbUsername.pfp === undefined) {
          const auth = firebaseAuth.getAuth();
          auth.onAuthStateChanged(function(user) {
            if (user.uid === userID) {
              commentsBlock = `<div class="col s10 offset-s1"> <div class="grey lighten-5 z-depth-3"> <div class="row valign-wrapper"><div class="col s2"><img id="pfp_${index}" src="../img/nopfp.png" alt="foto del perfil del usuario" class="circle responsive-img" style="margin:10px;"></div><div class="col s10" style="color: white; margin:10px;"><span class="black-text"><h1 style="font-size:30px; word-break: break-all">${dbUsername.username}</h1><p style="font-size:15px;">${comment}</p></p><p class="right" style="font-size:15px;">${date}</p><br><a tabindex="0" onclick="deleteCommentFromUser('${page}', ${index})" class="teal darken-4 waves-effect waves-light btn focus-visible-only-black">Eliminar</a></span></div> </div></div></div>` + commentsBlock;
            } else {
              commentsBlock = `<div class="col s10 offset-s1"> <div class="grey lighten-5 z-depth-3"> <div class="row valign-wrapper"><div class="col s2"><img id="pfp_${index}" src="../img/nopfp.png" alt="foto del perfil del usuario" class="circle responsive-img" style="margin:10px;"></div><div class="col s10" style="color: white; margin:10px;"><span class="black-text"><h1 style="font-size:30px; word-break: break-all">${dbUsername.username}</h1><p style="font-size:15px;">${comment}</p></p><p class="right" style="font-size:15px;">${date}</p></span></div> </div></div></div>` + commentsBlock;
            }
            $("#comments-db").html(html + commentsBlock);
          });        
        } else {
          const auth = firebaseAuth.getAuth();
          auth.onAuthStateChanged(function(user) {
            if (user.uid === userID) {
              commentsBlock = `<div class="col s10 offset-s1"> <div class="grey lighten-5 z-depth-3"> <div class="row valign-wrapper"><div class="col s2"><img id="pfp_${index}" src="${dbUsername.pfp}" alt="foto del perfil del usuario" class="circle responsive-img" style="margin:10px;"></div><div class="col s10" style="color: white; margin:10px;"><span class="black-text"><h1 style="font-size:30px; word-break: break-all">${dbUsername.username}</h1><p style="font-size:15px;">${comment}</p></p><p class="right" style="font-size:15px;">${date}</p><br><a tabindex="0" onclick="deleteCommentFromUser('${page}', ${index})" class="teal darken-4 waves-effect waves-light btn focus-visible-only-black">Eliminar</a></span></div> </div></div></div>` + commentsBlock;
            } else {
              commentsBlock = `<div class="col s10 offset-s1"> <div class="grey lighten-5 z-depth-3"> <div class="row valign-wrapper"><div class="col s2"><img id="pfp_${index}" src="${dbUsername.pfp}" alt="foto del perfil del usuario" class="circle responsive-img" style="margin:10px;"></div><div class="col s10" style="color: white; margin:10px;"><span class="black-text"><h1 style="font-size:30px; word-break: break-all">${dbUsername.username}</h1><p style="font-size:15px;">${comment}</p></p><p class="right" style="font-size:15px;">${date}</p></span></div> </div></div></div>` + commentsBlock;
            }
            $("#comments-db").html(html + commentsBlock);
          });
        }
      });
      html = $("#comments-db").html();
    });
  }).catch((error) => {
  });
}


export function deleteCommentFromUser(page, index) {
  var database_ref = getDatabase();
  get(child(ref(database_ref), `comments/${page}`)).then((snapshot) => {
    // COMMENTS ES UN ARRAY
    let comments = snapshot.val();
    let userID = comments[index].uid;
    comments.splice(index,1);

    set(ref(database_ref, `comments/${page}/`),comments);
    get(child(ref(database_ref), `users/${userID}/comments`)).then((snapshot) => {
      // COMMENTS ES UN ARRAY
      //console.log('entre!!')
      let comments = snapshot.val();
      // console.log(comments)
      comments.forEach((entry, index) => {
        if (entry.page === page) {
          comments.splice(index,1);
          //console.log(comments);
          set(ref(database_ref, `users/${userID}/comments/`),comments);
          if(!alert('Se ha borrado el comentario, se recargara la página')) {
            location.reload();
          }
        }
      });
    });
  });
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref , onValue, child, set, update, get, push } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js'; 
import * as firebaseAuth from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

/**
 * _Search Process_
 * @param {*} searchBox box to seach
 */

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


export function processSearch(searchBox) {
  $("#searchBox").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      localStorage.setItem("searchText",searchBox);
      location.href= "/searchResults.html"
    }
  });
  $("#sideNavSearchBox").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      localStorage.setItem("searchText",searchBox);
      location.href= "/searchResults.html"
    }
  });
}

export function processSearchClick(searchBox) {
  localStorage.setItem("searchText",searchBox);
  location.href= "/searchResults.html"
}


export function processSearchWithoutReloadInput(searchBox) {

  $("#dynamicSearchBox").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      getAllProductsFromDB(searchBox);
    }
  });
}


export function processSearchWithoutReload(searchBox) {
  getAllProductsFromDB(searchBox);
}

export async function loadTagsFromDB() {
  var database_ref = getDatabase();
  get(child(ref(database_ref), `products`)).then(async(snapshot) => {
    let allTags = []
    let gameTags = []
    let tagsListHtml = '';
    let index = 1;
    let gamesNames = Object.keys(snapshot.val());
    gamesNames.forEach(async(game) => {
      gameTags = await getTagFromGameDB(game);
      gameTags.forEach((tag) => {
        if(!allTags.includes(tag)) {
          allTags.push(tag);
          if(index%6 == 0 && index == 0) {
            tagsListHtml += `</div> <div class="col s12">`
          } else {
            tagsListHtml += `<div class = "col s2"> <label><input type="checkbox" id="check${index}" class="filled-in" value="${tag}" /><span>${tag} </span></label>  </div>`
          }
          $('#tagsList').html(tagsListHtml);
          index++;
        }
      });
    });
  });

}

export async function getTagFromGameDB(game){
  var database_ref = getDatabase();
  let tags = [];
  tags = await get(child(ref(database_ref), `products/${game}/tags`)).then((snapshot) => {
    // COMMENTS ES UN ARRAY
    //console.log('entre!!')
    tags = snapshot.val();
    return tags;
  });
  return tags;
}
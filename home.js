// setup materialize components
document.addEventListener('DOMContentLoaded', function () {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
});


var btn = document.getElementById("search-btn");

function createList(recipeList, recipe) {
    let li = document.createElement('li');
    let title = document.createElement('div');
    let body = document.createElement('div');
    let img = document.createElement('img');
    let span = document.createElement('span')

    title.setAttribute('class', 'collapsible-header white-text waves-effect waves-light');
    body.setAttribute('class', 'collapsible-body grey lighten-3');
    img.setAttribute('src', recipe.strMealThumb);

    span.textContent = recipe.strMeal;

    title.appendChild(img);
    title.appendChild(span);
    li.appendChild(title);
    li.appendChild(body);
    recipeList.appendChild(li);

    let loaded = false;
    title.addEventListener('click', function () {
        if (!loaded) {
            showRecipe(body, recipe.idMeal);
            loaded = true;
        }
    })
}


function noData(ingredient) {
    var elems = document.querySelector('.modal');
    let error = document.querySelector('#error_msg');
    error.textContent = `Recipe with ingredient ${ingredient} not found`;
    var instance = M.Modal.getInstance(elems);
    instance.open();
}


btn.addEventListener("click", function () {
    var request = new XMLHttpRequest();
    let ingredient = document.getElementById("search").value;
    request.open('GET', 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + ingredient, true);

    request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response).meals;
        let recipeList = document.querySelector("#recipe-list");
        while (recipeList.lastElementChild) {
            recipeList.removeChild(recipeList.lastElementChild);
        }

        if (data != null) {
            // recipeList.removeChild();
            data.forEach(recipe => {
                createList(recipeList, recipe);
            });
        } else {
            noData(ingredient);
            // console.log("No data found");
        }


    }

    // Send request
    request.send();
});

function showRecipe(body, recipeId) {

    var request = new XMLHttpRequest();
    request.open('GET', 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + recipeId, true);

    request.onload = function () {
        // Begin accessing JSON data here
        var recipe = JSON.parse(this.response).meals[0];


        // console.log(recipe);
        body.innerHTML = "<b>Ingredients:</b> <br>"
        let ul = document.createElement('ul');
        for (let i = 1; i <= 20; i++) {
            let li = document.createElement('li');
            
            let ingredient = recipe[`strIngredient${i}`];
            if (ingredient === "") {
                break;
            }
            li.textContent = ingredient + ' - ' + recipe[`strMeasure${i}`];
            // body.innerHTML += ingredient + ' - ' +  + "<br>";
            ul.appendChild(li);
        }
        body.appendChild(ul);
        body.innerHTML += "<hr><b>Instructions:</b> <br>";
        body.innerHTML += recipe.strInstructions;
        body.innerHTML += "<br><hr>"
        body.innerHTML += "<i>Follow recipe on YouTube</i><br>";
        body.innerHTML += `<iframe width="560" height="315" src="${recipe.strYoutube.replace('watch?v=', 'embed/')}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    }

    request.send();
}


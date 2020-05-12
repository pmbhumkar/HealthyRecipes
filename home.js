var btn = document.getElementById("submit");
btn.addEventListener("click", function() {
    var request = new XMLHttpRequest();
    let ingredient = document.getElementById("ing").value;
    request.open('GET', 'https://www.themealdb.com/api/json/v1/1/filter.php?i='+ingredient, true);

    request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response).meals;
    var table = document.getElementById("recipeList");
    let i=0;
    table.innerHTML = "";
    data.forEach(recipe => {
      // insert rows in table
            let row = table.insertRow(i);
            let recipeImg = row.insertCell(0);
            let recipeName = row.insertCell(1);
            recipeImg.style = "width: 120px; border-top:1px solid black; border-bottom:1px solid black";
            recipeName.innerHTML = recipe.strMeal;
            recipeName.classList += "recipetitle";
            recipeImg.innerHTML = `<img src='${recipe.strMealThumb}' height='100px' width='100px'>`;
            recipeName.addEventListener('click', function()
            {
                showRecipe(recipe.idMeal);
                this.classList.add("selectedRow");
            })
            i++;
        });
    }

    // Send request
    request.send();
});

function showRecipe(recipeId)
{
    var request = new XMLHttpRequest();
    request.open('GET', 'https://www.themealdb.com/api/json/v1/1/lookup.php?i='+recipeId, true);
       let prevSelected = document.getElementsByClassName("selectedRow");
       if (prevSelected.length > 0)
       {
        prevSelected[0].classList.remove("selectedRow");
       }

    request.onload = function() {
    // Begin accessing JSON data here
    var recipe = JSON.parse(this.response).meals[0];
    let recipeDetails = document.getElementById('recipeDetails');
    recipeDetails.innerHTML = `<b>Cuisin :</b> ${recipe.strArea} <br>`;
    recipeDetails.innerHTML += `<b>Ingredients : </b><br>`
    for(let i=1; i<= 20; i++)
    {
        let ingredient = eval("recipe.strIngredient"+i);
        if(ingredient === "")
        {
            break;
        }
        recipeDetails.innerHTML += ingredient + ' - ' + eval("recipe.strMeasure"+i) + "<br>";
    }
        recipeDetails.innerHTML += '<b> Instructions : </b><br>';
        recipeDetails.innerHTML += recipe.strInstructions;
        recipeDetails.innerHTML += `<br> <iframe width="560" height="315" src="${recipe.strYoutube.replace('watch?v=','embed/')}" frameborder="0" 
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    }

    request.send();
}
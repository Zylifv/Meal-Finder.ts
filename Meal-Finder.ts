let userIngArr : string[] = [];
const input = document.getElementById("text") as HTMLInputElement;
const btn = document.getElementById("add") as HTMLButtonElement;
const clearBtn = document.getElementById("clearForm") as HTMLButtonElement;
const result = document.getElementById("ingResult") as HTMLButtonElement;
const meals = document.getElementById("meals") as HTMLDivElement;
const myList = document.getElementById("myList") as HTMLDivElement;
const ingredientResult = document.getElementById("ingResult") as HTMLDivElement;
const recoMealArr : string[] = [];
const regex : any = /[!@#$%^&*()',.?":{}|<>0-9]/ig;
const ingredients : string[] = ["Onion", "Garlic", "Passata", "Basil", "Oregano", "Chicken", "Pork", "Potato", "Carrot", "Peppers", "Cucumber", "Mushroom", "Leek", "Sausage", "Parsley", "Flour", "Cheese", "Pasta", "Bacon", "Butter", "Stock", "Noodles", "Soy sauce", "Curry paste", "Coconut milk", "Lime"];
const mealsArr : {
  name : string;
  ingredients : string[];
  recipe : string;
}[] = [
  {
   name: "Chicken Pasta Bake",
   ingredients: ["Basil", "Passata", "Chicken", "Onion", "Garlic", "Cheese", "Pasta"],
   recipe: "https://www.bbcgoodfood.com/recipes/chicken-pasta-bake"
  },
  {
    name: "Chicken & Bacon Pasta",
    ingredients: ["Basil", "Passata", "Chicken", "Onion", "Garlic", "Bacon"],
    recipe: "https://www.bbcgoodfood.com/recipes/chicken-bacon-pasta"
  },
  {
    name: "French Onion Soup",
    ingredients: ["Onion", "Garlic", "Flour"],
    recipe: "https://www.bbcgoodfood.com/recipes/french-onion-soup"
  },
  {
    name: "Crispy Pork Ramen",
    ingredients: ["Noodles", "Onion", "Garlic", "Peppers", "Soy sauce", "Curry paste", "Coconut milk", "Lime"],
    recipe: "https://www.bbcgoodfood.com/recipes/crispy-pork-massaman-ramen"
  },
  {
    name: "Bangers & Mash with Onion Gravy",
    ingredients: ["Sausage", "Potato", "Onion", "Flour", "Butter", "Stock"],
    recipe: "https://www.bbcgoodfood.com/recipes/bangers-n-mash-with-onion-gravy"
  }
];


function insertElements(recipeTitle : string, recipeLinkRef : string)
//this is a DRY implementation for when the user ingredients match a meal and the elements get placed on screen
{
    let recipeLink = document.createElement("a");
    let recipeLinkText = document.createTextNode(recipeTitle);
        recipeLink.appendChild(recipeLinkText);
        recipeLink.title = recipeTitle;
        recipeLink.href = recipeLinkRef;
        meals.appendChild(recipeLink);
}


function addIng() //allows the user to add ingredients from a set list which can be however many as you want
{
  myList.style.display = "none";
  let inputVal = input.value.replace(regex,"");
  let currVal = inputVal.charAt(0).toUpperCase() + inputVal.slice(1);
    
  for (let i : number = 0; i < ingredients.length; i++)
  {
    if (currVal === "")
    {
      alert("Please enter a valid ingredient"); //stops user from entering null values
      return;
    }
    else if (currVal === ingredients[i] && userIngArr.includes(currVal))
    {
       alert("You have already chosen this ingredient, please try another one."); //stops user from entering the same ingredient more than once
       input.value = "";
       return;
     }
     else if (currVal === ingredients[i]) //adds ingredient/s
     {
       userIngArr.push(currVal); //pushes current ingredient into array for later use
       input.value = "";
       //uses the correct method of creating Nodes and adding them to the HTML without using .innerHTML which is susceptible to script attacks
       let newIngredient = document.createElement("div");
       let ingredientDelBtn = document.createElement("button");
           newIngredient.setAttribute("id", `${ingredients[i]}`);
           newIngredient.classList.add("ingredient-icon")
           ingredientDelBtn.setAttribute("id", `${ingredients[i]}-btn`)
           ingredientDelBtn.classList.add("discard");
           ingredientDelBtn.textContent = "X";
       let newIngredientNode = document.createTextNode(`${ingredients[i]}`);  
           newIngredient.appendChild(newIngredientNode);
           newIngredient.appendChild(ingredientDelBtn);
           ingredientResult.appendChild(newIngredient);
       

           ingredientDelBtn.onclick = function removeItem() { //NEEDS IMPROVING/FIXING
             let ref = ingredientDelBtn.id.substring(0, ingredientDelBtn.id.length - 4); //removes the "-btn" portion of the button id
             if (ingredientDelBtn.id == `${newIngredient.id}-btn`)
             {
               let index = userIngArr.indexOf(ref);
               console.log(index)
               if (index !== -1)
               {
                 meals.removeChild(document.getElementById(ref) as any);
                 userIngArr.splice(index, 1);
               }
             }
        }
      }
    }
  }

  //removes the dropdown list once the user clicks on the relevant ingredient
  myList.addEventListener("click", (e : any) => {
    if (e.target.classList.contains("ing_choices"))
    {
      const id = e.target.id;
      input.value = id;
      myList.style.display = "none";
    }
 });


function datalistMatch(e : any) //This is how i display the ingredients in a drop-down list to make it easier for the user to select the items they want
{
  let a = document.createElement("div");
  for (let i : number = 0; i < ingredients.length; i++)
  {
    let dropdown = document.createElement("div");
    let val = input.value;
    let ingName = ingredients[i];
    let ingMatches = ingName.substring(0, val.length).toUpperCase() == val.toUpperCase() ? 1 : 0
    let ingChars = ingName.split(" ");
      for (let j : number = 0; j < ingChars.length; j++)
      {
        ingMatches += ingChars[j].substring(0, val.length).toUpperCase() == val.toUpperCase() ? 1 : 0
      }
      if (input.value === "")
      {
        myList.style.display = "none";
      }
      if (ingMatches > 0 && input.value !== "")
      {
        myList.style.display = "block";
        dropdown.setAttribute("id", ingName);
        dropdown.setAttribute("class", "ing_choices");
        let index = ingName.toLowerCase().indexOf(val.toLowerCase())
        dropdown.innerHTML = `<b style="font-size: 16px;">${ingName}</b>`; 
       }
       else if (ingMatches == 0)
       {
         for (const n of myList.children)
         {
           myList.removeChild(n);
         }
       } 
       dropdown.innerHTML += "<input type='hidden' value='ingName'>"
       a.appendChild(dropdown);
       myList.appendChild(a);
   } 
}

function getResult() //will compare the users ingredients to each of the set meals in the meals array and returns a match/no match result
{
    let user : any = new Set(userIngArr);
    for (let i : number = 0; i < mealsArr.length; i++)
    {
       let mealName : string = mealsArr[i].name;
       let mealRecipe = mealsArr[i].recipe;
       let meal = new Set(mealsArr[i].ingredients);
       console.log(meal, meal.size);
       if (user.isSubsetOf(meal) && userIngArr.length === meal.size) //meal match!
       {
          meals.textContent = `${mealName} is a match! Follow the link below for the full recipe:\n`
          insertElements(mealName, mealRecipe); //calls upon the function to insert Nodes correctly utilising DRY coding practices
          return;
        }
        else //no match...
        {
          meals.textContent = `
          We cannot find a recipe that can be made with your current ingredients: \n ${userIngArr.join(", ").replace(/,(?=[^,]+$)/, " &")}.`
        }
    }
}

clearBtn.addEventListener("click", () => { //resets the users ingredient selection
  myList.style.display = "none";
  userIngArr.length = 0;
  input.value = "";
  meals.innerText = "";
  result.innerText = "";
  meals.innerText = "";
});

function randomMeal() //chooses a random meal for the user to try and make with a link
{
  for (let i : number = 0; i < mealsArr.length; i++)
  {
    let suggestedMeal = mealsArr[Math.floor(Math.random() * mealsArr.length)];
    meals.textContent = `${suggestedMeal.name} - has been selected as your random meal!\n
        The ingredients you will need are: ${suggestedMeal.ingredients.join(", ").replace(/,(?=[^,]+$)/, ', & ')}.\n
        Follow the link below for the full recipe including cooking instructions:\n`;
    insertElements(suggestedMeal.name, suggestedMeal.recipe);
   }
}

const search = document.getElementById('search');
submit = document.getElementById('submit');
random = document.getElementById('random');
mealsEl = document.getElementById('meals');
resultHeading = document.getElementById('result-heading');
single_mealEl = document.getElementById('single-meal');

document.addEventListener('DOMContentLoaded', () => {
    displayWelcomeMessage();
    submit.addEventListener('submit', searchMeal);
    random.addEventListener('click', getRandomMeal);
    mealsEl.addEventListener('click', e => {
        const path = e.composedPath();

        const mealInfo = path.find(item => {
            if (item.classList) {
                return item.classList.contains('meal-info');
            } else {
                return false;
            }
        });

        if (mealInfo) {
            const mealID = mealInfo.getAttribute('data-mealid');
            getMealbyId(mealID);
        }
    });
});

function displayWelcomeMessage() {
    const welcomeMessageEl = document.getElementById('welcome-message');
    const message = 'Welcome to Food Finder! Start searching for delicious meals or get a random meal suggestion!';
    typeWriter(welcomeMessageEl, message, 0);
}

function typeWriter(element, text, i) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(element, text, i), 100);
    }
}



//search meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

    //clear single meal
    single_mealEl.innerHTML = '';

    //get search term
    const term = search.value;
    console.log(term);
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
                if (data.meals == null) {
                    resultHeading.innerHTML = `<p>There are no search results.Try again!</p>`;
                }
                else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                  <div class="meal">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                  <div class="meal-info" data-mealID="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>
                  </div>
                  </div>
              `)
                        .join('');
                }
            })
        //clear search text
        search.value = '';
    }
    else {
        alert('Please enter a search term');
    }
}
//fetch meal by id
function getMealbyId(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
}

//fetch random meal from API
function getrandomMeal(){
    //clear meals and heading
    mealsEl.innerHTML='';
    resultHeading.innerHTML=''; 
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res =>res.json())
    .then(data =>{
        const meal=data.meals[0];
        addMealToDOM(meal);
    })
}
//Add meal to DOM
function addMealToDOM(meal) {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}`);
        }
        else break;
    }

single_mealEl.innerHTML = ` 
    <div class="single-meal"> 
     <h2>${meal.strMeal}</h2> 
     <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
     <div class="single-meal-info"> 
      ${meal.strCategory ? ` <p> ${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div> 
    <div class="main"> 
        <p>${meal.strInstructions}</p> 
       <h2>Ingredients</h2> 
      <ul> 
      ${ingredients.map(ing => `<li>${ing}</li>`).join('')} 
      </ul> 
      </div>
     </div> 
     `;

     // Scroll to the meal information
    single_mealEl.scrollIntoView({ behavior: 'smooth' });
}



//Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click',getrandomMeal);

mealsEl.addEventListener('click', e => {
    const path = e.composedPath();

    const mealInfo = path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealbyId(mealID);
    }
});

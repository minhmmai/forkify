import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
    elements.searchResultsPages.innerHTML = '';
};

const limitTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur)
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return newTitle;
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
}

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type == 'prev' ? page - 1 : page + 1}>
        <span>Page ${type == 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type == 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`

const renderPageButtons = (currentPage, resultNumber, resultsPerPage) => {
    const pageNumber = Math.ceil(resultNumber / resultsPerPage);
    let button;
    if (currentPage == 1 && pageNumber > 1) {
        // Only show button for the next page
        button = createButton(currentPage, 'next');

    } else if (currentPage < pageNumber) {
        // Show buttons for noth next and previous page
        button = `${createButton(currentPage, 'prev')} ${createButton(currentPage, 'next')}`;
    } else if (currentPage == pageNumber && pageNumber > 1) {
        // Only show button for previous page
        button = createButton(currentPage, 'prev');
    }

    elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    // Render results for the current page
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // Render the page buttons
    renderPageButtons(page, recipes.length, resultsPerPage);
}
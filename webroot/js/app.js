(() => {
  document.addEventListener('DOMContentLoaded', () => {

    const $q = (selector) => document.querySelector(selector)
    const $createEl = (el) => document.createElement(el)
    const $createText = (text) => document.createTextNode(text)
    const removeAllChildNodes = (parent) => {
      while (parent.firstChild) parent.removeChild(parent.firstChild);
    }

    const apiUrl = "http://localhost:8081/recipes";
    let cachedPage = 1; // for staying on the same page after deleting recipe

    const input = $q(".input-filter")
    input.addEventListener('change', (e) => fetchRecipes(1, e.currentTarget.value))

    /* Components */

    const RecipeItem = ({ id, title, description }) => {

      const handleDelete = e => {
        e.preventDefault()
        e.target.parentNode.remove()
        deleteRecipe(e.target.dataset.id)
      }

      const Item = $createEl('div')
      Item.className = "recipe-item"

      const h2 = $createEl('h2')
      h2.appendChild($createText(title))
      Item.appendChild(h2)

      const desc = $createEl('p')
      desc.appendChild($createText(description))
      Item.appendChild(desc)

      const button = $createEl('button')
      button.appendChild($createText('Delete'))
      button.setAttribute('data-id', id);
      button.className = "btn btn-delete"
      button.addEventListener('click', handleDelete);
      Item.appendChild(button)

      return Item;
    }


    const Pagination = (currentPage, totalPages) => {

      const handlePageChange = (e) => {
        e.preventDefault()
        fetchRecipes(e.target.dataset.id)
      }

      const PaginationWrap = $q('.pagination-wrap');
      const Pagination = $createEl('div')
      Pagination.className = "pagination"

      for (let i = 1; i <= totalPages; i++) {
        const button = $createEl('button')
        button.appendChild($createText(i))
        button.setAttribute('data-id', i)
        button.className = `btn ${currentPage == i ? 'active' : ''}`;
        button.addEventListener('click', handlePageChange);
        Pagination.appendChild(button)
      }
      PaginationWrap.appendChild(Pagination)
    }


    /* API calls */

    const fetchRecipes = (page = 1, search = "") => {
      fetch(`${apiUrl}?page=${page}&search=${search}`)
        .then((result) => {
          return result.json()
        })
        .then(({ currentPage, recipes, totalPages }) => {
          removeAllChildNodes($q(".pagination-wrap"))
          removeAllChildNodes($q(".recipes-list"))
          cachedPage = currentPage;
          Pagination(currentPage, totalPages)
          recipes.forEach(recipe => {
            $q(".recipes-list").appendChild(RecipeItem(recipe));
          });
        })
    }

    const deleteRecipe = (id) => {
      fetch(`${apiUrl}/${id}`, { method: 'DELETE', id })
        .then(response => response.json())
        .then(() => fetchRecipes(cachedPage));
    }

    fetchRecipes(); // initial fetch
  })
})()
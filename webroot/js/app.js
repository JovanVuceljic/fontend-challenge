(() => {
  document.addEventListener('DOMContentLoaded', () => {

    const $q = (selector) => document.querySelector(selector)
    const $createEl = (el) => document.createElement(el)
    const $createText = (text) => document.createTextNode(text)

    const RecipeItem = ({ id, title, description }) => {

      const handleDelete = (e) => {
        e.preventDefault()
        console.log("clicked");
      }
      const Item = $createEl('div')
      Item.className = "recipe-item"

      const h2 = $createEl('h2')
      h2.appendChild($createText(title))
      Item.appendChild(h2)

      const desc = $createEl('p')
      desc.appendChild($createText(description))
      Item.appendChild(desc)

      const button = $createEl('a')
      button.appendChild($createText('Delete'))
      button.setAttribute('href', id);
      button.className = "btn btn-delete"
      button.addEventListener('click', handleDelete);
      Item.appendChild(button)

      return Item;
    }

    const Pagination = (currentPage, totalPages) => {

      const handlePageChange = (e) => {
        e.preventDefault()
        console.log("clicked");
      }
      const PaginationWrap = $q('.pagination-wrap');
      const Pagination = $createEl('div')
      Pagination.className = "pagination"

      for (let i = 1; i <= totalPages; i++) {

        const button = $createEl('a')
        button.appendChild($createText(i))
        button.setAttribute('href', i);
        button.className = `btn ${currentPage == i ? 'active' : ''}`;
        button.addEventListener('click', handlePageChange);
        Pagination.appendChild(button)
      }
      PaginationWrap.appendChild(Pagination)
    }

    fetch('http://localhost:8081/recipes')
      .then((result) => {
        return result.json()
      })
      .then(({ currentPage, recipes, totalPages }) => {
        Pagination(currentPage, totalPages)
        recipes.forEach(recipe => {
          $q(".recipes-list").appendChild(RecipeItem(recipe));
        });
      })
  })
})()
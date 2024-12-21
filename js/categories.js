// Gerenciamento de categorias
const categoriesSelect = document.getElementById('postCategories');
const newCategoryInput = document.getElementById('newCategory');
const addCategoryButton = document.getElementById('addCategoryButton');

function loadCategories() {
    // Carregar categorias do backend ou localStorage
    const categories = ['Tecnologia', 'Lifestyle', 'Negócios']; // Exemplo
    categories.forEach(category => {
        const option = new Option(category, category);
        categoriesSelect.add(option);
    });
}

addCategoryButton.addEventListener('click', () => {
    const newCategory = newCategoryInput.value.trim();
    if (newCategory && !Array.from(categoriesSelect.options).some(option => option.value === newCategory)) {
        const option = new Option(newCategory, newCategory);
        categoriesSelect.add(option);
        newCategoryInput.value = '';
    }
});

// Gerenciamento de links
const linksList = document.getElementById('linksList');
const linkTextInput = document.getElementById('linkText');
const linkUrlInput = document.getElementById('linkUrl');
const addLinkButton = document.getElementById('addLinkButton');

function addLink(text, url) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${text}: <a href="${url}" target="_blank">${url}</a></span>
        <button class="delete-link">Excluir</button>
    `;
    li.querySelector('.delete-link').addEventListener('click', () => li.remove());
    linksList.appendChild(li);
}

addLinkButton.addEventListener('click', () => {
    const text = linkTextInput.value.trim();
    const url = linkUrlInput.value.trim();
    if (text && url) {
        addLink(text, url);
        linkTextInput.value = '';
        linkUrlInput.value = '';
    }
});

// Modificar a função savePost para incluir categorias e links
function savePost() {
    const postId = document.getElementById('postIdHidden').value;
    const title = document.getElementById('postTitle').value;
    const subTitle = document.getElementById('postSubTitle').value;
    const content = quill.root.innerHTML;
    const categories = Array.from(categoriesSelect.selectedOptions).map(option => option.value);
    const links = Array.from(linksList.children).map(li => {
        const [text, url] = li.querySelector('span').textContent.split(': ');
        return { text, url };
    });

    const post = {
        id: postId || Date.now().toString(),
        title,
        subTitle,
        content,
        categories,
        links
    };

    // Salvar o post (implementação depende do seu backend)
    console.log('Post salvo:', post);
    clearForm();
    loadPosts(); // Recarregar a lista de posts
}

// Modificar a função loadPost para preencher categorias e links
function loadPost(post) {
    document.getElementById('postIdHidden').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postSubTitle').value = post.subTitle;
    quill.root.innerHTML = post.content;

    // Preencher categorias
    Array.from(categoriesSelect.options).forEach(option => {
        option.selected = post.categories.includes(option.value);
    });

    // Preencher links
    linksList.innerHTML = '';
    post.links.forEach(link => addLink(link.text, link.url));
}

// Carregar categorias ao iniciar
loadCategories();

// Less writing for debugging
let lg = console.log;

const modal = document.getElementById('modal');
const pages = document.getElementById('pages');

const apiUrl = 'https://wp.palone.blog/?rest_route=';

// Get pages
fetch(apiUrl + '/wp/v2/pages&_fields=title,id,slug')
    .then(res => res.json())
    .then(data => {
        data.map(page => {
            let el = document.createElement('a');
            el.href = '#page-' + page.slug;
            el.innerText = page.title.rendered;

            el.addEventListener('click', () => {
                fetch(apiUrl + '/wp/v2/pages/' + page.id + '&_fields=content')
                    .then(res => res.json())
                    .then(data => {
                        renderModal(data.content.rendered);
                    });
            });

            pages.appendChild(el);
        });
    });

// Get posts
fetch(apiUrl + '/wp/v2/posts&_fields=title,id,slug,date,excerpt')
    .then(res => res.json())
    .then(data => {
        data.map(post => {
            let el = document.createElement('a');
            el.href = '#post-' + post.slug;
            el.innerHTML = post.title.rendered + post.excerpt.rendered + post.date; // TODO render the stuff actually neatly

            el.addEventListener('click', () => {
                fetch(apiUrl + '/wp/v2/posts/' + post.id + '&_fields=content')
                    .then(res => res.json())
                    .then(data => {
                        renderModal(data.content.rendered);
                    });
            });

            posts.appendChild(el);
        });
    });


// Functions down here
function renderModal(content) {
    modal.innerHTML = content;
    modal.classList.add('show');
}

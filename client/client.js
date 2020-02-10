const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const API_URL = 'http://localhost:5000/mini';
const minisElement = document.querySelector('.minis');

loadingElement.style.display = '';

listAllMinis();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const mini = {
        name,
        content
    };
    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(mini),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
      .then(createdMini => {
          console.log(createdMini);
          form.reset();
          setTimeout(() => {
            form.style.display = '';  
          }, 30000);
          listAllMinis();
          loadingElement.style.display = 'none';
          
      })
});

function listAllMinis() {
    minisElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(mini => {
            console.log(mini);
            mini.reverse();
            mini.forEach(min => {
                const div = document.createElement('div');
                const header = document.createElement('h3');
                header.textContent = min.name;

                const contents = document.createElement('p');
                contents.textContent = min.content;

                const date = document.createElement('small');
                date.textContent = new Date(min.created);
                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);
                minisElement.appendChild(div);
            });
            loadingElement.style.display = 'none';
        });
}
//Book Class: represents a book
class Book {
    constructor(title, year, id) {
        this.title = title;
        this.year = year;
        this.id = id;
    }
}
//UI class: handle UI tasks
class UI {
    static displayBooks() {

        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.year}</td>
        <td>${book.id}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(element) {
        if (element.classList.contains("delete")) {
            element.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement("div");

        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }
}
//store class: handles storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(id) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.id === id) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem("books", JSON.stringify(books));
    }
}


//event: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//event: add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.querySelector("#title").value;
    const year = document.querySelector("#year").value;
    const id = document.querySelector("#id").value;

    //validate
    if (title === "" || year === "" || id === "") {
        UI.showAlert("Please fill in all fields", "danger");
    } else {
        //instantiate book
        const book = new Book(title, year, id);
        UI.addBookToList(book);
        Store.addBook(book);
        UI.showAlert("Book Added.", "success");
        document.querySelector("#book-form").reset();
    }
}
);

//event: remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert("Book Removed.", "success");

})
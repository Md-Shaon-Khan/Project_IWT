const categories = [
  "Fiction", "Non-Fiction", "Science", "Technology",
  "History", "Biography", "Comics", "Fantasy",
  "Mystery", "Horror", "Poetry", "Romance",
  "Self-help", "Philosophy", "Children", "Travel"
];

const books = {};
const borrowHistory = [];

function capitalizeTitle(title) {
  return title.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}

function init() {
  const shelf = document.getElementById("bookshelf");
  const categorySelects = [document.getElementById("bookCategory"), document.getElementById("borrowCategory")];

  categories.forEach(category => {
    books[category] = [];

    const section = document.createElement("div");
    section.className = "section";
    section.innerHTML = `<h5>${category} (<span id="count-${category}">0</span>)</h5>
                         <ul id="list-${category}" class="book-list"></ul>`;
    shelf.appendChild(section);

    categorySelects.forEach(select => {
      const opt = document.createElement("option");
      opt.value = category;
      opt.textContent = category;
      select.appendChild(opt);
    });
  });

  // Sample prefilled books
  books["Fiction"].push("The Great Gatsby", "To Kill A Mockingbird");
  books["Science"].push("A Brief History Of Time");
  books["Philosophy"].push("The Republic");
  books["Technology"].push("Clean Code");

  updateDisplay();
}

function updateDisplay() {
  categories.forEach(category => {
    const ul = document.getElementById(`list-${category}`);
    const count = document.getElementById(`count-${category}`);
    ul.innerHTML = "";
    books[category].forEach(book => {
      const li = document.createElement("li");
      li.textContent = book;
      ul.appendChild(li);
    });
    count.textContent = books[category].length;
  });
}

function addBook() {
  const name = capitalizeTitle(document.getElementById("bookName").value.trim());
  const category = document.getElementById("bookCategory").value;
  if (!name || !category) return alert("Please enter book name and select section.");

  if (books[category].includes(name)) {
    alert("This book already exists in the section.");
  } else {
    books[category].push(name);
    updateDisplay();
    alert(`Book '${name}' added to '${category}'.`);
  }
  document.getElementById("bookName").value = "";
  document.getElementById("addSuggestions").innerHTML = "";
}

function borrowBook() {
  const name = capitalizeTitle(document.getElementById("borrowName").value.trim());
  const category = document.getElementById("borrowCategory").value;
  if (!name || !category) return alert("Please enter book name and select section.");

  const index = books[category].indexOf(name);
  if (index !== -1) {
    books[category].splice(index, 1);
    updateDisplay();
    alert(`You borrowed: ${name}`);

    // Add to history
    const now = new Date().toLocaleString();
    borrowHistory.unshift({ name, category, time: now });
    updateHistory();
  } else {
    alert("Book not available in this section.");
  }
  document.getElementById("borrowName").value = "";
  document.getElementById("borrowSuggestions").innerHTML = "";
}

function updateHistory() {
  const historyTable = document.getElementById("historyTable");
  historyTable.innerHTML = "";
  borrowHistory.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${entry.name}</td><td>${entry.category}</td><td>${entry.time}</td>`;
    historyTable.appendChild(row);
  });
}

function toggleInputBox(type) {
  if (type === "add") {
    const value = document.getElementById("bookCategory").value;
    document.getElementById("addInputWrapper").classList.toggle("d-none", !value);
    document.getElementById("addButtonWrapper").classList.toggle("d-none", !value);
  } else if (type === "borrow") {
    const value = document.getElementById("borrowCategory").value;
    document.getElementById("borrowInputWrapper").classList.toggle("d-none", !value);
    document.getElementById("borrowButtonWrapper").classList.toggle("d-none", !value);
  }
}

function setupAutocomplete(inputId, categoryId, suggestionBoxId) {
  const input = document.getElementById(inputId);
  const categorySelect = document.getElementById(categoryId);
  const suggestionBox = document.getElementById(suggestionBoxId);

  input.addEventListener("input", () => {
    const category = categorySelect.value;
    const query = capitalizeTitle(input.value.trim());
    suggestionBox.innerHTML = "";

    if (!query || !category || !books[category]) return;

    const suggestions = books[category].filter(b => b.startsWith(query));
    suggestions.forEach(s => {
      const div = document.createElement("div");
      div.textContent = s;
      div.onclick = () => {
        input.value = s;
        suggestionBox.innerHTML = "";
      };
      suggestionBox.appendChild(div);
    });
  });
}

init();
setupAutocomplete("bookName", "bookCategory", "addSuggestions");
setupAutocomplete("borrowName", "borrowCategory", "borrowSuggestions");

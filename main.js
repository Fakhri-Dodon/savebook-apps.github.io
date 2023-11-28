document.addEventListener('DOMContentLoaded', function () {
	const submitForm = document.getElementById('inputBook');
	submitForm.addEventListener('submit', function (event) {
		event.preventDefault();
		addBook();
    Swal.fire({
        title: "Success!!",
        text: "Book added successfully",
        icon: "success"
    });
	});
   if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const uncompleteBookshelfList = [];
const completeBookshelfList = [];
const RENDER_EVENT = 'render-book';

function addBook() {
	const addTitle = String(document.getElementById('inputBookTitle').value);
	const addName = String(document.getElementById('inputBookAuthor').value);
	const addYear = Number(document.getElementById('inputBookYear').value);
  const generatedID = Number(generateId());
  const inputBookIsComplete = Boolean(document.getElementById('inputBookIsComplete').checked);

  const checked = document.getElementById('completeBookshelfList');

  	const bookObject = generateBookObject(generatedID, addTitle, addName, addYear, inputBookIsComplete);
    uncompleteBookshelfList.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  }
}

document.addEventListener(RENDER_EVENT, function () {
	const uncompletedTODOList = document.getElementById('uncompleteBookshelfList');
  uncompletedTODOList.innerHTML = '';

  const completedTODOList = document.getElementById('completeBookshelfList');
	completedTODOList.innerHTML ='';
 
  for (const bookItem of uncompleteBookshelfList) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) 
  	   uncompletedTODOList.append(bookElement);
  	else
  		completedTODOList.append(bookElement);
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookObject.title;

  const textName = document.createElement('h2');
  textName.innerText = bookObject.author;
 
  const textYear = document.createElement('p');
  textYear.innerText = bookObject.year;
 
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textName, textYear);
 
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
 
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(bookObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
      Swal.fire({
         title: "Deleted!",
         text: "Your file has been deleted.",
         icon: "success"
      });
    });
 
    container.append(undoButton, trashButton);
    saveData();
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
       Swal.fire({
         title: "Deleted!",
         text: "Your file has been deleted.",
         icon: "success"
      });
    });
    
    container.append(checkButton, trashButton);
    saveData();
  }
 
  return container;
}

 function addTaskToCompleted (bookId) {
  const bookTarget = findTodo(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodo(bookId) {
  for (const bookItem of uncompleteBookshelfList) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  uncompleteBookshelfList.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findTodo(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}


function findBookIndex(bookId) {
  for (const index in uncompleteBookshelfList) {
    if (uncompleteBookshelfList[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function findBookIndexc(bookId) {
  for (const index in completeBookshelfList) {
    if (completeBookshelfList[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(uncompleteBookshelfList);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
 console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      uncompleteBookshelfList.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
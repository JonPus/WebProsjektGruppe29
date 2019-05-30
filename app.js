
/*Progress Bar funksjonen */


function moveFinished() {
  var elem = document.getElementById("spanBar"); 
  var width = 10;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++; 
      elem.style.width = width + '%'; 
      
    }
  }
}

function moveBar() {
  var elem = document.getElementById("spanBar"); 
  var width = 0;
  var id = setInterval(frame, 25);

  function frame() {
    if (width >= 10) {
      clearInterval(id);
    } else {
      width++; 
      elem.style.width = width + '%'; 
      
    }
  }

}

(function() {

  var UI = {
      elBoard: document.getElementById('board'),
      elTotalCardCount: document.getElementById('totalCards'),
      elCardPlaceholder: null,
    },
    lists = [],
    todos = [],
    isDragging = false,
    _listCounter = 0, 
    _cardCounter = 0;

  function live(eventType, selector, callback) {
    document.addEventListener(eventType, function (e) {
      if (e.target.webkitMatchesSelector(selector)) {
        callback.call(e.target, e);
      }
    }, false);
  }
  
  live('dragstart', '.list .card', function (e) {
    isDragging = true;
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.dataTransfer.dropEffect = "copy";
    e.target.classList.add('dragcard');
  });
  live('dragend', '.list .card', function (e) {
    this.classList.remove('dragcard');
    UI.elCardPlaceholder && UI.elCardPlaceholder.remove();
    UI.elCardPlaceholder = null;
    isDragging = false;
  });

  live('dragover', '.list, .list .card, .list .card-placeholder', function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if(this.className === "list") {
      this.appendChild(getCardPlaceholder());
    } else if(this.className.indexOf('card') !== -1) { 
      this.parentNode.insertBefore(getCardPlaceholder(), this);
    }
  });
  
  live('drop', '.list, .list .card-placeholder', function (e) {
    e.preventDefault();
    if(!isDragging) return false;
    var todo_id = +e.dataTransfer.getData('text');
    var todo = getTodo({_id: todo_id});
    var newListID = null; 
    if(this.className === 'list') { 
      newListID = this.dataset.id;
      this.appendChild(todo.dom);
    } else { 
      newListID = this.parentNode.dataset.id;
      this.parentNode.replaceChild(todo.dom, this);
    }
    moveCard(todo_id, +newListID);
  });
  
  function createCard(text, listID, index) {
    if(!text || text === '') return false;
    var newCardId = ++_cardCounter;
    var card = document.createElement("div");
    var list = getList({_id: listID});
    card.draggable = true;
    card.dataset.id = newCardId;
    card.dataset.listId = listID;
    card.id = 'todo_'+newCardId;
    card.className = 'card';
    card.innerHTML = text.trim();
    var todo = {
      _id: newCardId,
      listID: listID,
      text: text,
      dom: card,
      index: index || list.cards+1 
    };
    todos.push(todo);
    
    ++list.cards;
    
    return card;
  }

  function addCard(text, listID, index, updateCounters) {

    var text = prompt("textInput");

    listID = listID || 1;
    if(!text) return false;
    var list = document.getElementById('list_'+listID);
    var card = createCard(text, listID, index);
    if(index) {
      list.insertBefore(card, list.children[index]);
    } else {
      list.appendChild(card);
    }

    if(updateCounters !== false) updateCardCounts();

  }

  function newList(name) {
    name = name.trim();
    if(!name || name === '') return false;
    var newListID = ++_listCounter;
    var list = document.createElement("div");
    var heading = document.createElement("h3");
    var listCounter = document.createElement("span");

    var button = document.createElement("BUTTON");  
    button.innerHTML = "+";
    document.body.appendChild(button);
    button.className = "listButton";
    button.appendChild(list);
    
    list.dataset.id = newListID;
    list.id = 'list_'+newListID;
    list.className = "list";
    list.appendChild(heading);
    
    heading.className = "listname";
    heading.innerHTML = name;
    heading.appendChild(listCounter)

    listCounter.innerHTML = 0;
    
    lists.push({
      _id: newListID,
      name: name,
      cards: 0,
      elCounter: listCounter,
    });
    
    UI.elBoard.append(list);

  }
  
  function getList (obj) {
    return _.find(lists, obj);
  }
  
  function getTodo (obj) {
    return _.find(todos, obj);
  }
  
  function updateCardCounts (listArray) {
    lists.map(function (list) {
      list.elCounter.innerHTML = list.cards;
    })
  }
  
  function moveCard(cardId, newListId, index) {
    if(!cardId) return false;
    try {
      var card = getTodo({_id: cardId});
      if(card.listID !== newListId) {
        --getList({_id: card.listID}).cards;
        card.listID = newListId;
        ++getList({_id: newListId}).cards;
        updateCardCounts();
        moveBar();
      }
    
      if(index){
        card.index = index;
      }
      
    } catch (e) {
      console.log(e.message)
    }
  }
  
  live('submit', '#addCard', function (e) {
    e.preventDefault();
    addCard(_.trim(this.todoText.value));
    this.reset();
    return false;
  });
  live('submit', '#newList', function (e) {
    e.preventDefault();
    newList(_.trim(this.list_name.value));
    this.reset();
    return false;
  });
  
  function getCardPlaceholder () {
    if(!UI.elCardPlaceholder) { 
      UI.elCardPlaceholder = document.createElement('div');
      UI.elCardPlaceholder.className = "card-placeholder";
    }
    return UI.elCardPlaceholder;
  }
  
  function init () {

    newList('To do');
    newList('In Progress');
    newList('Done');

    updateCardCounts();
    
    moveCard(2, 1, 3);
  }

  document.addEventListener("DOMContentLoaded", function() {
    init();
  });
  
})();

  

window.addEventListener('load', onHtmlLoad);

function onHtmlLoad() {
  makeUserList();
  const filterEl = document.getElementById('filter');
  const searchSprintEl = document.getElementById('search-sprint');
  searchSprintEl.addEventListener('keyup', search);
  for (let i = 0; i < status.length; i++) {
    let statusEl = document.createElement('input');
    let labelEl = document.createElement('label');
    statusEl.setAttribute('type', 'checkbox');
    statusEl.setAttribute('name', status[i]);
    statusEl.addEventListener('click', filter);
    labelEl.innerHTML = status[i];
    filterEl.appendChild(statusEl);
    filterEl.appendChild(labelEl);
  }
  const createSprint = document.getElementById('create-sprint');
  createSprint.addEventListener('click', openPopUpForCreateSprint);
  statistics();
}

// DOM Manipulation
function statistics() {
  // console.log(issueList);
  // console.log(sprintList);
  // console.log(commentList);
  let numberOfSprints = sprintList.length;
  let numberOfBugs = 0;
  let numberOfFeatures = 0;
  let statusStatistics = [0, 0, 0, 0, 0, 0];
  const overviewEl = document.getElementById('overview');
  const numberOfSprintsEl = document.getElementById("number-of-sprints");
  const numberOfBugsEl = document.getElementById("number-of-bugs");
  const numberOfFeaturesEl = document.getElementById("number-of-features");
  const numberOfStatusEl = document.getElementsByClassName("number-of-status");
  for(let i = 0; i < issueList.length; i++) {
    if (issueList[i].type === 'Bug') {
      numberOfBugs++;
    } else if (issueList[i].type === 'Feature') {
      numberOfFeatures++;
    }
    for (let j = 0; j < status.length; j++) {
      if (issueList[i].status === status[j]) {
        statusStatistics[j]++;
      }
    }
  }
  for (let i = 0; i < statusStatistics.length; i++) {
    numberOfStatusEl[i].innerHTML = status[i] + ": " + statusStatistics[i];
  }
  numberOfSprintsEl.innerHTML = "Sprints: " + numberOfSprints;
  numberOfBugsEl.innerHTML = "Bugs: " + numberOfBugs;
  numberOfFeaturesEl.innerHTML = "Features: " + numberOfFeatures;
}

function makeUserList(){
  let userListElement = document.getElementById('user-list');
  usersList.forEach(function(element) {
    let radioBttn = document.createElement('input');
    radioBttn.setAttribute('type', 'radio');
    radioBttn.setAttribute('name', 'contact');
    radioBttn.setAttribute('value', element.name);
    radioBttn.setAttribute('id', element.id);
    radioBttn.addEventListener('click', function() {
      document.cookie = 'userId=' + this.id;
    });
    userListElement.appendChild(radioBttn);
    let labelForRadio = document.createElement('label');
    labelForRadio.setAttribute('for', element.id);
    labelForRadio.innerHTML = element.name;
    userListElement.appendChild(labelForRadio);
  });
  userListElement.firstChild.checked = true;
  document.cookie = "userId=" + userListElement.firstChild.id;
}

function makeHtml(issueList, sprintList) {
  const tableSprints = document.getElementById('sprints');
  tableSprints.innerHTML = "";
  //Writes the sprints to the DOM
  sprintList.forEach(function(sprint) {
    const sprintElement = document.createElement('div');
    sprintElement.addEventListener('drop', function(e) {
      drop_handler(e, sprint.id);
    });
    sprintElement.addEventListener('dragover', dragover_handler);
    sprintElement.setAttribute('class', 'drag-in');
    sprintElement.innerHTML = "<div class='sprint'>" + sprint.name + "</div>";
    const createIssueButton = document.createElement('button');
    createIssueButton.addEventListener('click', function(e){
      openPopUpForCreateIssue(e, sprint.id);
    });
    createIssueButton.innerHTML = "Create Issue";
    sprintElement.appendChild(createIssueButton);
    tableSprints.appendChild(sprintElement);
    //Writes issues to the sprints
    issueList.forEach(function(element) {
      if (element.sprint === sprint.id) {
        const insideRow = document.createElement('div');
        // insideRow.setAttribute('class', 'issue')
        insideRow.setAttribute('draggable', true);
        insideRow.addEventListener('dragstart', function(e) {
          dragstart_handler(e, element)
        });
        insideRow.setAttribute('id', element.id);
        const texatareaElement = document.createElement('textarea');
        insideRow.innerHTML = "<div class='table-cell'>Issue:</div>" +
          "<div class='table-cell'>Status: " + element.status + "</div>" +
          "<div class='table-cell'>" + element.name + "</div>" +
          "<div class='table-cell'>" + element.description + "</div>" +
          "<div class='table-cell'>" + element.type + "</div>" +
          "<div class='table-cell'>Created: " + element.createdAt + "</div>" +
          "<div class='table-cell'>Last update: " + element.updatedAt + "</div>";
        const updateButtonEl = document.createElement('button');
        updateButtonEl.innerHTML = 'Update';
        updateButtonEl.addEventListener('click', function(e) {
          openPopUpForUpdateIssue(e, element);
        });
        insideRow.appendChild(updateButtonEl);
        const commentsTab = document.createElement('div');
        commentsTab.setAttribute('class', 'comments-tab');
        if(element.comments.length !== 0) {
          element.comments.forEach(function(el) {
            commentsTab.innerHTML += "<p>" + el.name + "</p>";
          });
        }
        const commentButton = document.createElement('button');
        commentButton.innerHTML = "Add comment";
        commentButton.addEventListener('click', function(e) {
          const comment = new Comments();
          comment.name = texatareaElement.value
          let issueNumber = issueList.find(function(el) {
            if (el.id == element.id) {
              return el;
            }
          });
          issueNumber.comments.push(comment);
          makeHtml(issueList, sprintList);
        });
        insideRow.appendChild(commentsTab);
        insideRow.appendChild(texatareaElement);
        insideRow.appendChild(commentButton);
        if (element.type !== 'task') {
          const tasksElement = document.createElement('div');
          tasksElement.innerHTML = "TASKS";
          insideRow.appendChild(tasksElement);
        }
        sprintElement.appendChild(insideRow);
      }
    });
  });
  statistics();
}

//PopUps
function openPopUpForCreateSprint(){
  const popUpDiv = document.createElement('div');
  popUpDiv.setAttribute('class', 'pop-up');
  const inputForCreateSprint = document.createElement('input');
  const buttonForCreateSprint = document.createElement('button');
  buttonForCreateSprint.innerHTML = 'Create Sprint';
  buttonForCreateSprint.addEventListener('click', function(e){
    let textValue = e.path[1].childNodes[0].value;
    if (textValue !== "") {
      let sprint = new Sprint();
      sprint.name = textValue;
      sprintList.push(sprint);
      makeHtml(issueList, sprintList);
      removePopUp();
    }
  });
  const cancelButtonForCreateSprint = document.createElement('button');
  cancelButtonForCreateSprint.innerHTML = 'Cancel';
  cancelButtonForCreateSprint.setAttribute('onclick', 'removePopUp()');
  popUpDiv.appendChild(inputForCreateSprint);
  popUpDiv.appendChild(buttonForCreateSprint);
  popUpDiv.appendChild(cancelButtonForCreateSprint);
  document.getElementsByTagName('body')[0].appendChild(popUpDiv);
}

function openPopUpForCreateIssue(e, sprintId) {
  const popUpDiv = document.createElement('div');
  popUpDiv.setAttribute('class', 'pop-up');
  popUpDiv.innerHTML = "<div class='sprint'>" +
    "<select><option value='Feature'>Feature</option>" +
      "<option value='Bug'>Bug</option>" +
      "<option value='Task'>Task</option></select></div>" +
      "Name: <input type='text'>" +
      "Asignee: <select>" + makeOptionUserList(0) + "</select>" +
      "Description: <textarea></textarea>";
  const addIssueButton = document.createElement('button');
  addIssueButton.innerHTML = "Create Issue";
  addIssueButton.addEventListener('click', function(e) {
    let nameInput = e.path[1].childNodes[2].value;
    let descriptionInput = e.path[1].childNodes[6].value;
    if(nameInput !== "" && descriptionInput !== "") {
      let selectAssignee = e.path[1].childNodes[4];
      let selectType = e.path[1].childNodes[0].childNodes[0];
      let issue = new Issue();
      issue.name = nameInput;
      issue.description = descriptionInput;
      issue.assignee = selectAssignee.options[selectAssignee.selectedIndex].value;
      issue.sprint = sprintId;
      issue.type = selectType.options[selectType.selectedIndex].value;
      issue.createdBy = getCurrentUser();
      issueList.push(issue);
      makeHtml(issueList, sprintList);
      removePopUp();
    }
  });
  const cancelButtonForCreateSprint = document.createElement('button');
  cancelButtonForCreateSprint.innerHTML = 'Cancel';
  cancelButtonForCreateSprint.setAttribute('onclick', 'removePopUp()');
  popUpDiv.appendChild(addIssueButton);
  popUpDiv.appendChild(cancelButtonForCreateSprint);
  document.getElementsByTagName('body')[0].appendChild(popUpDiv);
}

function openPopUpForUpdateIssue(e, element) {
  const popUpDiv = document.createElement('div');
  popUpDiv.setAttribute('class', 'pop-up');
  popUpDiv.innerHTML = "<div class='sprint'>" +
    "<select>" + makeOptionType(element.type) + "</select></div>" +
      "Name: <input type='text' value='" + element.name + "'>" +
      "Asignee: <select>" + makeOptionUserList(element.assignee) + "</select>" +
      "Description: <textarea>" + element.description + "</textarea>" +
      "Status: <select>" + statusSelect(element.status) + "</select>";
  const addIssueButton = document.createElement('button');
  addIssueButton.innerHTML = "Update Issue";
  addIssueButton.addEventListener('click', function(e) {
    let nameInput = e.path[1].childNodes[2].value;
    let descriptionInput = e.path[1].childNodes[6].value;
    if (nameInput !== "" && descriptionInput !== "") {
      let selectAssignee = e.path[1].childNodes[4];
      let selectType = e.path[1].childNodes[0].childNodes[0];
      let selectStatus = e.path[1].childNodes[8];
      element.name = e.path[1].childNodes[2].value;
      element.description = e.path[1].childNodes[6].value;
      element.assignee = selectAssignee.options[selectAssignee.selectedIndex].value;
      element.type = selectType.options[selectType.selectedIndex].value;
      element.status = selectStatus.options[selectStatus.selectedIndex].value;
      element.updatedAt = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();;
      makeHtml(issueList, sprintList);
      removePopUp();
    }
  })
  const cancelButtonForCreateSprint = document.createElement('button')
  cancelButtonForCreateSprint.innerHTML = 'Cancel';
  cancelButtonForCreateSprint.setAttribute('onclick', 'removePopUp()')
  popUpDiv.appendChild(addIssueButton);
  popUpDiv.appendChild(cancelButtonForCreateSprint);
  document.getElementsByTagName('body')[0].appendChild(popUpDiv)
}

function removePopUp(){
  const popUpDiv = document.getElementsByClassName('pop-up')[0];
  popUpDiv.innerHTML = "";
  popUpDiv.classList.remove('pop-up');
}

//Drag functions
function dragstart_handler(e, element) {
  e.dataTransfer.setData("dragged-id", e.target.id);
  e.dataTransfer.setData("element", element.sprint);
  e.dataTransfer.effectAllowed = 'move';
  e.dropEffect = 'move';
}

function drop_handler(e, sprintId) {
  e.preventDefault();
  let data = e.dataTransfer.getData("dragged-id");
  let element = e.dataTransfer.getData("element");
  // e.target.appendChild(document.getElementById(data));
  for (let i = 0; i < issueList.length; i++) {
    if (issueList[i].id == data) {
      issueList[i].sprint = sprintId;
    }
  }
  makeHtml(issueList, sprintList);
}

function dragover_handler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

//Search and Filter
function filter() {
  let filterEl = document.getElementById('filter');
  let issueListFilter = [];
  let countOfChecked = 0;
  for (let i = 0; i < filterEl.childNodes.length; i++) {
    if (filterEl.childNodes[i].checked && issueList.length !== 0) {
      countOfChecked++;
      for (let j = 0; j < issueList.length; j++){
        if(filterEl.childNodes[i].name === issueList[j].status) {
          issueListFilter.push(issueList[j]);
        }
      }
    }
  }
  countOfChecked === 0 ? makeHtml(issueList, sprintList) : makeHtml(issueListFilter, sprintList);
}

function search() {
  let sprintListSearched = [];
  let searchText = this.value.toLowerCase();
  let countOfLetters = 0;
  if (sprintList.length !== 0) {
    for (let i = 0; i < sprintList.length; i++) {
      countOfLetters++;
      let textName = sprintList[i].name.toLowerCase();
      if(textName.indexOf(searchText) >= 0) {
        sprintListSearched.push(sprintList[i]);
      }
    }
  }
  countOfLetters === 0 ? makeHtml(issueList, sprintList) : makeHtml(issueList, sprintListSearched);
}

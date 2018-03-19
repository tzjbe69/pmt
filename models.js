//GLOBAL variables declaration
var usersList = createUserList();
var issueList = [];
var sprintList = [];
var commentList = [];
var projects = {id: createID(), sprints: []};
const status = ['New', 'In Progress', 'Feedback', 'Rework', 'Resolved', 'Ready for Testing'];

//Class like functions
function User() {
  this.id = 0;
  this.name = "";
}

function Issue() {
  this.id	= createID();
  this.type = "";
  this.name	= "";
  this.sprint	= null
  this.createdBy	= null
  this.assignee	= null
  this.description	= ""
  this.status	= "New";
  this.tasks	= {}
  this.comments	= [];
  this.updatedAt	= new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
  this.createdAt	= new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
}

function Sprint() {
  this.id = createID();
  this.name = "";
}

function Comments() {
  this.id = createID();
  this.name = "";
}

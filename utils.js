let getCurrentUser = () => {
    const cookiesArray = document.cookie.split('; ');
    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].split('=');
        if(cookie[0] === "userId") {
          return parseInt(cookie[1]);
        }
    }
};

function createID() {
  return new Date().getTime();
}

function createUserList() {
  const userList = [];
  let userOne = new User();
  userOne.name = 'Mihai';
  userOne.id = 1;
  userList.push(userOne);
  let userTwo = new User();
  userTwo.name = 'Andreea';
  userTwo.id = 2;
  userList.push(userTwo);
  let userThree = new User();
  userThree.name = 'Alexandra';
  userThree.id = 3;
  userList.push(userThree);
  return userList
}

function makeOptionUserList(userOriginal) {
  let userOption = "";
  usersList.forEach(function (user) {
    userOption += "<option value=" + user.id;
    if (userOriginal == user.id) {
      userOption += " selected"
    }
    userOption += ">" + user.name + "</option>";
  });
  return userOption;
}

function statusSelect(statusOriginal) {
  let statusString = "";
  for (let i = 1; i < status.length; i++) {
    statusString += "<option"
    if (statusOriginal === status[i]){
      statusString += " selected";
    }
    statusString += ">" + status[i] + "</option>";
  }
  return statusString;
}

function makeOptionType(typeOriginal) {
  console.log(typeOriginal);
  let optionString = "<option value='Feature'";
  if (typeOriginal === "Feature") {
    console.log('ok')
    optionString += " selected";
  }
  optionString += ">Feature</option><option value='Bug'"
  if (typeOriginal === "Bug") {
    optionString += " selected";
  }
  optionString += ">Bug</option><option value='Task'";
  if (typeOriginal === "Task") {
    optionString += " selected";
  }
  optionString += ">Task</option>";
  return optionString;
}

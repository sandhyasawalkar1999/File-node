const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Define the file path where tasks are stored
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Create the readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to load tasks from the file
const loadTasks = () => {
  if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([])); // Create empty array if file doesn't exist
  }
  const data = fs.readFileSync(tasksFilePath);
  return JSON.parse(data);
};

// Function to save tasks to the file
const saveTasks = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// Function to add a new task
const addTask = (taskDescription) => {
  const tasks = loadTasks();
  tasks.push({ description: taskDescription, complete: false });
  saveTasks(tasks);
  console.log('Task added!');
};

// Function to view all tasks
const viewTasks = () => {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('No tasks found.');
  } else {
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.description} [${task.complete ? 'Completed' : 'Pending'}]`);
    });
  }
};

// Function to mark a task as complete
const markTaskComplete = (taskIndex) => {
  const tasks = loadTasks();
  if (taskIndex >= 0 && taskIndex < tasks.length) {
    tasks[taskIndex].complete = true;
    saveTasks(tasks);
    console.log('Task marked as complete!');
  } else {
    console.log('Invalid task index.');
  }
};

// Function to remove a task
const removeTask = (taskIndex) => {
  const tasks = loadTasks();
  if (taskIndex >= 0 && taskIndex < tasks.length) {
    tasks.splice(taskIndex, 1); // Remove task at specified index
    saveTasks(tasks);
    console.log('Task removed!');
  } else {
    console.log('Invalid task index.');
  }
};

// Main function to interact with the user
const start = () => {
  rl.question('What would you like to do? (add/view/mark/remove/quit): ', (action) => {
    if (action === 'add') {
      rl.question('Enter task description: ', (description) => {
        addTask(description);
        start();
      });
    } else if (action === 'view') {
      viewTasks();
      start();
    } else if (action === 'mark') {
      rl.question('Enter task number to mark as complete: ', (taskNumber) => {
        markTaskComplete(Number(taskNumber) - 1); // Adjust for zero-based index
        start();
      });
    } else if (action === 'remove') {
      rl.question('Enter task number to remove: ', (taskNumber) => {
        removeTask(Number(taskNumber) - 1); // Adjust for zero-based index
        start();
      });
    } else if (action === 'quit') {
      console.log('Goodbye!');
      rl.close();
    } else {
      console.log('Invalid option. Please try again.');
      start();
    }
  });
};

// Start the task manager
start();

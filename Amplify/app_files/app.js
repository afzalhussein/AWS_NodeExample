import { Amplify, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import { onCreateTodo } from "./graphql/subscriptions";

Amplify.configure(awsconfig);

const MutationButton = document.getElementById("MutationEventButton");
const MutationResult = document.getElementById("MutationResult");
const QueryResult = document.getElementById("QueryResult");
const SubscriptionResult = document.getElementById("SubscriptionResult");

async function createNewTodo() {
  const todo = {
    name: "Use AppSync",
    description: `Realtime and Offline (${new Date().toLocaleString()})`,
  };

  try {
    const result = await API.graphql(graphqlOperation(createTodo, { input: todo }));
    displayMutationResult(result.data.createTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
  }
}

async function getData() {
  try {
    const result = await API.graphql(graphqlOperation(listTodos));
    displayQueryResults(result.data.listTodos.items);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

function displayMutationResult(todo) {
  MutationResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`;
}

function displayQueryResults(todos) {
  QueryResult.innerHTML = ""; // Clear previous results
  todos.forEach((todo) => {
    QueryResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`;
  });
}

function subscribeToNewTodos() {
  API.graphql(graphqlOperation(onCreateTodo)).subscribe({
    next: (evt) => {
      const todo = evt.value.data.onCreateTodo;
      displaySubscriptionResult(todo);
    },
    error: (error) => {
      console.error("Subscription error:", error);
    },
  });
}

function displaySubscriptionResult(todo) {
  SubscriptionResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`;
}

MutationButton.addEventListener("click", () => {
  createNewTodo();
});

// Initial data fetch
getData();
// Subscribe to new todos
subscribeToNewTodos();

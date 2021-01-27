import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import gql from "graphql-tag";

const getAllTodos = gql`
  {
    allTodos {
      id
      title
    }
  }
`;
const MutationOFAddTodo = gql`
  mutation addTodoTask($title: String) {
    addTodoTask(title: $title) {
      title
    }
  }
`;
const MutationOFDeleteTodo = gql`
  mutation deleteTodoTask($id: ID!) {
    deleteTodoTask(id: $id) {
      title
    }
  }
`;
const MutationOFUpdateTodo = gql`
  mutation updateTodoTask($id: ID, $title: String) {
    updateTodoTask(id: $id, title: $title) {
      title
    }
  }
`;
const Index = () => {
  const { loading, error, data } = useQuery(getAllTodos);
  const [input, setInput] = useState("");
  const [todoId, setTodoId] = useState("");
  const [addTodoTask] = useMutation(MutationOFAddTodo);
  const [deleteTodoTask] = useMutation(MutationOFDeleteTodo);
  const [updateTodoTask] = useMutation(MutationOFUpdateTodo);

  const addTodoFromClient = () => {
    addTodoTask({
      variables: {
        title: input,
      },
      refetchQueries: [{ query: getAllTodos }],
    });
    setInput("");
  };
  const updateTodo = () => {
    console.log("Update Todo Inputs===>", todoId, input);
    updateTodoTask({
      variables: {
        id: todoId,
        title: input,
      },
      refetchQueries: [{ query: getAllTodos }],
    });
  };
  const deleteTodo = (e: any) => {
    deleteTodoTask({
      variables: {
        id: e,
      },
      refetchQueries: [{ query: getAllTodos }],
    });
  };
  console.log(data);
  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>;
      </div>
    );
  }
  if (error) {
    <h1>error</h1>;
  }
  return (
    <>
      <div>
        <h1> Hello Gatsby</h1>
        <br />
        <input
          placeholder="Add Task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div>
          <button onClick={addTodoFromClient}>Add Todo Task</button>
        </div>
        <div>
          <button onClick={updateTodo}>Update Todo Task</button>
        </div>
        <div>
          {data?.allTodos.map((item) => {
            return (
              <div key={item.id}>
                <p>{item.title}</p>
                <p>
                  <button onClick={() => deleteTodo(item.id)}>Delete</button>
                  <button onClick={() => setTodoId(item.id)}>Edit Todo</button>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Index;

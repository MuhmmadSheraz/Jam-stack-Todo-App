import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";

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
  const Index = () => {
  const[input,setInput]=useState("")
  const [addTodoTask] = useMutation(MutationOFAddTodo);
  const addTodoFromClient = () => {
    addTodoTask({
      variables: {
        title: input,
      },
      // refetchQueries: [{ query: getAllTodos }],
    });
  };
  return (
    <div>
      <h1> Hello Gatsby</h1>
      <br/>
      <input placeholder="Add Task" onChange={(e)=>setInput(e.target.value)}/>
      <div>
        <button onClick={addTodoFromClient}>Add Todo Task</button>
      </div>
    </div>
  );
};

export default Index;

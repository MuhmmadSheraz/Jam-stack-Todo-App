import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { TiDelete } from "react-icons/ti";
import { RiEditCircleFill } from "react-icons/ri";

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
  const editTodo = (id, title) => {
    console.log(id, title);
    setTodoId(id);
    setInput(title);
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
    setInput("");

    setTodoId("");
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
      <div className="h-screen flex justify-center items-center">
        <p className="text-4xl  text-blue-600">Loading...</p>
      </div>
    );
  }
  if (error) {
    <h1>error</h1>;
  }
  return (
    <div className="h-screen bg-blue-200">
      <h1 className="text-3xl md:text-6xl text-center p-6 text-blue-600">
        JamStack Todo List
      </h1>
      <br />
      <div className="flex justify-center items-center  w-full ">
        {/* Input Field And Button */}
        <div className="flex w-full justify-center mx-3 md:mx-0">
          <input
            placeholder="Add Task"
            className="p-5 text-lg border-blue-500 border-2 rounded md:w-1/2 w-full  font-semibold text-blue-800 focus:outline-none focus:border-blue-700 shadow-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {todoId == "" ? (
            <button
              className="ml-3 text-blue-700 md:px-4 sm:text-xs md:text-lg border-blue-900 border-2 p-0"
              onClick={addTodoFromClient}
            >
              Add Todo
            </button>
          ) : (
            <button
              className="ml-3 text-blue-700 md:px-4 sm:text-xs md:text-lg border-blue-900 border-2 p-0 "
              onClick={updateTodo}
            >
              Update
            </button>
          )}
        </div>
      </div>
      {data?.allTodos.map((item) => {
        return (
          <div className="container px-5 mx-auto w-full" key={item.id}>
            <div className="mt-8 flex justify-between items-center mx-auto  md:w-3/5 shadow-lg bg-blue-300 p-6 my-2">
              <p className=" text-lg sm:text-2xl ">{item.title}</p>
              <div className="flex justify-end">
                <button
                  className="md:mx-5 mx-3 text-blue-900 outline-none ring-0 border-0"
                  onClick={() => editTodo(item.id, item.title)}
                >
                  <RiEditCircleFill className=" text-xl sm:text-3xl" />
                </button>
                <button
                  className="md:mx-5 mx-3 text-blue-900 outline-none ring-0 border-0"
                  onClick={() => deleteTodo(item.id)}
                >
                  <TiDelete className=" text-2xl sm:text-4xl"  />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Index;

"use client";
import CreateTodo from "@/components/CreateToDo";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { getAllTodos } from "@/lib/todo";
import type { ITodo } from "@/models/todo";
import { useEffect, useState } from "react";

const TodoPage: React.FC = () => {
  const [allTodos, setAllTodos] = useState<ITodo[] | undefined>(undefined);
  useEffect(() => {
    const fetchTodos = async () => {
      const all = await getAllTodos();
      setAllTodos(all);
      console.log(all);
    };
    fetchTodos();
  }, []);

  return (
    <>
      <Navbar />
      <div className="m-10">
        <CreateTodo />
      </div>
      <div className="grid grid-cols-2">
        {allTodos?.map((todo) => (
          <Card key={todo.name} className="p-5 m-3">
            <div>{todo.name}</div>
          </Card>
        ))}
      </div>
    </>
  );
};
export default TodoPage;

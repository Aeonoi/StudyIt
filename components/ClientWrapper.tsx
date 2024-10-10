// TODO: Fix and stlye the toast
"use client";
import { useToast } from "@/hooks/use-toast";
import {
  CheckLoginCollection,
  CheckRankCollection,
  CheckSuperTaskCollection,
} from "@/lib/mongo-functions";
import { getNotify, getPriority } from "@/lib/todo";
import type { ITodo } from "@/models/todo";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

// wraps around layout to check collections when app is first started
export default function ClientWrapper({ children }: Props) {
  useEffect(() => {
    const checkCollections = async () => {
      await CheckSuperTaskCollection();
      await CheckRankCollection();
      await CheckLoginCollection();
    };
    checkCollections();

    const showNotify = async () => {
      const todos: ITodo[] | undefined = (await getNotify()) || [];
      if (todos?.length > 0) {
        toast({
          title: "Here are the upcoming deadlines within the next three days",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {todos.map(async (todo) => {
                  const values = {
                    name: todo.name,
                    priority: await getPriority(Number(todo.priority)),
                    DueDate: todo.dueDate,
                    Description: todo.description,
                  };
                  return JSON.stringify(values, null, 2);
                })}
              </code>
            </pre>
          ),
        });
      } else {
        toast({ title: "No upcoming deadlines" });
      }
    };
    showNotify();
  }, []);

  const { toast } = useToast();

  return <>{children}</>;
}

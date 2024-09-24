"use client";
import { nanoid } from "nanoid";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type TodoStatus = "Pending" | "Success";

interface TodoData {
  id: string;
  text: string;
  status: TodoStatus;
}

interface TodoContextType {
  data: TodoData[];
  add: (todo: TodoData) => void;
  remove: (id: TodoData["id"]) => void;
  edit: (id: TodoData["id"], todo: Partial<TodoData>) => void;
  dragData: (newData: TodoData[]) => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<TodoData[]>([]);

  const setlistInStore = useCallback((newTodos: TodoData[]) => {
    localStorage.setItem("todoList", JSON.stringify(newTodos));
  }, []);

  const add = useCallback(
    (todo: TodoData) => {
      const uniqId = nanoid();
      const newData = [...data, { ...todo, id: uniqId }];
      setData(newData);
      setlistInStore(newData);
    },
    [setlistInStore, data]
  );

  const remove = useCallback(
    (id: TodoData["id"]) => {
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
      setlistInStore(newData);
    },
    [setlistInStore, data]
  );

  const edit = useCallback(
    (id: TodoData["id"], todo: Partial<TodoData>) => {
      const newData = data.map((item) => {
        if (item.id === id) {
          return { ...item, ...todo };
        }
        return item;
      });

      setData(newData);
      setlistInStore(newData);
    },
    [setlistInStore, data]
  );

  const dragData = useCallback(
    (newData: TodoData[]) => {
      setData(newData);
      setlistInStore(newData);
    },
    [setlistInStore]
  );

  useEffect(() => {
    const getTodoList = localStorage.getItem("todoList");
    if (getTodoList) {
      setData(JSON.parse(getTodoList));
    }
  }, []);

  return (
    <TodoContext.Provider value={{ data, add, remove, edit, dragData }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodo must be used within 'TodoProvider'");
  return context;
};

export default TodoProvider;

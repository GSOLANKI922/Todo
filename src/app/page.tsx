"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEventHandler, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodo } from "@/context/todoContext";
import { Edit2Icon, Trash } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/components/SortableItem";
import { CustomPagination } from "@/components/CustomPagination";

type TodoStatus = "Pending" | "Success";

interface TodoData {
  id: string;
  text: string;
  status: TodoStatus;
}

export default function Todo() {
  const { data, add, edit, remove, dragData } = useTodo(); // Add setData to handle reordering
  const [value, setValue] = useState<TodoData>({
    id: "0",
    text: "",
    status: "Pending",
  });
  const [currPage, setCurrPage] = useState<number>(1);
  const totalpage = Math.ceil(data.length / 10);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = data.findIndex((item) => item.id === active.id);
      const newIndex = data.findIndex((item) => item.id === over?.id);
      const newData = arrayMove(data, oldIndex, newIndex);
      dragData(newData);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (value.id === "0") {
      add({
        id: Math.random().toString(),
        text: value.text.trim(),
        status: "Pending",
      });
    } else {
      edit(value.id, {
        ...value,
        text: value.text.trim(),
      });
    }
    setValue({ text: "", id: "0", status: "Pending" });
  };

  const previous = () => {
    setCurrPage((prev) => prev - 1);
  };

  const next = () => {
    setCurrPage((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-5xl items-center m-auto border-sky-50 border-2 p-10 bg-black text-slate-50 h-full mt-12 rounded-md">
      <form className="flex gap-2 mb-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter todo text"
          onChange={(e) => setValue({ ...value, text: e?.target.value })}
          value={value?.text}
        />
        <Button type="submit" disabled={!value?.text.trim()}>
          {value.id === "0" ? "Add" : "Edit"}
        </Button>
      </form>
      {data.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">MOVE</TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>List</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Complete</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data
                  .slice(currPage * 10 - 10, currPage * 10)
                  .map((item, index) => (
                    <SortableItem key={item.id} id={item.id}>
                      <TableCell className="font-medium">
                        {currPage === 1 ? "" : currPage - 1}
                        {index + 1}
                      </TableCell>
                      <TableCell
                        className={`${
                          item.status === "Success" ? "line-through" : ""
                        } first-letter:capitalize`}
                      >
                        {item.text}
                      </TableCell>
                      <TableCell
                        className={`text-lg ${
                          item.status === "Pending"
                            ? "text-red-700"
                            : "text-green-700"
                        }`}
                      >
                        {item.status}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          className="border-white"
                          checked={item.status !== "Pending"}
                          onClick={() => {
                            edit(item.id, {
                              id: item.id,
                              text: item.text,
                              status: (item.status === "Pending"
                                ? "Success"
                                : "Pending") as TodoStatus,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-blue-500 hover:border-blue-800"
                          onClick={() => {
                            console.log(item, "item");
                            setValue({ ...item });
                          }}
                        >
                          <Edit2Icon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-red-500 hover:border-red-800"
                          onClick={() => remove(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </SortableItem>
                  ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      )}
      {totalpage > 1 && (
        <CustomPagination
          total={totalpage}
          currPage={currPage}
          previous={previous}
          next={next}
        />
      )}
    </div>
  );
}

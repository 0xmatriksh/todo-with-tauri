import Database from "tauri-plugin-sql-api";
import { Todo } from "../App";

export const db = await Database.load("sqlite:test.db");

export async function getTodosDB() {
  return await db.select<Todo[]>("SELECT * FROM todo").then((todos: Todo[]) => {
    return todos.map((todo) => {
      return {
        ...todo,
        done: todo.done === true,
      };
    });
  });
}

export async function addTodoDB(taskName: string | undefined) {
  return await db.execute("INSERT INTO todo (text, done) VALUES ($1, $2)", [
    taskName,
    false,
  ]);
}

export async function deleteTodoDB(id: number) {
  return await db.execute("DELETE FROM todo WHERE id = ?", [id]);
}

export async function updateTodoDB(id: number, done: boolean) {
  return await db.execute("UPDATE todo SET done = ? WHERE id = ?", [done, id]);
}

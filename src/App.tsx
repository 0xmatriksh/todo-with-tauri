import { createSignal } from "solid-js";
import "./App.css";
import { addTodoDB, deleteTodoDB, getTodosDB, updateTodoDB } from "./db";
import { getThemeStore, setThemeStore } from "./store";

export type Todo = {
  id: number;
  text: string | undefined;
  done: boolean;
};

const THEMES = ["synthwave", "light", "dark"];
export type ThemeType = "dark" | "light" | "synthwave";

const [todoList, setTodoList] = createSignal<Todo[]>(await getTodosDB());
const [theme, setTheme] = createSignal<ThemeType>(
  ((await getThemeStore()) as ThemeType) || "synthwave"
);

async function updateTheme() {
  const themeFromStore = (await getThemeStore()) as ThemeType;
  setTheme(themeFromStore);
}

async function updateTodoData() {
  const todos = await getTodosDB();
  setTodoList(todos);
}

function App() {
  async function addTodo(
    e: Event & {
      submitter: HTMLElement;
    } & {
      currentTarget: HTMLFormElement;
      target: Element;
    }
  ) {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const taskName = data.get("name")?.toString();

    addTodoDB(taskName);
    updateTodoData();
  }

  function _updateTheme(
    e: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement }
  ) {
    const themeSelected = e.currentTarget.value;
    setThemeStore(themeSelected as ThemeType);
    updateTheme();
  }

  return (
    <main
      class={`flex flex-col items-center justify-center h-screen space-y-4 `}
      data-theme={theme()}
    >
      <h1 class="text-3xl font-bold ">Todos</h1>
      <select id="theme" onChange={_updateTheme}>
        {THEMES.map((_theme) => (
          <option value={_theme}>{_theme.toUpperCase()}</option>
        ))}
      </select>
      <form class="form-control flex flex-row gap-3" onSubmit={addTodo}>
        <input
          type="text"
          name="name"
          class="input"
          placeholder="What needs to be done?"
        />
        <button type="submit" class="">
          Add
        </button>
      </form>
      <div class="flex flex-col gap-2 pt-10">
        {todoList().map((todo) => {
          return <Todo todo={todo} />;
        })}{" "}
      </div>
    </main>
  );
}

function Todo(props: { todo: Todo }) {
  async function deleteTodo() {
    deleteTodoDB(props.todo.id);
    await updateTodoData();
  }
  async function toggleTodo() {
    updateTodoDB(props.todo.id, !props.todo.done);
    await updateTodoData();
  }
  return (
    <li class="flex justify-between items-center min-w-[50vw]">
      <h2 class={`${props.todo.done ? "line-through" : ""}`}>
        {" "}
        {props.todo.done ? "✔️" : "❌"} {props.todo.text}
      </h2>
      <div class="flex gap-2 items-center">
        <input
          type="checkbox"
          class="checkbox"
          checked={props.todo.done}
          onChange={toggleTodo}
        />
        <button class="btn btn-error btn-sm" onClick={deleteTodo}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default App;

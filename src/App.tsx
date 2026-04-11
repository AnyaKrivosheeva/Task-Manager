import AddTaskForm from "./components/AddTaskForm/AddTaskForm"
import TaskList from "./components/TaskList/TaskList"

function App() {
  return (
    <>
      <h1>Список твоих делишек</h1>
      <AddTaskForm />
      <TaskList />
    </>
  )
}

export default App

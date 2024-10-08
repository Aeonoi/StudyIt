import CreateTodo from "@/components/CreateToDo";
import Navbar from "@/components/Navbar";

const TodoPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="m-10">
        <CreateTodo />
      </div>
      {/* Show all todos */}
    </>
  );
};
export default TodoPage;

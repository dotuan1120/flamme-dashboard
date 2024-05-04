import { Button } from "@mui/material";
import TodoList from "./TodoList";

const Home = () => {
  return (
    <div className='grid grid-cols-3 gap-2'>
      <div className='flex col-start-2'>
        <Button href='/dashboard' className='me-3' variant="contained">
          Dashboard
        </Button>
      </div>
      <div className="col-start-2">
        <TodoList />
      </div>
    </div>
  );
};

export default Home

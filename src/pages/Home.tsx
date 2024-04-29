import { Button } from "@mui/material";

const Home = () => {
  return (
    <div className='grid grid-cols-3 gap-2'>
      {/* <Container className='d-flex justify-content-center'> */}
        {/* <Card className='col-start-2 flex flex-col gap-2'> */}
          <div className='flex'>
            <Button href='/table' className='me-3' variant="contained">
              Table
            </Button>
            {/* <Button href='/register'>
              Register
            </Button> */}
          </div>
        {/* </Card> */}
      {/* </Container> */}
    </div>
  );
};

export default Home

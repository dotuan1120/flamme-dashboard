import { loadUser, register as registerMutation } from "../store/authSlice";
import { Controller, useForm } from 'react-hook-form';

import RequestResponseType from '../types/api';
import { useAppDispatch } from '../store/store';
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Button, TextField } from "@mui/material";

type Inputs = {
  username: string;
  password: string;
  name?: string;
  email?: string;
};

const Register = () => {
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // const [register, { isLoading }] = useRegisterMutation();

  // const { userInfo } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (userInfo) {
  //     navigate('/');
  //   }
  // }, [navigate, userInfo]);
  const loadUserCallback = useCallback(() => {
    return dispatch(loadUser());
  }, [dispatch]);

  const { register, handleSubmit, control, formState: { errors } } = useForm<Inputs>();
  const onSubmit = (data: Inputs) => {
    console.log('🚀 ~ onSubmit ~ data:', data)
    try {
      // const res = await useLoginMutation({ username: data.username, password: data.password }).unwrap();
      dispatch(registerMutation(data)).then((response: any) => {
        console.log('🚀 ~ dispatch ~ response:', response)
        let responseData = response.payload as RequestResponseType<String>;
        console.log('🚀 ~ dispatch ~ responseData:', responseData)
        if (!responseData.success) {
          throw new Error(responseData.message);
          // setAlert({ type: "danger", message: responseData.message });
          // setTimeout(() => setAlert(null), 1500);
        }
        loadUserCallback().then(() => {navigate('/')})
      });
    } catch (error) {}
  };

  // const submitHandler = async (e) => {
  //   e.preventDefault();

  //   if (password !== confirmPassword) {
  //     toast.error('Passwords do not match');
  //   } else {
  //     try {
  //       const res = await register({ name, email, password }).unwrap();
  //       dispatch(setCredentials({ ...res }));
  //       navigate('/');
  //     } catch (err) {
  //       toast.error(err?.data?.message || err.error);
  //     }
  //   }
  // };
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
      <form onSubmit={handleSubmit(onSubmit)} className="col-start-2 flex flex-col gap-2">
        {/* register your input into the hook by invoking the "register" function */}
        <label><span className="text-red-500">*</span> Username</label>
        <Controller
          name="username"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <TextField error={!!errors.username} {...field}/>}
        />

        {/* include validation with required or other standard HTML validation rules */}

        <label>Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <TextField {...field}/>}
          />

        <label>Email</label>
          <Controller
            name="email"
            control={control}
            rules={{
              pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "invalid email address"
            }}}
            render={({ field }) => <TextField error={!!errors.email} {...field}/>}
          />

        <label><span className="text-red-500">*</span> Password</label>
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <TextField error={!!errors.password} {...field} />}
        />
{/*
        <label>Confirm password:</label>
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Input.Password {...field} />}
          /> */}
        {/* errors will return when field validation fails  */}
        {/* {errors.password && <span>This field is required</span>} */}

        <Button variant="contained" type="submit">
          Register
        </Button>
      </form>
      </div>
    </>
  );
};

export default Register;
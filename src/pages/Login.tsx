import React, { useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import AlertMessage, { AlertMessageType } from "../layout/AlertMessage";
import { loadUser, login } from "../store/authSlice";
import { Controller, useForm } from "react-hook-form";
import RequestResponseType from "../types/api";
import { useAppDispatch, useAppSelector } from "../store/store";
import { Button, TextField } from "@mui/material";
import { LOCAL_STORAGE_AUTH } from "../common/constants";

type Inputs = {
  username: string;
  password: string;
};
const Login = () => {
  // Redux
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // Get redirect location or provide fallback
  const from = location.state?.from || "/";
  const user = useAppSelector((state) => state.auth.user);

  // const [login, { isLoading }] = useLoginMutation();

  // States
  // const [loginForm, setLoginForm] = useState<Inputs>({
  //   username: "",
  //   password: "",
  // });
  // const [alert, setAlert] = useState<AlertMessageType | null>(null);

  // Variables
  // const { username, password } = loginForm;

  // Functions
  // const onChangeLoginForm = (event: React.ChangeEvent<HTMLInputElement>) =>
  //   setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

  // const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   try {
  //     dispatch(login(loginForm)).then((response: any) => {
  //       let responseData = response.payload as RequestResponseType<String>;
  //       if (!responseData.success) {
  //         setAlert({ type: "danger", message: responseData.message });
  //         setTimeout(() => setAlert(null), 1500);
  //       } else {
  //         loadUserCallback();
  //       }
  //     });
  //   } catch (error) {}
  // };

  useEffect(() => {
    if (!!localStorage[LOCAL_STORAGE_AUTH]) {
      navigate(from, { replace: true });
    }
  }, []);
  // const loadUserCallback = useCallback(() => {
  //   return dispatch(loadUser());
  // }, [dispatch]);

  const { register, handleSubmit, control, formState: { errors } } = useForm<Inputs>();
  const onSubmit = (data: Inputs) => {
    try {
      // const res = await useLoginMutation({ username: data.username, password: data.password }).unwrap();
      dispatch(login(data)).then((response: any) => {
        console.log('🚀 ~ dispatch ~ response:', response)
        let responseData = response.payload as RequestResponseType<String>;
        if (!responseData.success) {
          throw new Error(responseData.message);
          // setAlert({ type: "danger", message: responseData.message });
          // setTimeout(() => setAlert(null), 1500);
        }
        // in auth callback logic, once authenticated navigate (redirect) back
        // to the route originally being accessed.
        navigate(from, { replace: true });
      });
    } catch (error) {}
  };

  // console.log(watch("example"))

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
      <form onSubmit={handleSubmit(onSubmit)} className="col-start-2 flex flex-col gap-2">
        {/* register your input into the hook by invoking the "register" function */}
        <label>Username:</label>
        <Controller
          name="username"
          control={control}
          rules={{ required: true }}
          defaultValue="flamme_tuando"
          render={({ field }) => <TextField variant="outlined" {...field}/>}
        />

        {/* include validation with required or other standard HTML validation rules */}

        <label>Password:</label>
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          defaultValue="123456"
          render={({ field }) => <TextField {...field} variant="outlined" type="password"/>}
        />
        {/* errors will return when field validation fails  */}
        {/* {errors.password && <span>This field is required</span>} */}

        <Button variant="contained" type="submit">
          Login
        </Button>
      </form>
      <div className="col-start-2">
        Don't have an account?
        <Link to="/register">
          <Button style={{ marginLeft: "1rem" }}>
            Register
          </Button>
        </Link>
      </div>
      </div>
    </>
  );
};

export default Login;
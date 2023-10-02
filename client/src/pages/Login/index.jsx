import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid } //Хук useForm вернет нам formState и из него мы вытащим объект 
  } = useForm({
    defaultValues: {
      email: "erichkrause2013@tut.by",
      password: "123456"
    },
    mode: 'onChange' //Валидация будет происходить только если поля поменялись
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));

    if(!data.payload) {
      return alert('Не удалось авторизоваться')
    }

    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  if(isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      {/* handleSubmit выполнит функцию onSubmit только если эти два поля корректно провалидированы */}
      <form onSubmit={handleSubmit(onSubmit)}> 
        <TextField 
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message} //Вытаскиваем сообщение об ошибке ?.message означает проверку на то, есть ли email
          type="email"
          {...register('email', { required: 'Укажите почту' })}
          fullWidth
        />

        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Напишите пароль' })}
          fullWidth
        />

        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>

    </Paper>
  );
};

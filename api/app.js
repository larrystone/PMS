// import express from 'express';
const express = require('express');

const app = express();

app.get('/', (_req, res) => {
  res.send('Welcome to the Population Management System!');
});

app.get('/ping', (_req, res) => {
  res.status(200).json('PONG!');
});

app.listen(3000, () => {
  console.log('App is live on PORT:' + 3000);
});


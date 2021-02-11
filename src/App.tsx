import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './layout/index';
import Header from './header/index';
import './App.global.css';

export default function App() {
  return (
    <>
      <Header />
      <Router>
        <Layout />
      </Router>
    </>
  );
}

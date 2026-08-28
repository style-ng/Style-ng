import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicSite from './pages/PublicSite.jsx';
import AdminApp from './admin/AdminApp.jsx';
import LearnIndex from './pages/LearnIndex.jsx';
import Article from './pages/Article.jsx';
import './styles/site.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="/learn" element={<LearnIndex />} />
        <Route path="/learn/:slug" element={<Article />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


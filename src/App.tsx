// import { useState } from "react";
// import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Search from "./Search.tsx";
import Gallery from "./Gallery.tsx";
import DetailView from "./DetailView.tsx";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <nav>
        <Link to="/">Pokedex</Link>
        <Link to="/">Search</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/pokemon/:id" element={<DetailView />} />
      </Routes>
    </BrowserRouter>
  );
}

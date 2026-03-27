/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App; 
*/
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArtworkList from "./pages/ArtworkList";
import AddArtwork from "./pages/AddArtwork";
import EditArtwork from "./pages/EditArtwork";
import ArtworkDetails from "./pages/ArtworkDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ArtworkList />} />
        <Route path="/add-artwork" element={<AddArtwork />} />
        <Route path="/edit-artwork/:id" element={<EditArtwork />} />
        <Route path="/artworks/:id" element={<ArtworkDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

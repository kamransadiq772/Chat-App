import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/chats' element={<ChatPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;

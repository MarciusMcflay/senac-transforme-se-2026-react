import { Routes, Route } from 'react-router'
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import Painel from './pages/Painel.jsx';

function App(){
  return (
    <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/auth" element={ <Auth />} />
        <Route path="/painel" element={ <Painel />} />
    </Routes>
  )
}

export default App;
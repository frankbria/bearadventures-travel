import { jsx as _jsx } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './styles/App.css';
function App() {
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsx(Routes, { children: _jsx(Route, { path: "/", element: _jsx(HomePage, {}) }) }) }));
}
export default App;

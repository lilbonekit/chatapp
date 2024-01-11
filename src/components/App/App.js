import './App.css'

import { Routes, Route } from 'react-router-dom'

import Layout from '../../pages/Layout/Layout'
import LoginPage from '../../pages/LoginPage/LoginPage'
import RegisterPage from '../../pages/RegisterPage/RegisterPage'
import HomePage from '../../pages/HomePage/HomePage'

function App() {

	return (
		<div className="App">
			<Routes>
				<Route path='/' element={<Layout/>}>
						<Route path="login" element={<LoginPage />} />
						<Route path="register" element={<RegisterPage />} />
						<Route path="home" element={<HomePage />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;

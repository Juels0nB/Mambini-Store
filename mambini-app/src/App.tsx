import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.tsx";
import Footer from "./components/Footer.tsx";
import HomeScreen from "./components/HomeScreen.tsx";
import ProductsPage from "./components/ProductsScreen.tsx";
import Cart from "./components/Cart.tsx";
import Detail from "./components/Detail.tsx";

function App() {
    return (
        <Router>
            <div className="bg-gray-100 min-h-screen">
            <NavBar />
                <main className="pt-10">
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/product/:id" element={<Detail />} />

                </Routes>
                </main>
            <Footer/>
            </div>
        </Router>
    )
}

export default App


import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.tsx";
import Footer from "./components/Footer.tsx";
import HomePage from "./Pages/HomePage.tsx";
import ProductsPage from "./Pages/ProductsPage.tsx";
import LoginPage from "./Pages/LoginPage.tsx";
import RegisterPage from "./Pages/RegisterPage.tsx";
import ProfilePage from "./Pages/ProfilePage.tsx";
import AdminDashboard from "./Pages/Admin/AdminDashboard.tsx";
import CartPage from "./Pages/CartPage.tsx";
import DetailPage from "./Pages/DetailPage.tsx";
import Returns from "./Pages/Returns.tsx";
import Shipping from "./Pages/Shipping.tsx";
import FAQ from "./Pages/Faq.tsx";
import Contact from "./Pages/ContactUs.tsx";

function App() {
    return (
        <Router>
            <div className="flex flex-col bg-gray-100  min-h-screen">
            <NavBar />
                <main className="pt-10">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/detail" element={<DetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminDashboard />} />

                    <Route path="/return" element={<Returns />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/us" element={<Contact />} />
                </Routes>
                </main>
            <Footer/>
            </div>
        </Router>
    )
}

export default App


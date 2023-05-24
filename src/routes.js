import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home"
import Repositorio from "./pages/Repositorio/Repositorio"

 const Nav = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home />}/>
                <Route exact path="/repositorio/:id" element={<Repositorio />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Nav;
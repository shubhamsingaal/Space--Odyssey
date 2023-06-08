import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Home from "./components/home"
import Auth from "./components/auth"

import NotFound from "./components/notfound"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/auth" element={<Auth />} />

        <Route exact path="/404" element={<NotFound />} />

        <Route exact path="*" element={<Navigate to="/404" />} />
        <Route exact path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
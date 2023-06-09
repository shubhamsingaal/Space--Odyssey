import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Home from "./components/home"
import Auth from "./components/auth"
import Events from "./components/events"
import Contact from "./components/contact"
import NotFound from "./components/notfound"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/auth" element={<Auth />} />
        <Route exact path="/events" element={<Events />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/404" element={<NotFound />} />
        <Route exact path="*" element={<Navigate to="/404" />} />
        <Route exact path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
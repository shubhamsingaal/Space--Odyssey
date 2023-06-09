import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Home from "./components/home"
import Events from "./components/events"
import Contact from "./components/contact"
import NotFound from "./components/notfound"
import Timeline from "./components/timeline"


function App() {
  return (
    <BrowserRouter>
      <Routes>
    
        <Route exact path="/events" element={<Events />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/timeline" element={<Timeline />} />
        <Route exact path="/404" element={<NotFound />} />
        <Route exact path="*" element={<Navigate to="/404" />} />
        <Route exact path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
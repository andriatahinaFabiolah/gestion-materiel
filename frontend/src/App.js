import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MaterielList from "./pages/materiels/MaterielList";
import MaterielAdd from "./pages/materiels/MaterielAdd";
import CategoryList from "./pages/categories/CategoryList";
import MaterielEdit from "./pages/materiels/MaterielEdit";
import DirectionList from "./pages/direction/DirectionList";
import PorteList from "./pages/portes/PorteList";
import AffectationAdd from "./pages/affectations/AffectationAdd";
import AffectationList from "./pages/affectations/AffectationList";
import Dashboard from "./pages/dashboard/Dashboard";
import LoginPage from "./pages/connection/LoginPage";
import RegisterPage from "./pages/inscription/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/materiels" element={<MaterielList />} />
        <Route path="/materiels/add" element={<MaterielAdd />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/materiels/edit/:id" element={<MaterielEdit />} />
        <Route path="/direction" element={<DirectionList />} />
        <Route path="/portes" element={<PorteList />} />
        <Route path="/affectations/add" element={<AffectationAdd />} />
        <Route path="/affectations" element={<AffectationList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

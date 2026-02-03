import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompanyList from "./pages/CompanyList";
import CompanyDetail from "./pages/CompanyDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CompanyList />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import './App.css'

// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { Layout } from "./components/Layout";
// import { PdfProvider } from "./components/PdfModal";
// import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
// import { LevelPage } from "./pages/LevelPage";
// import { PastPapersPage } from "./pages/PastPapersPage";
// import { SubtopicsPage } from "./pages/SubtopicsPage";
// import { TopicsPage } from "./pages/TopicsPage";

function App() {
  return (
    <>
    <p>Hello, World!</p>
    <HomePage />
    {/* <BrowserRouter>
      <PdfProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/:examLevel" element={<LevelPage />} />
            <Route path="/:examLevel/past-papers" element={<PastPapersPage />} />
            <Route path="/:examLevel/topics" element={<TopicsPage />} />
            <Route path="/:examLevel/topics/:topic" element={<SubtopicsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </PdfProvider>
    </BrowserRouter> */}
    </>
  )
}

export default App

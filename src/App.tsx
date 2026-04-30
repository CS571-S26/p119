import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Layout } from "@/components/layout/layout"
import { HomePage } from "@/pages/home"
import { AboutPage } from "@/pages/about"
import { CoursePage } from "@/pages/course"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="course/:courseId" element={<CoursePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

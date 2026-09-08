import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import LevelPage from "./pages/LevelPage";
import PastPapersPage from "./pages/PastPapersPage";
import TopicsPage from "./pages/TopicsPage";
import SubtopicPage from "./pages/SubtopicPage";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: ":level", Component: LevelPage },
      { path: ":level/past-papers", Component: PastPapersPage },
      { path: ":level/topics", Component: TopicsPage },
      { path: ":level/topics/:topic", Component: SubtopicPage },
      { path: "*", Component: NotFound },
    ],
  },
]);

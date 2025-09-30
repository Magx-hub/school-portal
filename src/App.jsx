// App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PWABadge from './PWABadge';

const LessonPlanManager = lazy(() => import('./pages/LessonPlanManager'));
// const LessonPlanGenerator = lazy(() => import('./pages/LessonPlanGenerator'));
const QuestionBankManager = lazy(() => import('./pages/QuestionBankManager'));
const TimetableManager = lazy(() => import('./pages/TimetableManager'));

function App() {
  return (
    <Router>
      <div className="m-0 bg-slate-800 border-b border-slate-700 flex items-center">
        <div className="p-4 mt-4">
          <h4 className="text-amber-400 font-bold text-2xl">MagMax Educational Centre</h4>
          <h6 className="text-white mt-2">Teachers' Digital Platform</h6>
        </div>
      </div>
      <nav className="p-4 bg-slate-800 text-amber-200 flex gap-4 overflow-x-auto">
        <Link to="/lessonplans">Lesson Plan</Link>
        <Link to="/questions">Question Bank</Link>
        <Link to="/timetables">TimeTable</Link>
      </nav>

      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LessonPlanManager />} />
          <Route path="/lessonplans" element={<LessonPlanManager />} />
          <Route path="/questions" element={<QuestionBankManager />} />
          <Route path="/timetables" element={<TimetableManager />} />
        </Routes>
      </Suspense>

      <PWABadge />
    </Router>
  );
}

export default App;

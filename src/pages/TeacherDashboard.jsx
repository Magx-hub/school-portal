import { Component } from 'react';
import LessonPlanManager from "./LessonPlanManager";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
          <h2 className="text-red-800 font-bold mb-2">Something went wrong</h2>
          <p className="text-red-600">Please refresh the page or try again later.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function TeacherDashboard() {
  return (
    <div className="bg-slate-300 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
        <p>Welcome to the Teacher Dashboard!</p>
      </div>
      <ErrorBoundary>
        <LessonPlanManager />
      </ErrorBoundary>
    </div>
  );
}
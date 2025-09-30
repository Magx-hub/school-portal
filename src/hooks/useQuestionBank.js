import { useState, useEffect } from 'react';
import {
  initDBWithDefaults,
  addQuestion,
  getAllQuestions,
  getQuestionsByClassAndSubject,
  getQuestionsByType,
  getMCQQuestionsForTest,
  updateQuestion,
  deleteQuestion,
  searchQuestions,
  getQuestionsByFilters,
  getQuestionsCount
} from '../utils/questionBankService';

export const useQuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Initialize the database and load questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        await initDBWithDefaults();
        const data = await getAllQuestions();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError('Failed to load questions. Please try again.');
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Add a new question
  const addNewQuestion = async (questionData) => {
    try {
      setLoading(true);
      const id = await addQuestion(questionData);
      const updatedQuestions = await getAllQuestions();
      setQuestions(updatedQuestions);
      setNotification({
        message: 'Question added successfully!',
        type: 'success'
      });
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Failed to add question:', err);
      setNotification({
        message: 'Failed to add question. Please try again.',
        type: 'error'
      });
      setLoading(false);
      return false;
    }
  };

  // Update an existing question
  const updateExistingQuestion = async (questionData) => {
    try {
      setLoading(true);
      await updateQuestion(questionData);
      const updatedQuestions = await getAllQuestions();
      setQuestions(updatedQuestions);
      setNotification({
        message: 'Question updated successfully!',
        type: 'success'
      });
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Failed to update question:', err);
      setNotification({
        message: 'Failed to update question. Please try again.',
        type: 'error'
      });
      setLoading(false);
      return false;
    }
  };

  // Delete a question
  const deleteExistingQuestion = async (id) => {
    try {
      setLoading(true);
      await deleteQuestion(id);
      const updatedQuestions = await getAllQuestions();
      setQuestions(updatedQuestions);
      setNotification({
        message: 'Question deleted successfully!',
        type: 'success'
      });
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Failed to delete question:', err);
      setNotification({
        message: 'Failed to delete question. Please try again.',
        type: 'error'
      });
      setLoading(false);
      return false;
    }
  };

  // Filter questions by class and subject
  const filterQuestions = async (classValue, subject) => {
    try {
      setLoading(true);
      const filteredQuestions = await getQuestionsByClassAndSubject(classValue, subject);
      setQuestions(filteredQuestions);
      setLoading(false);
    } catch (err) {
      console.error('Failed to filter questions:', err);
      setNotification({
        message: 'Failed to filter questions. Please try again.',
        type: 'error'
      });
      setLoading(false);
    }
  };

  // Reset filters and load all questions
  const resetFilters = async () => {
    try {
      setLoading(true);
      const allQuestions = await getAllQuestions();
      setQuestions(allQuestions);
      setLoading(false);
    } catch (err) {
      console.error('Failed to reset filters:', err);
      setNotification({
        message: 'Failed to reset filters. Please try again.',
        type: 'error'
      });
      setLoading(false);
    }
  };

  // Generate MCQ test
  const generateMCQTest = async (classValue, subject, count) => {
    try {
      setLoading(true);
      const testQuestions = await getMCQQuestionsForTest(classValue, subject, count);
      setLoading(false);
      
      if (testQuestions.length < count) {
        setNotification({
          message: `Only ${testQuestions.length} MCQ questions available for the selected criteria.`,
          type: 'warning'
        });
      }
      
      return testQuestions;
    } catch (err) {
      console.error('Failed to generate test:', err);
      setNotification({
        message: 'Failed to generate test. Please try again.',
        type: 'error'
      });
      setLoading(false);
      return [];
    }
  };

  // Search questions
  const searchQuestionsText = async (searchTerm) => {
    try {
      setLoading(true);
      const searchResults = await searchQuestions(searchTerm);
      setQuestions(searchResults);
      setLoading(false);
    } catch (err) {
      console.error('Failed to search questions:', err);
      setNotification({
        message: 'Failed to search questions. Please try again.',
        type: 'error'
      });
      setLoading(false);
    }
  };

  // Filter questions by multiple criteria
  const filterQuestionsByMultiple = async (filters) => {
    try {
      setLoading(true);
      const filteredQuestions = await getQuestionsByFilters(filters);
      setQuestions(filteredQuestions);
      setLoading(false);
    } catch (err) {
      console.error('Failed to filter questions:', err);
      setNotification({
        message: 'Failed to filter questions. Please try again.',
        type: 'error'
      });
      setLoading(false);
    }
  };

  // Get questions count
  const getCount = async (classValue, subject) => {
    try {
      return await getQuestionsCount(classValue, subject);
    } catch (err) {
      console.error('Failed to get questions count:', err);
      return 0;
    }
  };

  return {
    questions,
    loading,
    error,
    notification,
    setNotification,
    addNewQuestion,
    updateExistingQuestion,
    deleteExistingQuestion,
    filterQuestions,
    resetFilters,
    generateMCQTest,
    searchQuestionsText,
    filterQuestionsByMultiple,
    getCount
  };
};
import { db } from './db';


// Load default questions from JSON file
export const loadDefaultQuestions = async () => {
  try {
    const response = await fetch('/data/english_questions.json');
    const data = await response.json();

    const transformedQuestions = data.questions.map(q => ({
      class: 'Basic 7',
      subject: 'English Language',
      question_type: 'MCQ',
      question: q.question,
      options: q.options,
      correctAnswer: q.options.indexOf(q.answer),
      answer: q.answer,
      createdAt: new Date().toISOString()
    }));

    await db.questions.bulkAdd(transformedQuestions);
    return transformedQuestions.length;
  } catch (error) {
    console.error('Failed to load default questions:', error);
    throw error;
  }
};

// Initialize database and load default questions if empty
export const initDBWithDefaults = async () => {
  const existingQuestions = await db.questions.count();
  
  if (existingQuestions === 0) {
    console.log('No questions found, loading default questions...');
    await loadDefaultQuestions();
    console.log('Default questions loaded successfully');
  }
  
  return db;
};

// Add a new question
export const addQuestion = async (question) => {
  const questionWithTimestamp = {
    ...question,
    createdAt: new Date().toISOString()
  };
  return await db.questions.add(questionWithTimestamp);
};

// Get all questions
export const getAllQuestions = async () => {
  return await db.questions.toArray();
};

// Get questions by class and subject (with fallback to JSON)
export const getQuestionsByClassAndSubject = async (classValue, subject) => {
  let filteredQuestions = await db.questions
    .where({ class: classValue, subject: subject })
    .toArray();

  // If no questions found in database, try JSON file
  if (filteredQuestions.length === 0) {
    console.log('No questions found in database, loading from JSON...');
    filteredQuestions = await getQuestionsFromJSON(classValue, subject);
  }

  return filteredQuestions;
};

// Get questions by type
export const getQuestionsByType = async (type) => {
  return await db.questions
    .where('question_type')
    .equals(type)
    .toArray();
};

// Get questions from JSON file directly
export const getQuestionsFromJSON = async (classValue, subject) => {
  try {
    const response = await fetch('/data/english_questions.json');
    const data = await response.json();

    const transformedQuestions = data.questions.map(q => ({
      id: q.id,
      class: classValue || 'Basic 7', // Use provided class or default
      subject: subject || 'English Language', // Use provided subject or default
      question_type: 'MCQ',
      question: q.question,
      options: q.options,
      correctAnswer: q.options.indexOf(q.answer),
      answer: q.answer,
      createdAt: new Date().toISOString()
    }));

    // If specific class/subject requested, filter by them
    if (classValue && subject) {
      return transformedQuestions.filter(q =>
        q.class === classValue && q.subject === subject
      );
    }

    // Otherwise return all questions with the requested class/subject
    return transformedQuestions;
  } catch (error) {
    console.error('Failed to load questions from JSON:', error);
    return [];
  }
};

// Get MCQ questions for test generation (with fallback to JSON)
export const getMCQQuestionsForTest = async (classValue, subject, count) => {
  let questions = await getQuestionsByClassAndSubject(classValue, subject);
  let mcqQuestions = questions.filter(q => q.question_type === 'MCQ');

  if (mcqQuestions.length === 0) {
    console.log('No questions found in database for', classValue, subject, ', loading from JSON...');
    // Try to load from JSON with the requested class/subject
    questions = await getQuestionsFromJSON(classValue, subject);
    mcqQuestions = questions.filter(q => q.question_type === 'MCQ');

    // If still no questions found, try loading default questions
    if (mcqQuestions.length === 0) {
      console.log('No questions found for requested criteria, loading default English questions...');
      questions = await getQuestionsFromJSON('Basic 7', 'English Language');
      mcqQuestions = questions.filter(q => q.question_type === 'MCQ');
    }
  }

  return shuffleArray(mcqQuestions).slice(0, count);
};

// Update a question
export const updateQuestion = async (question) => {
  return await db.questions.put(question);
};

// Delete a question
export const deleteQuestion = async (id) => {
  return await db.questions.delete(id);
};

// Search questions by text
export const searchQuestions = async (searchTerm) => {
  return await db.questions
    .filter(q => q.question.toLowerCase().includes(searchTerm.toLowerCase()))
    .toArray();
};

// Get questions by multiple filters
export const getQuestionsByFilters = async (filters) => {
  let query = db.questions.toCollection();
  
  if (filters.class) {
    query = query.filter(q => q.class === filters.class);
  }
  if (filters.subject) {
    query = query.filter(q => q.subject === filters.subject);
  }
  if (filters.question_type) {
    query = query.filter(q => q.question_type === filters.question_type);
  }
  
  return await query.toArray();
};

// Get questions count by class and subject
export const getQuestionsCount = async (classValue, subject) => {
  return await db.questions
    .where({ class: classValue, subject: subject })
    .count();
};

// Helper function to shuffle array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
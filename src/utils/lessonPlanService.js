// utils/lessonPlanService.js
import { db } from "./db";

// Load default lesson plans
export const loadDefaultLessonPlans = async () => {
  try {
    const defaultPlans = [
      {
        subject: "English Language",
        classLevel: "Basic 7",
        week: "Week 1",
        date: "2025-01-10",
        duration: "60 mins",
        strand: "Reading",
        substrand: "Comprehension",
        contentStandards: [
          "B7.2.1.1: Demonstrate understanding of texts by identifying main ideas and supporting details"
        ],
        indicators: [
          "B7.2.1.1.1: Read and explain the main ideas in a passage",
          "B7.2.1.1.2: Answer questions based on a passage"
        ],
        coreCompetencies: [
          "Communication and Collaboration",
          "Critical Thinking and Problem Solving"
        ],
        subjectPractices: [
          "Listening and Speaking",
          "Vocabulary Development"
        ],
        phases: {
          starter: "Teacher reads a short passage and asks students to predict the main idea.",
          main: "Students read the passage silently, then answer comprehension questions in pairs.",
          conclusion: "Class discussion of answers; teacher summarizes key points."
        },
        tlr: ["Printed passage", "Board/marker", "Flashcards"],
        assessment: "Students answer 5 comprehension questions (written/oral).",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    await db.lessonPlans.bulkAdd(defaultPlans);
    return defaultPlans.length;
  } catch (error) {
    console.error('Failed to load default lesson plans:', error);
    throw error;
  }
};

// Initialize database with default lesson plans if empty
export const initLessonPlanDB = async () => {
  const existingPlans = await db.lessonPlans.count();
  
  if (existingPlans === 0) {
    console.log('No lesson plans found, loading default plans...');
    await loadDefaultLessonPlans();
    console.log('Default lesson plans loaded successfully');
  }
  
  return db;
};

// ✅ CREATE - Add a new lesson plan
export const addLessonPlan = async (planData) => {
  const planWithTimestamps = {
    ...planData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return await db.lessonPlans.add(planWithTimestamps);
};

// ✅ READ - Get all lesson plans
export const getAllLessonPlans = async () => {
  return await db.lessonPlans.toArray();
};

// ✅ READ - Get lesson plan by ID
export const getLessonPlanById = async (id) => {
  return await db.lessonPlans.get(id);
};

// ✅ READ - Get lesson plans by class and subject
export const getLessonPlansByClassAndSubject = async (classLevel, subject) => {
  return await db.lessonPlans
    .where({ classLevel, subject })
    .toArray();
};

// ✅ READ - Get lesson plans by week
export const getLessonPlansByWeek = async (week) => {
  return await db.lessonPlans
    .where('week')
    .equals(week)
    .toArray();
};

// ✅ UPDATE - Update a lesson plan
export const updateLessonPlan = async (id, updates) => {
  const updateWithTimestamp = {
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return await db.lessonPlans.update(id, updateWithTimestamp);
};

// ✅ DELETE - Delete a lesson plan
export const deleteLessonPlan = async (id) => {
  return await db.lessonPlans.delete(id);
};

// ✅ SEARCH - Search lesson plans by text
export const searchLessonPlans = async (searchTerm) => {
  return await db.lessonPlans
    .filter(plan => 
      (plan.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (plan.classLevel?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (plan.strand?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (plan.substrand?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (plan.assessment?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    .toArray();
};

// ✅ FILTER - Get lesson plans by multiple filters
export const getLessonPlansByFilters = async (filters) => {
  let query = db.lessonPlans.toCollection();
  
  if (filters.classLevel) {
    query = query.filter(plan => plan.classLevel === filters.classLevel);
  }
  if (filters.subject) {
    query = query.filter(plan => plan.subject === filters.subject);
  }
  if (filters.week) {
    query = query.filter(plan => plan.week === filters.week);
  }
  if (filters.strand) {
    query = query.filter(plan => plan.strand === filters.strand);
  }
  
  return await query.toArray();
};

// ✅ GET UNIQUE VALUES - For filter options
export const getUniqueValues = async () => {
  const [classes, subjects, weeks, strands] = await Promise.all([
    db.lessonPlans.orderBy('classLevel').uniqueKeys(),
    db.lessonPlans.orderBy('subject').uniqueKeys(),
    db.lessonPlans.orderBy('week').uniqueKeys(),
    db.lessonPlans.orderBy('strand').uniqueKeys()
  ]);
  
  return { classes, subjects, weeks, strands };
};

// ✅ GENERATE PDF - Generate PDF for a lesson plan
export const generateLessonPlanPDF = async (lessonPlan) => {
  // This function would typically be implemented with jsPDF
  // For now, return the plan data for PDF generation in the component
  return lessonPlan;
};

// ✅ DUPLICATE - Duplicate a lesson plan
export const duplicateLessonPlan = async (id) => {
  const originalPlan = await getLessonPlanById(id);
  if (!originalPlan) throw new Error('Lesson plan not found');
  
  const duplicatedPlan = {
    ...originalPlan,
    id: undefined, // Let Dexie generate new ID
    week: `${originalPlan.week} (Copy)`,
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return await addLessonPlan(duplicatedPlan);
};
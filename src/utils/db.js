// /utils/db.js
import Dexie from "dexie";

export const db = new Dexie("SchoolDB");

// Define schema - Updated to match the lesson plan structure
db.version(1).stores({
    students: "++id, fullname, classLevel, gender",
    teachers: "++id, fullname, classLevel, gender",
    notes: "++id, title, content, timestamp",
    lessonPlans: "++id, subject, classLevel, week, date, topic, strand, substrand, createdAt"
});

// Add timetable store in version 2
db.version(2).stores({
    timetable: "++id, dayOfWeek, classLevel, subject, startTime, endTime"
});

db.version(3).stores({
  questions: '++id, class, subject, [class+subject], question_type, question, options, correctAnswer, answer, createdAt',
    // questions: "++id, class, subject, [class+subject]" // 👈 compound index
});

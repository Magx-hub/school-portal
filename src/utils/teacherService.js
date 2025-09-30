// teacherService.js
import { db } from "./db";

// ✅ CREATE teacher
export async function addTeacher(fullname, classLevel, gender) {
  return await db.teachers.add({ fullname, classLevel, gender });
}

// ✅ READ all teachers
export async function getAllTeachers() {
  return await db.teachers.toArray();
}

// ✅ READ by ID
export async function getTeacherById(id) {
  return await db.teachers.get(id);
}

// ✅ UPDATE teacher
export async function updateTeacher(id, updates) {
  return await db.teachers.update(id, updates);
  // updates example: { fullname: "New Name" }
}

// ✅ DELETE teacher
export async function deleteTeacher(id) {
  return await db.teachers.delete(id);
}

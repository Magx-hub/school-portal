
// studentService.js
import { db } from "./db";

// ✅ CREATE student
export async function addStudent(fullname, classLevel, gender) {
  return await db.students.add({ fullname, classLevel, gender });
}

// ✅ READ all students
export async function getAllStudents() {
  return await db.students.toArray();
}

// ✅ READ by ID
export async function getStudentById(id) {
  return await db.students.get(id);
}

// ✅ UPDATE student
export async function updateStudent(id, updates) {
  return await db.students.update(id, updates);
  // updates example: { fullname: "New Name" }
}

// ✅ DELETE student
export async function deleteStudent(id) {
  return await db.students.delete(id);
}

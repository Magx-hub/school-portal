// utils.timetableService.js
import { db } from "./db";

// ✅ CREATE timetable entry
export async function addTimetableEntry(dayOfWeek, classLevel, subject, startTime, endTime) {
  return await db.timetable.add({ dayOfWeek, classLevel, subject, startTime, endTime});
}


export async function getAllTimetableEntries() {
  return await db.timetable.toArray();
}


export async function getTimetableByDay(dayOfWeek) {
  return await db.timetable.where("dayOfWeek").equals(dayOfWeek).toArray();
}

export async function getTimetableById(id) {
    return await db.timetable.get(id);
}

export async function updateTimetableEntry(id, updates) {
  return await db.timetable.update(id, updates);
}

export async function deleteTimetableEntry(id) {
  return await db.timetable.delete(id);
}
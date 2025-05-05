import db from '../../config/db.js';

export async function getAllFiles() {
  const [rows] = await db.query('SELECT * FROM files');
  return rows;
}

export async function getFilesById(user_id) {
  const [rows] = await db.query('SELECT * FROM files WHERE user_id = ?', [user_id]);
  return rows;
}

export async function createFile({ user_id, name, fileType, path }) {
  const [result] = await db.query('INSERT INTO files (user_id, name, type, path) VALUES (?, ?, ?, ?)', [user_id, name, fileType, path]);

  return {id: result.insertId, user_id, name, fileType, path};
}

export async function updateFile({id, name}) {
  const [result] = await db.query('UPDATE files SET name = ? WHERE id = ?', [name, id])
  return result;
}

export async function deleteFile(id) {
  const [result] = await db.query('DELETE FROM files WHERE id = ?', [id]);
  return result;
}
import db from '../../config/db.js';
import bcrypt from 'bcryptjs';

export async function register({ name, email, password, faceImage }) {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await db.query(
        'INSERT INTO users (username, email, password, profile_picture) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, faceImage]
    );

    return { id: result.insertId, name, email };
}

export async function login({ email, password }) {
    // Find user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
        throw new Error('Usuario no encontrado');
    }

    const user = users[0];

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error('Contraseña inválida');
    }

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        tempToken: generateTempToken()
    };
}

function generateTempToken() {
    // For now, just generate a random string
    return Math.random().toString(36).substring(2);
}
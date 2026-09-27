// src/controllers/market.controllers.js
import bcrypt from 'bcryptjs';
import { pool } from '../config.js';

export const postRegistro = async (req, res) => {
  try {
    const { nombre, correo, clave } = req.body;

    const [existe] = await pool.query(
      'SELECT id FROM usuarios WHERE correo = ?', [correo]
    );
    if (existe.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const claveHasheada = await bcrypt.hash(clave, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, clave) VALUES (?, ?, ?)',
      [nombre, correo, claveHasheada]
    );

    res.status(201).json({ message: 'Usuario registrado correctamente', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Algo salió mal' });
  }
};

export const postLogin = async (req, res) => {
  try {
    const { correo, clave } = req.body;
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const coincide = await bcrypt.compare(clave, rows[0].clave);
    if (!coincide) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.json({ message: 'Encontrado', usuario: { id: rows[0].id, nombre: rows[0].nombre, correo: rows[0].correo } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Algo salió mal' });
  }
};
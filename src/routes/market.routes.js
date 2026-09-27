// src/routes/market.routes.js
import { Router } from 'express';
import {
  getUsuarios,
  getUsuario,
  postUsuarios,
  putUsuarios,
  deleteUsuarios,
  getProductos,
  postProductos,
  putProductos,
  deleteProductos,
  getProductosId,
  postRegistro,
  postLogin,          // ← faltaba este import
} from '../controllers/market.controllers.js';

const router = Router();

// Rutas para productos
router.get('/productos', (req, res, next) => {
  console.log('Endpoint /productos alcanzado');
  next();
}, getProductos);

router.get('/productos/:id', (req, res, next) => {
  console.log('Endpoint /productos/:id alcanzado');
  next();
}, getProductosId);

// Rutas de CRUD para usuarios
router.get('/usuarios', getUsuarios);
router.post('/newusuarios', postUsuarios);
router.put('/usuarios/:id', putUsuarios);
router.delete('/usuarios/:id', deleteUsuarios);

// Rutas de CRUD para productos
router.post('/productos', postProductos);
router.put('/productos/:id', putProductos);
router.delete('/productos/:id', deleteProductos);

// Autenticación
router.post('/usuarios/registro', postRegistro);
router.post('/usuarios/login', postLogin);   // ← nota el conflicto abajo

export default router;   // ← movido al final
  import bcrypt from 'bcryptjs';
  import { pool } from '../config.js';

  export const getUsuarios=async(req,res)=>{
      try{
          const [result]=await pool.query('SELECT * FROM usuarios')
          res.json(result)
      }catch(error){
          return res.status(500).json({ message: "Algo salio mal" });
      }
  };


  export const getUsuario = async (req, res) => {
      try {
        const { username, password } = req.body; 
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE nombre = ? AND clave = ?", [
          username, password
        ]);
        if (rows.length <= 0) {
          return res.status(404).json({ message: "Usuario no Encontrado" });
        }
        res.json({ message: "Encontrado" });
      } catch (error) {
        return res.status(500).json({ message: 'Algo salio mal'});
      }
    };

  export const postUsuarios = async (req, res) => {
    try {
      const { nombre, correo, clave} = req.body;

      // 1. Consultamos el último ID en la base de datos
      const [result] = await pool.query("SELECT MAX(id) AS last_id FROM usuarios");

      // 2. Obtenemos el último ID y lo incrementamos
      const lastId = result[0].last_id || 0; // Si no hay productos, el último ID será 0
      const newId = lastId + 1;  // Calculamos el nuevo ID

      // 3. Insertamos el nuevo producto con el ID incrementado
      const [insertResult] = await pool.query(
        "INSERT INTO usuarios (id, nombre, correo, clave) VALUES (?, ?, ?, ?)", 
        [newId, nombre, correo, clave]
      );

      // 4. Verificamos si la inserción fue exitosa
      if (insertResult.affectedRows > 0) {
        res.json({ message: "Usuario Agregado", id: newId });
      } else {
        res.status(404).json({ message: "No se ingresó el usuario" });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Algo salió mal' });
    }
  };


    export const putUsuarios = async (req, res) => {
      try {
        const { id } = req.params; // Obtener el ID del producto desde los parámetros de la URL
        const { name, description, price_cost, price_sale, quantity, image } = req.body;
    
        // Actualizar el producto en la base de datos
        const [result] = await pool.query(
          "UPDATE productos SET nombre = ?, descripcion = ?, precio_costo = ?, precio_venta = ?, cantidad = ?, fotografia = ? WHERE id = ?",
          [name, description, price_cost, price_sale, quantity, image, id]
        );
    
        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json({ message: "Producto actualizado" });
      } catch (error) {
        return res.status(500).json({ message: 'Algo salió mal' });
      }
    };
    

    export const deleteUsuarios = async (req, res) => {
      try {
        const { id } = req.params; // Obtener el ID del producto desde los parámetros de la URL
    
        // Eliminar el producto de la base de datos
        const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);
    
        // Verificar si se eliminó algún registro
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json({ message: "Producto eliminado" });
      } catch (error) {
        return res.status(500).json({ message: 'Algo salió mal' });
      }
    };
    
  export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    if (rows.length <= 0) {
      return res.status(404).json({ message: "No hay productos registrados" });
    }
    res.json(rows);   // ← array directo, sin envolver
  } catch (error) {
    return res.status(500).json({ message: "Algo salio mal" });
  }
};

    export const getProductosId=async(req,res)=>{
      try{
        const { id } = req.params; // Obtener el ID del producto desde los parámetros de la URL
        const [rows] = await pool.query("SELECT * FROM productos where id=?",[id]);
        if (rows.length <= 0) {
          return res.status(404).json({ message: "No hay productos registrados" });
        }
        res.json({ productos: rows });
      }catch(error){
          return res.status(500).json({ message: "Algo salio mal" });
      }
    };

    export const postProductos_version_001=async(req,res)=>{
      try {
        const { name, description, price_cost, price_sale,quantity,image } = req.body; 
        const [rows] = await pool.query("INSERT INTO productos (nombre,descripcion,precio_costo,precio_venta,cantidad,fotografia) VALUES (?,?,?,?,?,?)", [
          name, description, price_cost, price_sale,quantity,image
        ]);
        if (rows.length <= 0) {
          return res.status(404).json({ message: "No se ingreso el producto" });
        }
        res.json({ message: "Producto Agregado" });
      } catch (error) {
        return res.status(500).json({ message: 'Algo salio mal'});
      }
    };

  export const postProductos = async (req, res) => {
    try {
      const { name, description, price_cost, price_sale, quantity, image } = req.body;

      // 1. Consultamos el último ID en la base de datos
      const [result] = await pool.query("SELECT MAX(id) AS last_id FROM productos");

      // 2. Obtenemos el último ID y lo incrementamos
      const lastId = result[0].last_id || 0; // Si no hay productos, el último ID será 0
      const newId = lastId + 1;  // Calculamos el nuevo ID

      // 3. Insertamos el nuevo producto con el ID incrementado
      const [insertResult] = await pool.query(
        "INSERT INTO productos (id, nombre, descripcion, precio_costo, precio_venta, cantidad, fotografia) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [newId, name, description, price_cost, price_sale, quantity, image]
      );

      // 4. Verificamos si la inserción fue exitosa
      if (insertResult.affectedRows > 0) {
        res.json({ message: "Producto Agregado", id: newId });
      } else {
        res.status(404).json({ message: "No se ingresó el producto" });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Algo salió mal' });
    }
  };


    export const putProductos = async (req, res) => {
      try {
        const { id } = req.params; // Obtener el ID del producto desde los parámetros de la URL
        const { name, description, price_cost, price_sale, quantity, image } = req.body;
    
        // Actualizar el producto en la base de datos
        const [result] = await pool.query(
          "UPDATE productos SET nombre = ?, descripcion = ?, precio_costo = ?, precio_venta = ?, cantidad = ?, fotografia = ? WHERE id = ?",
          [name, description, price_cost, price_sale, quantity, image, id]
        );
    
        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json({ message: "Producto actualizado" });
      } catch (error) {
        return res.status(500).json({ message: 'Algo salió mal' });
      }
    };
    

    export const deleteProductos = async (req, res) => {
      try {
        const { id } = req.params; // Obtener el ID del producto desde los parámetros de la URL
    
        // Eliminar el producto de la base de datos
        const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);
    
        // Verificar si se eliminó algún registro
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json({ message: "Producto eliminado" });
      } catch (error) {
        return res.status(500).json({ message: 'Algo salió mal' });
      }
    };
    
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
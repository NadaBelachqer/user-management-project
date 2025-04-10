async function getAllUsers(req, res) {
    try {
      const [rows] = await req.db.query('SELECT * FROM users');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
  async function createUser(req, res) {
    const { firstname, lastname, email, city } = req.body;
    if (!firstname || !lastname || !email || !city) {
      return res.status(400).json({ error: 'Tous les champs sont requis !' });
    }
    try {
      const [result] = await req.db.query(
        'INSERT INTO users (firstname, lastname, email, city) VALUES (?, ?, ?, ?)',
        [firstname, lastname, email, city]
      );
      res.status(201).json({ id: result.insertId, firstname, lastname, email, city });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
  async function updateUser(req, res) {
    const { id } = req.params;
    const { firstname, lastname, email, city } = req.body;
    try {
      const [result] = await req.db.query(
        'UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ? WHERE id = ?',
        [firstname, lastname, email, city, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
  async function deleteUser(req, res) {
    const { id } = req.params;
    try {
      const [result] = await req.db.query('DELETE FROM users WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
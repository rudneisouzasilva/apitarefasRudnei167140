var jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const modeloTarefa = require('../models/tarefa');
const userModel = require('../models/user');

router.post('/login', async (req, res) => {
  try {
    const data = await userModel.findOne({
      nome: req.body.nome
    });

    if (data != null && data.senha === req.body.senha) {
      const token = jwt.sign(
        {
          id: data.nome,
          tipo: data.tipo
        },
        'segredo',
        { expiresIn: 300 }
      );

      return res.json({
        auth: true,
        token: token,
        nome: data.nome,
        tipo: data.tipo
      });
    }

    res.status(500).json({
      message: 'Login invalido!'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Autorização por JWT
function verificaJWT(req, res, next) {
  const token = req.headers['id-token'];

  if (!token) {
    return res.status(401).json({
      auth: false,
      message: 'Token nao fornecido'
    });
  }

  jwt.verify(token, 'segredo', function (err, decoded) {
    if (err) {
      return res.status(500).json({
        auth: false,
        message: 'Falha!'
      });
    }

    next();
  });
}

// CREATE
router.post('/post', verificaJWT, async (req, res) => {
  const objetoTarefa = new modeloTarefa({
    descricao: req.body.descricao,
    statusRealizada: req.body.statusRealizada
  });

  try {
    const tarefaSalva = await objetoTarefa.save();
    res.status(200).json(tarefaSalva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ
router.get('/getAll', verificaJWT, async (req, res) => {
  try {
    const resultados = await modeloTarefa.find();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete('/delete/:id', verificaJWT, async (req, res) => {
  try {
    const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE
router.patch('/update/:id', verificaJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const novaTarefa = req.body;
    const options = { new: true };

    const result = await modeloTarefa.findByIdAndUpdate(
      id,
      novaTarefa,
      options
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// CREATE usuario
router.post('/users', verificaJWT, async (req, res) => {
  const objetoUsuario = new userModel({
    nome: req.body.nome,
    senha: req.body.senha,
    tipo: req.body.tipo
  });

  try {
    const usuarioSalvo = await objetoUsuario.save();
    res.status(200).json(usuarioSalvo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ usuarios
router.get('/users', verificaJWT, async (req, res) => {
  try {
    const resultados = await userModel.find();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE usuario
router.delete('/users/:id', verificaJWT, async (req, res) => {
  try {
    const resultado = await userModel.findByIdAndDelete(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE usuario
router.patch('/users/:id', verificaJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const novoUsuario = req.body;
    const options = { new: true };

    const resultado = await userModel.findByIdAndUpdate(
      id,
      novoUsuario,
      options
    );

    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
var jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const modeloTarefa = require('../models/tarefa');
const userModel = require('../models/user');
var { createHash, randomBytes } = require('crypto');

// Funções Auxiliares para Criptografia
function gerarSalt() {
  return randomBytes(16).toString('hex');
}

function gerarHash(senha, salt) {
  return createHash('sha256').update(senha + salt).digest('hex');
}

function validPassword(senha, hashBD, saltBD) {
  const hashCalculado = gerarHash(senha, saltBD);
  return hashCalculado === hashBD;
}

// Middleware de Autorização por JWT
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
        message: 'Falha na autenticação do token!'
      });
    }

    next();
  });
}

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await userModel.findOne({ nome: req.body.nome });
    if (!user) {
      return res.status(401).json({ message: 'Usuario nao encontrado' });
    }

    if (validPassword(req.body.senha, user.hash, user.salt)) {
      const token = jwt.sign({ id: user._id }, 'segredo', { expiresIn: '1h' });
      return res.status(200).json({ auth: true, token: token, tipo: user.tipo });
    } else {
      return res.status(401).json({ auth: false, message: 'Senha invalida' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- ROTAS DE USUÁRIOS ---

// CREATE usuario
router.post('/users', verificaJWT, async (req, res) => {
  const salt = gerarSalt();
  const hash = gerarHash(req.body.senha, salt);

  const objetoUsuario = new userModel({
    nome: req.body.nome,
    hash: hash,
    salt: salt,
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

// UPDATE usuario
router.patch('/users/:id', verificaJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const novoUsuario = {
      nome: req.body.nome,
      tipo: req.body.tipo
    };

    if (req.body.senha && req.body.senha.trim() !== '') {
      const salt = gerarSalt();
      const hash = gerarHash(req.body.senha, salt);
      novoUsuario.hash = hash;
      novoUsuario.salt = salt;
    }

    const options = { new: true };
    const resultado = await userModel.findByIdAndUpdate(id, novoUsuario, options);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// --- ROTAS DE TAREFAS ---

// CREATE tarefa
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

// READ todas as tarefas
router.get('/getAll', verificaJWT, async (req, res) => {
  try {
    const resultados = await modeloTarefa.find();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE tarefa
router.patch('/update/:id', verificaJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const novaTarefa = req.body;
    const options = { new: true };

    const resultado = await modeloTarefa.findByIdAndUpdate(id, novaTarefa, options);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE tarefa
router.delete('/delete/:id', verificaJWT, async (req, res) => {
  try {
    const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
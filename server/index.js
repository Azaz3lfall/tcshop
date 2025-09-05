const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Importa o multer

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

// --- Configuração do Multer para Upload de Imagens ---
const storage = multer.diskStorage({
  // Define o destino dos arquivos
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  // Define o nome do arquivo, adicionando a data para evitar nomes duplicados
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middlewares
app.use(cors());
app.use(express.json());


// Isso torna as imagens na pasta /public/uploads acessíveis via URL
// Ex: http://localhost:3001/uploads/nome-da-imagem.jpg
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// --- ROTAS DA API ---

// Rota para obter todos os produtos
app.get('/api/products', (req, res) => {
  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error("Erro ao ler o banco de dados:", err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    const db = JSON.parse(data);
    res.json(db.products);
  });
});

// Rota para obter um único produto
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    const db = JSON.parse(data);
    const product = db.products.find(p => p.id === productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  });
});

// Rota para obter UM ÚNICO produto pelo seu ID
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);

  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error("Erro ao ler o banco de dados:", err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    const db = JSON.parse(data);
    const product = db.products.find(p => p.id === productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  });
});

// --- ROTA DE CRIAÇÃO DE PRODUTO ATUALIZADA ---
// Usamos 'upload.single("image")' para processar o arquivo de imagem
app.post('/api/products', upload.single('image'), (req, res) => {
  const newProductData = req.body;

  // Verifica se o arquivo foi enviado
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
  }

  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro interno do servidor' });
    
    const db = JSON.parse(data);
    const lastId = db.products.reduce((maxId, product) => Math.max(product.id, maxId), 0);

    const newProduct = {
      id: lastId + 1,
      name: newProductData.name,
      description: newProductData.description,
      price: newProductData.price,
      stock: parseInt(newProductData.stock, 10),
      categoria: newProductData.categoria,
      destaque: newProductData.destaque === 'true', // O formulário envia 'true' como string
      // A URL da imagem agora é o caminho para o arquivo salvo
      imageUrl: `http://localhost:3001/uploads/${req.file.filename}`
    };

    db.products.push(newProduct);

    fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao salvar o produto.' });

      console.log('Produto adicionado com sucesso:', newProduct);
      res.status(201).json(newProduct);
    });
  });
});

// Rota para obter produtos por categoria
app.get('/api/products/category/:categoryName', (req, res) => {
  const { categoryName } = req.params;
  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro interno do servidor' });
    const db = JSON.parse(data);
    const productsInCategory = db.products.filter(
      product => product.categoria && product.categoria.toLowerCase() === categoryName.toLowerCase()
    );
    res.json(productsInCategory);
  });
});

// Rota para atualizar (editar) um produto
app.put('/api/products/:id', (req, res) => {
  // ATENÇÃO: Esta rota ainda não suporta upload de imagem.
  // Faremos isso em um próximo passo se necessário. Por agora, ela continuará atualizando apenas os textos.
  const productId = parseInt(req.params.id, 10);
  const updatedData = req.body;

  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro interno do servidor' });
    const db = JSON.parse(data);
    const productIndex = db.products.findIndex(p => p.id === productId);

    if (productIndex === -1) return res.status(404).json({ error: 'Produto não encontrado' });
    
    db.products[productIndex] = { ...db.products[productIndex], ...updatedData };

    fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao salvar o produto.' });
      
      console.log(`Produto com ID ${productId} foi atualizado.`);
      res.status(200).json(db.products[productIndex]);
    });
  });
});


// Rota para deletar um produto
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro interno do servidor' });
    const db = JSON.parse(data);
    const updatedProducts = db.products.filter(p => p.id !== productId);
    if (db.products.length === updatedProducts.length) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    db.products = updatedProducts;
    fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao salvar o produto.' });
      console.log(`Produto com ID ${productId} foi deletado.`);
      res.status(200).json({ message: 'Produto deletado com sucesso!' });
    });
  });
});


// Rota para criar pedidos
app.post('/api/orders', (req, res) => {
  const newOrder = req.body;
  newOrder.id = Date.now();
  newOrder.date = new Date().toISOString();
  
  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro ao salvar o pedido.' });
    const db = JSON.parse(data);
    db.orders.push(newOrder);
    fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao salvar o pedido.' });
      console.log('Pedido salvo com sucesso:', newOrder);
      res.status(201).json({ message: 'Pedido criado com sucesso!', order: newOrder });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor do backend rodando em http://localhost:${PORT}`);
});
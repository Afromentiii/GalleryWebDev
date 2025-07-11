const app = require('../app');
const http = require('http');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`✅ Serwer działa na porcie ${port}`);
});

app.get('/', (req, res) => {
  res.redirect('/login');
});
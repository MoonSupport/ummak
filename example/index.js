const { Ummak } = require('../dist');
const server = Ummak.init();

server.post('/todos');
server.put('/todos/:id');
server.delete('/todos/:id');
server.auth();

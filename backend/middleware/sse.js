class SSEManager {
  constructor() {
    this.clients = new Map();
  }

  init(req, res, clientId) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    const id = clientId || req.userId || Date.now().toString();
    this.register(id, res);
    req.on('close', () => {
      this.unregister(id);
    });
  }

  register(id, res) {
    this.clients.set(id, res);
  }

  unregister(id) {
    const res = this.clients.get(id);
    if (res) {
      res.end();
      this.clients.delete(id);
    }
  }

  broadcast(data) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const res of this.clients.values()) {
      try {
        res.write(payload);
      } catch {}
    }
  }
}

module.exports = new SSEManager();

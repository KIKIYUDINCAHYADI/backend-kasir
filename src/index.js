import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Middleware CORS
app.use('*', cors())

// ==========================
// ENDPOINT: /api/products
// ==========================

// GET semua produk
app.get('/api/products', async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM products").all()
    return c.json(results)
  } catch (err) {
    return c.text("Gagal mengambil produk: " + err.message, 500)
  }
})

// POST tambah produk
app.post('/api/products', async (c) => {
  try {
    const { name, price } = await c.req.json()
    await c.env.DB.prepare("INSERT INTO products (name, price) VALUES (?, ?)")
      .bind(name, price)
      .run()
    return c.text("Produk berhasil ditambahkan", 201)
  } catch (err) {
    return c.text("Gagal menambahkan produk: " + err.message, 500)
  }
})

// PUT update produk
app.put('/api/products/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const { name, price } = await c.req.json()
    await c.env.DB.prepare("UPDATE products SET name = ?, price = ? WHERE id = ?")
      .bind(name, price, id)
      .run()
    return c.text("Produk berhasil diupdate")
  } catch (err) {
    return c.text("Gagal mengupdate produk: " + err.message, 500)
  }
})

// DELETE hapus produk
app.delete('/api/products/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await c.env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run()
    return c.text("Produk berhasil dihapus")
  } catch (err) {
    return c.text("Gagal menghapus produk: " + err.message, 500)
  }
})

// ==========================
// ENDPOINT: /api/transactions
// ==========================

// POST simpan transaksi
app.post('/api/transactions', async (c) => {
  try {
    const { items, total } = await c.req.json()
    await c.env.DB.prepare("INSERT INTO transactions (items, total) VALUES (?, ?)")
      .bind(JSON.stringify(items), total)
      .run()
    return c.text("Transaksi berhasil disimpan", 201)
  } catch (err) {
    return c.text("Gagal menyimpan transaksi: " + err.message, 500)
  }
})

export default app

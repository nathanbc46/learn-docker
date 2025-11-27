import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { prisma } from './lib/prisma'
import { z } from 'zod'
import { cors } from 'hono/cors'

const app = new Hono()
app.use('*', cors())

const zodProduct = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string().optional()
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/products', async (c) => {
  const products = await prisma.product.findMany()
  if(!products){
    return c.notFound()
  }
  return c.json({data : products})
})

app.get('/products/:id', async (c) => {
  const id = c.req.param('id')
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id)
    }
  })
  return c.json({data : product})
})

app.post('/products', async (c) => {
  const { name, price, description } = await c.req.json()
  zodProduct.parse({ name, price, description })

  const newProduct = await prisma.product.create({
    data: {
      name,
      price: Number(price),
      description
    }
  })
  return c.json({data : newProduct})
})

app.put('/products/:id', async (c) => {
  const id = c.req.param('id')
  const { name, price } = await c.req.json()
  const updatedProduct = await prisma.product.update({
    where: {
      id: Number(id)
    },
    data: {
      name,
      price: Number(price)
    }
  })
  return c.json({data : updatedProduct})
})

app.delete('/products/:id', async (c) => {
  const id = c.req.param('id')
  const deletedProduct = await prisma.product.delete({
    where: {
      id: Number(id)
    }
  })
  return c.json({data : deletedProduct})
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

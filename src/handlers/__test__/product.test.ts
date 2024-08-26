import request from "supertest"
import server from "../../server"

//TEST CREAR PRODUCTOS
describe('POST /api/products', () => {
    //Testeamos las "validaciones de los input"
    it("should display validation errors", async () => {
        const response = await request(server).post('/api/products').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    //Testeamos que en nro del precio sea mayor a 0
    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Teclado",
            price: 0
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })

    //Testeamos que el precio sea un numero y sea mayor a 0
    it('should validate than the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "monitor testing",
            price: "probando poner string"
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })

    //Testeamos la URL
    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Producto desde testing",
            price: 300
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("data")

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("errors")
    })
})

//TEST PRODUCTOS
describe('GET /api/products', () => {
    it('should check if /api/product url exist', async () => {
        const response = await request(server).get("/api/products")

        expect(response.status).not.toBe(404)
    })
    it('get JSON response with products', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("data")

        expect(response.body).not.toHaveProperty("errors")
    })
})

//TEST PRODUCTO
describe('GET /api/products/:id', () => {
    //Testeamos la respuesta de un producto NO existente
    it("should return 404 response for a non existent product", async () => {
        const productId = 20000
        const response = await request(server).get(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Producto no encontrado")
    })

    //Testeamos respuesta de un id de la URL NO valido
    it("should check a valid ID in the URL", async () => {
        const response = await request(server).get('/api/products/not-valid-id')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors[0].msg).toBe("Id no válido")
    })
    //Testeamos la respuesta de un producto existente
    it("get a JSON response for a single product", async () => {
        const response = await request(server).get('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
    })
})

//TEST EDITAR PRODUCTO
describe('PUT /api/products/:id', () => {
    //Testeamos respuesta de un id de la URL NO valido
    it("should check a valid ID in the URL", async () => {
        const response = await request(server).put('/api/products/not-valid-id')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors[0].msg).toBe("Id no válido")
    })
    //testeamos los mensajes de error mandando vacio los campos
    it('should display validate error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })
    //testeamos que el precio sea mayor a 0
    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: "monitor curvo 24 pulgadas",
            availability: true,
            price: 0
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors[0].msg).toBe("Precio no valido")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })
    //testeamos la respuesta cuando el producto no existe
    it('should return 404 response for a non existent product', async () => {
        const productId = 2000
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "Mouse",
            price: 20,
            availability: true
        })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe("Producto no encontrado")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")

        
    })
    //testeamos si todo va ok
    it('should update an existing product with valid data', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: "Mouse",
            price: 20,
            availability: true
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty("errors")
    })
})

//TEST EDITAR DISPONIBILIDAD
describe('PATCH /api/products/:id', () => {
    //testeamos con un producto no existente
    it('should return 404 response for a non existing product', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe("Producto no encontrado")

        expect(response.status).not.toBe(200)
        expect(response.body.error).not.toHaveProperty("data")
    })
    //testeamos actualizar la disponibilidad correctamente
    it('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty("errors")
    })
})

//TEST BORRAR PRODUCTO
describe('DELETE /api/products/:id', () => {
    //testeamos con un id no valido
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid-id')

        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toBe("Id no válido")
    })
    //testeamos con un producto no existente
    it('should return a 404 response for a non existent product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe("Producto no encontrado")
    })
    //testeamos borrar el producto
    it('should return a 200 response and delete the product', async () => {
        const response = await request(server).delete('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)

    })
})
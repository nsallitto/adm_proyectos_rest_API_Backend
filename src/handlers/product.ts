import { Request, Response } from "express"
import Product from "../models/Products.models";

//OBTENER PRODUCTOS
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            attributes: {exclude: ['createdAt', 'updatedAt']}
        })
        res.json({data: products})
    } catch (error) {
        console.log(error);
    }
}

//OBTENER PRODUCTO
export const getProduct = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const product = await Product.findByPk(id)

        //Validamos si no encuentra el producto
        if (!product) {
            res.status(404).json({
                error: "Producto no encontrado"
            })
        }
        
        res.json({data: product})
    } catch (error) {
        console.log(error);
    }
}

//CREAR PRODUCTO
export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json({data: product})

    } catch (error) {
        console.log(error);
    }
}

//EDITAR PRODUCTO
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const product = await Product.findByPk(id)

        //Validamos si no encuentra el producto
        if (!product) {
            res.status(404).json({
                error: "Producto no encontrado"
            })
        }

        //Actualizamos el producto
        await product.update(req.body)
        await product.save()
        res.json({data: product})

    } catch (error) {
        console.log(error);
    }
}

//EDITAR DISPONIBILIDAD
export const updateAvailability = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const product = await Product.findByPk(id)

        //Validamos si no encuentra el producto
        if (!product) {
            res.status(404).json({
                error: "Producto no encontrado"
            })
        }
        //Actualizamos availability
        product.availability = !product.dataValues.availability
        await product.save()
        res.json({data: product})

    } catch (error) {
        console.log(error);
    }
}

//BORRAR PRODUCTO
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const product = await Product.findByPk(id)

        //Validamos si no encuentra el producto
        if (!product) {
            res.status(404).json({
                error: "Producto no encontrado"
            })
        }

        //Eliminamos el producto
        await product.destroy()
        res.json({data: "Producto eliminado"})

    } catch (error) {
        console.log(error);
    }
}
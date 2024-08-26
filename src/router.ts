import { Router } from "express";
import { body, param } from "express-validator"
import { createProduct, deleteProduct, getProduct, getProducts, updateAvailability, updateProduct } from "./handlers/product";
import { handleInputErrors } from "./middleware";

const router = Router();

//Routing
router.get('/', getProducts)
router.get('/:id', 
    //validacion
    param("id").isInt().withMessage("Id no válido"),

    handleInputErrors,
    getProduct
)

router.post('/', 
    //validacion
    body("name")
        .notEmpty().withMessage("El nombre no puede ir vacio"),
    body("price")
        .isNumeric().withMessage("Valor no válido")
        .notEmpty().withMessage("El precio no puede ir vacio")
        .custom(value => value > 0).withMessage("Precio no valido"),

    handleInputErrors,
    createProduct
)

router.put('/:id',
    //validacion
    param("id")
        .isInt().withMessage("Id no válido"),
    body("name")
        .notEmpty().withMessage("El nombre no puede ir vacio"),
    body("price")
        .isNumeric().withMessage("Valor no válido")
        .notEmpty().withMessage("El precio no puede ir vacio")
        .custom(value => value > 0).withMessage("Precio no valido"),
    body("availability")
        .isBoolean().withMessage("Valor para disponibilidad no válido"),

    handleInputErrors,
    updateProduct
)

router.patch('/:id',
    param("id")
        .isInt().withMessage("Id no válido"),
    
    handleInputErrors,
    updateAvailability)

router.delete('/:id',
    param("id")
        .isInt().withMessage("Id no válido"),

    handleInputErrors,
    deleteProduct)

export default router 
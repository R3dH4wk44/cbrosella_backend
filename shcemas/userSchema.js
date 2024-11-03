import  {z} from 'zod'



const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "La contraseña debe tener almenos 6 caracteres")  // En esta versión, la contraseña no es obligatoria, pero si se quiere hacer obligatoria, cambiar el optional() a required() en la validación de password.
})


const userRegisterSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1, "El nombre es obligatorio"),
    phone: z.string().min(9).max(9).optional(),
    password: z.string().min(6, "La contraseña debe tener almenos 6 caracteres")
})

export { userLoginSchema, userRegisterSchema };
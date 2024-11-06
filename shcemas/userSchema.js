import  {z} from 'zod'



const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "La contraseña debe tener almenos 6 caracteres"),
    rememberMe: z.boolean()
})


const userRegisterSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1, "El nombre es obligatorio"),
    phone: z.string().min(9).max(9).optional(),
    password: z.string().min(6, "La contraseña debe tener almenos 6 caracteres")
})

export { userLoginSchema, userRegisterSchema };
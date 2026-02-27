import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("И-мэйл хаяг буруу байна"),
  password: z.string().min(1, "Нууц үг оруулна уу"),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, "Нэр хамгийн багадаа 2 тэмдэгт байна"),
    email: z.string().email("И-мэйл хаяг буруу байна"),
    password: z
      .string()
      .min(8, "Нууц үг 8-аас дээш тэмдэгт байна")
      .regex(/[A-Z]/, "Нууц үг том үсэг агуулсан байна")
      .regex(/\d/, "Нууц үг тоо агуулсан байна"),
    confirmPassword: z.string(),
    agreeTerms: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Нууц үг таарахгүй байна",
        path: ["confirmPassword"],
      })
    }
    if (!data.agreeTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Үйлчилгээний нөхцөлийг зөвшөөрнө үү",
        path: ["agreeTerms"],
      })
    }
  })

import { Router } from "express"
import { createUserPassword, deleteUserPassword, getPasswordDetails, getUserPasswords, updateUserPassword } from "../controllers/passwords.js"

const router = Router()

router.post('/', getUserPasswords)
router.post('/create', createUserPassword)
router.post('/:id', getPasswordDetails)
router.put('/:id', updateUserPassword)
router.delete('/:id', deleteUserPassword)


export default router
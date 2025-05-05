import { createPassword, deletePassword, getPasswordDetail, getPasswords, updatePassword } from "../models/passwords.js";

export async function getUserPasswords(req,res) {
    try {
        const {id} = req.body.id
        const passwords = await getPasswords(id)

        return res.status(200).json({bandera:true, contrasenas: passwords})
    } catch (error) {
        return res.status(500).json({bandera:false, mensaje: error.message})
    }
}

export async function createUserPassword(req,res) {
    try {
        const {user_id,site_name,user_name,password,descripcion} = req.body
        const new_password = await createPassword(user_id, site_name, user_name, password, descripcion)

        return res.status(200).json({bandera:true, mensaje: new_password.mensaje})
    } catch (error) {
        return res.status(500).json({bandera:false, mensaje: error.message})
    }
}

export async function updateUserPassword(req,res) {
    try {
        const {id} = req.params
        const {site_name, user_name, password, descripcion} = req.body
        const updated = await updatePassword(id,site_name,user_name,password,descripcion)
        
        return res.status(200).json({bandera:true, mensaje: updated.mensaje})
    } catch (error) {
        return res.status(500).json({bandera:false, mensaje: error.message})
    }
}

export async function deleteUserPassword(req,res){
    try {
        const {id} = req.params

        const deleted = await deletePassword(id)

        return res.status(200).json({bandera:true, mensaje: deleted.mensaje})
    } catch (error) {
        return res.status(500).json({bandera:false, mensaje: error.message})
    }
}


export async function getPasswordDetails(req,res) {
    try {
        const {id} = req.params
        const contrasena = await getPasswordDetail(id)
        return res.status(200).json({bandera:true, contrasena: contrasena})
    } catch (error) {
        return res.status(500).json({bandera:false, mensaje: error.message})
        
    }
}
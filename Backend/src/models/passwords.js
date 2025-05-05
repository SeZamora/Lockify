import db from '../../config/db.js'
import {SecretsManagerClient, GetSecretValueCommand, CreateSecretCommand, UpdateSecretCommand, DeleteSecretCommand} from '@aws-sdk/client-secrets-manager'

const cliente = new SecretsManagerClient({region: 'us-east-1'})

async function getUserPasswords(id){
    const [rows] = await db.query('SELECT id,secret_name FROM credentials WHERE user_id = ?',[id])
    return rows
}

export async function createPassword(user_id,site_name,user_name,password, description = "") {
    const secret_name = `secret_${user_id}_${site_name}_${Date.now()}`
    const new_secret = {
        site_name,
        user_name,
        password
    }

    await cliente.send (new CreateSecretCommand({Name: secret_name, SecretString: JSON.stringify(new_secret)}))
    const [result] = await db.query('INSERT INTO credentials (user_id, secret_name, note) VALUES (?,?,?)',[user_id,secret_name,description])
    
    if(result.affectedRows === 0) throw new Error('Ocurrio un error al crear la contraseña')
    else return {mensaje: 'Contraseña creada satisfactoriamente'}
}

export async function updatePassword(id,site_name,username,password,descripcion = "") {
    const [secret] = await db.query('SELECT secret_name FROM credentials WHERE id = ?',[id])

    if (secret.length === 0) throw new Error('No se encontro la contraseña') 

    await cliente.send(new  UpdateSecretCommand({SecretId: secret[0].secret_name, SecretString: JSON.stringify({site_name, username, password})}))

    await db.query('UPDATE credentials SET note = ? WHERE id = ?',[descripcion,id])

    return {mensaje: 'Contraseña actualizada'}
   
}

export async function deletePassword(id) {
    const [secret] = await db.query('SELECT secret_name FROM credentials WHERE id = ?',[id])
    if (secret.length === 0) throw new Error("No se encontro la contraseña")
    
    await cliente.send(new DeleteSecretCommand({SecretId: secret[0].secret_name, ForceDeleteWithoutRecovery: true}))
    const [result] = await db.query('DELETE FROM credentials WHERE id = ?',[id])
    return {mensaje: 'Contraseña eliminada'}
}

export async function getPasswords(id){
    const secret_names = await getUserPasswords(id)

    const secrets = await Promise.all(secret_names.map(async (secret) =>{
        try {
            const comando = new GetSecretValueCommand({SecretId: secret.secret_name })
            const respuesta = await cliente.send(comando)
            return{
                id: secret.id,
                secret_name: secret.secret_name,
                datos: JSON.parse(respuesta.SecretString).site_name
            }
        } catch (error) {
            return{
                id: secret.id,
                secret_name: secret.secret_name,
                error: error.message
            }
        }
    }))

    return secrets

}

export async function getPasswordDetail(id) {
    try {
        const [secret] = await db.query('SELECT secret_name FROM credentials WHERE id = ?',[id])
        const comando = new GetSecretValueCommand({SecretId: secret[0].secret_name})
        const respuesta = await cliente.send(comando)
        return {
            id: id,
            datos: JSON.parse(respuesta.SecretString)
        }
    } catch (error) {
        return {
            id: id,
            error: error.message
        }
    }
}
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as filesModel from '../models/files.js';

const s3 = new S3Client({
  region: process.env.AWS_REGION,                // p.ej. "us-east-1"
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // define en tu .env
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
const BUCKET = process.env.BUCKET_NAME;          // p.ej. "mi-app-documentos-2025"


export async function getAllFiles(req, res) {
  try {
    const files = await filesModel.getAllFiles();

    return res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getFilesById(req, res) {
  try {
    const { id } = req.params;
    const files = await filesModel.getFilesById(id);

    if (files.length === 0) {
      return res.status(404).json({ message: 'No se encontraron archivos para este usuario' });
    }

    return res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files by user ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createFile(req, res) {
  try {
    const { user_id, fileName, fileType, file } = req.body;
    const key = `documents/${user_id}/${Date.now()}_${fileName}`; // Genera un nombre único para el archivo
    const buffer = Buffer.from(file, "base64");

    // 3. Sube a S3:
    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: fileType,
      ACL: "public-read"               // o "public-read" si lo necesitas público
    });
    await s3.send(cmd);
    // 4. Construye la URL del objeto:
    const path = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    console.log('URL:', path); // URL del archivo en S3
    // const path = 'https://example.com/file.pdf'; // fake path
    const [result] = await filesModel.createFile({ user_id, name: fileName, fileType, path });

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Falló la creación del archivo' });
    }

    return res.status(201).json({...result, message: 'Archivo creado satisfactoriamente', url: path });
  } catch (error) {
    console.error('Error creating file:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateFile(req, res) {
  try {
    const { id } = req.params;
    const { fileName } = req.body;

    const [result] = await filesModel.updateFile({id, name: fileName})
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Falló la actualización del archivo' });
    }

    return res.status(200).json({ message: 'Archivo actualizado satisfactoriamente' });
  } catch (error) {
    console.error('Error updating file:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteFile(req, res) {
  try {
    const { id } = req.params;
    const [result] = await filesModel.deleteFile(id);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Falló la eliminación del archivo' });
    }
    
    return res.status(200).json({ message: 'Archivo eliminado satisfactoriamente' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
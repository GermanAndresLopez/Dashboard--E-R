import supabase from '../models/supabaseClient.js';
import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';

// Agregar registro individual desde el formulario
export const agregarRegistro = async (req, res) => {
  try {
    const {
      Fecha,
      Temperatura_C,
      Voltaje_V,
      Eficiencia_Porcentaje,
      Alarma,
      Tipo_Alarma,
      Alarma_Calculada
    } = req.body;

    const { error } = await supabase.from('sensores').insert([{
      fecha: Fecha,
      temperatura_c: parseFloat(Temperatura_C),
      voltaje_v: parseFloat(Voltaje_V),
      eficiencia_porcentaje: parseFloat(Eficiencia_Porcentaje),
      alarma: parseInt(Alarma),
      tipo_alarma: Tipo_Alarma,
      alarma_calculada: parseInt(Alarma_Calculada)
    }]);

    if (error) throw error;
    res.status(200).json({ message: 'Registro agregado' });

  } catch (error) {
    console.error('Error al agregar registro:', error);
    res.status(500).json({ error: 'Error interno al agregar el registro' });
  }
};

// Subida masiva por CSV
export const uploadCSV = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se subió ningún archivo.' });
    }

    const csvPath = file.path;
    const fileContent = await fs.readFile(csvPath, 'utf8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    for (const record of records) {
      const registro = {
        fecha: record['Fecha'],
        temperatura_c: parseFloat(record['Temperatura_C']),
        voltaje_v: parseFloat(record['Voltaje_V']),
        eficiencia_porcentaje: parseFloat(record['Eficiencia_%']),
        alarma: parseInt(record['Alarma']),
        tipo_alarma: record['Tipo_Alarma'],
        alarma_calculada: parseInt(record['Alarma_Calculada'])
      };

      const { error } = await supabase.from('sensores').insert([registro]);
      if (error) console.error('Error al insertar registro individual:', error.message);
    }

    res.status(200).json({ message: 'CSV subido y registros insertados correctamente.' });

  } catch (error) {
    console.error('Error al procesar CSV:', error);
    res.status(500).json({ error: 'Error interno al procesar el CSV' });
  }
};

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const linhas = await sql`SELECT id, numero, capacidade FROM salas ORDER BY id`;
        return res.status(200).json(linhas);
    }

    if (req.method === 'POST') {
        const { numero, capacidade } = req.body || {};

        if (!numero || typeof numero !== 'string' || !numero.trim()) {
            return res.status(400).json({ erro: 'Informe o número ou nome da sala.' });
        }

        const cap = parseInt(capacidade, 10);
        if (!Number.isInteger(cap) || cap <= 0) {
            return res.status(400).json({ erro: 'A capacidade deve ser maior que zero.' });
        }

        const numeroTratado = numero.trim();
        const existente = await sql`SELECT id FROM salas WHERE LOWER(numero) = LOWER(${numeroTratado})`;
        if (existente.length > 0) {
            return res.status(409).json({ erro: 'Já existe uma sala com esse nome.' });
        }

        const [sala] = await sql`
            INSERT INTO salas (numero, capacidade)
            VALUES (${numeroTratado}, ${cap})
            RETURNING id, numero, capacidade
        `;
        return res.status(201).json(sala);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ erro: 'Método não permitido.' });
}

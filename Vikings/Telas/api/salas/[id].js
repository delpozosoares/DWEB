import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
    const id = parseInt(req.query.id, 10);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ erro: 'ID inválido.' });
    }

    if (req.method === 'GET') {
        const [sala] = await sql`SELECT id, numero, capacidade FROM salas WHERE id = ${id}`;
        if (!sala) return res.status(404).json({ erro: 'Sala não encontrada.' });
        return res.status(200).json(sala);
    }

    if (req.method === 'PUT') {
        const { numero, capacidade } = req.body || {};

        if (!numero || typeof numero !== 'string' || !numero.trim()) {
            return res.status(400).json({ erro: 'Informe o número ou nome da sala.' });
        }

        const cap = parseInt(capacidade, 10);
        if (!Number.isInteger(cap) || cap <= 0) {
            return res.status(400).json({ erro: 'A capacidade deve ser maior que zero.' });
        }

        const numeroTratado = numero.trim();
        const duplicada = await sql`
            SELECT id FROM salas WHERE LOWER(numero) = LOWER(${numeroTratado}) AND id != ${id}
        `;
        if (duplicada.length > 0) {
            return res.status(409).json({ erro: 'Já existe uma sala com esse nome.' });
        }

        const [sala] = await sql`
            UPDATE salas SET numero = ${numeroTratado}, capacidade = ${cap}
            WHERE id = ${id}
            RETURNING id, numero, capacidade
        `;
        if (!sala) return res.status(404).json({ erro: 'Sala não encontrada.' });
        return res.status(200).json(sala);
    }

    if (req.method === 'DELETE') {
        const [sala] = await sql`DELETE FROM salas WHERE id = ${id} RETURNING id`;
        if (!sala) return res.status(404).json({ erro: 'Sala não encontrada.' });
        return res.status(204).end();
    }

    res.setHeader('Allow', 'GET, PUT, DELETE');
    return res.status(405).json({ erro: 'Método não permitido.' });
}

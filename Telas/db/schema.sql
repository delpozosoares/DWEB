CREATE TABLE IF NOT EXISTS salas (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(100) NOT NULL UNIQUE,
    capacidade INTEGER NOT NULL CHECK (capacidade > 0)
);

INSERT INTO salas (numero, capacidade) VALUES
    ('Sala 01', 15),
    ('Sala 02', 20),
    ('Sala 03', 12)
ON CONFLICT (numero) DO NOTHING;

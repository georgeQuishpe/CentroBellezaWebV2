DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'citas_db') THEN
        CREATE DATABASE auth_db;
    END IF;
END $$;

\c citas_db;

CREATE TABLE Citas (
    Id SERIAL PRIMARY KEY,
    UsuarioId VARCHAR(10) NOT NULL, 
    ServicioId INT NOT NULL, 
    Fecha TIMESTAMP NOT NULL,
    Estado VARCHAR(20) CHECK (Estado IN ('Pendiente', 'Confirmada', 'Cancelada')),
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Citas (UsuarioId, ServicioId, Fecha, Estado) VALUES
('1701234567', 1, '2024-02-05 10:00:00', 'Pendiente'),
('1702345678', 3, '2024-02-06 14:30:00', 'Confirmada'),
('1704567890', 5, '2024-02-07 16:00:00', 'Pendiente'),
('1705678901', 2, '2024-02-08 11:15:00', 'Cancelada'),
('1701234567', 4, '2024-02-09 09:00:00', 'Confirmada');

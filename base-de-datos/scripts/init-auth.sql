DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'auth_db') THEN
        CREATE DATABASE auth_db;
    END IF;
END $$;

\c auth_db;

CREATE TABLE Usuarios (
    Id VARCHAR(10) PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL, -- Encriptada
    Nombre VARCHAR(100) NOT NULL,
    Telefono VARCHAR(20),
    Rol VARCHAR(20) CHECK (Rol IN ('Admin', 'Cliente')),
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Estado BOOLEAN NOT NULL -- Activo/Inactivo
);

INSERT INTO Usuarios (Id, Email, Password, Nombre, Telefono, Rol, Estado) VALUES
('1756088322', 'admin@gmail.com', '$2b$10$5tpjwQBkEJxG5M2JQyUoseUXQOF3NOBUwAoT7rVOF.SkYZHKnQMbC', 'Administrador General', '0999999999', 'Admin', TRUE),
('1701234567', 'cliente1@gmail.com', '$2b$10$XcCVp5BFRMEUYGcZ39WB2eAKZ/mBaG2vCOcZfP.7/Vp2eqLDuH2pW', 'María Pérez', '0981111111', 'Cliente', TRUE),
('1702345678', 'cliente2@gmail.com', '$2b$10$yYiRQ6rfczHPXt7AeFFk3eELc0iVRu8XyK1qQx5ppr9D0Dehl57wS', 'Carlos López', '0982222222', 'Cliente', TRUE),
('1704567890', 'cliente3@gmail.com', '$2b$10$ztVtKO8YbbjObBOoz5r2.OguajFsZd6/rERW8cRh6I8.q5tUykxbi', 'Ana Torres', '0983333333', 'Cliente', TRUE),
('1705678901', 'cliente4@gmail.com', '$2b$10$CvuQ1SzGmRUP5SpxMC13.O.98Oj/63e4Pf3Mtk5toGCgkROyaHT0W', 'Luis Martínez', '0984444444', 'Cliente', TRUE);

CREATE DATABASE servicios_db;
GO
USE servicios_db;
GO
CREATE TABLE Servicios (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Precio NUMERIC(10,2) NOT NULL,
    Duracion INT NOT NULL, -- en minutos
    Estado BOOLEAN NOT NULL
);
GO


INSERT INTO Servicios (Nombre, Descripcion, Precio, Duracion, Estado) VALUES
('Corte de Cabello', 'Corte profesional para hombres y mujeres', 15.00, 30, TRUE),
('Manicure', 'Cuidado y esmaltado de uñas', 20.00, 45, TRUE),
('Pedicure', 'Cuidado de pies y esmaltado', 25.00, 60, TRUE),
('Tinte de Cabello', 'Coloración con productos profesionales', 50.00, 90, TRUE),
('Masaje Relajante', 'Terapia de relajación con aceites esenciales', 40.00, 60, TRUE);

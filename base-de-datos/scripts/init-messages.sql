DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'chat_db') THEN
        CREATE DATABASE auth_db;
    END IF;
END $$;

\c chat_db;

CREATE TABLE ChatMensajes (
    Id SERIAL PRIMARY KEY,
    UsuarioId VARCHAR(10) NOT NULL, 
    Mensaje TEXT NOT NULL,
    FechaEnvio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Leido BOOLEAN NOT NULL
);

INSERT INTO ChatMensajes (UsuarioId, Mensaje, Leido) VALUES
('1701234567', 'Hola, quisiera agendar una cita para corte de cabello.', FALSE),
('1756088322', 'Hola María, claro. ¿Qué día y hora prefieres?', FALSE),
('1701234567', 'El viernes a las 10 am.', FALSE),
('1756088322', 'Listo, tu cita ha sido agendada. ¡Nos vemos pronto!', TRUE),

('1702345678', 'Buenas tardes, ¿tienen disponibilidad para un pedicure mañana?', FALSE),
('1756088322', 'Buenas tardes Carlos, sí, tenemos espacio a las 2:30 pm.', FALSE),
('1702345678', 'Perfecto, reservo ese horario.', TRUE),
('1756088322', 'Tu cita ha sido confirmada.', TRUE),

('1704567890', 'Hola, ¿cuánto cuesta un masaje relajante?', FALSE),
('1756088322', 'Hola Ana, el masaje tiene un costo de $40 y dura 1 hora.', TRUE),

('1705678901', 'Hola, tuve que cancelar mi cita de manicure. ¿Puedo reagendar?', FALSE),
('1756088322', 'Sí, claro Luis. Avísame cuándo te gustaría reprogramarla.', FALSE);

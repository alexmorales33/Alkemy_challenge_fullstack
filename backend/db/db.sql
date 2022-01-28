CREATE DATABASE IF NOT EXISTS operations;
USE operations;

CREATE TABLE `Transactions` (
  `id` int NOT NULL,
  `type` varchar(11) COLLATE latin1_spanish_ci NOT NULL,
  `date` date NOT NULL,
  `name` varchar(40) COLLATE latin1_spanish_ci NOT NULL,
  `amt` decimal(13,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Transactions`
--
ALTER TABLE `Transactions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Transactions`
--
ALTER TABLE `Transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;
DESCRIBE Transactions;
INSERT INTO Transactions values
	(1, 'Egreso', '2022-01-01', 'Supermercado', 600),
    (2, 'Ingreso', '2022-01-02', 'Sueldo', 45000),
    (3, 'Egreso', '2022-01-02', 'Luz', 3000),
    (4, 'Egreso', '2022-01-02', 'Gas', 2250),
    (5, 'Ingreso', '2022-01-04', 'Regalo cumpleaños', 1500),
    (6, 'Egreso', '2022-01-05', 'Mercadolibre', 2780),
    (7, 'Egreso', '2022-01-06', 'Panaderia', 300),
    (8, 'Egreso', '2022-01-08', 'Regalo sobrino', 1500),
    (9, 'Ingreso', '2022-01-09', 'Trading', 25000),
    (10, 'Egreso', '2022-01-10', 'Patente', 4500);
    
SELECT * FROM Transactions;
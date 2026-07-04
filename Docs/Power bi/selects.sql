-----query A
SELECT TOP 10
    c.cliente        AS Nombre_Cliente,
    c.direccion      AS Direccion,
    c.nit            AS NIT,
    p.producto       AS Producto,
    SUM(e.pbruto)    AS Peso_Bruto_Total,
    MONTH(e.fecha)   AS Mes,
    YEAR(e.fecha)    AS Anio
FROM dbo.envio    e
INNER JOIN dbo.cliente  c ON c.codcliente  = e.codcliente
INNER JOIN dbo.producto p ON p.codproducto = e.codproducto
WHERE YEAR(e.fecha) = 2014
GROUP BY
    c.cliente,
    c.direccion,
    c.nit,
    p.producto,
    MONTH(e.fecha),
    YEAR(e.fecha)
ORDER BY
    SUM(e.pbruto) DESC;


-----query B

SELECT
    f.finca                AS Finca,
    e.empresa              AS Empresa,
    COUNT(en.idenvio)      AS Total_Transacciones,
    MONTH(en.fecha)        AS Mes,
    YEAR(en.fecha)         AS Anio
FROM dbo.envio   en
INNER JOIN dbo.finca   f ON f.codfinca   = en.codfinca
                       AND f.codempresa  = en.codempresa
INNER JOIN dbo.empresa e ON e.codempresa = f.codempresa
WHERE YEAR(en.fecha)  = 2015
  AND MONTH(en.fecha) BETWEEN 1 AND 6
GROUP BY
    f.finca,
    e.empresa,
    MONTH(en.fecha),
    YEAR(en.fecha)
HAVING
    COUNT(en.idenvio) >= 15
ORDER BY
    f.finca,
    MONTH(en.fecha);




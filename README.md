# ISP Management System (Cable & Internet)

Sistema integral para la gestión operativa, facturación y control de morosidad de una empresa proveedora de servicios de telecomunicaciones.

Este proyecto fue desarrollado como una solución completa _End-to-End_, abarcando desde el diseño relacional de la base de datos hasta la creación de dashboards gerenciales.

## Tecnologías y Arquitectura

El sistema está construido siguiendo los principios de **Clean Architecture (Arquitectura en 4 capas)** para garantizar escalabilidad, separación de responsabilidades y facilidad de mantenimiento.

### Backend & Base de Datos (Core)

- **Framework:** ASP.NET Core 8 Web API
- **Base de Datos:** SQL Server
- **ORM:** Dapper (Micro-ORM implementado para máxima velocidad en la ejecución de consultas).
- **Patrones:** Repository Pattern, Inyección de Dependencias, DTOs.
- **Lógica de Datos:** Todo el acceso a datos está centralizado mediante _Stored Procedures_ fuertemente tipados para prevenir SQL Injection y optimizar el rendimiento.

### Frontend & BI

- **Frontend:** React.js
- **Inteligencia de Negocios:** Power BI (Dashboards de rendimiento operativo y comercial conectados a la BD).

## Módulos Principales

1. **Gestión de Clientes:** CRUD completo con manejo de borrado lógico y estados.
2. **Facturación y Pagos:** Lógica de negocio para cálculo de descuentos (combos), registro de abonos y control de saldos.
3. **Control de Morosidad:** Suspensión automática de servicios mediante reglas de negocio.
4. **Dashboards (BI):** Reportes analíticos sobre despachos operacionales y transacciones por sucursal.

## Instrucciones de Ejecución

### 1. Base de Datos

1. Ejecutar el script `database_schema.sql` ubicado en la carpeta `/Database` en SQL Server.
2. El script incluye la creación de tablas, relaciones y todos los Stored Procedures necesarios.

### 2. Backend (.NET)

1. Navegar a la carpeta `/Backend`.
2. Actualizar la cadena de conexión (`CableNetDb`) en el archivo `appsettings.json`.
3. Ejecutar el comando:
   ```bash
   dotnet run
   ```

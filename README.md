# Komodo MCP Server

Un servidor MCP (Model Context Protocol) completo para la API de Komodo. Proporciona acceso a todas las funcionalidades de Komodo a través de una arquitectura modular y bien estructurada.

## 🚀 Características

- **Arquitectura Modular**: Organizado en módulos de recursos para mejor mantenibilidad
- **Cobertura Completa de API**: Integra todos los endpoints disponibles de Komodo
- **TypeScript**: Completamente tipado para mejor experiencia de desarrollo
- **Manejo de Errores**: Sistema centralizado de manejo de errores
- **Configuración Flexible**: Soporte para múltiples entornos

## 📦 Instalación

1. **Clona el repositorio**:
   ```bash
   git clone <repository-url>
   cd komodo-mcp-server
   ```

2. **Instala las dependencias**:
   ```bash
   pnpm install
   ```

3. **Configura las variables de entorno**:
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus credenciales:
   ```env
   KOMODO_KEY="tu_api_key"
   KOMODO_SECRET="tu_secret"
   KOMODO_URL="https://tu-instancia.komo.do"
   ```

4. **Compila el proyecto**:
   ```bash
   pnpm build
   ```

## 🏃‍♂️ Uso

### Desarrollo
```bash
pnpm dev
```

### Producción
```bash
pnpm start
```

## 🛠️ Herramientas Disponibles

El servidor MCP proporciona **40+ herramientas** organizadas en los siguientes módulos:

### 🖥️ Servidores
- `list_servers` - Lista todos los servidores
- `get_server_info` - Información detallada de un servidor
- `create_server` - Crea un nuevo servidor
- `update_server` - Actualiza configuración de servidor
- `delete_server` - Elimina un servidor
- `get_server_stats` - Estadísticas del servidor

### 📚 Stacks
- `list_stacks` - Lista todos los stacks
- `get_stack_info` - Información detallada de un stack
- `deploy_stack` - Despliega un stack
- `create_stack` - Crea un nuevo stack
- `update_stack` - Actualiza configuración de stack
- `delete_stack` - Elimina un stack
- `start_stack` - Inicia un stack
- `stop_stack` - Detiene un stack
- `restart_stack` - Reinicia un stack

### 🚀 Deployments
- `list_deployments` - Lista todos los deployments
- `get_deployment_info` - Información detallada de un deployment
- `deploy_deployment` - Despliega un deployment
- `create_deployment` - Crea un nuevo deployment
- `update_deployment` - Actualiza configuración de deployment
- `delete_deployment` - Elimina un deployment
- `start_deployment` - Inicia un deployment
- `stop_deployment` - Detiene un deployment
- `restart_deployment` - Reinicia un deployment
- `get_deployment_logs` - Obtiene logs de deployment

### 🔨 Builds
- `list_builds` - Lista todos los builds
- `get_build_info` - Información detallada de un build
- `run_build` - Ejecuta un build
- `create_build` - Crea un nuevo build
- `update_build` - Actualiza configuración de build
- `delete_build` - Elimina un build
- `cancel_build` - Cancela un build en ejecución

### 📁 Repositorios
- `list_repos` - Lista todos los repositorios
- `get_repo_info` - Información detallada de un repositorio
- `create_repo` - Crea un nuevo repositorio
- `update_repo` - Actualiza configuración de repositorio
- `delete_repo` - Elimina un repositorio
- `pull_repo` - Actualiza repositorio desde origen
- `clone_repo` - Clona un repositorio

### ⚙️ Procedimientos
- `list_procedures` - Lista todos los procedimientos
- `get_procedure_info` - Información detallada de un procedimiento
- `run_procedure` - Ejecuta un procedimiento
- `create_procedure` - Crea un nuevo procedimiento
- `update_procedure` - Actualiza configuración de procedimiento
- `delete_procedure` - Elimina un procedimiento

### 🔧 Sistema
- `list_updates` - Lista actualizaciones del sistema
- `get_system_info` - Información del sistema
- `get_version` - Versión de Komodo
- `list_alerters` - Lista alertas configuradas
- `get_alerter_info` - Información detallada de una alerta
- `create_alerter` - Crea una nueva alerta
- `update_alerter` - Actualiza configuración de alerta
- `delete_alerter` - Elimina una alerta

## 🏗️ Arquitectura

```
src/
├── index.ts              # Punto de entrada principal
├── types.ts              # Definiciones de tipos TypeScript
├── client.ts             # Cliente Komodo y utilidades
└── resources/            # Módulos de recursos
    ├── servers.ts        # Gestión de servidores
    ├── stacks.ts         # Gestión de stacks
    ├── deployments.ts    # Gestión de deployments
    ├── builds.ts         # Gestión de builds
    ├── repos.ts          # Gestión de repositorios
    ├── procedures.ts     # Gestión de procedimientos
    └── system.ts         # Funciones del sistema
```

### Principios de Diseño

- **Separación de Responsabilidades**: Cada módulo maneja un tipo específico de recurso
- **Reutilización de Código**: Cliente y utilidades compartidas
- **Tipado Fuerte**: Interfaces TypeScript para mejor seguridad
- **Manejo Consistente de Errores**: Respuestas uniformes en toda la aplicación

## 🔧 Configuración MCP

Para usar este servidor MCP, configúralo en tu cliente MCP compatible:

```json
{
  "mcpServers": {
    "komodo": {
      "command": "node",
      "args": ["/ruta/a/komodo-mcp-server/dist/index.js"],
      "cwd": "/ruta/a/komodo-mcp-server",
      "env": {
        "KOMODO_KEY": "tu-key-aqui",
        "KOMODO_SECRET": "tu-secret-aqui",
        "KOMODO_URL": "tu-url-aqui"
      }
    }
  }
}
```

## 🐛 Solución de Problemas

### Error de Conexión
1. Verifica las variables de entorno
2. Confirma que la URL de Komodo sea accesible
3. Valida las credenciales API

### Error "Method not found"
1. Asegúrate de que el servidor esté compilado (`pnpm build`)
2. Verifica la configuración en tu cliente MCP
3. Reinicia el cliente MCP después de cambios de configuración

### Problemas de Permisos
1. Verifica que las credenciales tengan los permisos necesarios
2. Confirma que el usuario tenga acceso a los recursos solicitados

## 📋 Requisitos

- Node.js v18 o superior
- pnpm (recomendado) o npm
- Acceso a una instancia de Komodo
- Credenciales API válidas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 🔗 Enlaces

- [Documentación de Komodo](https://docs.komo.do)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

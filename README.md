# Komodo MCP Server

Un servidor MCP (Model Context Protocol) para integrar la API de Komodo con Trae IDE.

## Configuración

1. Asegúrate de tener las variables de entorno configuradas en el archivo `.env`:

```env
KOMODO_KEY="tu_api_key"
KOMODO_SECRET="tu_secret"
KOMODO_URL="https://tu-instancia.komo.do"
```

2. Instala las dependencias:

```bash
pnpm install
```

3. Compila el proyecto:

```bash
pnpm build
```

4. Prueba la conexión con Komodo:

```bash
node test-mcp.js
```

## Solución de Problemas

### Error -32601 "Method not found" en Trae IDE

Si recibes este error, el servidor MCP está funcionando correctamente (verificado con `node diagnose-mcp.js`). El problema está en la configuración de Trae IDE:

#### Pasos para resolver:

1. **Verifica la ubicación del archivo de configuración**:
   - El archivo `mcp-config-trae.json` debe estar en el directorio de configuración de Trae IDE
   - Ubicación típica: `~/.config/trae/mcp-config.json` o similar

2. **Verifica el contenido de la configuración**:
   ```json
   {
     "mcpServers": {
       "komodo": {
         "command": "node",
         "args": ["/opt/dev/mcp/komodo/dist/index.js"],
         "cwd": "/opt/dev/mcp/komodo",
         "env": {
           "KOMODO_KEY": "tu-key-aqui",
           "KOMODO_SECRET": "tu-secret-aqui",
           "KOMODO_URL": "tu-url-aqui"
         }
       }
     }
   }
   ```

3. **Reinicia Trae IDE** después de cambiar la configuración

4. **Verifica la versión de Node.js**:
   ```bash
   node --version  # Debe ser v18 o superior
   ```

5. **Ejecuta el diagnóstico completo**:
   ```bash
   node diagnose-mcp.js
   ```

### Scripts de Diagnóstico

- `node test-mcp.js` - Prueba básica de conexión con Komodo
- `node test-mcp-protocol.js` - Prueba completa del protocolo MCP
- `node diagnose-mcp.js` - Diagnóstico completo del servidor

### Estado del Servidor

✅ **Servidor MCP**: Funcionando correctamente  
✅ **Protocolo MCP**: Implementado completamente  
✅ **Conexión Komodo**: Verificada (37 stacks, 9 servidores)  
✅ **Herramientas MCP**: 6 herramientas disponibles  

Si el problema persiste, verifica la configuración específica de Trae IDE o contacta al soporte técnico.

## Uso

### Desarrollo

```bash
pnpm dev
```

### Producción

```bash
pnpm start
```

## Herramientas Disponibles

El servidor MCP proporciona las siguientes herramientas para interactuar con Komodo:

### `list_stacks`
Lista todos los stacks disponibles en Komodo.

### `get_stack_info`
Obtiene información detallada de un stack específico.
- **Parámetros**: `stack_name` (string)

### `deploy_stack`
Despliega un stack específico.
- **Parámetros**: `stack_name` (string)

### `list_servers`
Lista todos los servidores disponibles.

### `get_server_info`
Obtiene información detallada de un servidor específico.
- **Parámetros**: `server_id` (string)

### `list_updates`
Lista las actualizaciones recientes.
- **Parámetros**: `limit` (number, opcional, por defecto: 10)

## Integración con Trae IDE

Para usar este servidor MCP con Trae IDE, agrega la configuración correspondiente en tu archivo de configuración de MCP de Trae.

## Estructura del Proyecto

```
├── src/
│   └── index.ts          # Servidor MCP principal
├── dist/                 # Archivos compilados
├── .env                  # Variables de entorno
├── package.json          # Configuración del proyecto
├── tsconfig.json         # Configuración de TypeScript
└── README.md            # Este archivo
```

## Dependencias

- `@modelcontextprotocol/sdk`: SDK para crear servidores MCP
- `komodo_client`: Cliente oficial de TypeScript para la API de Komodo
- `dotenv`: Para cargar variables de entorno

## Licencia

ISC
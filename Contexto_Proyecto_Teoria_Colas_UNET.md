# Contexto del Proyecto: MVP de Teoría de Colas - Distribución de Suministros Post-Sismo

## 1. Descripción General del Proyecto
Este documento sirve como contexto base para el desarrollo de un Producto Mínimo Viable (MVP). Se trata de un proyecto de la asignatura Investigación de Operaciones II en la carrera de Ingeniería Informática de la UNET. 

El equipo de desarrollo está conformado por 3 integrantes. El objetivo es construir una aplicación Web de alto impacto social que aplique la Teoría de Colas para resolver un cuello de botella logístico real en un escenario de crisis humanitaria (específicamente, un contexto post-sismo).

## 2. Escenario Elegido: Distribución de Suministros Vitales
Abordaremos la logística de entrega de agua y alimentos en centros de acopio.
*   **El problema:** Largas filas de damnificados esperando a la intemperie para recibir kits de supervivencia, frente a un número limitado de mesas de entrega y voluntarios.
*   **El propósito:** Calcular dinámicamente cuántas estaciones de servicio (mesas) se necesitan para minimizar los tiempos de espera y evitar el colapso del sistema ante la llegada masiva de damnificados.

## 3. Modelo Matemático Requerido
El motor de cálculo implementará un modelo de colas **(M/M/s): (FCFS/∞/∞)**.

**Variables de entrada (Data Dummy coherente):**
*   $\lambda$ (Lambda): Tasa de llegada de damnificados (personas/hora).
*   $\mu$ (Mu): Tasa de servicio por estación de entrega (kits/hora).
*   $s$: Número de servidores (estaciones/mesas de entrega activas).

**Ecuaciones a resolver en el código:**
1.  **Factor de utilización:** $
ho = \lambda / (s \cdot \mu)$
2.  **Probabilidad de sistema vacío ($P_0$):** Requiere cálculo de sumatoria hasta $s-1$.
3.  **Longitud de la cola ($L_q$):** Promedio de personas esperando.
4.  **Tiempo de espera en cola ($W_q$):** $L_q / \lambda$.

## 4. Arquitectura y Stack Tecnológico
El proyecto debe ser ágil, moderno y fácil de mantener. Trabajaremos bajo el siguiente entorno:
*   **Frontend:** React inicializado con Vite.
*   **Estilos:** Tailwind CSS para un diseño limpio, profesional y enfocado en usabilidad (tablero de control/dashboard).
*   **Backend / Persistencia:** Supabase para gestionar los escenarios de prueba y los registros del sistema logístico.
*   **Control de Versiones:** Repositorio en GitHub.

## 5. Experiencia de Usuario (UI/UX)
El usuario final de esta App (coordinador logístico de una ONG) **no es experto en matemáticas**. Por lo tanto:
*   La interfaz no debe abrumar con números crudos.
*   Debe incluir un panel visual (semáforos o tarjetas de alerta).
*   Debe traducir el cálculo a lenguaje natural. Ejemplo: *"El tiempo de espera es crítico (45 min). Se requiere habilitar 2 mesas de entrega adicionales de forma inmediata."*

## 6. Instrucciones de Asistencia (Para el LLM)
A partir de este contexto, las solicitudes estarán orientadas a:
1.  Traducir las fórmulas matemáticas de $M/M/s$ a funciones eficientes en JavaScript/TypeScript.
2.  Estructurar componentes en React para el panel de control y los formularios de entrada de variables.
3.  Configurar rutas y la conexión con el esquema de base de datos en Supabase.
4.  Optimizar el código para que el cálculo analítico sea preciso y se refleje en tiempo real en la interfaz.

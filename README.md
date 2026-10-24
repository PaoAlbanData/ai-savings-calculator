# AI Savings Calculator · Calculadora Empresarial de Ahorro con IA

Aplicación web interactiva que permite a las empresas **estimar cuánto tiempo y dinero podrían liberar automatizando tareas repetitivas con inteligencia artificial**, y en cuánto tiempo recuperarían la inversión.

Todos los cálculos se realizan en el navegador: sin backend, sin base de datos, sin APIs de pago y sin enviar datos a ningún servidor.

> **Nota:** Esta herramienta realiza estimaciones orientativas basadas en los datos y supuestos introducidos. No utiliza un modelo predictivo de inteligencia artificial y sus resultados no garantizan ahorros reales.

---

## Funcionalidades

- **Formulario interactivo** con campos numéricos y sliders: proceso, empleados, horas semanales, coste por hora, % de reducción, coste de implantación, mantenimiento mensual y semanas laborables al año (52 por defecto).
- **Cálculos en tiempo real** de horas anuales, coste laboral actual, horas liberadas, valor económico potencial, coste total del primer año, beneficio neto, ROI potencial y periodo de recuperación.
- **Dashboard de resultados** con cuatro tarjetas KPI, explicación breve de cada indicador y tabla de detalle.
- **Gráficos** (Recharts): horas antes/después de la automatización y costes frente a beneficios del primer año.
- **Indicador visual del periodo de recuperación** sobre un horizonte de 36 meses.
- **Mensaje interpretativo** que se adapta a los resultados (favorable, medio plazo, no rentable…).
- **Escenarios** conservador (20 %), moderado (40 %) y optimista (60 %), personalizables, con comparativa y gráfico.
- **Distinción explícita** entre ahorro económico real y valor de la capacidad laboral liberada.
- **Informe PDF** descargable con datos, resultados, gráficos, escenarios, metodología y supuestos (generado en el navegador con jsPDF).
- **Impresión** optimizada de los resultados.
- **Validación** de campos: sin negativos, límites por campo, sin divisiones por cero.
- **Formato español** de números y moneda en euros (1.234,5 €).
- **Sección de metodología** con todas las fórmulas.
- Diseño **responsive** (ordenador, tablet y móvil) y accesible.

## Tecnologías

| Tecnología | Uso |
|---|---|
| [React 18](https://react.dev/) + [Vite 6](https://vite.dev/) | Interfaz y entorno de desarrollo/compilación |
| [Tailwind CSS 4](https://tailwindcss.com/) | Estilos |
| [Recharts](https://recharts.org/) | Gráficos |
| [jsPDF](https://github.com/parallax/jsPDF) | Generación del informe PDF en el navegador |
| [Lucide](https://lucide.dev/) | Iconos |

## Instalación y uso local

Requisitos: [Node.js](https://nodejs.org/) 20 o superior.

```bash
git clone https://github.com/PaoAlbanData/ai-savings-calculator.git
cd ai-savings-calculator
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

Otros comandos:

```bash
npm run build     # genera la versión de producción en dist/
npm run preview   # sirve localmente la versión de producción
```

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com/), pulsa **Add New → Project** e importa el repositorio.
3. Vercel detecta Vite automáticamente (Build Command `npm run build`, Output Directory `dist`).
4. Pulsa **Deploy**. No hace falta configurar variables de entorno.

## Fórmulas utilizadas

| Indicador | Fórmula |
|---|---|
| Horas anuales del proceso | Empleados × Horas semanales por empleado × Semanas al año |
| Coste laboral anual actual | Horas anuales × Coste laboral por hora |
| Horas anuales liberadas | Horas anuales × (% de reducción ÷ 100) |
| Valor económico anual potencial | Horas liberadas × Coste laboral por hora |
| Coste total del primer año | Coste de implantación + Mantenimiento mensual × 12 |
| Beneficio neto potencial (año 1) | Valor económico potencial − Coste total del primer año |
| ROI potencial (año 1) | Beneficio neto potencial ÷ Coste total del primer año × 100 |
| Periodo de recuperación (meses) | Coste de implantación ÷ (Valor potencial ÷ 12 − Mantenimiento mensual) |

### Criterios

- El **valor económico potencial** mide la capacidad laboral liberada, **no un ahorro de caja**. Solo se convierte en ahorro real si las horas se reasignan a tareas de mayor valor, se evitan contrataciones u horas extra, o se reduce el coste laboral. Los costes de implantación y mantenimiento sí son desembolsos reales.
- El **ROI potencial** no se calcula si el coste total del primer año es 0 €.
- El **periodo de recuperación** solo existe si el valor mensual de las horas liberadas supera el mantenimiento mensual.
- No se consideran impuestos, inflación, curva de adopción ni valor temporal del dinero.
- Los porcentajes de los escenarios son hipótesis ilustrativas, no resultados garantizados.

## Estructura del proyecto

```
├── public/
│   └── favicon.svg
├── src/
│   ├── components/      # Componentes de la interfaz (formulario, KPIs, gráficos, escenarios…)
│   ├── data/
│   │   └── defaults.js  # Datos de ejemplo, escenarios y límites de validación
│   ├── utils/
│   │   ├── calculations.js  # Fórmulas (funciones puras)
│   │   ├── format.js        # Formato español de números y moneda
│   │   └── pdf.js           # Generación del informe PDF
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Accesibilidad y diseño

- Paleta de gráficos validada para personas con daltonismo, con etiquetas directas en las barras.
- Campos con etiquetas, mensajes de error anunciados y navegación por teclado.
- Respeta la preferencia del sistema de reducir animaciones.

## Licencia

Proyecto de portfolio. Puedes usarlo como referencia libremente.

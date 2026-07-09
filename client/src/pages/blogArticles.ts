// ─── Blog Articles Data ──────────────────────────────────────────────────────

export interface BlogArticle {
  id: number;
  title: string;
  category: string;
  readTime: string;
  color: string;
  excerpt: string;
  content: string[];
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 0,
    title: 'Cómo Reducir el Estrés Laboral en 5 Pasos',
    category: 'Salud Mental',
    readTime: '5 min',
    color: '#7C4DFF',
    excerpt: 'El estrés laboral afecta al 67% de los trabajadores en Puerto Rico. Descubra estrategias comprobadas para reducirlo.',
    content: [
      'El estrés laboral es uno de los principales factores que afectan la productividad y el bienestar de los empleados en Puerto Rico. Según estudios recientes del Departamento del Trabajo y Recursos Humanos, aproximadamente el 67% de los trabajadores reportan niveles elevados de estrés relacionado con su empleo.',
      '**Paso 1: Identificar los Detonantes.** El primer paso es reconocer qué situaciones específicas generan estrés. Puede ser la carga de trabajo, conflictos interpersonales, falta de control sobre las tareas, o la incertidumbre laboral. Lleve un diario durante una semana anotando los momentos de mayor tensión.',
      '**Paso 2: Establecer Límites Saludables.** Defina horarios claros de trabajo y descanso. La cultura del "siempre disponible" erosiona la salud mental. Comunique sus límites de manera profesional y respete los de sus compañeros.',
      '**Paso 3: Incorporar Micro-Pausas.** Cada 90 minutos, tome una pausa de 5-10 minutos. Levántese, estire el cuerpo, respire profundamente. Estas micro-pausas restauran la capacidad cognitiva y reducen la acumulación de cortisol.',
      '**Paso 4: Practicar la Comunicación Asertiva.** Muchos conflictos laborales surgen por malentendidos. Aprenda a expresar sus necesidades de forma clara y respetuosa. Solicite retroalimentación constructiva y ofrézcala también.',
      '**Paso 5: Buscar Apoyo Profesional.** No espere a estar en crisis. Los programas de asistencia al empleado (EAP) y los servicios de bienestar corporativo como Empresa Saludable ofrecen herramientas preventivas que pueden hacer una diferencia significativa.',
      'Implementar estos cinco pasos de manera consistente puede reducir los niveles de estrés laboral hasta en un 40% en las primeras 8 semanas, según datos de nuestros programas corporativos activos en la isla.',
    ],
  },
  {
    id: 1,
    title: 'Guía de Ejercicios para la Oficina',
    category: 'Salud Física',
    readTime: '8 min',
    color: '#FF5722',
    excerpt: 'Rutinas de 10 minutos que puede realizar en su escritorio para prevenir dolores y mejorar la postura.',
    content: [
      'El sedentarismo en la oficina es responsable de un aumento del 35% en problemas musculoesqueléticos entre trabajadores de Puerto Rico. La buena noticia es que pequeñas intervenciones de movimiento durante la jornada laboral pueden prevenir la mayoría de estas condiciones.',
      '**Estiramiento de Cuello y Hombros (2 min).** Incline la cabeza hacia un lado, mantenga 15 segundos, repita del otro lado. Luego, eleve los hombros hacia las orejas, sostenga 5 segundos y suelte. Repita 5 veces. Esto alivia la tensión acumulada por mirar pantallas.',
      '**Rotación de Muñecas y Dedos (2 min).** Extienda los brazos al frente, rote las muñecas en círculos 10 veces en cada dirección. Abra y cierre los puños rápidamente 20 veces. Esto previene el síndrome del túnel carpiano.',
      '**Sentadillas en la Silla (3 min).** De pie frente a su silla, baje lentamente como si fuera a sentarse, detenga justo antes de tocar el asiento, y suba. Realice 3 series de 10 repeticiones. Fortalece piernas y glúteos sin necesidad de equipo.',
      '**Caminata en el Lugar (3 min).** Marche en su lugar elevando las rodillas lo más alto posible. Combine con movimientos de brazos. Esto eleva la frecuencia cardíaca y mejora la circulación sanguínea, especialmente importante después de estar sentado por horas.',
      '**Recomendación.** Programe alarmas cada 2 horas para realizar esta rutina completa de 10 minutos. Las empresas que implementan pausas activas reportan una reducción del 28% en ausentismo por dolores musculares y un aumento del 15% en productividad vespertina.',
    ],
  },
  {
    id: 2,
    title: 'Nutrición Corporativa: Menús Saludables',
    category: 'Nutrición',
    readTime: '6 min',
    color: '#4CAF50',
    excerpt: 'Cómo diseñar opciones alimentarias que mejoren la energía y concentración de su equipo.',
    content: [
      'La alimentación en el entorno laboral tiene un impacto directo en la productividad. Estudios demuestran que empleados con acceso a opciones nutritivas tienen un 25% más de energía sostenida durante la tarde, el período donde la productividad típicamente decae.',
      '**Principio 1: Proteína en Cada Comida.** Incluya fuentes de proteína magra (pollo, pescado, legumbres, huevos) en el almuerzo corporativo. La proteína estabiliza los niveles de azúcar en sangre y previene el "bajón" de las 2:00 PM.',
      '**Principio 2: Carbohidratos Complejos.** Sustituya el arroz blanco por arroz integral, quinoa o batata. Los carbohidratos complejos liberan energía gradualmente, manteniendo la concentración por más tiempo.',
      '**Principio 3: Hidratación Estratégica.** Provea estaciones de agua con frutas (limón, pepino, menta). La deshidratación leve reduce la capacidad cognitiva hasta un 20%. Evite depender del café como única fuente de hidratación.',
      '**Principio 4: Snacks Inteligentes.** Reemplace las máquinas expendedoras de dulces con opciones como nueces mixtas, frutas frescas, yogur griego y barras de granola sin azúcar añadida. Un snack saludable a media mañana previene decisiones alimentarias impulsivas al almuerzo.',
      '**Implementación en Puerto Rico.** Aproveche los productos locales: plátanos, aguacates, mangos, y pescado fresco. Colabore con proveedores locales para menús que combinen sabor caribeño con nutrición óptima. Nuestras farmacias aliadas ofrecen consultas nutricionales personalizadas para empresas.',
    ],
  },
  {
    id: 3,
    title: 'Educación Financiera para Empleados',
    category: 'Finanzas',
    readTime: '7 min',
    color: '#2196F3',
    excerpt: 'Programas de bienestar financiero que reducen el estrés económico y mejoran la retención de talento.',
    content: [
      'El estrés financiero es el principal distractor laboral en Puerto Rico, donde el 72% de los empleados reporta preocupaciones económicas que afectan su rendimiento. Un programa de educación financiera corporativa no es un lujo—es una inversión en productividad.',
      '**Módulo 1: Presupuesto Personal.** Enseñe a los empleados la regla 50/30/20: 50% necesidades, 30% deseos, 20% ahorro/deuda. Provea herramientas digitales para rastrear gastos y establecer metas financieras realistas.',
      '**Módulo 2: Manejo de Deuda.** En Puerto Rico, la deuda promedio por hogar supera los $15,000 en tarjetas de crédito. Ofrezca talleres sobre consolidación de deuda, negociación con acreedores, y estrategias de pago acelerado (bola de nieve vs. avalancha).',
      '**Módulo 3: Ahorro para Emergencias.** El objetivo mínimo es 3 meses de gastos básicos. Facilite programas de ahorro automático a través de deducción de nómina. Las empresas que ofrecen este beneficio ven un 34% menos de solicitudes de adelantos salariales.',
      '**Módulo 4: Planificación de Retiro.** Explique las opciones disponibles: planes 401(k), IRA, y los beneficios específicos del código tributario de Puerto Rico para el ahorro a largo plazo. Cada año de retraso en comenzar a ahorrar para el retiro cuesta miles en interés compuesto.',
      '**Resultados Medibles.** Las empresas con programas de bienestar financiero reportan: 28% menos ausentismo por estrés, 41% mayor satisfacción laboral, y 23% mejor retención de talento. La inversión se recupera en los primeros 6 meses.',
    ],
  },
  {
    id: 4,
    title: 'Implementando un Programa de Bienestar',
    category: 'Corporativo',
    readTime: '10 min',
    color: '#FF9800',
    excerpt: 'Guía paso a paso para lanzar un programa de bienestar corporativo exitoso en su organización.',
    content: [
      'Implementar un programa de bienestar corporativo requiere planificación estratégica, compromiso de la alta gerencia, y una ejecución por fases. Las empresas que siguen un proceso estructurado tienen 3 veces más probabilidades de lograr resultados sostenibles.',
      '**Fase 1: Diagnóstico (Semanas 1-4).** Realice una evaluación de necesidades: encuestas anónimas de salud, análisis de ausentismo, costos de seguro médico, y entrevistas con líderes de departamento. Identifique las 3 áreas prioritarias para su población específica.',
      '**Fase 2: Diseño del Programa (Semanas 5-8).** Basado en el diagnóstico, seleccione intervenciones específicas. No intente abordar todo a la vez. Un programa enfocado en 2-3 pilares tiene mejor adherencia que uno que cubra 10 áreas superficialmente.',
      '**Fase 3: Lanzamiento Piloto (Semanas 9-16).** Implemente con un grupo piloto del 20-30% de la plantilla. Mida participación, satisfacción, y métricas de salud base. Ajuste según retroalimentación antes del lanzamiento general.',
      '**Fase 4: Escalamiento (Meses 5-12).** Extienda el programa a toda la organización. Incorpore incentivos (días libres, descuentos en seguro, reconocimientos). Establezca embajadores de bienestar en cada departamento.',
      '**Fase 5: Medición y Mejora Continua.** Evalúe trimestralmente: participación, satisfacción, indicadores de salud, ausentismo, y ROI. Un programa maduro debe demostrar $3-6 de retorno por cada $1 invertido dentro de los primeros 18 meses.',
      '**Consideraciones para Puerto Rico.** Asegúrese de cumplir con las regulaciones del Departamento de Salud y OSHA. Integre la red de farmacias comunitarias como punto de acceso. Considere el contexto cultural caribeño en el diseño de actividades.',
    ],
  },
  {
    id: 5,
    title: 'Mindfulness en el Trabajo: Guía Práctica',
    category: 'Salud Mental',
    readTime: '4 min',
    color: '#7C4DFF',
    excerpt: 'Técnicas de atención plena que puede practicar en 5 minutos para mejorar enfoque y bienestar.',
    content: [
      'El mindfulness o atención plena es una de las herramientas más respaldadas por la ciencia para mejorar el bienestar laboral. Meta-análisis con más de 12,000 participantes demuestran reducciones significativas en ansiedad, depresión y agotamiento profesional.',
      '**Técnica 1: Respiración 4-7-8.** Inhale por la nariz contando hasta 4, sostenga contando hasta 7, exhale por la boca contando hasta 8. Repita 4 ciclos. Esta técnica activa el sistema nervioso parasimpático y reduce la respuesta de estrés en menos de 2 minutos.',
      '**Técnica 2: Escaneo Corporal Rápido.** Cierre los ojos 60 segundos. Dirija su atención desde la coronilla hasta los pies, notando sensaciones sin juzgarlas. Esto interrumpe el ciclo de pensamientos rumiativos y reconecta con el momento presente.',
      '**Técnica 3: Anclaje Sensorial.** Cuando sienta estrés, identifique: 5 cosas que ve, 4 que toca, 3 que escucha, 2 que huele, 1 que saborea. Este ejercicio de grounding es especialmente útil antes de reuniones difíciles o presentaciones.',
      '**Implementación Corporativa.** Designe un espacio tranquilo (aunque sea pequeño) para práctica. Ofrezca sesiones guiadas de 10 minutos al inicio de la jornada. Las apps de meditación corporativas tienen un 60% de adherencia cuando se combinan con sesiones presenciales mensuales.',
      '**Resultados Documentados.** Empresas con programas de mindfulness reportan: 32% menos errores, 24% mejor toma de decisiones, y 19% mayor creatividad en resolución de problemas. El costo es mínimo comparado con el retorno en calidad de trabajo.',
    ],
  },
  {
    id: 6,
    title: 'Ergonomía: Prevención de Lesiones',
    category: 'Salud Física',
    readTime: '6 min',
    color: '#FF5722',
    excerpt: 'Configuración óptima del espacio de trabajo para prevenir lesiones musculoesqueléticas.',
    content: [
      'Las lesiones musculoesqueléticas relacionadas con el trabajo representan el 33% de todas las reclamaciones de compensación obrera en Puerto Rico. La mayoría son prevenibles con ajustes ergonómicos simples que cuestan una fracción de lo que cuesta una reclamación.',
      '**Monitor.** La parte superior de la pantalla debe estar a nivel de los ojos, a una distancia de un brazo extendido (50-70 cm). Incline ligeramente hacia atrás (10-20°). Si usa laptop, invierta en un soporte elevador y teclado externo.',
      '**Silla.** Los pies deben estar planos en el suelo, rodillas a 90°, espalda apoyada en el respaldo con soporte lumbar. Los reposabrazos deben permitir que los hombros estén relajados, no elevados.',
      '**Teclado y Mouse.** Los codos a 90°, muñecas en posición neutral (no dobladas). Use un mouse ergonómico si trabaja más de 4 horas diarias con computadora. Considere un teclado dividido para reducir la pronación.',
      '**Iluminación.** Evite reflejos en la pantalla. La luz natural lateral es ideal. Complemente con iluminación indirecta. La regla 20-20-20: cada 20 minutos, mire algo a 20 pies de distancia por 20 segundos para reducir fatiga visual.',
      '**Evaluación Profesional.** Empresa Saludable ofrece evaluaciones ergonómicas in situ con recomendaciones personalizadas. Las empresas que implementan nuestras recomendaciones reportan una reducción del 45% en quejas musculoesqueléticas dentro de los primeros 3 meses.',
    ],
  },
  {
    id: 7,
    title: 'ROI del Bienestar Corporativo',
    category: 'Corporativo',
    readTime: '12 min',
    color: '#FF9800',
    excerpt: 'Análisis financiero del retorno de inversión en programas de bienestar para empresas en Puerto Rico.',
    content: [
      'La pregunta más común de los ejecutivos es: ¿cuánto retorna cada dólar invertido en bienestar? La respuesta, respaldada por más de 50 estudios longitudinales, es consistente: entre $3 y $6 por cada $1 invertido, con resultados visibles desde el primer año.',
      '**Reducción de Ausentismo.** El ausentismo cuesta a las empresas puertorriqueñas un promedio de $1,685 por empleado al año. Programas de bienestar bien implementados reducen el ausentismo entre 25-40%, generando ahorros directos de $420-$674 por empleado anualmente.',
      '**Reducción de Costos Médicos.** Los costos de seguro médico grupal aumentan 8-12% anual en Puerto Rico. Empresas con programas de bienestar activos logran contener estos aumentos al 3-5%, ahorrando miles por empleado en primas.',
      '**Mejora en Productividad.** El presentismo (estar presente pero no productivo) cuesta 3 veces más que el ausentismo. Empleados saludables y comprometidos son 21% más productivos. Para una empresa de 100 empleados con salario promedio de $35,000, esto representa $735,000 en valor adicional.',
      '**Retención de Talento.** Reemplazar un empleado cuesta 50-200% de su salario anual. Programas de bienestar mejoran la retención en 23-41%. Para una empresa con 15% de rotación anual, esto puede significar ahorros de $100,000+ al año.',
      '**Cálculo para su Empresa.** Solicite una evaluación gratuita con Empresa Saludable. Analizamos sus métricas actuales (ausentismo, rotación, costos médicos, productividad) y proyectamos el ROI específico para su organización con un modelo financiero personalizado.',
    ],
  },
  {
    id: 8,
    title: 'Planificación de Presupuesto Personal',
    category: 'Finanzas',
    readTime: '5 min',
    color: '#2196F3',
    excerpt: 'Herramientas y métodos para que sus empleados tomen control de sus finanzas personales.',
    content: [
      'El 78% de los trabajadores en Puerto Rico vive de cheque en cheque. Esta realidad financiera genera estrés crónico que impacta directamente la concentración, las relaciones laborales y la salud física. Un presupuesto personal es el primer paso hacia la estabilidad.',
      '**Método de los Sobres Digitales.** Divida su ingreso neto en categorías fijas: vivienda (30%), transporte (15%), alimentación (15%), servicios (10%), ahorro (10%), deuda (10%), personal (10%). Use apps como YNAB o Mint para rastrear cada categoría.',
      '**Identificar Gastos Fantasma.** Revise sus estados de cuenta de los últimos 3 meses. Identifique suscripciones olvidadas, compras impulsivas recurrentes, y cargos automáticos innecesarios. El puertorriqueño promedio gasta $200+ mensuales en gastos que no recuerda haber autorizado.',
      '**Fondo de Emergencia Progresivo.** Comience con una meta de $500 (cubre la mayoría de emergencias menores). Luego avance a 1 mes de gastos, después 3 meses. Automatice una transferencia semanal, aunque sea de $25. La consistencia supera al monto.',
      '**Negociación de Servicios.** Llame a sus proveedores de cable, internet, seguro de auto y teléfono. Solicite descuentos por lealtad o amenace con cancelar. El 70% de las veces obtiene una reducción. Esto puede liberar $100-300 mensuales sin cambiar su estilo de vida.',
      '**Recurso Corporativo.** Empresa Saludable ofrece talleres mensuales de finanzas personales como parte de nuestros planes corporativos. Incluyen consultas individuales confidenciales con asesores financieros certificados.',
    ],
  },
];

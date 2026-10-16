/* ============================================================
   LECCIONES DE TEORÍA
   Cada lección tiene: dominio, título, minutos estimados de
   lectura y comprobaciones al final. El cuerpo (bloques de texto)
   está en lesson-bodies.js y se carga al abrir la lección.
   ============================================================ */

export const LESSONS = [
  /* ==================== CAPA FÍSICA ==================== */
  {
    id: "phy1", dom: "phy", mins: 8,
    title: "Por qué LoRa oye lo que nadie oye",
    checks: [
      { q: "¿Por qué LoRa puede demodular señales por debajo del nivel de ruido?", opts: ["Porque transmite con más potencia", "Porque la correlación con el chirp conocido concentra la energía de la señal y no la del ruido", "Porque usa corrección de errores muy agresiva", "Porque el receptor filtra en banda estrecha"], a: 1, exp: "La ganancia de proceso viene de la correlación: la energía repartida del chirp se concentra en un pico, mientras que el ruido aleatorio permanece disperso." },
      { q: "Un nodo pasa de SF9 a SF11. ¿Qué ocurre con la duración de símbolo?", opts: ["Se multiplica por cuatro", "Se duplica", "Se reduce a la mitad", "No cambia si el BW es el mismo"], a: 0, exp: "Cada unidad de SF duplica Tsym, así que dos unidades lo multiplican por cuatro. También cuadruplica aproximadamente el tiempo en aire y la energía por mensaje." },
      { q: "El Sync Word 0x34 sirve para:", opts: ["Cifrar la cabecera", "Sincronizar las balizas de clase B", "Indicar el spreading factor", "Distinguir el tráfico de redes públicas LoRaWAN y descartar el resto pronto"], a: 3, ref: "RP002 §4.1.2", exp: "Es un filtro de eficiencia que va en claro. No aporta ninguna protección criptográfica." },
    ],
  },
  {
    id: "phy2", dom: "phy", mins: 9,
    title: "SF, ancho de banda y coding rate: el triángulo de compromisos",
    checks: [
      { q: "¿Cuál es el efecto de pasar de 125 a 250 kHz manteniendo SF7?", opts: ["Duplica la tasa y empeora la sensibilidad unos 3 dB", "Duplica el alcance", "No cambia nada relevante", "Activa el LDRO"], a: 0, exp: "Duplicar BW divide Tsym por dos, pero deja entrar el doble de potencia de ruido, lo que degrada la sensibilidad en aproximadamente 3 dB." },
      { q: "El LDRO se activa cuando:", opts: ["El coding rate es 4/8", "Se usa SF11 o SF12 con 125 kHz de ancho de banda", "El payload supera 51 bytes", "El nodo entra en clase B"], a: 1, exp: "Con símbolos de decenas de milisegundos la deriva de reloj compromete la demodulación. El LDRO sacrifica dos bits por símbolo para ganar margen, y aparece como DE = 1 en la fórmula de tiempo en aire." },
      { q: "Un nodo lejano deja de ser recibido cuando otro cercano transmite a la vez con distinto SF. Se debe a:", opts: ["Un fallo del Sync Word", "El efecto de captura: la señal fuerte enmascara a la débil pese a la cuasi-ortogonalidad", "El límite de duty cycle", "La ausencia de coding rate"], a: 1, exp: "La ortogonalidad entre spreading factors es aproximada. Diferencias grandes de potencia recibida rompen la separación entre demoduladores." },
    ],
  },
  {
    id: "phy3", dom: "phy", mins: 10,
    title: "Tiempo en aire: el número que gobierna toda la red",
    checks: [
      { q: "En la fórmula de tiempo en aire, ¿qué representa PL?", opts: ["Solo la carga útil de aplicación", "La potencia de transmisión", "El número de símbolos del preámbulo", "El PHYPayload completo, incluidas cabeceras y MIC"], a: 3, exp: "PL son los bytes de la trama física. Sobre la carga de aplicación hay que sumar MHDR, FHDR, FPort y MIC: 13 bytes como mínimo." },
      { q: "Con un tiempo en aire de 2 s y un ciclo de trabajo del 1 %, ¿cuánto hay que esperar antes de volver a transmitir en esa subbanda?", opts: ["20 s", "100 s", "198 s", "3.600 s"], a: 2, ref: "RP002 §2.4", exp: "La espera es ToA · (100/dc − 1) = 2 · 99 = 198 s. Es decir, unos 18 mensajes por hora como máximo." },
      { q: "¿Por qué el downlink es el recurso más escaso de una celda LoRaWAN?", opts: ["Porque los nodos no saben recibir", "Porque el gateway es semidúplex y está sujeto a su propio ciclo de trabajo", "Porque el Network Server limita los downlinks a uno por hora", "Porque el downlink usa siempre SF12"], a: 1, exp: "Mientras transmite, el gateway no recibe, y su tiempo de emisión está limitado por la regulación. Un exceso de tramas confirmadas agota ese presupuesto rápidamente." },
    ],
  },

  /* ==================== ARQUITECTURA ==================== */
  {
    id: "arq1", dom: "arq", mins: 9,
    title: "Los cinco elementos y el viaje de un uplink",
    checks: [
      { q: "Un gateway recibe una trama de un dispositivo que no ha visto nunca. ¿Qué hace?", opts: ["La reenvía al Network Server con metadatos de radio", "La descarta por no estar asociado", "Consulta al Join Server si acepta al dispositivo", "La descifra y la envía al Application Server"], a: 0, ref: "TS002 §3", exp: "No existe asociación entre nodo y gateway. El gateway reenvía cualquier trama LoRaWAN que reciba y es el Network Server quien decide si la sesión es válida." },
      { q: "¿Quién elige el gateway que emitirá un downlink?", opts: ["El dispositivo, en el campo FCtrl", "El propio gateway que mejor recibió", "El Network Server, según SNR y disponibilidad", "El Application Server"], a: 2, ref: "TS002 §3", exp: "El Network Server centraliza la decisión: conoce todas las recepciones duplicadas y el estado de ciclo de trabajo de cada gateway." },
      { q: "¿Por qué LoRaWAN no usa topología en malla?", opts: ["Porque la radio no lo permitiría", "Porque la especificación lo dejó para una versión futura", "Porque reenviar tráfico ajeno arruinaría la batería de los nodos y añadiría complejidad de encaminamiento", "Porque los gateways ya hacen de nodos"], a: 2, ref: "TS002 §3", exp: "La estrella de estrellas mantiene el nodo dormido casi todo el tiempo. La diversidad de gateways aporta la fiabilidad que en otras tecnologías da la malla." },
    ],
  },
  {
    id: "arq2", dom: "arq", mins: 8,
    title: "Quién ve qué: el reparto de seguridad",
    checks: [
      { q: "¿Qué clave impide que el operador de red lea los datos de tu sensor?", opts: ["NwkSKey", "El Sync Word", "NwkKey", "AppSKey"], a: 3, ref: "TS002 §3", exp: "El FRMPayload de aplicación se cifra con la AppSKey, que solo conocen el dispositivo y el Application Server." },
      { q: "El Join Server puede pertenecer a una organización distinta del operador de red porque:", opts: ["Así lo exige la regulación europea", "Necesita acceso directo a los gateways", "Su función es custodiar claves raíz y derivar sesiones, independiente de la gestión de radio", "Solo funciona con ABP"], a: 2, ref: "TS002 §3", exp: "Esa separación permite cambiar de operador sin reprogramar los dispositivos, ya que las claves raíz siguen en el mismo Join Server." },
      { q: "Backend Interfaces (TS002) define:", opts: ["El formato de trama en el aire", "La mensajería entre NS, JS, AS y entre operadores en roaming", "El protocolo del packet forwarder del gateway", "Los planes de frecuencia regionales"], a: 1, ref: "TS002 §1", exp: "Es la especificación de los interfaces entre servidores. El enlace gateway-servidor no está cubierto por ella." },
    ],
  },
  {
    id: "arq3", dom: "arq", mins: 8,
    title: "Identificadores, direccionamiento y roaming",
    checks: [
      { q: "¿Qué identificador cambia en cada procedimiento de unión OTAA?", opts: ["DevEUI", "JoinEUI", "DevAddr", "NetID"], a: 2, ref: "TS002 §14", exp: "La DevAddr identifica una sesión, no al hardware, y el servidor asigna una nueva en cada Join-Accept junto con claves de sesión frescas." },
      { q: "En roaming pasivo, el control MAC de la sesión lo mantiene:", opts: ["El Network Server doméstico", "El Network Server visitado", "El Join Server", "El gateway visitado"], a: 0, ref: "TS002 §11.3", exp: "El fNS visitado solo reenvía tramas. En handover roaming, en cambio, el sNS visitado asume la gestión MAC." },
      { q: "¿Por qué la DevAddr no basta para identificar una trama con seguridad?", opts: ["Porque va cifrada", "Porque solo se usa en ABP", "Porque cambia en cada trama", "Porque solo es única dentro de una red y puede repetirse entre operadores"], a: 3, ref: "TS002 §14", exp: "Son 32 bits con un prefijo de red. El servidor valida siempre el MIC, que es lo que prueba realmente la autenticidad." },
    ],
  },

  /* ==================== CLASES ==================== */
  {
    id: "cls1", dom: "cls", mins: 9,
    title: "Clase A: el contrato de consumo mínimo",
    checks: [
      { q: "Un nodo de clase A recibe un downlink en RX1. ¿Qué hace después?", opts: ["Abre igualmente RX2 por si hay más datos", "Pasa a clase C temporalmente", "Retransmite el uplink", "No abre RX2 y apaga la radio"], a: 3, ref: "TS001 §3.3", exp: "Recibir en RX1 cancela RX2. Si el servidor tiene más datos en cola, lo indica con el bit FPending para que el nodo envíe otro uplink." },
      { q: "En EU868, ¿qué frecuencia y data rate usa RX2 por defecto?", opts: ["La del uplink y el mismo DR", "923,3 MHz y DR8", "868,1 MHz y DR5", "869,525 MHz y DR0"], a: 3, ref: "RP002 §2.4.7", exp: "RX2 usa parámetros fijos, en una subbanda con 10 % de ciclo de trabajo y el data rate más robusto, para maximizar la probabilidad de entrega." },
      { q: "¿Por qué JOIN_ACCEPT_DELAY1 es de 5 s y no de 1 s?", opts: ["Porque el Join-Accept es más largo", "Porque el nodo transmite a SF12 durante el join", "Porque el servidor necesita tiempo para consultar al Join Server y derivar claves", "Porque lo exige la regulación"], a: 2, ref: "TS001 §3.3", exp: "El procedimiento de unión implica una consulta al Join Server y la derivación de claves, que necesitan más margen que la respuesta a un uplink de datos." },
    ],
  },
  {
    id: "cls2", dom: "cls", mins: 9,
    title: "Clase B: latencia acotada mediante balizas",
    checks: [
      { q: "¿Cada cuánto se emite la baliza en clase B?", opts: ["30 s", "64 s", "128 s", "256 s"], a: 2, ref: "TS001 §11.1", exp: "El periodo de baliza es de 128 s y se divide en ventana reservada, ventana de balizas y guarda." },
      { q: "Con una periodicidad de ping slot k = 5, ¿cuántas ranuras abre el nodo por periodo?", opts: ["4", "8", "32", "128"], a: 0, ref: "TS001 §11.2", exp: "2^(7−5) = 4 ranuras cada 128 s, es decir, una oportunidad de downlink aproximadamente cada 32 segundos." },
      { q: "Un nodo de clase B lleva tres horas sin recibir balizas. ¿En qué estado está?", opts: ["Sigue en clase B con ventanas ensanchadas", "Se ha desconectado y debe repetir el join", "Ha pasado a clase C", "Ha vuelto a clase A"], a: 3, ref: "TS001 §10.1", exp: "El modo beaconless amplía las ventanas durante unas dos horas. Agotado ese margen, el dispositivo abandona la clase B y opera como clase A." },
    ],
  },
  {
    id: "cls3", dom: "cls", mins: 6,
    title: "Clase C y cambios de clase",
    checks: [
      { q: "Un dispositivo de clase C acaba de transmitir un uplink. ¿Qué ocurre a continuación?", opts: ["Abre RXC de inmediato y no abre RX1", "Espera al siguiente uplink", "Solo abre RX2", "Abre RX1 en su instante y después vuelve a RXC continuo"], a: 3, ref: "TS001 §15", exp: "La clase C conserva RX1. Cierra RXC durante la transmisión y durante RX1, y lo reabre en cuanto RX1 termina." },
      { q: "Durante una campaña FUOTA, un sensor a pilas suele:", opts: ["Permanecer en clase A todo el proceso", "Repetir el join en clase C", "Conmutar temporalmente a clase B o C y volver a A al terminar", "Desactivar el ADR de forma permanente"], a: 2, exp: "El cambio temporal de clase permite recibir los fragmentos en multicast sin sacrificar la autonomía el resto del tiempo." },
      { q: "¿Qué clase requiere gateways con referencia temporal precisa?", opts: ["Clase A", "Todas por igual", "Clase C", "Clase B"], a: 3, ref: "TS001 §13.5", exp: "Las balizas de clase B deben emitirse simultáneamente y con precisión, lo que exige sincronización GPS en los gateways." },
    ],
  },

  /* ==================== SEGURIDAD ==================== */
  {
    id: "sec1", dom: "sec", mins: 10,
    title: "OTAA paso a paso",
    checks: [
      { q: "¿Qué contiene exactamente un Join-Request?", opts: ["DevAddr, FCnt y MIC", "JoinEUI, DevEUI y DevNonce, más el MIC", "AppKey cifrada y DevEUI", "NetID, DevAddr y CFList"], a: 1, ref: "TS001 §6.2.5", exp: "18 bytes de payload: JoinEUI (8) + DevEUI (8) + DevNonce (2). Va en claro pero con integridad protegida por la clave raíz." },
      { q: "¿Cuánto mide el payload de un Join-Accept que incluye CFList?", opts: ["12 bytes", "18 bytes", "28 bytes", "33 bytes"], a: 2, ref: "TS001 §6.2.6", exp: "12 bytes de campos obligatorios más 16 de CFList. La lista comunica canales adicionales o una máscara de canales según la región." },
      { q: "Un dispositivo al que se le ha borrado la memoria no volátil no consigue unirse. La causa más probable es:", opts: ["Ha perdido la AppKey", "Está fuera de cobertura", "Su DevNonce se ha reiniciado y el servidor lo rechaza por repetido", "El JoinEUI ha caducado"], a: 2, ref: "TS001 §6.2.5", exp: "Desde 1.0.3 el DevNonce es un contador monótono. El servidor rechaza valores ya usados, así que hay que reiniciar también su registro en el servidor." },
    ],
  },
  {
    id: "sec2", dom: "sec", mins: 7,
    title: "ABP: qué es y por qué casi nunca conviene",
    checks: [
      { q: "¿Cuál es el principal riesgo operativo de ABP?", opts: ["No admite cifrado de aplicación", "Requiere un Join Server dedicado", "No permite usar clase A", "La pérdida de los contadores de trama al reiniciar rompe la sesión o fuerza a desactivar la protección antirrepetición"], a: 3, ref: "TS001 §6.3", exp: "Los contadores deben persistir en memoria no volátil. Desactivar su validación en el servidor abre la puerta a ataques de repetición." },
      { q: "Si las claves de un dispositivo ABP se comprometen, la solución es:", opts: ["Forzar un nuevo join", "Reprogramar físicamente el dispositivo con claves nuevas", "Cambiar la DevAddr en el servidor", "Rotar el Sync Word"], a: 1, ref: "TS001 §6.3", exp: "ABP no tiene mecanismo de renovación de sesión. Sin procedimiento de unión, la única salida es reprovisionar el hardware." },
      { q: "Un dispositivo ABP recién activado en EU868 conoce inicialmente:", opts: ["Todos los canales de la red, recibidos en el Join-Accept", "Solo los tres canales por defecto, hasta que reciba comandos MAC", "Los canales que él mismo escanea", "Ninguno, hasta el primer downlink"], a: 1, ref: "TS001 §6.3", exp: "Sin Join-Accept no hay CFList, así que arranca con la configuración regional mínima y depende de NewChannelReq para ampliarla." },
    ],
  },
  {
    id: "sec3", dom: "sec", mins: 9,
    title: "Criptografía LoRaWAN: MIC, cifrado y jerarquía de claves",
    checks: [
      { q: "El MIC de una trama LoRaWAN es:", opts: ["Un CRC de 2 bytes", "Un hash del payload cifrado", "8 bytes con HMAC-SHA256", "4 bytes obtenidos con AES-128 CMAC"], a: 3, ref: "TS001 §4.4", exp: "Se calcula con AES-128 en modo CMAC sobre la trama completa y se truncan los cuatro primeros bytes." },
      { q: "¿Por qué el texto cifrado tiene la misma longitud que el original?", opts: ["Porque se descarta el exceso", "Porque el modo CTR combina el payload con un flujo de claves mediante XOR, sin relleno", "Porque el payload siempre es múltiplo de 16", "Porque se comprime antes de cifrar"], a: 1, ref: "TS001 §4.3.3", exp: "El modo contador convierte AES en un cifrado de flujo. Es una propiedad valiosa cuando el payload máximo son 51 bytes." },
      { q: "En LoRaWAN 1.1, ¿por qué el MIC de uplink se divide entre dos claves?", opts: ["Para que en roaming una red visitada verifique su parte sin tener el control criptográfico completo", "Para acelerar el cálculo", "Para permitir MIC de 8 bytes", "Para separar clase A de clase B"], a: 0, ref: "TS001-1.1 §6.1.2.3", exp: "FNwkSIntKey y SNwkSIntKey reparten la verificación entre el NS que reenvía y el que sirve la sesión, que es la base del roaming con handover." },
    ],
  },

  /* ==================== TRAMA ==================== */
  {
    id: "mac1", dom: "mac", mins: 10,
    title: "Anatomía de una trama, byte a byte",
    checks: [
      { q: "¿Qué campo determina si una trama es un Confirmed Data Up?", opts: ["FCtrl", "El MIC", "FPort", "El MType dentro del MHDR"], a: 3, ref: "TS001 §4.2.1", exp: "El MType ocupa los tres bits más altos del MHDR. 100 corresponde a Confirmed Data Up." },
      { q: "En el aire, una DevAddr 26011BDA aparece como:", opts: ["26011BDA", "0126DA1B", "1BDA2601", "DA1B0126"], a: 3, ref: "TS001 §1.1", exp: "Los campos multibyte van en little-endian, así que los bytes se invierten respecto a la representación habitual." },
      { q: "¿Cuántos bytes de sobrecarga añade LoRaWAN a una carga útil de aplicación en el caso más simple?", opts: ["5", "9", "13", "18"], a: 2, ref: "TS001 §4.1", exp: "MHDR (1) + FHDR (7) + FPort (1) + MIC (4) = 13 bytes, sin contar FOpts." },
    ],
  },
  {
    id: "mac2", dom: "mac", mins: 8,
    title: "FCtrl, contadores y confirmaciones",
    checks: [
      { q: "El bit FPending en un downlink indica que:", opts: ["El nodo debe confirmar la trama", "El servidor tiene más downlinks en cola y conviene enviar otro uplink", "La trama contiene comandos MAC", "El nodo está en clase B"], a: 1, ref: "TS001 §4.3.1", exp: "Solo existe en downlink. Avisa al nodo de que abriendo nuevas ventanas recogerá el resto de los datos pendientes." },
      { q: "¿Por qué se transmiten solo 16 bits del contador de 32?", opts: ["Para ahorrar tiempo en aire; el receptor reconstruye la parte alta", "Porque más no cabe en el MIC", "Porque el contador se reinicia cada 65.536 tramas", "Porque la parte alta va en el FPort"], a: 0, ref: "TS001 §4.3.1", exp: "Ambos extremos mantienen los 32 bits y el receptor infiere el desbordamiento. El contador completo entra en el MIC y en el cifrado." },
      { q: "Un nodo envía tres tramas confirmadas seguidas y recibe un único ACK. ¿Qué sabe?", opts: ["Que las tres llegaron", "Que solo llegó la última", "Que al menos una llegó, sin poder identificar cuáles", "Que ninguna llegó"], a: 2, ref: "TS001 §4.3.1", exp: "El ACK no numera ni acumula: confirma la recepción sin identificar la secuencia, lo que limita su utilidad como mecanismo de fiabilidad." },
    ],
  },
  {
    id: "mac3", dom: "mac", mins: 7,
    title: "Puertos y transporte de comandos MAC",
    checks: [
      { q: "Una trama con FPort = 0 puede contener:", opts: ["Comandos MAC y datos de aplicación a la vez", "Solo datos de aplicación", "Únicamente comandos MAC cifrados con la clave de red", "El Join-Request"], a: 2, ref: "TS001 §4.3.2", exp: "FPort 0 dedica todo el FRMPayload a comandos MAC. Las dos vías de transporte, FOpts y FPort 0, son excluyentes." },
      { q: "¿Cuál es la longitud máxima del campo FOpts?", opts: ["8 bytes", "15 bytes", "16 bytes", "51 bytes"], a: 1, ref: "TS001 §4.3.1", exp: "FOptsLen ocupa 4 bits del FCtrl, de ahí el máximo de 15 bytes. Si no caben, los comandos deben ir en FPort 0." },
      { q: "El puerto 224 se reserva para:", opts: ["Tráfico multicast", "Sincronización de reloj", "Comandos MAC largos", "El protocolo de pruebas de certificación"], a: 3, ref: "TS001 §4.3.2", exp: "Lo usa el banco de pruebas durante la certificación LoRaWAN Certified. Los puertos 225 a 255 quedan reservados a extensiones futuras." },
    ],
  },

  /* ==================== COMANDOS Y ADR ==================== */
  {
    id: "cmd1", dom: "cmd", mins: 10,
    title: "Cómo funciona el ADR de verdad",
    checks: [
      { q: "¿Quién decide el nuevo data rate cuando el ADR está activo?", opts: ["El Network Server, mediante LinkADRReq", "El dispositivo, según su propio SNR", "El gateway con mejor recepción", "El Join Server"], a: 0, ref: "TS001 §5.2", exp: "El nodo solo decide si participa activando el bit ADR. Los valores concretos los impone el servidor a partir del historial de SNR." },
      { q: "Un nodo lleva 96 uplinks sin recibir ningún downlink. ¿Qué está haciendo?", opts: ["Ya ha activado ADRACKReq y ha iniciado el backoff subiendo potencia", "Nada especial, es normal", "Ha vuelto a clase A", "Ha repetido el join"], a: 0, ref: "TS001 §5.2", exp: "ADR_ACK_LIMIT (64) más ADR_ACK_DELAY (32) suman 96. Superado ese umbral el nodo sube la potencia al máximo y después empieza a bajar el data rate." },
      { q: "¿Por qué se desaconseja el ADR en dispositivos móviles?", opts: ["Porque consume más batería", "Porque el algoritmo asume condiciones de radio estables y reacciona demasiado tarde al desplazamiento", "Porque no es compatible con clase A", "Porque el servidor lo rechaza"], a: 1, ref: "TS001 §5.2", exp: "El ADR optimiza sobre un historial reciente. Un nodo optimizado cerca del gateway se queda sin enlace al alejarse, y el backoff tarda decenas de uplinks en actuar." },
    ],
  },
  {
    id: "cmd2", dom: "cmd", mins: 9,
    title: "Catálogo de comandos MAC",
    checks: [
      { q: "¿Qué comando permite al dispositivo saber cuántos gateways le están oyendo?", opts: ["DevStatusReq", "LinkCheckReq", "LinkADRReq", "DeviceTimeReq"], a: 1, ref: "TS001 §5.1", exp: "LinkCheckAns (0x02) devuelve el margen de demodulación en dB y el número de gateways que recibieron la trama." },
      { q: "En DevStatusAns, un valor de batería de 0 significa:", opts: ["Batería agotada", "No se puede medir", "El dispositivo está alimentado externamente", "Batería al 100 %"], a: 2, ref: "TS001 §5.5", exp: "0 indica alimentación externa, de 1 a 254 es la escala proporcional y 255 significa que el dispositivo no puede medir la batería." },
      { q: "Un dispositivo acepta el data rate propuesto pero rechaza la máscara de canales de un LinkADRReq. ¿Qué ocurre?", opts: ["Aplica solo el data rate", "No aplica ninguno de los tres parámetros", "El servidor reintenta automáticamente", "El dispositivo vuelve a los canales por defecto"], a: 1, ref: "TS001 §5.2", exp: "LinkADRAns confirma cada campo por separado, pero si alguno se rechaza el dispositivo no aplica ninguno: la orden se trata como un conjunto." },
    ],
  },
  {
    id: "cmd3", dom: "cmd", mins: 7,
    title: "Diagnóstico: síntomas y causas habituales",
    checks: [
      { q: "Un dispositivo ABP deja de ser aceptado tras un corte de alimentación. La causa más probable es:", opts: ["Ha perdido las claves", "Su FCntUp se ha reiniciado y el servidor lo descarta por repetido", "El gateway ha cambiado", "Ha caducado la DevAddr"], a: 1, ref: "TS001 §6.3", exp: "Los contadores deben persistir en memoria no volátil. Al reiniciarse, el servidor interpreta las tramas como repeticiones." },
      { q: "Los uplinks llegan bien pero ningún downlink alcanza al nodo. ¿Qué revisarías primero?", opts: ["Las claves de aplicación", "El plan de frecuencia de uplink", "La temporización de RX y los parámetros de RX2", "El DevEUI"], a: 2, ref: "TS001 §3.3", exp: "Si el uplink funciona, la radio y la sesión están bien. El problema suele estar en RxDelay o en un RX2 no estándar que el nodo desconoce." },
      { q: "Un sensor a pilas agota la batería en meses en lugar de años. La causa más probable es:", opts: ["Payload demasiado corto", "Opera en SF12 con tramas confirmadas o se une repetidamente", "Usa el puerto 224", "Tiene el bit ADR activado"], a: 1, exp: "El consumo lo domina el tiempo de radio activa. SF alto, confirmaciones con reintentos y joins repetidos son los tres sospechosos habituales." },
    ],
  },

  /* ==================== REGIONAL ==================== */
  {
    id: "reg1", dom: "reg", mins: 8,
    title: "Por qué existen los parámetros regionales",
    checks: [
      { q: "¿Qué documento define los planes de frecuencia por región?", opts: ["TS001 Link Layer", "TS005 Remote Multicast Setup", "TS002 Backend Interfaces", "RP002 Regional Parameters"], a: 3, ref: "RP002", exp: "TS001 define el protocolo, que es universal. RP002 recoge todo lo que depende de la geografía." },
      { q: "En Norteamérica no hay límite de ciclo de trabajo, pero sí:", opts: ["Un máximo de mensajes diarios", "Prohibición de downlink", "Dwell time de 400 ms y salto de frecuencia obligatorio", "Restricción a clase A"], a: 2, ref: "RP002 §2.5", exp: "La FCC limita la duración de cada transmisión y exige rotar canales, lo que en la práctica descarta SF12 en canales de 125 kHz." },
      { q: "Un dispositivo ABP en EU868 solo conocerá canales adicionales si:", opts: ["Los recibe en el Join-Accept", "Los escanea automáticamente", "El servidor se los envía con NewChannelReq", "Cambia de plan regional"], a: 2, ref: "TS001 §5.6", exp: "Sin procedimiento de unión no hay CFList, así que la única vía es el comando MAC durante la sesión." },
    ],
  },
  {
    id: "reg2", dom: "reg", mins: 9,
    title: "EU868 en detalle",
    checks: [
      { q: "¿Cuál es la carga útil máxima de aplicación en DR2 en EU868?", opts: ["11 bytes", "115 bytes", "51 bytes", "242 bytes"], a: 2, ref: "RP002 §2.4.6", exp: "DR0, DR1 y DR2 comparten un máximo de 51 bytes. A partir de DR3 sube a 115 y desde DR4 a 242." },
      { q: "La subbanda de 869,4 a 869,65 MHz permite:", opts: ["25 mW y 1 % de ciclo de trabajo", "Solo uplink", "100 mW sin restricción", "500 mW y 10 % de ciclo de trabajo"], a: 3, ref: "RP002 §2.4", exp: "Es la subbanda más generosa del plan y por eso alberga la frecuencia de RX2, 869,525 MHz." },
      { q: "En EU868, ¿qué data rate corresponde a SF9?", opts: ["DR2", "DR4", "DR3", "DR6"], a: 2, ref: "RP002 §2.4.3", exp: "DR0 es SF12 y va bajando: DR3 corresponde a SF9. El número de DR y el SF suman 17 en el rango DR0 a DR5." },
    ],
  },
  {
    id: "reg3", dom: "reg", mins: 8,
    title: "US915, AS923 y el resto del mundo",
    checks: [
      { q: "¿Cuántos canales de uplink de 125 kHz define US915?", opts: ["8", "16", "64", "72"], a: 2, ref: "RP002 §2.5.2", exp: "64 canales de 125 kHz desde 902,3 MHz, más 8 de 500 kHz. En total 72 canales de uplink." },
      { q: "Un dispositivo US915 tarda muchísimo en unirse a la red. La causa más probable es:", opts: ["Está en SF12", "Prueba los 72 canales mientras el gateway solo escucha una subbanda de 8", "El dwell time bloquea el join", "Le falta la CFList"], a: 1, ref: "RP002 §2.5.2", exp: "Es el problema clásico de US915. Fijar la subbanda correcta en el dispositivo resuelve la mayoría de estos casos." },
      { q: "¿Qué plan regional exige escuchar el canal antes de transmitir (LBT)?", opts: ["EU868", "US915", "KR920", "IN865"], a: 2, ref: "RP002 §2.11", exp: "KR920 (Corea) exige Listen Before Talk: el dispositivo comprueba que el canal está libre antes de transmitir, a diferencia del ciclo de trabajo de EU868 o el dwell time de US915." },
    ],
  },

  /* ==================== DESPLIEGUE ==================== */
  {
    id: "ops1", dom: "ops", mins: 9,
    title: "Presupuesto de enlace y cobertura",
    checks: [
      { q: "¿Qué aporta más margen de enlace: pasar de SF7 a SF12, o duplicar la ganancia de antena?", opts: ["La antena, siempre", "Ambas por igual", "El cambio de SF: aporta unos 14 dB", "Ninguna afecta al margen"], a: 2, exp: "Los 14 dB del cambio de spreading factor son difíciles de igualar con antenas, aunque se pagan con 32 veces más tiempo en aire." },
      { q: "¿Por qué suele preferirse subir la antena a aumentar su ganancia?", opts: ["Porque es más barato", "Porque reduce el consumo", "Porque despeja la zona de Fresnel y amplía el horizonte, mientras que la ganancia solo redistribuye energía", "Porque la regulación limita la ganancia"], a: 2, exp: "Una antena de alta ganancia estrecha el lóbulo vertical y puede dejar sin cobertura a los nodos situados justo debajo del mástil." },
      { q: "Un cálculo de enlace da un margen de 2 dB. ¿Qué conclusión sacas?", opts: ["El enlace es sólido", "El cálculo está mal", "Hay que bajar el spreading factor", "Es insuficiente: hace falta reservar entre 10 y 20 dB para variabilidad ambiental"], a: 3, exp: "La propagación real varía con la lluvia, la vegetación y la posición del dispositivo. Sin margen de desvanecimiento, el enlace fallará de forma intermitente." },
    ],
  },
  {
    id: "ops2", dom: "ops", mins: 8,
    title: "Capacidad: por qué las redes se saturan",
    checks: [
      { q: "¿Por qué los nodos en SF12 penalizan tanto la capacidad de una celda?", opts: ["Porque usan más canales", "Porque obligan a cambiar de subbanda", "Porque exigen downlinks adicionales", "Porque ocupan el aire unas 24 veces más tiempo que los de SF7 para el mismo mensaje"], a: 3, exp: "Es el efecto del nodo lejano. Un porcentaje pequeño de dispositivos lentos puede consumir la mayor parte del tiempo de canal disponible." },
      { q: "Una celda está saturada. ¿Qué medida ataca la causa más directamente?", opts: ["Aumentar NbTrans para compensar pérdidas", "Revisar el ADR y reducir las tramas confirmadas", "Pasar todos los nodos a SF12 por seguridad", "Activar la clase C"], a: 1, exp: "Subir NbTrans o el spreading factor agrava la congestión. El ADR y la eliminación de confirmaciones innecesarias liberan tiempo de canal." },
      { q: "El acceso al medio en LoRaWAN se describe como:", opts: ["TDMA coordinado por el gateway", "ALOHA: transmisión aleatoria sin escuchar el canal", "CSMA con detección de portadora", "Token ring"], a: 1, exp: "Es lo que permite que el nodo duerma casi todo el tiempo, y también lo que hace que la probabilidad de colisión crezca cuadráticamente con la carga." },
    ],
  },
  {
    id: "ops3", dom: "ops", mins: 8,
    title: "Ciclo de vida: energía, FUOTA y certificación",
    checks: [
      { q: "¿Qué componente domina el consumo de un sensor LoRaWAN bien diseñado?", opts: ["El microcontrolador en reposo", "La memoria no volátil", "La lectura del sensor", "El tiempo de radio activa, sobre todo la emisión"], a: 3, exp: "Por eso reducir el tiempo en aire mediante ADR y payloads compactos es la medida de mayor impacto sobre la vida de batería." },
      { q: "Durante una campaña FUOTA, la redundancia del transporte fragmentado sirve para:", opts: ["Cifrar el firmware", "Acelerar la descarga", "Permitir reconstruir el fichero aunque se pierdan fragmentos", "Verificar la firma del fabricante"], a: 2, exp: "Sin redundancia, un único fragmento perdido obligaría a repetir la campaña completa, algo inviable con miles de dispositivos." },
      { q: "Un dispositivo con LoRaWAN Certified:", opts: ["Puede venderse en cualquier país sin más trámites", "Tiene garantizada una cobertura mínima", "Ha demostrado cumplir el protocolo y los parámetros regionales, pero necesita además certificación regulatoria", "Está exento del marcado CE"], a: 2, exp: "Son dos procesos independientes: uno acredita interoperabilidad y el otro legalidad de emisión bajo RED o FCC." },
    ],
  },
];

/* Índice auxiliar: lecciones agrupadas por dominio, en orden. */
export const LESSONS_BY_DOM = (dom) => LESSONS.filter((l) => l.dom === dom);

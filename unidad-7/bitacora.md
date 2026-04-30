# Unidad 7

## Bitácora de proceso de aprendizaje


## Bitácora de aplicación 

### Actividad 05  

**Palabra elegida**
#### ERROR

---

**Justificación conceptual**
La palabra “ERROR” se selecciona por su fuerte carga semántica en entornos digitales. Representa una falla del sistema, una interrupción inesperada o un colapso en procesos que deberían funcionar correctamente.

La intención es traducir ese concepto en una experiencia audiovisual donde el sistema aparenta estabilidad, pero puede colapsar en cualquier momento debido a estímulos externos (audio).

---

**Análisis del significado visual y comportamental**

#### Visual:
- Asociado a pantallas, código, fallos digitales  
- Colores: rojo (alerta), blanco (información), negro (sistema)  
- Distorsión gráfica → glitch, fragmentación  

#### Comportamental:
- Un error no es estático → es inestable  
- Puede aparecer repentinamente  
- Genera caos, pérdida de control  
- Rompe estructuras existentes  

Traducción: la palabra debe pasar de orden → desorden

---

**Moodboard / Referencias**
- Glitch digital  
- Pantallas de error  
- RGB split  
- Interfaces rotas  
- Estética cyberpunk  

---

**Bocetos**
- Boceto 1: palabra fija con leve vibración  
- Boceto 2: letras que se separan progresivamente  
- Boceto 3 (final): letras ancladas que colapsan con el sonido  

Idea final: sistema estable que se rompe

---

**Mapa de decisiones**

| Elemento      | Decisión        | Justificación                         |
|--------------|----------------|--------------------------------------|
| Palabra      | ERROR          | Alta carga semántica digital         |
| Tipografía   | Courier New    | Asociada a código                    |
| Física       | Matter.js      | Permite simular colapso              |
| Audio        | Micrófono      | Entrada externa impredecible         |
| Color        | Rojo/blanco/negro | Error + sistema                  |
| Interacción  | Mouse + sonido | Participación activa                 |

---

**Mapa de interpretación**

| Elemento visual        | Significado              |
|----------------------|--------------------------|
| Letras alineadas      | Sistema estable          |
| Anclas               | Control estructural      |
| Ruido (audio)        | Interferencia externa    |
| Glitch               | Falla del sistema        |
| Movimiento caótico   | Pérdida de control       |
| RGB split            | Error visual digital     |

---

**Relación entre audio y comportamiento**

El audio funciona como detonante del sistema:

- Se captura volumen en tiempo real  
- Se define un umbral (0.05)  

**Si el audio es bajo:**
- Sistema estable  
- Letras alineadas  
- Sin movimiento  

**Si el audio supera el umbral:**
- Se activa el glitch  
- Gravedad aleatoria  
- Letras se dispersan  
- Se reproduce sonido glitch  
- Distorsión visual  

El sonido representa el “ruido” que rompe el sistema

---

**Evidencia del uso de IA**

- Uso de IA (ChatGPT) para:
  - Estructuración conceptual  
  - Definición de comportamientos semánticos  
  - Apoyo en documentación (bitácora)  
- El código fue desarrollado y adaptado manualmente
- Utilicé IA (Gemini) como "pair programmer" para traducir la idea conceptual de un "collar elástico" a las lógicas matemáticas de Matter.js.

---

**Código fuente**

``` js
// Módulos de Matter.js
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

let engine;
let world;
let letras = [];
let anclas = [];
let mConstraint;

let mic;
let audioIniciado = false;
let sonidoGlitch;
let fullScreenBool = false;

const palabra = "ERROR";

function preload() {
  sonidoGlitch = loadSound("efecto_glitch.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Configuración de audio
  mic = new p5.AudioIn();
  
  // Configuración de Matter.js
  engine = Engine.create();
  world = engine.world;
  // Gravedad intermitente (se controlará en el draw)
  engine.world.gravity.y = 1; 

  // 3. Interacción con el mouse
  let canvasmouse = Mouse.create(canvas.elt);
  canvasmouse.pixelRatio = pixelDensity();
  mConstraint = MouseConstraint.create(engine, {
    mouse: canvasmouse,
    constraint: { stiffness: 0.2, render: { visible: false } }
  });
  World.add(world, mConstraint);
}

function draw() {
  // Fondo oscuro con leve rastro para el efecto de "pantalla rota"
  background(10, 200); 
  Engine.update(engine);

  let vol = 0;
  if (audioIniciado) {
    vol = mic.getLevel();
  }

  // UMBRAL DEL ERROR: Si el ruido pasa de 0.05, el sistema colapsa (glitch)
  let hayGlitch = vol > 0.05;

  if (hayGlitch) {
    // --- NUEVO: REPRODUCIR SONIDO ---
    // Si hay un glitch y el sonido NO se está reproduciendo ya, dispáralo
    if (!sonidoGlitch.isPlaying()) {
      // Le bajamos un poco el volumen (0.0 a 1.0)
      sonidoGlitch.setVolume(0.5); 
      sonidoGlitch.play();
    }
    
    // La gravedad se vuelve loca
    engine.world.gravity.y = random(-2, 2);
    engine.world.gravity.x = random(-1, 1);
    
    // Efecto visual de fondo (parpadeo)
    if (random() > 0.8) background(200, 0, 0, 50);
  } else {
    // Si hay silencio, el sistema intenta repararse
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
  }

  textAlign(CENTER, CENTER);
  textSize(100);
  textFont('Courier New'); // Tipografía de código/sistema
  textStyle(BOLD);
  noStroke();

  for (let i = 0; i < letras.length; i++) {
    let l = letras[i];
    let pos = l.body.position;
    let angle = l.body.angle;

    // COMPORTAMIENTO FÍSICO SEMÁNTICO:
    if (hayGlitch) {
      // 1. Las anclas se rompen (stiffness 0) para que las letras salgan volando
      anclas[i].stiffness = 0.001;
      
      // 2. Fuerzas caóticas instantáneas (stuttering físico)
      if (random() > 0.5) {
        Matter.Body.setVelocity(l.body, { 
          x: random(-15, 15) * vol * 10, 
          y: random(-15, 15) * vol * 10 
        });
        // Saltos abruptos de rotación (antinatural)
        Matter.Body.setAngle(l.body, angle + random(-1, 1));
      }
    } else {
      // El sistema intenta recuperarse, las anclas vuelven a tener fuerza
      anclas[i].stiffness = 0.1;
    }

    push();
    translate(pos.x, pos.y);
    rotate(angle);

    // COMPORTAMIENTO VISUAL SEMÁNTICO (RGB Split / Aberración cromática)
    if (hayGlitch) {
      let offset = random(5, 20) * (vol * 10);
      
      // Canal Rojo desviado
      fill(255, 0, 0, 200);
      text(l.char, -offset, -offset);
      
      // Canal Cian desviado
      fill(0, 255, 255, 200);
      text(l.char, offset, offset);
      
      // Fragmentación (dibuja la letra deformada por un instante)
      if (random() > 0.8) scale(random(0.5, 1.5), random(0.5, 1.5));
    }

    // Letra principal (Blanco)
    fill(255);
    text(l.char, 0, 0);
    pop();
  }
}

function mousePressed() {
  if (!audioIniciado && fullScreenBool) {
    userStartAudio();
    mic.start();
    audioIniciado = true;
  }
}

function keyPressed() {
  if (key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs); 
    clear();
    background(10, 200); 
    let letras = [];
    let anclas = [];
    fullScreenBool = true
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
    let startX = width / 2 - (palabra.length * 80) / 2 + 40;
    let posY = height / 2;

    // 1. Crear las letras como cuerpos físicos
    for (let i = 0; i < palabra.length; i++) {
      let char = palabra.charAt(i);
      let body = Bodies.rectangle(startX + i * 100, posY, 70, 90, {
        restitution: 0.2, // Poca elasticidad, más "seco"
        friction: 0.5,
        density: 0.05
      });

      letras.push({
        body: body,
        char: char,
        origenX: startX + i * 100,
        origenY: posY
      });
      World.add(world, body);

      // 2. Crear "anclas" invisibles. 
      // Esto obliga al sistema a intentar mantener la palabra legible.
      let ancla = Constraint.create({
        pointA: { x: startX + i * 100, y: posY },
        bodyB: body,
        stiffness: 0.1, // Fuerza con la que intenta volver a su sitio
        damping: 0.1
      });
      anclas.push(ancla);
      World.add(world, ancla);
    }
}
```

**Enlace al sketch**

- [Código](https://editor.p5js.org/supervejito80/sketches/czsVBIXo3)
- [FullScreen](https://editor.p5js.org/supervejito80/full/czsVBIXo3)

## Bitácora de reflexión

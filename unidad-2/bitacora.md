# Unidad 2

## Bitácora de proceso de aprendizaje

### Actividad 1
### Actividad 2
### Actividad 3
**¿Qué tuviste que hacer para hacer la conversión propuesta?**
**Código**
``` js
let position;

function setup() {
    createCanvas(400, 400);
    position = createVector(6,9);
    console.log(position.toString());
    playingVector(position);
    console.log(position.toString());
    noLoop();
}

function playingVector(v){
    v.x = 20;
    v.y = 30;
}

function draw() {
    background(220);
    console.log("Only once");
}
```
### Actividad 4
**¿Qué resultado esperas obtener en el programa anterior?**
Esperaba que en cosola se viera como se cambian las coordenadas del vector de 6, 9 a 20, 30
**¿Qué resultado obtuviste?**
Lo que esperaba obtener que se accedia al vector por su referencia y se le cambianban sus valores
**¿Qué tipo de paso se está realizando en el código?**
Es paso por referencia
**¿Qué aprendiste?**
Nada
### Actividad 5
**¿Para qué sirve el método mag()? Nota que hay otro método llamado magSq(). ¿Cuál es la diferencia entre ambos? ¿Cuál es más eficiente?**
`mag()` es para encontrar la magnitud del vector (o sea cuanto mide). `magSq()` calcula la misma magnitud pero sin calcular la raiz cuadrada y eso sirve para...
**¿Para qué sirve el método normalize()?**
Creo que es para encontrar la direccion del vector haciendo su magnitud 1 o no se
**Te encuentras con un periodista en la calle y te pregunta ¿Para qué sirve el método dot()? ¿Qué le responderías en un frase?**
Proyectar un vector sobre otro? 🤨
**El método dot() tiene una versión estática y una de instancia. ¿Cuál es la diferencia entre ambas?**
**Ahora el mismo periodista curioso de antes te pregunta si le puedes dar una intuición geométrica acerca del producto cruz. Entonces te pregunta ¿Cuál es la interpretación geométrica del producto cruz de dos vectores? Tu respuesta debe incluir qué pasa con la orientación y la magnitud del vector resultante.**


## Bitácora de aplicación 



## Bitácora de reflexión

import './style.css'

import * as THREE from 'three'

import { createScene } from './scene'
import { initPhysics, getWorld } from './physics'
import { createBall, createMachine, physicsObjects } from './machine'

function setKinematic(actor, position, quaternion) {
  actor.rigidBody.setNextKinematicTranslation({
    x: position.x,
    y: position.y,
    z: position.z
  })

  if (quaternion) {
    actor.rigidBody.setNextKinematicRotation({
      x: quaternion.x,
      y: quaternion.y,
      z: quaternion.z,
      w: quaternion.w
    })
  }
}

function getBodyPosition(actor) {
  const position = actor.rigidBody.translation()
  return new THREE.Vector3(position.x, position.y, position.z)
}

function getBodyQuaternion(actor) {
  const rotation = actor.rigidBody.rotation()
  return new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
}

function applyImpulse(actor, impulse) {
  actor.rigidBody.applyImpulse(
    {
      x: impulse.x,
      y: impulse.y,
      z: impulse.z
    },
    true
  )
}

function isDominoFallen(actor) {
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(getBodyQuaternion(actor))
  return up.y < 0.52
}

async function init() {
  const { scene, camera, renderer, controls, composer } = createScene()

  await initPhysics()
  const world = getWorld()
  const { actors, signals } = createMachine(scene, world)

  const uiDiv = document.createElement('div')
  uiDiv.id = 'ui'
  document.body.appendChild(uiDiv)

  const stages = [
    { id: 'start', label: 'La canica principal baja por las rampas', done: false },
    { id: 'dominoes', label: 'Golpea los dominoes en cadena', done: false },
    { id: 'relay', label: 'La ultima ficha abre la compuerta naranja', done: false },
    { id: 'seesaw', label: 'La canica azul activa el balancin', done: false },
    { id: 'final', label: 'La canica amarilla despierta el martillo', done: false },
    { id: 'bell', label: 'El golpe final enciende la campana', done: false }
  ]

  const state = {
    started: false,
    relayReleased: false,
    seesawTriggered: false,
    finalReleased: false,
    hammerTriggered: false,
    bellTriggered: false,
    relayTime: 0,
    seesawTime: 0,
    finalTime: 0,
    hammerTime: 0,
    bellTime: 0
  }

  function markStage(id) {
    const stage = stages.find((item) => item.id === id)
    if (stage) stage.done = true
  }

  function updateUI() {
    const completed = stages.filter((stage) => stage.done).length
    uiDiv.innerHTML = `
      <div class="ui-panel">
        <div class="ui-title">Maquina Rube Goldberg</div>
        <div class="ui-actions">
          <button id="startButton">${state.started ? 'Reiniciar con R' : 'Iniciar'}</button>
          <button id="dropButton">Canica extra</button>
        </div>
        <div class="progress">
          <span style="width: ${(completed / stages.length) * 100}%"></span>
        </div>
        <ol class="stage-list">
          ${stages
            .map(
              (stage) => `
                <li class="${stage.done ? 'done' : ''}">
                  <span></span>
                  <p>${stage.label}</p>
                </li>
              `
            )
            .join('')}
        </ol>
        <div class="hint">Espacio: iniciar | Click: canica extra | R: reiniciar | Arrastra: camara</div>
      </div>
    `

    document.getElementById('startButton')?.addEventListener('click', startMachine)
    document.getElementById('dropButton')?.addEventListener('click', dropExtraBall)
  }

  function startMachine() {
    if (state.started) return

    state.started = true
    markStage('start')
    signals[0]?.activate()
    setKinematic(actors.startGate, new THREE.Vector3(-18.9, 6.95, 0))
    applyImpulse(actors.mainBall, new THREE.Vector3(2.4, 0, 0))
    updateUI()
  }

  function dropExtraBall() {
    createBall(
      scene,
      world,
      new THREE.Vector3(-17.6 + Math.random() * 2, 11.5, -0.35 + Math.random() * 0.7),
      {
        name: 'extra-ball',
        radius: 0.34,
        color: 0x93c5fd,
        velocity: new THREE.Vector3(1.8, 0, 0)
      }
    )
  }

  function releaseRelay() {
    if (state.relayReleased) return

    state.relayReleased = true
    state.relayTime = 0
    markStage('dominoes')
    markStage('relay')
    signals[1]?.activate()
    setKinematic(actors.relayGate, new THREE.Vector3(9.35, 6.9, -3.1))
    applyImpulse(actors.relayBall, new THREE.Vector3(2.0, 0, 0))
    updateUI()
  }

  function triggerSeesaw() {
    if (state.seesawTriggered) return

    state.seesawTriggered = true
    state.seesawTime = 0
    markStage('seesaw')
    applyImpulse(actors.switchBlock, new THREE.Vector3(2.8, 0.5, 0))
    updateUI()
  }

  function releaseFinalBall() {
    if (state.finalReleased) return

    state.finalReleased = true
    state.finalTime = 0
    markStage('final')
    setKinematic(actors.finalGate, new THREE.Vector3(13.4, 7.7, 3.95))
    applyImpulse(actors.finalBall, new THREE.Vector3(2.1, 0, 0))
    updateUI()
  }

  function triggerHammer() {
    if (state.hammerTriggered) return

    state.hammerTriggered = true
    state.hammerTime = 0
    signals[2]?.activate()
    updateUI()
  }

  function triggerBell() {
    if (state.bellTriggered) return

    state.bellTriggered = true
    state.bellTime = 0
    markStage('bell')
    signals[2]?.activate()
    updateUI()
  }

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault()
      startMachine()
    }

    if (event.key.toLowerCase() === 'r') {
      window.location.reload()
    }
  })

  window.addEventListener('click', (event) => {
    if (event.target === renderer.domElement || event.target === document.body) {
      dropExtraBall()
    }
  })

  let previousTime = performance.now()
  let uiFrame = 0

  updateUI()

  function updateStages(delta) {
    if (!state.started) return

    const mainPosition = getBodyPosition(actors.mainBall)
    const relayPosition = getBodyPosition(actors.relayBall)
    const finalPosition = getBodyPosition(actors.finalBall)
    const goalPosition = getBodyPosition(actors.goalBall)
    const lastDomino = actors.dominoes[actors.dominoes.length - 1]

    if (!state.relayReleased) {
      const dominoesFallen = actors.dominoes.filter(isDominoFallen).length
      if (dominoesFallen > 9 || isDominoFallen(lastDomino) || mainPosition.x > 8.4) {
        releaseRelay()
      }
    }

    if (state.relayReleased) {
      state.relayTime += delta
      if (!state.seesawTriggered && (relayPosition.x > 15.2 || state.relayTime > 4.2)) {
        triggerSeesaw()
      }
    }

    if (state.seesawTriggered) {
      state.seesawTime += delta
      const phase = Math.min(state.seesawTime / 1.25, 1)
      const angle = THREE.MathUtils.lerp(0.16, -0.46, Math.sin(phase * Math.PI * 0.5))
      const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, angle))
      setKinematic(actors.seesaw, new THREE.Vector3(16.7, 1.38, 1.05), quaternion)

      if (!state.finalReleased && state.seesawTime > 0.55) {
        releaseFinalBall()
      }
    }

    if (state.finalReleased) {
      state.finalTime += delta
      if (!state.hammerTriggered && (finalPosition.x > 18.4 || state.finalTime > 3.25)) {
        triggerHammer()
      }
    }

    if (state.hammerTriggered) {
      state.hammerTime += delta
      const swing = Math.min(state.hammerTime / 0.8, 1)
      const angle = THREE.MathUtils.lerp(0.65, -0.82, Math.sin(swing * Math.PI * 0.5))
      const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, angle))
      setKinematic(actors.hammer, new THREE.Vector3(8.7, 1.55, 5.9), quaternion)

      if (state.hammerTime > 0.38 && state.hammerTime < 0.48) {
        applyImpulse(actors.goalBall, new THREE.Vector3(-5.6, 0.8, 0))
      }

      if (!state.bellTriggered && (goalPosition.x < 0.8 || state.hammerTime > 2.2)) {
        triggerBell()
      }
    }

    if (state.bellTriggered) {
      state.bellTime += delta
      if (state.bellTime < 3) {
        actors.bell.ring(state.bellTime)
      } else {
        actors.bell.rest()
      }
    }
  }

  function syncPhysicsObjects() {
    for (let i = physicsObjects.length - 1; i >= 0; i--) {
      const object = physicsObjects[i]
      const position = object.rigidBody.translation()
      const rotation = object.rigidBody.rotation()

      object.mesh.position.set(position.x, position.y, position.z)
      object.mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)

      if (position.y < -18) {
        scene.remove(object.mesh)
        physicsObjects.splice(i, 1)
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate)

    const currentTime = performance.now()
    const delta = Math.min((currentTime - previousTime) / 1000, 1 / 30)
    previousTime = currentTime
    world.timestep = delta
    updateStages(delta)
    world.step()
    syncPhysicsObjects()

    controls.update()

    uiFrame++
    if (uiFrame % 40 === 0) updateUI()

    composer.render()
  }

  animate()
}

init()

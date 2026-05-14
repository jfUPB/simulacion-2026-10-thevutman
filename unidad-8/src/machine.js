import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'

export const physicsObjects = []
export const staticObjects = []

const materials = new Map()

function getMaterial(color, options = {}) {
  const key = `${color}-${options.metalness ?? 0.35}-${options.roughness ?? 0.45}-${options.transparent ?? false}`

  if (!materials.has(key)) {
    materials.set(
      key,
      new THREE.MeshStandardMaterial({
        color,
        metalness: options.metalness ?? 0.35,
        roughness: options.roughness ?? 0.45,
        transparent: options.transparent ?? false,
        opacity: options.opacity ?? 1
      })
    )
  }

  return materials.get(key)
}

function toQuaternion(rotation = {}) {
  return new THREE.Quaternion().setFromEuler(
    new THREE.Euler(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0)
  )
}

function applyTransform(mesh, position, rotation = {}) {
  mesh.position.copy(position)
  mesh.quaternion.copy(toQuaternion(rotation))
}

function createBody(world, type, position, rotation = {}, options = {}) {
  const quaternion = toQuaternion(rotation)
  let desc

  if (type === 'dynamic') {
    desc = RAPIER.RigidBodyDesc.dynamic()
  } else if (type === 'kinematic') {
    desc = RAPIER.RigidBodyDesc.kinematicPositionBased()
  } else {
    desc = RAPIER.RigidBodyDesc.fixed()
  }

  desc
    .setTranslation(position.x, position.y, position.z)
    .setRotation({
      x: quaternion.x,
      y: quaternion.y,
      z: quaternion.z,
      w: quaternion.w
    })

  if (options.linearDamping !== undefined) desc.setLinearDamping(options.linearDamping)
  if (options.angularDamping !== undefined) desc.setAngularDamping(options.angularDamping)
  if (options.gravityScale !== undefined) desc.setGravityScale(options.gravityScale)

  return world.createRigidBody(desc)
}

function registerPhysics(mesh, rigidBody, meta = {}) {
  physicsObjects.push({
    mesh,
    rigidBody,
    ...meta
  })
}

function registerStatic(mesh, rigidBody, meta = {}) {
  staticObjects.push({
    mesh,
    rigidBody,
    ...meta
  })
}

export function createStaticBox(scene, world, options) {
  const {
    name,
    position,
    size,
    rotation,
    color = 0x334155,
    friction = 0.8,
    restitution = 0.15,
    materialOptions = {}
  } = options

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size.x, size.y, size.z),
    getMaterial(color, materialOptions)
  )

  mesh.castShadow = true
  mesh.receiveShadow = true
  applyTransform(mesh, position, rotation)
  scene.add(mesh)

  const rigidBody = createBody(world, 'fixed', position, rotation)
  const collider = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2)
    .setFriction(friction)
    .setRestitution(restitution)

  world.createCollider(collider, rigidBody)
  registerStatic(mesh, rigidBody, { name, type: 'static-box' })

  return { mesh, rigidBody }
}

export function createKinematicBox(scene, world, options) {
  const {
    name,
    position,
    size,
    rotation,
    color = 0xf97316,
    friction = 0.9,
    restitution = 0.1
  } = options

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size.x, size.y, size.z),
    getMaterial(color, { metalness: 0.45, roughness: 0.28 })
  )

  mesh.castShadow = true
  mesh.receiveShadow = true
  applyTransform(mesh, position, rotation)
  scene.add(mesh)

  const rigidBody = createBody(world, 'kinematic', position, rotation)
  const collider = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2)
    .setFriction(friction)
    .setRestitution(restitution)

  world.createCollider(collider, rigidBody)
  registerPhysics(mesh, rigidBody, {
    name,
    type: 'kinematic-box',
    targetPosition: position.clone(),
    targetRotation: toQuaternion(rotation)
  })

  return { mesh, rigidBody }
}

export function createDynamicBox(scene, world, options) {
  const {
    name,
    position,
    size,
    rotation,
    color = 0x22c55e,
    friction = 0.75,
    restitution = 0.25,
    linearDamping = 0.15,
    angularDamping = 0.12
  } = options

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size.x, size.y, size.z),
    getMaterial(color, { metalness: 0.35, roughness: 0.4 })
  )

  mesh.castShadow = true
  mesh.receiveShadow = true
  applyTransform(mesh, position, rotation)
  scene.add(mesh)

  const rigidBody = createBody(world, 'dynamic', position, rotation, {
    linearDamping,
    angularDamping
  })

  const collider = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2)
    .setFriction(friction)
    .setRestitution(restitution)

  world.createCollider(collider, rigidBody)
  registerPhysics(mesh, rigidBody, { name, type: 'dynamic-box' })

  return { mesh, rigidBody }
}

export function createBall(scene, world, position, options = {}) {
  const {
    name,
    radius = 0.45,
    color = 0xf8fafc,
    velocity,
    friction = 0.35,
    restitution = 0.45,
    linearDamping = 0.04,
    angularDamping = 0.03
  } = options

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 40, 32),
    getMaterial(color, { metalness: 0.8, roughness: 0.12 })
  )

  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  const rigidBody = createBody(world, 'dynamic', position, {}, {
    linearDamping,
    angularDamping
  })

  if (velocity) {
    rigidBody.setLinvel({ x: velocity.x, y: velocity.y, z: velocity.z }, true)
  }

  const collider = RAPIER.ColliderDesc.ball(radius)
    .setFriction(friction)
    .setRestitution(restitution)

  world.createCollider(collider, rigidBody)
  registerPhysics(mesh, rigidBody, { name, type: 'ball', radius })

  return { mesh, rigidBody }
}

export function createCylinder(scene, world, options) {
  const {
    name,
    position,
    radius = 0.45,
    height = 1.2,
    rotation,
    color = 0xfacc15,
    dynamic = true,
    friction = 0.65,
    restitution = 0.35
  } = options

  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 32),
    getMaterial(color, { metalness: 0.45, roughness: 0.35 })
  )

  mesh.castShadow = true
  mesh.receiveShadow = true
  applyTransform(mesh, position, rotation)
  scene.add(mesh)

  const rigidBody = createBody(world, dynamic ? 'dynamic' : 'fixed', position, rotation, {
    linearDamping: dynamic ? 0.2 : undefined,
    angularDamping: dynamic ? 0.18 : undefined
  })

  const collider = RAPIER.ColliderDesc.cylinder(height / 2, radius)
    .setFriction(friction)
    .setRestitution(restitution)

  world.createCollider(collider, rigidBody)

  if (dynamic) {
    registerPhysics(mesh, rigidBody, { name, type: 'cylinder' })
  } else {
    registerStatic(mesh, rigidBody, { name, type: 'static-cylinder' })
  }

  return { mesh, rigidBody }
}

export function createRamp(scene, world, options) {
  const {
    name,
    position,
    length,
    width,
    angle,
    yaw = 0,
    color = 0x475569,
    railColor = 0x94a3b8
  } = options

  const rotation = { y: yaw, z: angle }
  const base = createStaticBox(scene, world, {
    name,
    position,
    size: new THREE.Vector3(length, 0.32, width),
    rotation,
    color,
    friction: 0.45
  })

  const quaternion = toQuaternion(rotation)
  const railY = new THREE.Vector3(0, 0.42, 0).applyQuaternion(quaternion)
  const left = new THREE.Vector3(0, 0, width / 2 + 0.08).applyQuaternion(quaternion)
  const right = new THREE.Vector3(0, 0, -width / 2 - 0.08).applyQuaternion(quaternion)

  createStaticBox(scene, world, {
    name: `${name}-left-rail`,
    position: position.clone().add(left).add(railY),
    size: new THREE.Vector3(length, 0.42, 0.12),
    rotation,
    color: railColor,
    friction: 0.65
  })

  createStaticBox(scene, world, {
    name: `${name}-right-rail`,
    position: position.clone().add(right).add(railY),
    size: new THREE.Vector3(length, 0.42, 0.12),
    rotation,
    color: railColor,
    friction: 0.65
  })

  return base
}

export function createFloor(scene, world) {
  createStaticBox(scene, world, {
    name: 'floor',
    position: new THREE.Vector3(0, -0.35, 0),
    size: new THREE.Vector3(44, 0.7, 24),
    color: 0x141821,
    friction: 0.9,
    materialOptions: { metalness: 0.2, roughness: 0.75 }
  })

  const grid = new THREE.GridHelper(44, 44, 0x334155, 0x1f2937)
  grid.position.y = 0.02
  scene.add(grid)
}

export function createDomino(scene, world, position, color = 0xef4444) {
  return createDynamicBox(scene, world, {
    name: 'domino',
    position,
    size: new THREE.Vector3(0.22, 1.7, 0.82),
    color,
    friction: 0.86,
    restitution: 0.18,
    linearDamping: 0.06,
    angularDamping: 0.05
  })
}

export function createSignalLight(scene, position, color = 0x22c55e) {
  const group = new THREE.Group()

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 1.1, 14),
    getMaterial(0x64748b, { metalness: 0.5, roughness: 0.35 })
  )
  base.position.y = 0.55
  group.add(base)

  const bulbMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    emissive: 0x000000,
    metalness: 0.2,
    roughness: 0.2
  })

  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.23, 24, 18), bulbMaterial)
  bulb.position.y = 1.22
  group.add(bulb)

  const light = new THREE.PointLight(color, 0, 5)
  light.position.y = 1.22
  group.add(light)

  group.position.copy(position)
  scene.add(group)

  return {
    group,
    activate() {
      bulbMaterial.color.setHex(color)
      bulbMaterial.emissive.setHex(color)
      bulbMaterial.emissiveIntensity = 1.8
      light.intensity = 4
    }
  }
}

export function createTargetBell(scene, position) {
  const group = new THREE.Group()

  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 2.6, 0.22),
    getMaterial(0x475569, { metalness: 0.4, roughness: 0.4 })
  )
  stand.position.set(0, 1.3, 0)
  group.add(stand)

  const bell = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.13, 18, 48),
    getMaterial(0xfacc15, { metalness: 0.85, roughness: 0.18 })
  )
  bell.position.set(0, 2.55, 0)
  bell.rotation.x = Math.PI / 2
  group.add(bell)

  const clapper = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 24, 18),
    getMaterial(0xfffbeb, { metalness: 0.75, roughness: 0.18 })
  )
  clapper.position.set(0, 2.55, 0)
  group.add(clapper)

  group.position.copy(position)
  scene.add(group)

  return {
    group,
    ring(time) {
      const shake = Math.sin(time * 28) * 0.16
      bell.rotation.z = shake
      clapper.position.x = Math.sin(time * 34) * 0.22
    },
    rest() {
      bell.rotation.z = 0
      clapper.position.x = 0
    }
  }
}

export function createMachine(scene, world) {
  const actors = {}
  const signals = []

  createFloor(scene, world)

  createStaticBox(scene, world, {
    name: 'back-wall',
    position: new THREE.Vector3(0, 3.2, -8.2),
    size: new THREE.Vector3(42, 6.4, 0.32),
    color: 0x0f172a,
    friction: 0.7,
    materialOptions: { metalness: 0.2, roughness: 0.85 }
  })

  createRamp(scene, world, {
    name: 'initial-high-ramp',
    position: new THREE.Vector3(-15, 7.6, 0),
    length: 9.5,
    width: 1.35,
    angle: -0.32,
    color: 0x2563eb,
    railColor: 0x93c5fd
  })

  createRamp(scene, world, {
    name: 'initial-low-ramp',
    position: new THREE.Vector3(-7.2, 4.5, 0),
    length: 7.6,
    width: 1.35,
    angle: -0.37,
    color: 0x1d4ed8,
    railColor: 0xbfdbfe
  })

  createRamp(scene, world, {
    name: 'domino-delivery-ramp',
    position: new THREE.Vector3(-1.7, 1.65, 0),
    length: 4.4,
    width: 1.18,
    angle: -0.18,
    color: 0x0f766e,
    railColor: 0x5eead4
  })

  actors.mainBall = createBall(scene, world, new THREE.Vector3(-18.4, 10.2, 0), {
    name: 'main-ball',
    color: 0xffffff,
    velocity: new THREE.Vector3(2.2, 0, 0)
  })

  actors.startGate = createKinematicBox(scene, world, {
    name: 'start-gate',
    position: new THREE.Vector3(-18.9, 9.25, 0),
    size: new THREE.Vector3(0.18, 1.7, 1.55),
    color: 0xef4444
  })

  const dominoColors = [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x38bdf8, 0xa78bfa]
  actors.dominoes = []
  for (let i = 0; i < 15; i++) {
    actors.dominoes.push(
      createDomino(
        scene,
        world,
        new THREE.Vector3(0.65 + i * 0.56, 0.86, 0),
        dominoColors[i % dominoColors.length]
      )
    )
  }

  createStaticBox(scene, world, {
    name: 'domino-stop-left',
    position: new THREE.Vector3(4.6, 0.45, 0.78),
    size: new THREE.Vector3(8.8, 0.28, 0.18),
    color: 0x334155
  })

  createStaticBox(scene, world, {
    name: 'domino-stop-right',
    position: new THREE.Vector3(4.6, 0.45, -0.78),
    size: new THREE.Vector3(8.8, 0.28, 0.18),
    color: 0x334155
  })

  signals.push(createSignalLight(scene, new THREE.Vector3(-10.4, 0.05, -1.9), 0x60a5fa))

  actors.relayGate = createKinematicBox(scene, world, {
    name: 'relay-gate',
    position: new THREE.Vector3(9.35, 4.8, -3.1),
    size: new THREE.Vector3(0.22, 1.65, 1.45),
    color: 0xf97316
  })

  actors.relayBall = createBall(scene, world, new THREE.Vector3(8.55, 5.45, -3.1), {
    name: 'relay-ball',
    color: 0x38bdf8,
    radius: 0.43,
    velocity: new THREE.Vector3(0, 0, 0)
  })

  createRamp(scene, world, {
    name: 'relay-ramp',
    position: new THREE.Vector3(12.6, 4.12, -3.1),
    length: 7.8,
    width: 1.28,
    angle: -0.29,
    color: 0x7c3aed,
    railColor: 0xc4b5fd
  })

  actors.switchBlock = createDynamicBox(scene, world, {
    name: 'switch-block',
    position: new THREE.Vector3(16.55, 1.05, -3.1),
    size: new THREE.Vector3(0.58, 1.05, 1.05),
    color: 0xf59e0b,
    friction: 0.7,
    restitution: 0.2
  })

  signals.push(createSignalLight(scene, new THREE.Vector3(11.3, 0.05, -5.05), 0xc084fc))

  actors.seesaw = createKinematicBox(scene, world, {
    name: 'seesaw',
    position: new THREE.Vector3(16.7, 1.38, 1.05),
    size: new THREE.Vector3(6.2, 0.28, 1.15),
    rotation: { z: 0.16 },
    color: 0xfacc15
  })

  createStaticBox(scene, world, {
    name: 'seesaw-pivot',
    position: new THREE.Vector3(16.7, 0.72, 1.05),
    size: new THREE.Vector3(0.72, 0.95, 1.35),
    color: 0x475569
  })

  actors.finalGate = createKinematicBox(scene, world, {
    name: 'final-gate',
    position: new THREE.Vector3(13.4, 5.68, 3.95),
    size: new THREE.Vector3(0.22, 1.5, 1.36),
    color: 0x22c55e
  })

  actors.finalBall = createBall(scene, world, new THREE.Vector3(12.7, 6.15, 3.95), {
    name: 'final-ball',
    radius: 0.44,
    color: 0xfef08a,
    velocity: new THREE.Vector3(0, 0, 0)
  })

  createRamp(scene, world, {
    name: 'final-upper-ramp',
    position: new THREE.Vector3(16.4, 4.88, 3.95),
    length: 7.5,
    width: 1.3,
    angle: -0.28,
    color: 0x16a34a,
    railColor: 0x86efac
  })

  createRamp(scene, world, {
    name: 'final-return-ramp',
    position: new THREE.Vector3(13.2, 2.38, 5.9),
    length: 7,
    width: 1.25,
    angle: 0.28,
    yaw: Math.PI,
    color: 0x15803d,
    railColor: 0xbbf7d0
  })

  actors.hammer = createKinematicBox(scene, world, {
    name: 'hammer',
    position: new THREE.Vector3(8.7, 1.55, 5.9),
    size: new THREE.Vector3(2.75, 0.28, 0.42),
    rotation: { z: 0.65 },
    color: 0xf43f5e
  })

  createStaticBox(scene, world, {
    name: 'hammer-pivot',
    position: new THREE.Vector3(8.0, 1.07, 5.9),
    size: new THREE.Vector3(0.42, 0.42, 0.72),
    color: 0xe2e8f0
  })

  actors.goalBall = createBall(scene, world, new THREE.Vector3(6.55, 0.95, 5.9), {
    name: 'goal-ball',
    radius: 0.42,
    color: 0xfb7185,
    velocity: new THREE.Vector3(0, 0, 0)
  })

  createRamp(scene, world, {
    name: 'goal-ramp',
    position: new THREE.Vector3(3.0, 0.78, 5.9),
    length: 6,
    width: 1.24,
    angle: -0.05,
    yaw: Math.PI,
    color: 0xbe123c,
    railColor: 0xfda4af
  })

  actors.bell = createTargetBell(scene, new THREE.Vector3(-0.55, 0, 5.9))
  signals.push(createSignalLight(scene, new THREE.Vector3(5.8, 0.05, 7.6), 0xfb7185))

  createStaticBox(scene, world, {
    name: 'bell-hit-pad',
    position: new THREE.Vector3(0.25, 0.75, 5.9),
    size: new THREE.Vector3(0.18, 1.5, 1.25),
    color: 0xfacc15,
    friction: 0.3,
    restitution: 0.55
  })

  return {
    actors,
    signals
  }
}


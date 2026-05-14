import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x080b10)
  scene.fog = new THREE.Fog(0x080b10, 26, 58)

  const camera = new THREE.PerspectiveCamera(
    56,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  camera.position.set(9, 11, 19)

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15

  document.body.appendChild(renderer.domElement)

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.45,
    0.3,
    0.82
  )
  composer.addPass(bloomPass)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.target.set(3, 2.8, 0.6)
  controls.minDistance = 10
  controls.maxDistance = 42
  controls.maxPolarAngle = Math.PI * 0.48

  const ambientLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 1.2)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4)
  keyLight.position.set(-8, 16, 12)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.width = 2048
  keyLight.shadow.mapSize.height = 2048
  keyLight.shadow.camera.near = 1
  keyLight.shadow.camera.far = 55
  keyLight.shadow.camera.left = -24
  keyLight.shadow.camera.right = 24
  keyLight.shadow.camera.top = 18
  keyLight.shadow.camera.bottom = -16
  scene.add(keyLight)

  const coolLight = new THREE.PointLight(0x38bdf8, 65, 32)
  coolLight.position.set(-12, 8, 5)
  scene.add(coolLight)

  const warmLight = new THREE.PointLight(0xf97316, 48, 28)
  warmLight.position.set(17, 7, -5)
  scene.add(warmLight)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  })

  return {
    scene,
    camera,
    renderer,
    controls,
    composer
  }
}

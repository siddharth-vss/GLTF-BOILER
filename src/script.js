import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const canvas = document.querySelector('canvas.webgl')
import pos from './img/sp.jpg'
import starsTexture from './img/stars.jpg';
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(3);
// scene.add(axesHelper);
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

camera.position.z = 3
camera.position.y = 1
scene.add(camera)

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const directionalLight = new THREE.DirectionalLight();
scene.add(directionalLight);

// directionalLight.setPosition(0,0,0);
const planeGeomatry = new THREE.PlaneGeometry(5,5);
const planeMatirial = new THREE.MeshBasicMaterial({
    color:"#01BAEF",
    // map:texture.load( pos ),
    side : THREE.DoubleSide,
    // wireframe: true
});
const planeMatirial2 = new THREE.MeshBasicMaterial({
    color:"red",
    // map:texture.load( pos ),
    side : THREE.DoubleSide,
    // wireframe: true
});
const plane = new THREE.Mesh(planeGeomatry, planeMatirial);
const plane2 = new THREE.Mesh(planeGeomatry, planeMatirial2);
scene.add(plane);
scene.add(plane2);

plane.rotateX(-Math.PI / 2);
plane2.position.z = -2.5;
plane2.position.y = 2.5;

const spotLight = new THREE.SpotLight( 0xffffff )
spotLight.position.set(0,5,10)

const spLight = new THREE.SpotLight( 0xffffff )
spLight.position.set(2,5,-5)

const spLight2 = new THREE.SpotLight( 0xffffff )
spLight2.position.set(2,5,-5)



scene.add(spLight)
scene.add(spotLight)

gltfLoader.load(
    'spider/scene.gltf',
    (gltf) =>
    {
        console.log(gltf);
        const model = gltf.scene;
        model.position.y +=0.2;
        scene.add(model);
        
    }
)



const cursor ={x:0, y:0}
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -( event.clientY / sizes.width - 0.5)
})
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);


const renderer = new THREE.WebGLRenderer({
    // color:"#FFFFFF",
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

const controls = new OrbitControls(camera, canvas)



window.addEventListener('dblclick',() =>
{
    if(!document.fullscreenElement)
    {
        canvas.requestFullscreen()
    }
    else
    {
        document.exitFullscreen()
    }
})


window.addEventListener('resize', () => 
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()    

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})
const animate = () =>
{

    renderer.render(scene, camera)
    controls.update()

    window.requestAnimationFrame(animate)
}

animate()
import style from './Shelf.module.scss';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { DirectionalLightHelper } from 'three';
import { throttle } from 'lodash';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';

export default function Shelf({scrollContainer}) {
  
  const canvasContainer = useRef();
  const canvas = useRef();

  useEffect(()=>{
    threeCode(canvasContainer.current,canvas.current,scrollContainer.current);

  },[]);

  return (
    <section className={style.shelf_container} ref={canvasContainer}>
      <canvas ref={canvas}>

      </canvas>
    </section>
  )
}


function threeCode(container,canvas,scrollContainer) {

  /**
   * Scence setup
   */
  let sizes = {
    width:container.getBoundingClientRect().width,
    height:container.getBoundingClientRect().height,
  }

  const {width,height} = sizes;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera( 65, width / height, 0.1, 1000 );

  //renderer------
  const renderer = new THREE.WebGLRenderer({
    canvas:canvas,
    alpha:true,
    antialias:true
  });
  
  renderer.setSize(width,height);

  scene.add(new THREE.AxesHelper(1));
  renderer.render( scene, camera );
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.CineonToneMapping
  
  //camera
  camera.position.z = 16;
  camera.position.y = 1;
  // pour pouvoid 


  /**
   * Lights
   */
   const light = new THREE.AmbientLight( 'white',0.4); // soft white light
   scene.add( light );

   const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
   //scene.add(new THREE.DirectionalLightHelper(directionalLight,3));
   directionalLight.lookAt(new THREE.Vector3(0,0,0));
   directionalLight.position.y = 1;
   directionalLight.position.z = 3;
   directionalLight.position.x = 0;
   
   scene.add( directionalLight );

  //shelf
  let shelf = new THREE.Group();
  scene.add(shelf)


   // 3D models ----------------------

  const textureLoader = new THREE.TextureLoader();
  const book1Texture = textureLoader.load("/models/textures/cover1.png")
  const book2Texture = textureLoader.load("/models/textures/cover2.png")
  const book3Texture = textureLoader.load("/models/textures/cover3.png")
  const book4Texture = textureLoader.load("/models/textures/cover4.png")

  const textures = [book1Texture,book2Texture,book3Texture,book4Texture];

  // Instantiate a loader
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath( '/draco/' );
  loader.setDRACOLoader( dracoLoader );


  loader.load(
    '/models/book.glb',  
    (gltf)=>{
        
        gltf.scene.children[0].scale.set(7,7,7);
        gltf.scene.children[0].rotateY(-Math.PI/2);      

        const mesh = gltf.scene.children[0];
        const material = mesh.material;

        let BookY =0;        


        textures.forEach(texture=>{
          const newMaterial = material.clone();
          if (newMaterial.map) {
            newMaterial.map = newMaterial.map.clone();
            newMaterial.map.source = texture.source;
            newMaterial.needsUpdate = true;
          }
          const newMesh = mesh.clone();
          newMesh.material = newMaterial;
          newMesh.position.y = BookY;
          BookY-=0.7;
          shelf.add(newMesh);

        })
          
        });       


  //handle resize
  window.addEventListener('resize', () =>
  {
      // Update sizes
      sizes.width=container.getBoundingClientRect().width;
      sizes.height=container.getBoundingClientRect().height;
      const{width,height} = sizes;
      // Update camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();    

      // Update renderer
      renderer.setSize(width, height);
  })

  //const controls = new OrbitControls( camera, canvas);

  /**
   * Animation
   */
  function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    //controls.update();
  }
  animate();

}
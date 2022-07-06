import style from './Shelf.module.scss';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { DirectionalLightHelper } from 'three';
import { throttle } from 'lodash';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

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
  camera.position.y = 0;
  // pour pouvoid 


  /**
   * Lights
   */
   const light = new THREE.AmbientLight( 'white',0.5); // soft white light
   scene.add( light );

   const directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
   //scene.add(new THREE.DirectionalLightHelper(directionalLight,1));
   
   directionalLight.position.y = 0;
   directionalLight.position.z = 2;
   directionalLight.position.x = 0;
   
   scene.add( directionalLight );



  //meshes
  let bookGeomerty = new THREE.BoxGeometry(1.4,2.1,0.3);

  let color = ['#afc2e0','#282928','#041b40','#1f2226','#eb4034','#0b1f09','#0a1859','#c7c9d4','#546dde','#282533','#374033'];
  let BookY =0;

  //shelf
  let shelf = new THREE.Group();
  scene.add(shelf)


   // 3D models ----------------------

  // Instantiate a loader
  const loader = new GLTFLoader();

  loader.load(
    '/models/book-cover1.glb',
    (gltf)=>{
        gltf.scene.scale.set(7,7,7);
        gltf.scene.rotateY(-Math.PI/2);
        shelf.add(gltf.scene);
          
        });       

  // color.forEach(color=>{
  //   let book = new THREE.Mesh(
  //     bookGeomerty,
  //     new THREE.MeshStandardMaterial({color})
  //   )

  //   book.position.y = BookY;
  //   BookY-=0.6;
  //   book.rotateZ(Math.PI/2);
  //   book.rotateY(Math.PI/2);
  //   shelf.add(book);
  // })


  //handle scroll
  scrollContainer?.addEventListener('scroll',throttle(()=>{
    const{scrollTop} = scrollContainer;
    const {clientHeight} = document.documentElement;

    let wmin = window.innerWidth> clientHeight ? clientHeight : window.innerWidth;
    shelf.position.y = (scrollTop/wmin)*7;

  },10));

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
import { color } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
import { GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js'
import { GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass.js'
// threejs는 지오메트리 만들고 텍스쳐 만들면 끝이다 기억하자

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  //좀 더 이쁘게 만들어줌
  renderer.outputEncoding = THREE.sRGBEncoding

  const effectComposer = new EffectComposer(
    renderer
  )
  const textureLoader = new THREE.TextureLoader()
  //지구 밖 환경 만들어주는 변수
  const cubeTextureLoader = new THREE.CubeTextureLoader()
  const environmentMap = cubeTextureLoader.load([
    'assets/environments/px.png',
    'assets/environments/nx.png',
    'assets/environments/py.png',
    'assets/environments/ny.png',
    'assets/environments/pz.png',
    'assets/environments/nz.png',
  ])
  
  environmentMap.encoding = THREE.sRGBEncoding

  const container = document.querySelector('#container');

  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const scene = new THREE.Scene();
  //환경 설정임
  scene.background = environmentMap
  scene.environment = environmentMap

  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  //라이트 추가헤야지 지구 자세히 보임
  const addLight = () => {
    const light = new THREE.DirectionalLight(0xfffff)
    light.position.set(2.65, 2.13, 1.02)
    scene.add(light)
  }
  
  const addPostEffexts = () => {
    const renderPass = new RenderPass(scene, camera)
    effectComposer.addPass(renderPass)

    const filmPass = new FilmPass(1, 1, 4096, false)
    // effectComposer.addPass(filmPass)

    const shaderPass = new ShaderPass(GammaCorrectionShader)


    const glitchPass = new GlitchPass({
      glitchAmount: 1,
      glitchSpeed: 0.0001,
      glitchType: "pixelate"
    })
    effectComposer.addPass(glitchPass)

    const afterimagePass = new AfterimagePass(0.96)
    effectComposer.addPass(afterimagePass)
    effectComposer.addPass(shaderPass)
  }

  const createEarthGlow = () => {
    const material = new THREE.ShaderMaterial({
      vertexShader: '',
      fragmentShader: '',
      side: THREE.DoubleSide,
      transparent: true,
    })

    const geometry = new THREE.SphereGeometry(1, 40, 40)
    const mesh = new THREE.Mesh(geometry, material)

    return mesh

  }

  const createEarth1 = () => {
    const material = new THREE.MeshStandardMaterial({
      map: textureLoader.load('assets/earth-night-map.jpg'),
      // side: THREE.FrontSide,
      opacity: 0.6,
      transparent: true,
    })

    const geometry = new THREE.SphereGeometry(1.3, 30, 30)
    
    const mesh = new THREE.Mesh(geometry, material)

     //return 멕여줘야함
    return mesh
  };

  //감싸는 지구 생성
  const createEarth2 = () => {
    const material = new THREE.MeshStandardMaterial({
      map: textureLoader.load('assets/earth-night-map.jpg'),
      opacity: 0.8,
      //이거 안넣으면 opacity 적용안됨
      transparent: true,
      //Earth1이 좀 더 앞에 있는 거 같은 효과를 줌 말그대로 뒷쪽 부분만 렌더하겠다는 명령어
      side: THREE.BackSide
    })

    const geometry = new THREE.SphereGeometry(1.5, 30, 30)
    const mesh = new THREE.Mesh(geometry, material)

    //return 멕여줘야함
    return mesh
  }

  //별만드는 거임
  const createStar = (count = 500) => {
    // threejs에서는 그냥 배열로 넣어주면 안되고 정확한 배열값 넣어줘야함 짜증나게
    // const positions = [] <--- 이거 안됨
    const positions = new Float32Array(count * 3)

    for(let i = 0; i < count; i++) {
      positions[i] = (Math.random() - 0.5) * 5 // -3 ~ 3
      positions[i + 1] = (Math.random() - 0.5) * 5 // -3 ~ 3
      positions[i + 2] = (Math.random() - 0.5) * 5 // -3 ~ 3
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    )

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.02,
      transparent: true,
      depthWrite: false,
      map: textureLoader.load('assets/particle.png'),
      //threejs멍청해서 png 배경 검은색으로 처리함 그래서 이거 넣어줘야함
      alphaMap: textureLoader.load('assets/particle.png'),
      color: 0xbcc6c6,
    })

    const star = new THREE.Points(particleGeometry, particleMaterial)

    return star
  }
  //create 좀 깔끔하게 만들기 위해서 하나 만듬
  const create = () => {
    const earth1 = createEarth1()
    const earth2 = createEarth2()
    const star = createStar()
    scene.add(earth1, earth2, star)

    return {
      earth1,
      earth2,
      star,
    }
  }

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    effectComposer.setSize(canvasSize.width, canvasSize.height)
  };

  const addEvent = () => {
    window.addEventListener('resize', resize);
  };

  const draw = (obj) => {
    const { earth1, earth2, star } = obj

    earth1.rotation.x += 0.0005;
    earth1.rotation.y += 0.0005;

    earth2.rotation.x += 0.0005;
    earth2.rotation.y += 0.0005;

    star.rotation.x += 0.0001;
    star.rotation.y += 0.0001;

    controls.update();
    effectComposer.render()
    // renderer.render(scene, camera);
    requestAnimationFrame(() => {
      draw(obj);
    });
  };

  const initialize = () => {
    const obj = create()
    addLight()
    addPostEffexts()
    addEvent();
    resize();
    draw(obj);
  };

  initialize();
}

/**
* Template Name: Personal - v4.7.0
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

let renderer,
    camera,
    planet,
    moon,
    sphereBg,
    terrainGeometry,
    container = document.getElementById("canvas_container"),
    timeout_Debounce,
    frame = 0,
    cameraDx = 0.05,
    count = 0,
    t = 0;

/*   Lines values  */
let lineTotal = 1000;
let linesGeometry = new THREE.BufferGeometry();
linesGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6 * lineTotal), 3));
linesGeometry.setAttribute("velocity", new THREE.BufferAttribute(new Float32Array(2 * lineTotal), 1));
let l_positionAttr = linesGeometry.getAttribute("position");
let l_vertex_Array = linesGeometry.getAttribute("position").array;
let l_velocity_Array = linesGeometry.getAttribute("velocity").array;


init();
animate();


function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");
    scene.fog = new THREE.Fog("#3c1e02", 0.5, 50);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000)
    camera.position.set(0, 1, 32)

    pointLight1 = new THREE.PointLight("#ffffff", 1, 0);
    pointLight1.position.set(0, 30, 30);
    scene.add(pointLight1);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();

    // Planet
    const texturePlanet = loader.load('https://i.ibb.co/h94JBXy/saturn3-ljge5g.jpg');
    texturePlanet.anisotropy = 16;
    const planetGeometry = new THREE.SphereBufferGeometry(10, 50, 50);
    const planetMaterial = new THREE.MeshLambertMaterial({
        map: texturePlanet,
        fog: false
    });
    planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(0, 8, -30);
    scene.add(planet);


    //Moon
    const textureMoon = loader.load('https://i.ibb.co/64zn361/moon-ndengb.jpg');
    textureMoon.anisotropy = 16;
    let moonGeometry = new THREE.SphereBufferGeometry(2, 32, 32);
    let moonMaterial = new THREE.MeshPhongMaterial({
        map: textureMoon,
        fog: false
    });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(0, 8, 0);
    scene.add(moon);


    // Sphere Background 
    const textureSphereBg = loader.load('https://i.ibb.co/JCsHJpp/stars2-qx9prz.jpg');
    textureSphereBg.anisotropy = 16;
    const geometrySphereBg = new THREE.SphereBufferGeometry(150, 32, 32);
    const materialSphereBg = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        map: textureSphereBg,
        fog: false
    });
    sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
    sphereBg.position.set(0, 50, 0);
    scene.add(sphereBg);


    // Terrain
    const textureTerrain = loader.load();
    textureTerrain.rotation = THREE.MathUtils.degToRad(5);
    terrainGeometry = new THREE.PlaneBufferGeometry(70, 70, 20, 20);
    const terrainMaterial = new THREE.MeshBasicMaterial({
        map: textureTerrain,
        fog: true
    });
    terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -0.47 * Math.PI;
    terrain.rotation.z = THREE.Math.degToRad(90);
    scene.add(terrain);

    let t_vertex_Array = terrainGeometry.getAttribute("position").array;
    terrainGeometry.getAttribute("position").setUsage(THREE.DynamicDrawUsage);

    terrainGeometry.setAttribute("myZ", new THREE.BufferAttribute(new Float32Array(t_vertex_Array.length / 3), 1));
    let t_myZ_Array = terrainGeometry.getAttribute("myZ").array;

    for (let i = 0; i < t_vertex_Array.length; i++) {
        t_myZ_Array[i] = THREE.MathUtils.randInt(0, 5);
    }

    //Terain Lines
    const terrain_line = new THREE.LineSegments(
        terrainGeometry,
        new THREE.LineBasicMaterial({
            color: "#fff",
            fog: false
        })
    );
    terrain_line.rotation.x = -0.47 * Math.PI;
    terrain_line.rotation.z = THREE.Math.degToRad(90);
    scene.add(terrain_line);



    //  Stars
    for (let i = 0; i < lineTotal; i++) {
        let x = THREE.MathUtils.randInt(-100, 100);
        let y = THREE.MathUtils.randInt(10, 40);
        if (x < 7 && x > -7 && y < 20) x += 14;
        let z = THREE.MathUtils.randInt(0, -300);

        l_vertex_Array[6 * i + 0] = l_vertex_Array[6 * i + 3] = x;
        l_vertex_Array[6 * i + 1] = l_vertex_Array[6 * i + 4] = y;
        l_vertex_Array[6 * i + 2] = l_vertex_Array[6 * i + 5] = z;

        l_velocity_Array[2 * i] = l_velocity_Array[2 * i + 1] = 0;
    }
    let starsMaterial = new THREE.LineBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.5,
        fog: false
    });
    let lines = new THREE.LineSegments(linesGeometry, starsMaterial);
    linesGeometry.getAttribute("position").setUsage(THREE.DynamicDrawUsage);
    scene.add(lines);
}




function animate() {
    planet.rotation.y += 0.002;
    sphereBg.rotation.x += 0.002;
    sphereBg.rotation.y += 0.002;
    sphereBg.rotation.z += 0.002;


    // Moon Animation
    moon.rotation.y -= 0.007;
    moon.rotation.x -= 0.007;
    moon.position.x = 15 * Math.cos(t) + 0;
    moon.position.z = 20 * Math.sin(t) - 35;
    t += 0.015;


    // Terrain Animation  
    let t_vertex_Array = terrainGeometry.getAttribute("position").array;
    let t_myZ_Array = terrainGeometry.getAttribute("myZ").array;

    for (let i = 0; i < t_vertex_Array.length; i++) {
        if (i >= 210 && i <= 250) t_vertex_Array[i * 3 + 2] = 0;
        else {
            t_vertex_Array[i * 3 + 2] = Math.sin((i + count * 0.0003)) * (t_myZ_Array[i] - (t_myZ_Array[i] * 0.5));
            count += 0.1;
        }
    }

    //   Stars Animation  
    for (let i = 0; i < lineTotal; i++) {
        l_velocity_Array[2 * i] += 0.0049;
        l_velocity_Array[2 * i + 1] += 0.005;

        l_vertex_Array[6 * i + 2] += l_velocity_Array[2 * i];
        l_vertex_Array[6 * i + 5] += l_velocity_Array[2 * i + 1];

        if (l_vertex_Array[6 * i + 2] > 50) {
            l_vertex_Array[6 * i + 2] = l_vertex_Array[6 * i + 5] = THREE.MathUtils.randInt(-200, 10);
            l_velocity_Array[2 * i] = 0;
            l_velocity_Array[2 * i + 1] = 0;
        }
    }


    //Camera Movement
    camera.position.x += cameraDx;
    camera.position.y = -1.2 * (1 - Math.abs(frame / 2000 - 0.5) / 0.5);
    camera.lookAt(0, 0, 0);
    frame += 8;
    if (frame > 2000) frame = 0;
    if (camera.position.x > 18) cameraDx = -cameraDx;
    if (camera.position.x < -18) cameraDx = Math.abs(cameraDx);


    l_positionAttr.needsUpdate = true;
    terrainGeometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}




/*     Resize     */
window.addEventListener("resize", () => {
    clearTimeout(timeout_Debounce);
    timeout_Debounce = setTimeout(onWindowResize, 80);
});
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}


(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)

    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '#navbar .nav-link', function(e) {
    let section = select(this.hash)
    if (section) {
      e.preventDefault()

      let navbar = select('#navbar')
      let header = select('#header')
      let sections = select('section', true)
      let navlinks = select('#navbar .nav-link', true)

      navlinks.forEach((item) => {
        item.classList.remove('active')
      })

      this.classList.add('active')

      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }

      if (this.hash == '#header') {
        header.classList.remove('header-top')
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        return;
      }

      if (!header.classList.contains('header-top')) {
        header.classList.add('header-top')
        setTimeout(function() {
          sections.forEach((item) => {
            item.classList.remove('section-show')
          })
          section.classList.add('section-show')

        }, 350);
      } else {
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        section.classList.add('section-show')
      }

      scrollto(this.hash)
    }
  }, true)

  /**
   * Activate/show sections on load with hash links
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      let initial_nav = select(window.location.hash)

      if (initial_nav) {
        let header = select('#header')
        let navlinks = select('#navbar .nav-link', true)

        header.classList.add('header-top')

        navlinks.forEach((item) => {
          if (item.getAttribute('href') == window.location.hash) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        })

        setTimeout(function() {
          initial_nav.classList.add('section-show')
        }, 350);

        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

})()
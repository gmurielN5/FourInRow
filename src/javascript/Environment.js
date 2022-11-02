import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

class Environment {
  constructor() {
    this.ground = new THREE.Group()
    const loader = new FBXLoader()

    const environment = this
    /**
     * Floor
     */

    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xa39e08 })
    const floorGeometry = new THREE.PlaneGeometry(10000, 10000, 1, 1)
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.material.side = THREE.DoubleSide
    floor.rotation.x = 90
    floor.position.y = -600
    floor.position.z = -700
    environment.ground.add(floor)

    /**
     * Maple Tree
     */
    loader.load(
      `./assets/fbx/environment/MapleTrees.fbx`,
      function (object) {
        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            child.position.set(-180, -130, 120)
            child.scale.set(70, 70, 70)
          }
        })

        environment.ground.add(object.children[4])
      },
      undefined,
      function (error) {
        console.error(error)
      }
    )
    /**
     * Maple Tree
     */
    loader.load(
      `./assets/fbx/environment/BirchTrees.fbx`,
      function (object) {
        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            child.position.set(300, -180, 0)
            child.scale.set(50, 50, 50)
          }
        })

        environment.ground.add(object.children[3])
      },
      undefined,
      function (error) {
        console.error(error)
      }
    )
    /**
     * Stone
     */
    loader.load(
      `./assets/fbx/environment/Rocks.fbx`,
      function (object) {
        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            child.position.set(300, -180, 0)
          }
        })

        environment.ground.add(object.children[2])
      },
      undefined,
      function (error) {
        console.error(error)
      }
    )
    /**
     * Grass
     */
    loader.load(
      `./assets/fbx/environment/Grass.fbx`,
      function (object) {
        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            child.position.set(0, 0, 0)
          }
        })

        const grass = new THREE.Object3D()
        grass.add(object.children[0])
        const greens = []
        for (var i = 0; i < 100; i++) {
          greens[i] = grass.clone()
          greens[i].position.x = Math.random() * 700 - 300
          greens[i].position.y = -180
          greens[i].position.z = Math.random() * 100 - 20
          environment.ground.add(greens[i])
        }
      },
      undefined,
      function (error) {
        console.error(error)
      }
    )
  }

  loadEnvironment(game) {
    const environment = this
    game.scene.add(environment.ground)
  }
}

export default Environment

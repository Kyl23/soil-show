import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const colorMap = (num) => {
    const map = {
        2: "rgb(252,228,214)",
        3: "rgb(244,176,132)",
        4: "rgb(169,208,142)",
        5: "rgb(221,235,247)",
        6: "rgb(155,194,230)",
        7: "rgb(31,78,120)",
        8: "rgb(102,102,102)",
    }

    return map[num];
}

const group = new THREE.Group()
function genCube(x, y, z, rgb) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: rgb });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z)

    // scene.add(cube);
    group.add(cube);
}

genCube(-1, 0, 0, colorMap(2))
genCube(0, 0, 0, colorMap(2))
genCube(1, 0, 0, colorMap(2))
genCube(-1, 1, 0, colorMap(3))
genCube(0, 1, 0, colorMap(3))
genCube(1, 1, 0, colorMap(3))

scene.add(group)
camera.lookAt(0, 0, 0)
camera.position.x = 0;
camera.position.z = 5;

const keys = {};

window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

window.addEventListener('mousedown', (event) => {
    keys['mousedown'] = { x: event.x, y: event.y };
});

window.addEventListener('mouseup', (event) => {
    delete keys['mousedown'];
});

window.addEventListener('mousemove', (event) => {
    if (keys['mousedown']) {
        const previousMousePosition = keys['mousedown']
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        // 通过鼠标移动调整旋转
        group.rotation.y += deltaMove.x * 0.01; // 0.01 是调整的敏感度
        group.rotation.x += deltaMove.y * 0.01; // 同样可以根据需要调整
        keys['mousedown'] = { x: event.x, y: event.y };
    }

});

const moveSpeed = 0.5;
window.addEventListener('wheel', (event) => {
    event.preventDefault(); // 防止页面滚动
    if (event.deltaY < 0) {
        // 向上滚动，放大
        camera.position.z -= moveSpeed;
    } else {
        // 向下滚动，缩小
        camera.position.z += moveSpeed;
    }
});

function update_moving() {
    if (keys['a']) {
        group.position.x -= moveSpeed; // 左移
    }
    if (keys['d']) {
        group.position.x += moveSpeed;
    }
    if (keys['w']) {
        group.position.y -= moveSpeed;
    }
    if (keys['s']) {
        group.position.y += moveSpeed;
    }
}

function animate() {
    requestAnimationFrame(animate);

    update_moving();
    renderer.render(scene, camera);
}

const x1 = document.querySelector("#x1");
const x2 = document.querySelector("#x2");
const y1 = document.querySelector("#y1");
const y2 = document.querySelector("#y2");
const z1 = document.querySelector("#z1");
const z2 = document.querySelector("#z2");
const slice_button = document.querySelector("#slice");
const screenshot = document.querySelector("#screenshot");

slice_button.addEventListener('click', () => {
    for (const child of group.children) {
        child.visible = true
    }

    const t_x1 = x1.value ? x1.value : -Infinity;
    const t_x2 = x2.value ? x2.value : Infinity;
    const t_y1 = y1.value ? y1.value : -Infinity;
    const t_y2 = y2.value ? y2.value : Infinity;
    const t_z1 = z1.value ? z1.value : -Infinity;
    const t_z2 = z2.value ? z2.value : Infinity;

    for (const child of group.children) {
        if ((child.position.x < t_x1 || child.position.x > t_x2) ||
            (child.position.y < t_y1 || child.position.y > t_y2) ||
            (child.position.z < t_z1 || child.position.z > t_z2)
        ) {
            child.visible = false
        }
    }
})

screenshot.addEventListener('click', () => {
    renderer.setSize(3840*2, 2160*2);
    renderer.render(scene, camera);
    const imgData = renderer.domElement.toDataURL(); // 將畫布轉為圖像URL
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'screenshot.png'; // 設置下載文件名
    link.click(); // 自動觸發下載
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();


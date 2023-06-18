const canvas = document.querySelector('canvas')

/* 캔버스 사이즈 초기 설정 코드
디바이스 dpr 을 곱함으로써 좀 더 선명한 결과값을 만들어 낼 수 있음 */
const ctx = canvas.getContext('2d')
const dpr = window.devicePixelRatio
let canvasWidth
let canvasHeight
let particles


function init() {
    canvasWidth = innerWidth
    canvasHeight = innerHeight
    
    canvas.style.width  = canvasWidth + 'px'
    canvas.style.height  = canvasHeight + 'px'
    
    //아래 값을 넣어줘야지 canvas에 1:1 비율로 그림이 그려짐
    canvas.width = canvasWidth * dpr
    canvas.height = canvasHeight * dpr
    ctx.scale(dpr, dpr)

    //새로 생성된 new Particle을 particles를 라는 배열에 넣을 수 있게 변수 생성
    particles = []
    const TOTAL = canvasWidth / 10

    //TOTAL 값만큼의 파티클들이 랜덤하게 생성됨
    for (let i = 0; i < TOTAL; i++) {
        const x = randomNumBetween(0, canvasWidth)
        const y = randomNumBetween(0, canvasHeight)
        const radius = randomNumBetween(50, 100)
        const vy = randomNumBetween(1, 5)
        const particle = new Particle(x, y, radius, vy)
        particles.push(particle)
    }
}

const feGaussianBlur = document.querySelector('feGaussianBlur')
const feColorMatrix = document.querySelector('feColorMatrix')

const controls = new function() {
    // this.blurValue = 40
    // this.alphaChannel = 100
    this.acc = 1.03
    this.rectWidth = 10;
    this.rectHeight = 80;
    this.fillStyle = 'blue'
}

let gui = new dat.GUI()

// gui.add(controls, 'blurValue', 0, 100).onChange(value => {
//     feGaussianBlur.setAttribute('stdDeviation', value)
// })
// gui.add(controls, 'alphaChannel', 1, 200).onChange(value => {
//     feColorMatrix.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} -23')
// })

const f3 = gui.addFolder('Rain Control')
f3.open()
f3.add(controls, 'acc', 1, 1.5, 0.01).onChange(value => {
    particles.forEach(particle => particle.acc = value)
})
f3.add(controls, 'rectWidth', 10, 500).onChange(value => {
    particles.forEach(particle => particle.rectWidth = value)
})
f3.add(controls, 'rectHeight', 10, 500).onChange(value => {
    particles.forEach(particle => particle.rectHeight = value)
})

//파티클을 각기 다른 위치에 생성하고 애니메이션을 만들기 위해서 class 생성
class Particle {
    constructor(x, y, radius, vy) {
        this.x = x
        this.y = y
        this.radius = radius
        //파티클이 각기 다른 속도로 떨어질 수 있도록 vy라는 변수 생성
        this.vy = vy
        //가속도 변수
        this.acc = 1.03
        this.rectWidth = controls.rectWidth
        this.rectHeight = controls.rectHeight
    }
    update() {
        this.vy *= this.acc
        this.y += this.vy

    }
    draw() {
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.rectWidth, this.rectHeight)
        ctx.fillStyle = 'blue'
        ctx.globalAlpha = '0.7'
        ctx.fill()
        ctx.closePath()
    }
}

const x = 50
const y = 50
const radius = 50
const particle = new Particle(x, y, radius)

//최대값과 최소값을 가지고 랜덤하게 형성하는 변수 생성
const randomNumBetween = (min, max) => {
    return Math.random() * (max - min + 1) + min
}

 
//60fps를 목표로 설정하는 코드
let interval = 1000 / 60
let now, delta
let then = Date.now()

function animation() {
    //애니메이션을 무한히 실행시킴
    window.requestAnimationFrame(animation)

    //60fps 를 하기위한 기본 공식
    now = Date.now()
    delta = now - then

    if (delta < interval) return

    //초기화 시켜서 다시 그리는 코드
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    particles.forEach(particle => {
        particle.update()
        particle.draw()   

        //파티클이 다 떨어졌을 경우 다시 위치를 초기화해서 계속 떨어지는 듯한 느낌을 줌
        if(particle.y - particle.radius > canvasHeight) {
            particle.y = -particle.radius
            //파티클이 좀 더 랜덤한 모양으로 보이게끔 하는 코드
            particle.x = randomNumBetween(0, canvasWidth)
            particle.radius = randomNumBetween(50, 100)
            particle.vy = randomNumBetween(1, 5)
        }
    })

    //60fps 를 하기위한 기본 공식
    then = now - (delta % interval)
}

window.addEventListener('load', () => {
    init()
    animation()
})

window.addEventListener('resize', () => {
    init()
})



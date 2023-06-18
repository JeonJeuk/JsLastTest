const listStyleChangeStartY = 750
const listStyleChangeEndY = 4400

const listItems = document.querySelectorAll('.list-item')

const division = (listStyleChangeEndY - listStyleChangeStartY) / listItems.length

const panel1Img = document.querySelector('#panel1-img')
const flyingSantaImg = document.querySelector('#flying-santa-img')

window.addEventListener("scroll", () => {

    console.log(window.scrollY)

    if (document.getElementById("on")) {
        document.getElementById("on").removeAttribute("id")
    }
    
    if (window.scrollY > listStyleChangeStartY && window.scrollY < listStyleChangeEndY) {
        const targetIndex = Math.round((window.scrollY - listStyleChangeStartY) / division)

        if(listItems[targetIndex]) {
            listItems[targetIndex].id = "on"
        }
    }

    const scrollYBottom = window.scrollY + document.documentElement.clientHeight
    
    if (scrollYBottom > panel1Img.offsetTop && scrollYBottom < panel1Img.offsetTop + panel1Img.offsetHeight + 100)  {
        const translateX = 80 - 80 * 1.50 * (scrollYBottom - panel1Img.offsetTop) / (panel1Img.offsetHeight + 100)
        const translateY = -13 + 13 * 1.50 * (scrollYBottom - panel1Img.offsetTop) / (panel1Img.offsetHeight + 100)

        const rotateDegree  = 23 - 23 * 1.7 * (scrollYBottom - panel1Img.offsetTop) / (panel1Img.offsetHeight + 100)

        flyingSantaImg.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotateDegree}deg)` 
    }
})


/* Preloader
----------------------------------- */
const preloaderBtn = document.querySelector('.preloader-btn')

let intervalId = null
let scale = 1
// 연해지는 정도의 한계 설정
const preloaderHideThreshold = 18


function setPreloaderStyle(scale) {
    preloaderBtn.style.transform = `scale(${scale})`
    // 스케일이 커지면서 텍스트도 희미해져가는 코드
    document.querySelector('.preloader-btn-hold').style.opacity = 1 - (scale - 1) / preloaderHideThreshold
}

const header = document.querySelector(".header")

preloaderBtn.addEventListener('mousedown', () => {
    intervalId = setInterval(() => {
        scale += 0.175

        setPreloaderStyle(scale)

        if (scale >= 1 +preloaderHideThreshold) {
            document.querySelector('.preloader').classList.add('hidden-area')

            // const poster = document.querySelector('.poster')
            const listItem = document.querySelector('#list-item-wrapper')
            const panel = document.querySelector('#panel1-img')
            const nav = document.querySelector('nav')
            const intro = document.querySelector('#intro-main')

            header.classList.remove('hidden-area')
            // poster.classList.remove('hidden-area')
            listItem.classList.remove('hidden-area')
            panel.classList.remove('hidden-area')
            nav.classList.remove('hidden-area')
            intro.classList.remove('hidden-area')
            
            

            header.classList.add('shown-area')
            // poster.classList.add('shown-area')
            listItem.classList.add('shown-area')
            panel.classList.add('shown-area')
            nav.classList.add('shown-area')
            intro.classList.add('shown-area')
            
            clearInterval(intervalId)
        }
    }, 10)
})

preloaderBtn.addEventListener('mouseup', () => {
    clearInterval(intervalId)

    intervalId = setInterval(() => {
        scale -= 0.075

        setPreloaderStyle(scale)

        // 계속 작아지는 것을 방지하기 위함
        if (scale <= 1) {
            clearInterval(intervalId)
        }
    }, 10)
})
/* ----------------------------------- */

/* 마우스 포인터 위치에 따른 오브젝트 이동
----------------------------------- */

//이유는 모르겠는데 header로 하면 작동이 안됨... 왜그럴까..
const body = document.querySelector('body')

body.addEventListener('mousemove', function(e) {
    const xRelativeToHeader = e.clientX / header.clientWidth
    const yRelativeToHeader = e.clientY / header.clientHeight

    document.querySelector(".header-title").style.transform = `translate(${(xRelativeToHeader * -100)}px, ${yRelativeToHeader * -100}px)`

    document.querySelector("#circle-1").style.transform = `translate(${xRelativeToHeader * -50}px, ${yRelativeToHeader * -50}px)`
    document.querySelector("#circle-2").style.transform = `translate(${xRelativeToHeader * 50}px, ${yRelativeToHeader * 50}px)`

    document.querySelector("#header-image-1").style.transform = `translate(${xRelativeToHeader * -50}px, ${yRelativeToHeader * -50}px)`
    document.querySelector("#header-image-2").style.transform = `translate(${xRelativeToHeader * -30}px, ${yRelativeToHeader * -20}px)`
    document.querySelector("#header-image-3").style.transform = `translate(${xRelativeToHeader * -20}px, ${yRelativeToHeader * -20}px)`
    document.querySelector("#header-image-4").style.transform = `translate(${xRelativeToHeader * 5}px, ${yRelativeToHeader * 5}px)`
    document.querySelector("#header-image-5").style.transform = `translate(${xRelativeToHeader * -30}px, ${yRelativeToHeader * -20}px)`
    document.querySelector("#header-image-6").style.transform = `translate(${xRelativeToHeader * -30}px, ${yRelativeToHeader * -20}px)`
    document.querySelector("#header-image-7").style.transform = `translate(${xRelativeToHeader * -30}px, ${yRelativeToHeader * -20}px)`
    document.querySelector("#header-image-8").style.transform = `translate(${xRelativeToHeader * -30}px, ${yRelativeToHeader * -20}px)`
    document.querySelector("#header-image-9").style.transform = `translate(${xRelativeToHeader * -30}px, ${yRelativeToHeader * -20}px)`
    document.querySelector("#header-image-10").style.transform = `translate(${xRelativeToHeader * -30}px, ${yRelativeToHeader * -20}px)`
    document.querySelector("#header-image-11").style.transform = `translate(${xRelativeToHeader * -30}px, ${yRelativeToHeader * -20}px)`
  })
/* ----------------------------------- */

/* Observer를 활용한 parallax scroll
----------------------------------- */

// const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//         if(entry.isIntersecting) {
//             entry.target.classList.add('poster-image-state-visible')
//         }
//     })
// }, { threshold: 0.2 })

// document.querySelectorAll('.poster-image-wrapper').forEach((poster) => {
//     observer.observe(poster)
// })

// const posterParallax = document.querySelector('.poster-parallax')

// posterParallax.addEventListener('mousemove', (e) => {
//     const xRelativeToPosterParallax = e.cilentX / posterParallax.clientWidth
//     const yRelativeToPosterParallax = e.cilentY / posterParallax.clientHeight

//     document.querySelector('#poster-image-2').style.transform = `translate(${xRelativeToPosterParallax * -40}px, ${yRelativeToPosterParallax * -40}px)`
//     document.querySelector('#poster-image-3').style.transform = `translate(${xRelativeToPosterParallax * 40}px, ${yRelativeToPosterParallax * 40}px)`
// })
/* ----------------------------------- */

let lastScrollTop = 0;
const delta = 15;
const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset;

  if (Math.abs(lastScrollTop - scrollTop) <= delta) {
    return;
  }

  if (scrollTop > lastScrollTop && lastScrollTop > 0) {
    nav.style.transition = 'top 0.4s'
    nav.style.top = "-80px";
  } else {
    nav.style.transition = 'top 0.4s'
    nav.style.top = "0px";
  }
  lastScrollTop = scrollTop;
});
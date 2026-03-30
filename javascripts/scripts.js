document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('#section1')
  const video = document.querySelector('#scrollVideo')
  const canvas = document.querySelector('#scrollCanvas')

  if (!section || !video || !canvas) return

  const ctx = canvas.getContext('2d')

  let duration = 0
  let targetTime = 0
  let isSeeking = false
  let ready = false

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    drawFrame()
  }

  function drawFrame() {
    if (!video.videoWidth || !video.videoHeight) return

    const canvasRatio = canvas.width / canvas.height
    const videoRatio = video.videoWidth / video.videoHeight

    let drawWidth
    let drawHeight
    let offsetX
    let offsetY

    if (videoRatio > canvasRatio) {
      drawHeight = canvas.height
      drawWidth = drawHeight * videoRatio
      offsetX = (canvas.width - drawWidth) / 2
      offsetY = 0
    } else {
      drawWidth = canvas.width
      drawHeight = drawWidth / videoRatio
      offsetX = 0
      offsetY = (canvas.height - drawHeight) / 2
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight)
  }

  video.addEventListener('loadedmetadata', function () {
    duration = video.duration
    ready = true
    resizeCanvas()

    video.currentTime = 0.001
  })

  video.addEventListener('seeked', function () {
    isSeeking = false
    drawFrame()
  })

  window.addEventListener('resize', resizeCanvas)

  function updateTargetTime() {
    if (!ready || !duration) return

    const rect = section.getBoundingClientRect()
    const sectionHeight = section.offsetHeight
    const windowHeight = window.innerHeight

    const maxScroll = sectionHeight - windowHeight
    const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(maxScroll, 0))
    const progress = maxScroll > 0 ? scrolled / maxScroll : 0

    targetTime = progress * duration
  }

  function tick() {
    updateTargetTime()

    if (
      ready &&
      !isSeeking &&
      Math.abs(video.currentTime - targetTime) > 0.03
    ) {
      isSeeking = true
      video.currentTime = targetTime
    }

    requestAnimationFrame(tick)
  }

  tick()
})
/* section-2 */

const letters = document.querySelector('.letters')

const items = document.querySelectorAll(
  '#text1, #text2, #text3, #text4, #text5, #text6, #text7, #text8, .apple1, .apple2, .apple3, .apple4, .apple5, .apple6'
)

const MIN_SPEED = 0.4
const MAX_SPEED = 1.2

let animationStarted = false
let startTimer = null

function startAnimation() {
  if (animationStarted) return
  animationStarted = true

  items.forEach((el) => {
    const style = getComputedStyle(el)

    const startLeft = parseFloat(style.left) || 0
    const startTop = parseFloat(style.top) || 0
    const rotation = style.getPropertyValue('--rot').trim() || '0deg'

    let moveX = 0
    let moveY = 0

    let speedX = (Math.random() * 2 - 1) * MAX_SPEED
    let speedY = (Math.random() * 2 - 1) * MAX_SPEED

    if (Math.abs(speedX) < MIN_SPEED) {
      speedX = speedX < 0 ? -MIN_SPEED : MIN_SPEED
    }

    if (Math.abs(speedY) < MIN_SPEED) {
      speedY = speedY < 0 ? -MIN_SPEED : MIN_SPEED
    }

    let isDragging = false
    let shiftX = 0
    let shiftY = 0

    function normalizeSpeed() {
      if (Math.abs(speedX) < MIN_SPEED) {
        speedX = speedX < 0 ? -MIN_SPEED : MIN_SPEED
      }

      if (Math.abs(speedY) < MIN_SPEED) {
        speedY = speedY < 0 ? -MIN_SPEED : MIN_SPEED
      }
    }

    function render() {
      el.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation})`
    }

    render()

    el.addEventListener('pointerdown', function (e) {
      e.preventDefault()

      isDragging = true
      el.classList.add('dragging')

      const rect = el.getBoundingClientRect()
      shiftX = e.clientX - rect.left
      shiftY = e.clientY - rect.top

      el.setPointerCapture(e.pointerId)
    })

    el.addEventListener('pointermove', function (e) {
      if (!isDragging) return

      const parentRect = letters.getBoundingClientRect()

      const currentLeft = e.clientX - parentRect.left - shiftX
      const currentTop = e.clientY - parentRect.top - shiftY

      moveX = currentLeft - startLeft
      moveY = currentTop - startTop

      render()
    })

    function stopDragging() {
      if (!isDragging) return

      isDragging = false
      el.classList.remove('dragging')

      speedX = (Math.random() * 2 - 1) * MAX_SPEED
      speedY = (Math.random() * 2 - 1) * MAX_SPEED

      normalizeSpeed()
    }

    el.addEventListener('pointerup', stopDragging)
    el.addEventListener('pointercancel', stopDragging)

    function animate() {
      if (!isDragging) {
        moveX += speedX
        moveY += speedY

        const parentRect = letters.getBoundingClientRect()
        const rect = el.getBoundingClientRect()

        const left = rect.left - parentRect.left
        const top = rect.top - parentRect.top
        const right = left + rect.width
        const bottom = top + rect.height

        if (left <= 0) {
          moveX += 2
          speedX = Math.abs(speedX)
          speedY += (Math.random() - 0.5) * 0.2
        }

        if (right >= parentRect.width) {
          moveX -= 2
          speedX = -Math.abs(speedX)
          speedY += (Math.random() - 0.5) * 0.2
        }

        if (top <= 0) {
          moveY += 2
          speedY = Math.abs(speedY)
          speedX += (Math.random() - 0.5) * 0.2
        }

        if (bottom >= parentRect.height) {
          moveY -= 2
          speedY = -Math.abs(speedY)
          speedX += (Math.random() - 0.5) * 0.2
        }

        normalizeSpeed()
        render()
      }

      requestAnimationFrame(animate)
    }

    animate()
  })
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animationStarted && !startTimer) {
        startTimer = setTimeout(() => {
          startAnimation()
        }, 3000)
      }
    })
  },
  {
    threshold: 0.4
  }
)

observer.observe(section2)

/* section-3 */

const section3 = document.querySelector('.section-3')
const popup = document.querySelector('.popup')

section3.addEventListener('click', function (e) {
  if (popup.contains(e.target)) return

  const rect = section3.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const img = document.createElement('img')
  img.src = 'images/print_birch.svg'
  img.classList.add('birch-img')

  img.style.left = `${x}px`
  img.style.top = `${y}px`

  section3.appendChild(img)
})

/* section-4 */

const field4 = document.querySelector('#field4')
if (!field4) return

const items4 = []
let pointerX = -9999
let pointerY = -9999

const startCards = [
  { type: 'img', skin: 'birch4', x: -1, y: 4, r: 14, d: 0.0 },
  { type: 'img', skin: 'girl4', x: 11, y: 6, r: -18, d: 0.08 },
  { type: 'text', text: 'давай', x: 38, y: 5, r: -12, d: 0.16 },
  { type: 'img', skin: 'tree4', x: 68, y: 5, r: -9, d: 0.24 },
  { type: 'img', skin: 'birch4', x: 85, y: 8, r: -18, d: 0.32 },

  { type: 'img', skin: 'tree4', x: -1, y: 22, r: 8, d: 0.1 },
  { type: 'img', skin: 'birch4', x: 16, y: 26, r: -16, d: 0.18 },
  { type: 'text', text: 'создай', x: 30, y: 18, r: 8, d: 0.26 },
  { type: 'text', text: 'себе', x: 53, y: 16, r: 6, d: 0.34 },
  { type: 'img', skin: 'girl4', x: 70, y: 24, r: 5, d: 0.42 },

  { type: 'img', skin: 'trees4', x: 38, y: 32, r: -15, d: 0.2 },
  { type: 'text', text: 'анкету', x: 50, y: 28, r: -5, d: 0.28 },
  { type: 'img', skin: 'trees4', x: 83, y: 30, r: -17, d: 0.36 }
]

function makeCard(card) {
  const unit = document.createElement('div')
  unit.className = 'unit4'
  unit.style.left = `${card.x}vw`
  unit.style.top = `${card.y}vw`

  const el = document.createElement('div')
  el.classList.add('card4')
  el.style.setProperty('--rot', `${card.r}deg`)
  el.style.setProperty('--delay', `${card.d}s`)

  if (card.type === 'text') {
    el.classList.add('text4')
    const span = document.createElement('span')
    span.textContent = card.text
    el.appendChild(span)
  } else {
    el.classList.add('img4', card.skin)
  }

  unit.appendChild(el)
  field4.appendChild(unit)

  requestAnimationFrame(() => {
    el.classList.add('show')
  })

  const obj = {
    unit,
    card: el,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rot: 0,
    vr: 0,
    baseX: card.x,
    baseY: card.y,
    width: 0,
    height: 0,
    active: false
  }

  items4.push(obj)

  const totalDelay = (card.d + 1.1) * 1000
  setTimeout(() => {
    obj.active = true
    updateSize(obj)
  }, totalDelay)
}

function updateSize(obj) {
  obj.width = (obj.unit.offsetWidth / window.innerWidth) * 100
  obj.height = (obj.unit.offsetHeight / window.innerWidth) * 100
}

function updateAllSizes() {
  items4.forEach(updateSize)
}

startCards.forEach(makeCard)
window.addEventListener('resize', updateAllSizes)

function pushFromCursor(obj) {
  if (!obj.active) return

  const cx = obj.baseX + obj.x + obj.width / 2
  const cy = obj.baseY + obj.y + obj.height / 2

  const dx = cx - pointerX
  const dy = cy - pointerY
  const dist = Math.sqrt(dx * dx + dy * dy)
  const radius = 9

  if (dist < radius && dist > 0) {
    const force = (radius - dist) / radius
    const angle = Math.atan2(dy, dx)

    obj.vx += Math.cos(angle) * force * 0.18
    obj.vy += Math.sin(angle) * force * 0.18
    obj.vr += (Math.random() - 0.5) * force * 1.2
  }
}

function keepInside(obj) {
  const maxX = 100 - obj.width - obj.baseX
  const minX = -obj.baseX
  const maxY = 52 - obj.height - obj.baseY
  const minY = -obj.baseY

  if (obj.x < minX) {
    obj.x = minX
    obj.vx *= -0.5
  }

  if (obj.x > maxX) {
    obj.x = maxX
    obj.vx *= -0.5
  }

  if (obj.y < minY) {
    obj.y = minY
    obj.vy *= -0.5
  }

  if (obj.y > maxY) {
    obj.y = maxY
    obj.vy *= -0.5
  }
}

function collide4(a, b) {
  if (!a.active || !b.active) return

  const ax = a.baseX + a.x
  const ay = a.baseY + a.y
  const bx = b.baseX + b.x
  const by = b.baseY + b.y

  const hit =
    ax < bx + b.width &&
    ax + a.width > bx &&
    ay < by + b.height &&
    ay + a.height > by

  if (!hit) return

  const overlapX1 = ax + a.width - bx
  const overlapX2 = bx + b.width - ax
  const overlapY1 = ay + a.height - by
  const overlapY2 = by + b.height - ay

  const overlapX = Math.min(overlapX1, overlapX2)
  const overlapY = Math.min(overlapY1, overlapY2)

  if (overlapX < overlapY) {
    if (ax < bx) {
      a.x -= overlapX / 2
      b.x += overlapX / 2
    } else {
      a.x += overlapX / 2
      b.x -= overlapX / 2
    }

    const temp = a.vx
    a.vx = b.vx * 0.75
    b.vx = temp * 0.75
  } else {
    if (ay < by) {
      a.y -= overlapY / 2
      b.y += overlapY / 2
    } else {
      a.y += overlapY / 2
      b.y -= overlapY / 2
    }

    const temp = a.vy
    a.vy = b.vy * 0.75
    b.vy = temp * 0.75
  }

  a.vr += (Math.random() - 0.5) * 0.4
  b.vr += (Math.random() - 0.5) * 0.4
}

function render4(obj) {
  obj.unit.style.transform = `translate(${obj.x}vw, ${obj.y}vw) rotate(${obj.rot}deg)`
}

function animate4() {
  items4.forEach((obj) => {
    if (obj.active) {
      pushFromCursor(obj)

      obj.x += obj.vx
      obj.y += obj.vy
      obj.rot += obj.vr

      obj.vx *= 0.93
      obj.vy *= 0.93
      obj.vr *= 0.9

      keepInside(obj)
    }
  })

  for (let i = 0; i < items4.length; i++) {
    for (let j = i + 1; j < items4.length; j++) {
      collide4(items4[i], items4[j])
    }
  }

  items4.forEach((obj) => {
    if (obj.active) render4(obj)
  })

  requestAnimationFrame(animate4)
}

animate4()

field4.addEventListener('pointermove', function (e) {
  const rect = field4.getBoundingClientRect()
  pointerX = ((e.clientX - rect.left) / rect.width) * 100
  pointerY = ((e.clientY - rect.top) / rect.width) * 100
})

field4.addEventListener('pointerleave', function () {
  pointerX = -9999
  pointerY = -9999
})

const randomSkins = ['birch4', 'girl4', 'trees4', 'tree4']

field4.addEventListener('click', function (e) {
  if (e.target.closest('.unit4')) return

  const rect = field4.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.width) * 100

  const card = {
    type: 'img',
    skin: randomSkins[Math.floor(Math.random() * randomSkins.length)],
    x: x - 5.75,
    y: y - 5.4,
    r: Math.random() * 30 - 15,
    d: 0
  }

  makeCard(card)
})
// 5
document.addEventListener('DOMContentLoaded', function () {
  const section5 = document.querySelector('#section5')
  if (!section5) return

  const btn5 = document.querySelector('#btn5')
  const video5 = document.querySelector('#video5')
  const canvas5 = document.querySelector('#canvas5')
  const photo5 = document.querySelector('#photo5')

  let stream5 = null
  let started5 = false
  let captured5 = false

  const observer5 = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started5) {
          started5 = true

          setTimeout(() => {
            section5.classList.add('active')

            setTimeout(() => {
              section5.classList.add('orbit')
            }, 1400)
          }, 2000)
        }
      })
    },
    { threshold: 0.45 }
  )

  observer5.observe(section5)

  async function startCamera5() {
    try {
      stream5 = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })

      video5.srcObject = stream5
      photo5.style.display = 'none'
      video5.style.display = 'block'
    } catch (error) {
      console.log('Камера недоступна', error)
    }
  }

  function takePhoto5() {
    if (!video5.videoWidth || !video5.videoHeight) return

    const ctx = canvas5.getContext('2d')
    canvas5.width = video5.videoWidth
    canvas5.height = video5.videoHeight

    ctx.drawImage(video5, 0, 0, canvas5.width, canvas5.height)

    const data = canvas5.toDataURL('image/png')
    photo5.src = data
    photo5.style.display = 'block'
    video5.style.display = 'none'

    captured5 = true

    setTimeout(() => {
      section5.classList.add('done')
    }, 2000)
  }

  btn5.addEventListener('click', async function () {
    if (!stream5) {
      await startCamera5()
      return
    }

    if (!captured5) {
      takePhoto5()
    }
  })

  video5.addEventListener('click', function () {
    if (stream5 && !captured5) {
      takePhoto5()
    }
  })
})

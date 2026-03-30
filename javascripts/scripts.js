document.addEventListener('DOMContentLoaded', function () {
  let video1 = document.querySelector('.bg-video1')
  if (video1) {
    video1.playbackRate = 0.5
  }

  let section2 = document.querySelector('.section-2')
  let letters = document.querySelector('.letters')
  let items = document.querySelectorAll(
    '#text1, #text2, #text3, #text4, #text5, #text6, #text7, #text8, .apple1, .apple2, .apple3, .apple4, .apple5, .apple6'
  )
  let MIN_SPEED = 0.4
  let MAX_SPEED = 1.2
  let animationStarted = false
  let startTimer = null

  function startAnimation() {
    if (animationStarted) return
    animationStarted = true

    items.forEach((el) => {
      let style = getComputedStyle(el)
      let startLeft = parseFloat(style.left) || 0
      let startTop = parseFloat(style.top) || 0
      let rotation = style.getPropertyValue('--rot').trim() || '0deg'
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

        let rect = el.getBoundingClientRect()
        shiftX = e.clientX - rect.left
        shiftY = e.clientY - rect.top

        el.setPointerCapture(e.pointerId)
      })

      el.addEventListener('pointermove', function (e) {
        if (!isDragging) return
        if (!letters) return

        let parentRect = letters.getBoundingClientRect()
        let currentLeft = e.clientX - parentRect.left - shiftX
        let currentTop = e.clientY - parentRect.top - shiftY

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
        if (!isDragging && letters) {
          moveX += speedX
          moveY += speedY

          let parentRect = letters.getBoundingClientRect()
          let rect = el.getBoundingClientRect()
          let left = rect.left - parentRect.left
          let top = rect.top - parentRect.top
          let right = left + rect.width
          let bottom = top + rect.height

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

  if (section2) {
    let observer = new IntersectionObserver(
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
  }

  let section3 = document.querySelector('.section-3')
  let popup = document.querySelector('.popup')
  let info3 = document.querySelector('#info3')

  if (section3 && popup && info3) {
    popup.addEventListener('click', function (e) {
      e.stopPropagation()
      info3.classList.add('active')
    })

    info3.addEventListener('click', function () {
      info3.classList.remove('active')
    })

    section3.addEventListener('click', function (e) {
      if (popup.contains(e.target)) return
      if (info3.classList.contains('active')) return

      let rect = section3.getBoundingClientRect()
      let x = e.clientX - rect.left
      let y = e.clientY - rect.top

      let img = document.createElement('img')
      img.src = 'images/print_birch.svg'
      img.classList.add('birch-img')
      img.style.left = `${x}px`
      img.style.top = `${y}px`

      section3.appendChild(img)
    })
  }

  let field4 = document.querySelector('#field4')

  if (field4) {
    let items4 = []
    let pointerX = -9999
    let pointerY = -9999

    let startCards = [
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
      let unit = document.createElement('div')
      unit.className = 'unit4'
      unit.style.left = `${card.x}vw`
      unit.style.top = `${card.y}vw`

      let el = document.createElement('div')
      el.classList.add('card4')
      el.style.setProperty('--rot', `${card.r}deg`)
      el.style.setProperty('--delay', `${card.d}s`)

      if (card.type === 'text') {
        el.classList.add('text4')
        let span = document.createElement('span')
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

      let obj = {
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

      let totalDelay = (card.d + 1.1) * 1000
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

      let cx = obj.baseX + obj.x + obj.width / 2
      let cy = obj.baseY + obj.y + obj.height / 2
      let dx = cx - pointerX
      let dy = cy - pointerY
      let dist = Math.sqrt(dx * dx + dy * dy)
      let radius = 9

      if (dist < radius && dist > 0) {
        let force = (radius - dist) / radius
        let angle = Math.atan2(dy, dx)
        obj.vx += Math.cos(angle) * force * 0.18
        obj.vy += Math.sin(angle) * force * 0.18
        obj.vr += (Math.random() - 0.5) * force * 1.2
      }
    }

    function keepInside(obj) {
      let maxX = 100 - obj.width - obj.baseX
      let minX = -obj.baseX
      let maxY = 52 - obj.height - obj.baseY
      let minY = -obj.baseY

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

      let ax = a.baseX + a.x
      let ay = a.baseY + a.y
      let bx = b.baseX + b.x
      let by = b.baseY + b.y

      let hit =
        ax < bx + b.width &&
        ax + a.width > bx &&
        ay < by + b.height &&
        ay + a.height > by

      if (!hit) return

      let overlapX1 = ax + a.width - bx
      let overlapX2 = bx + b.width - ax
      let overlapY1 = ay + a.height - by
      let overlapY2 = by + b.height - ay
      let overlapX = Math.min(overlapX1, overlapX2)
      let overlapY = Math.min(overlapY1, overlapY2)

      if (overlapX < overlapY) {
        if (ax < bx) {
          a.x -= overlapX / 2
          b.x += overlapX / 2
        } else {
          a.x += overlapX / 2
          b.x -= overlapX / 2
        }

        let temp = a.vx
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

        let temp = a.vy
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
      let rect = field4.getBoundingClientRect()
      pointerX = ((e.clientX - rect.left) / rect.width) * 100
      pointerY = ((e.clientY - rect.top) / rect.width) * 100
    })

    field4.addEventListener('pointerleave', function () {
      pointerX = -9999
      pointerY = -9999
    })

    let randomSkins = ['birch4', 'girl4', 'trees4', 'tree4']

    field4.addEventListener('click', function (e) {
      if (e.target.closest('.unit4')) return

      let rect = field4.getBoundingClientRect()
      let x = ((e.clientX - rect.left) / rect.width) * 100
      let y = ((e.clientY - rect.top) / rect.width) * 100

      let card = {
        type: 'img',
        skin: randomSkins[Math.floor(Math.random() * randomSkins.length)],
        x: x - 5.75,
        y: y - 5.4,
        r: Math.random() * 30 - 15,
        d: 0
      }

      makeCard(card)
    })
  }

  let section5 = document.querySelector('#section5')

  if (section5) {
    let btn5 = document.querySelector('#btn5')
    let video5 = document.querySelector('#video5')
    let canvas5 = document.querySelector('#canvas5')
    let photo5 = document.querySelector('#photo5')
    let stream5 = null
    let started5 = false
    let captured5 = false

    let observer5 = new IntersectionObserver(
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

      let ctx = canvas5.getContext('2d')
      canvas5.width = video5.videoWidth
      canvas5.height = video5.videoHeight
      ctx.drawImage(video5, 0, 0, canvas5.width, canvas5.height)

      let data = canvas5.toDataURL('image/png')
      photo5.src = data
      photo5.style.display = 'block'
      video5.style.display = 'none'
      captured5 = true

      setTimeout(() => {
        section5.classList.add('done')
      }, 2000)
    }

    if (btn5) {
      btn5.addEventListener('click', async function () {
        if (!stream5) {
          await startCamera5()
          return
        }

        if (!captured5) {
          takePhoto5()
        }
      })
    }

    if (video5) {
      video5.addEventListener('click', function () {
        if (stream5 && !captured5) {
          takePhoto5()
        }
      })
    }
  }

  let manBtn = document.querySelector('#manBtn')
  let womanBtn = document.querySelector('#womanBtn')
  let section8 = document.querySelector('#section8')
  let resultImage8 = document.querySelector('#resultImage8')

  if (manBtn && womanBtn && section8 && resultImage8) {
    manBtn.addEventListener('click', function () {
      resultImage8.src = 'images/man_result.png'
      resultImage8.style.display = 'block'
      resultImage8.style.opacity = '1'
      section8.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })

    womanBtn.addEventListener('click', function () {
      resultImage8.src = 'images/woman_result.png'
      resultImage8.style.display = 'block'
      resultImage8.style.opacity = '1'
      section8.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  }

  let section6 = document.querySelector('.section-6')
  let swing6 = document.querySelector('#swing6')

  if (section6 && swing6) {
    let currentRotate = 0
    let targetRotate = 0

    section6.addEventListener('mousemove', function (e) {
      let rect = section6.getBoundingClientRect()
      let x = e.clientX - rect.left
      let centerX = rect.width / 2
      let percent = (x - centerX) / centerX
      targetRotate = percent * 8
    })

    section6.addEventListener('mouseleave', function () {
      targetRotate = 0
    })

    function animateSwing() {
      currentRotate += (targetRotate - currentRotate) * 0.08
      swing6.style.transform = `rotate(${currentRotate}deg)`
      requestAnimationFrame(animateSwing)
    }
    animateSwing()
  }
})

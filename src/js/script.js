import '@babel/polyfill'
import 'intersection-observer'

import IntersectionObserverAnimations from './intersection-observer/intersection-observer'

const ioa = new IntersectionObserverAnimations()
ioa.init()

const form = document.querySelector('.form')
const name = document.querySelector('#name')
const nav = document.querySelector('.navbar')
const email = document.querySelector('#email')
const msg = document.querySelector('#message')
const goTop = document.querySelector('.go-top')
const navLinks = document.querySelectorAll('nav li a')
const inputs = document.querySelectorAll('.form-input')
const displayMsg = document.querySelector('#display-msg')

// Scroll to top shizz
goTop.addEventListener('click', goToTop)

function goToTop() {
  window.scroll({ top: 0, left: 0, behavior: 'smooth' })
}

// Add click listener on nav links
Array.prototype.slice.call(navLinks).forEach(function (link) {
  link.addEventListener('click', handleNavClick)
})

// Handle nav link clicks
function handleNavClick(e) {
  const scrollTo = e.target.getAttribute('href')

  // Polyfill code for smooth scroll
  document.querySelector(scrollTo).scrollIntoView({
    behavior: 'smooth',
  })
}

// Listen for window scroll
window.addEventListener('scroll', handleScroll)
window.addEventListener('resize', handleScroll)

// Scroll handler
function handleScroll(e) {
  // Grab scroll position
  const scrollPos =
    this.scrollY || this.scrollTop || document.documentElement.scrollTop

  // Grab window width
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  // Show / hide go to top button
  if (scrollPos > 1000) {
    goTop.classList.add('show-go-top')
  } else {
    goTop.classList.remove('show-go-top')
  }

  // Early return if screen width is less than 925
  if (windowWidth < 925) {
    return setNavStyles('solid')
  }

  // Apply styles based on position
  if (scrollPos > 50) {
    setNavStyles('solid')
  } else {
    setNavStyles('transparent')
  }
}

function setNavStyles(style) {
  nav.classList.remove('navbar--solid')
  nav.classList.remove('navbar--transparent')

  nav.classList.add(`navbar--${style}`)
}

// Form input shizz
Array.prototype.slice.call(inputs).forEach(function (input) {
  input.addEventListener('focusout', handleInputAnimation)
})

// Form animations handler
function handleInputAnimation(e) {
  // Grab input value
  const val = e.target.value

  if (val) {
    e.target.classList.add('notEmpty')
  } else {
    e.target.classList.remove('notEmpty')
  }
}

// Form action shizz
form.addEventListener('submit', handleFormSubmit)

// Send form data to backend
function handleFormSubmit(e) {
  e.preventDefault()

  const data = {
    name: name.value,
    email: email.value,
    message: msg.value,
  }

  axios
    .post('https://node-sender.glitch.me/', data)
    .then(function (res) {
      displayData(res)

      if (res.data.success) {
        resetForm()
      }
    })
    .catch(function (err) {
      displayMsg.innerHTML =
        '<div class="msg error"><i class="far fa-times-circle"></i>' +
        err +
        '</div>'
    })
}

// Clear out form
function resetForm() {
  Array.prototype.slice.call(inputs).forEach(function (input) {
    input.classList.remove('notEmpty')
    input.value = ''
  })
}

// Display message shizz
displayMsg.addEventListener('click', hideDisplayMsg)

function hideDisplayMsg() {
  displayMsg.innerHTML = ''
}

function buildMessageTemplate(className, message) {
  return `<div class="msg ${className}"><i class="far fa-times-circle"></i><span>${message}</span></div>`
}

function displayData() {
  let className = res.data.success ? 'success' : 'error'
  buildMessageTemplate(className, res.data.error)
}

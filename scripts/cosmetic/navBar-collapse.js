const navLinks = document.querySelectorAll('.nav-item')
const menuToggle = document.getElementById('navbarSupportedContent')
const boostrapCollapse = new bootstrap.Collapse(menuToggle)

navLinks.forEach((link) => {
    link.addEventListener('click', () => { boostrapCollapse.toggle() })
})
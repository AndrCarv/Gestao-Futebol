var introduction = gsap.timeline({defaults: {duration: 3}});

/* Timeline */
introduction.from('#introduction-image', {x: '-100vw', ease: "elastic.out(1, 0.3)"})
introduction.add('unlockButton')
introduction.to('#introduction-image', {duration: 1, scale: 0.7, rotation: -10, y: '-100', ease: "power3.out"}, 'unlockButton')
introduction.to('#introduction-button', {duration: 0.5, opacity: 1, y: '-190', ease: "none"}, 'unlockButton')

/* Button effect */
const continueButton = document.querySelector('#introduction-button')

continueButton.addEventListener('click', () => {
    introduction.timeScale(2);
    introduction.reverse();
    setInterval(()=>{
        gsap.to('#introduction', {duration: 1, y: '-100vh', ease: "power2.out"})
        setInterval(() => { //Wait 1 second
            document.querySelector('body').style.overflow = 'visible'
            document.querySelector('#introduction').style.display = 'none'
        }, 1000)
    }, 2000)
})
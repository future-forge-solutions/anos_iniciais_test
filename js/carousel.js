document.addEventListener('DOMContentLoaded', function () {
    const carouselTrack = document.querySelector('.carousel-track');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    let currentIndex = 0;
    let dots = [];
    let validBanners = [];

    function checkImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    function loadBannersFromHTML() {
        const carouselElement = document.getElementById('bannerCarousel');
        const banners = [];

        // Obtener el contenido del atributo data-banners
        const bannersData = carouselElement.getAttribute('data-banners');
        console.log('Datos raw del atributo data-banners:', bannersData);

        if (bannersData) {
            // Dividir por líneas y procesar cada una
            const lines = bannersData.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            console.log('Líneas procesadas:', lines);
            console.log('Número total de líneas:', lines.length);

            lines.forEach((line, index) => {
                console.log(`Procesando línea ${index + 1}:`, line);

                // Parsear cada línea con formato "image:ruta/imagen.jpg link:https://enlace.com"
                const imageMatch = line.match(/image:([^\s]+)/);
                const linkMatch = line.match(/link:(.*)$/);

                console.log(`Línea ${index + 1} - imageMatch:`, imageMatch);
                console.log(`Línea ${index + 1} - linkMatch:`, linkMatch);

                if (imageMatch && imageMatch[1]) {
                    const imageUrl = imageMatch[1].trim();
                    const linkUrl = linkMatch && linkMatch[1] ? linkMatch[1].trim() : '';

                    banners.push({
                        image: imageUrl,
                        link: linkUrl
                    });
                    console.log(`Banner ${index + 1} agregado:`, { image: imageUrl, link: linkUrl });
                } else {
                    console.log(`Banner ${index + 1} NO agregado - no se encontró imagen válida`);
                }
            });
        }

        console.log('Banners finales cargados desde HTML:', banners);
        console.log('Número total de banners:', banners.length);
        return banners;
    }

    async function initCarousel() {
        const bannersFromHTML = loadBannersFromHTML();
        console.log('Banners antes de verificar imágenes:', bannersFromHTML.length);

        // Verificar que las imágenes existen
        const checks = await Promise.all(bannersFromHTML.map(banner => checkImage(banner.image)));
        console.log('Resultados de verificación de imágenes:', checks);

        // Mostrar qué imágenes fallan
        bannersFromHTML.forEach((banner, index) => {
            if (!checks[index]) {
                console.log(`❌ Imagen NO encontrada: ${banner.image}`);
            } else {
                console.log(`✅ Imagen encontrada: ${banner.image}`);
            }
        });

        validBanners = bannersFromHTML.filter((_, index) => checks[index]);
        console.log('Banners válidos después de verificar:', validBanners.length);

        carouselTrack.innerHTML = '';
        dotsContainer.innerHTML = '';
        dots = [];

        validBanners.forEach((banner, index) => {
            console.log(`Procesando banner ${index + 1}:`, banner);

            const slide = document.createElement('div');
            slide.className = 'carousel-slide';

            const img = document.createElement('img');
            img.src = banner.image;
            img.alt = `Banner ${index + 1}`;

            if (banner.link && banner.link !== '') {
                const anchor = document.createElement('a');
                anchor.href = banner.link;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
                anchor.className = 'carousel-link';
                anchor.appendChild(img);
                slide.appendChild(anchor);
                img.draggable = false;
                img.style.userSelect = 'none';
                img.style.cursor = 'pointer';
            } else {
                slide.appendChild(img);
            }

            carouselTrack.appendChild(slide);

            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
            dots.push(dot);
        });

        currentIndex = 0;
        updateCarousel();
    }

    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        if (!validBanners.length) return;
        currentIndex = (index + validBanners.length) % validBanners.length;
        updateCarousel();
    }

    function handleCarouselClick(e) {
        if (e.target.closest('a') || e.target.closest('.carousel-link')) return;
        if (e.target.tagName === 'IMG' && e.target.closest('a')) return;

        const dot = e.target.closest('.carousel-dot');
        if (dot) {
            const index = dots.indexOf(dot);
            if (index !== -1) goToSlide(index);
            return;
        }

        if (e.target.closest('.carousel-button.prev')) {
            e.preventDefault();
            goToSlide(currentIndex - 1);
            return;
        }

        if (e.target.closest('.carousel-button.next')) {
            e.preventDefault();
            goToSlide(currentIndex + 1);
            return;
        }
    }

    document.addEventListener('click', handleCarouselClick);

    if (!window.carouselInitialized) {
        initCarousel();
        window.carouselInitialized = true;
    }

    let slideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 2000);

    const carousel = document.querySelector('.carousel-container');
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 2000);
    });

    window.addEventListener('resize', updateCarousel);
});
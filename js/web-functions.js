document.addEventListener("DOMContentLoaded", function () {
    // Fungsi untuk menunggu elemen tersedia
    const waitForElement = (selector, callback, timeout = 5000) => {
        const start = Date.now();

        const checkExist = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - start < timeout) {
                requestAnimationFrame(checkExist);
            } else {
                console.error(`Elemen ${selector} tidak ditemukan dalam ${timeout}ms.`);
            }
        };

        checkExist();
    };

    // Tunggu hingga elemen .nav-items tersedia, lalu tambahkan event listener
    waitForElement(".nav-items", (navItems) => {
        navItems.addEventListener("click", function (event) {
            if (event.target.classList.contains("items")) {
                // Hapus class "items-active" dari semua elemen
                document.querySelectorAll(".nav-items .items").forEach(item => {
                    item.classList.remove("items-active");
                });

                // Tambahkan class "items-active" ke elemen yang diklik
                event.target.classList.add("items-active");

                const targetSection = document.getElementById(`${event.target.id}` + 'Section');
                if (targetSection) {
                    // console.log(targetSection)
                    targetSection.scrollIntoView({ behavior: "smooth" });
                } else {
                    console.error(`Section dengan ID ${targetSectionId} tidak ditemukan.`);
                }
            }
        });
    });

    waitForElement(".welcome-foot", (wfoot) => {
        if (wfoot) {
            wfoot.addEventListener('click', () => {
                const targetSection = document.getElementById("howSection");
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth" });
                } else {
                    console.error(`Section dengan ID "howSection" tidak ditemukan.`);
                }
            });
        } else {
            console.error(`Elemen dengan class "welcome-foot" tidak ditemukan.`);
        }
    });

    waitForElement(".feedback-contents", (fcontent) => {
        var nextUrl = "";
        const bullets = fcontent.querySelectorAll('.carousel-bullet');
        const prevButton = fcontent.querySelector('.carousel-button:first-child');
        const nextButton = fcontent.querySelector('.carousel-button:last-child');
        let activeIndex = 0;

        function updateActiveBullet(index) {
            bullets.forEach((bullet, i) => {
                if (i === index) {
                    bullet.classList.add('bullet-active');
                } else {
                    bullet.classList.remove('bullet-active');
                }
            });
        }

        prevButton.addEventListener('click', () => {
            activeIndex = (activeIndex - 1 + bullets.length) % bullets.length;
            updateActiveBullet(activeIndex);
        });

        nextButton.addEventListener('click', () => {
            activeIndex = (activeIndex + 1) % bullets.length;
            updateActiveBullet(activeIndex);
        });

        // Initialize active bullet
        updateActiveBullet(activeIndex);
    });


});
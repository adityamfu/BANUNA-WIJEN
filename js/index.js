import { set, ref, get } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js'
import {
    universalTakeData,
    database,
    generateRandomAlphanumeric,
    generateCurrentTime,
} from './data-controller.js'

const feedbackDetails = document.getElementById('feedbackDetails')
const feedBullets = document.getElementById('feedBullets')
const productsList = document.getElementById('productsList')
sessionStorage.clear()

async function setStoreDataUi() {
    const data = await universalTakeData('banunaStoreData')
    document.getElementById('NamaToko').innerHTML = data.storeName
    document.getElementById('HeadlineToko').innerHTML = data.headline
    document.getElementById('AlamatToko').innerHTML = data.storeAddress
    document.getElementById(
        'KontakNav',
    ).href = `https://wa.me/${data.storeMainContact}`
    document
        .getElementById('InstagramToko')
        .closest('a').href = `https://instagram.com/${data.storeIg}`
    document
        .getElementById('FacebookToko')
        .closest('a').href = `https://facebook.com/@${data.storeFb}`
    document
        .getElementById('WhatsappToko')
        .closest('a').href = `https://wa.me/${data.storeMainContact}`
    document.getElementById(
        'FootIG',
    ).href = `https://instagram.com/${data.storeIg}`
    document.getElementById(
        'FootFb',
    ).href = `https://facebook.com/@${data.storeFb}`
    document.getElementById(
        'FootWa',
    ).href = `https://wa.me/${data.storeMainContact}`
    document.getElementById('KontakIg').innerHTML = data.storeIg
    document.getElementById('KontakFb').innerHTML = data.storeFb
    document.getElementById('KontakWa').innerHTML = data.storeMainContact
}

async function displayFeedback() {
    try {
        const feedData = await universalTakeData('feedbacks')

        if (feedData && typeof feedData === 'object') {
            const feedbackKeys = Object.keys(feedData)
            const validFeedbackKeys = feedbackKeys.filter(
                (key) => feedData[key].status !== 'unchecked',
            ) //valid checking
            if (validFeedbackKeys.length === 0) {
                feedbackDetails.textContent = 'No valid feedback data available.'
                return
            }

            // Tambahkan bullets untuk setiap feedback yang valid
            feedBullets.innerHTML = validFeedbackKeys
                .map(() => '<div class="feedback-bullet"></div>')
                .join('')

            let currentIndex = 0

            const updateFeedback = () => {
                const feed = feedData[validFeedbackKeys[currentIndex]]

                // Update feedback display
                feedbackDetails.innerHTML = `
                    <div class="feedbackThing">
                        <div class="feedname"><b>${feed.feedbackName || 'Anonymous'
                    }</b></div>
                        <div class="feedText">${feed.feedbackText || 'No feedback provided.'
                    }</div>
                    </div>
                `

                // Highlight bullet yang sedang aktif
                const bullets = feedBullets.querySelectorAll('.feedback-bullet')
                bullets.forEach((bullet, index) => {
                    bullet.classList.toggle('active', index === currentIndex)
                })

                currentIndex = (currentIndex + 1) % validFeedbackKeys.length
            }

            updateFeedback() // Tampilkan feedback pertama langsung
            setInterval(updateFeedback, 3000) // Ganti feedback setiap 3 detik
        } else {
            feedbackDetails.textContent = 'No feedback data available.'
        }
    } catch (error) {
        console.error('Error fetching feedback data:', error)
        feedbackDetails.textContent = 'Error loading feedback data.'
    }
}

async function displayProducts() {
    try {
        const prodData = await universalTakeData('products')
        if (prodData && typeof prodData === 'object') {
            const productCards = Object.keys(prodData)
                .map((key) => {
                    const product = prodData[key]
                    return `
                <div class="Card">
                    <div class="card-image">
                        <img src="${product.productImage || './images/default.png'
                        }" alt="${product.productName}" />
                    </div>
                    <div class="Frame2812">
                        <div class="Frame2657">
                            <div class="WijenOriginal">${product.productName
                        }</div>
                            <div class="desc">
                                ${product.productDesc}
                            </div>
                        </div>
                        <div class="Frame2813">
                            <div class="productPrice">Rp${product.productPrice
                        }</div>
                            <div class="Btnbeli" id="${product.productId}">
                                <a class="Beli">Beli</a>
                            </div>
                        </div>
                    </div>
                </div>
                `
                })
                .join('')

            productsList.innerHTML = productCards

            // Add click event listener to each "Btnbeli"
            const buyButtons = document.querySelectorAll('.Btnbeli')
            buyButtons.forEach((button) => {
                button.addEventListener('click', (event) => {
                    const prodid = event.currentTarget.id
                    if (prodid !== "BeliSekarang") {
                        window.location.href = `./details.html?${prodid}`
                    } else {
                        document.getElementById("ToProdButton").click()
                    }
                })
            })
        } else {
            productsList.textContent = 'No products data available.'
        }
    } catch (error) {
        console.error('Error fetching products data:', error)
        productsList.textContent = 'Error loading products data.'
    }
}

setStoreDataUi()
displayFeedback()
displayProducts()

const style = document.createElement('style')
style.textContent = `
    .feedback-bullet.active {
        background-color: orange;
    }
`
document.head.appendChild(style)

document
    .getElementById('KirimFeedback')
    .addEventListener('click', async (e) => {
        Swal.fire({
            title: 'Masukkan Nama',
            input: 'text',
            inputPlaceholder: 'Nama Anda',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const rid = generateRandomAlphanumeric()
                const FData = {
                    feedbackId: rid,
                    feedbackName: result.value,
                    feedbackText: e.target.previousElementSibling.value,
                    status: 'unchecked',
                    dateCreated: generateCurrentTime(),
                }
                set(ref(database, `feedbacks/${rid}`), FData)
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                })
                e.target.previousElementSibling.value = ''
            }
        })
    })

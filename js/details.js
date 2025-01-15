import { generateRandomAlphanumeric } from './data-controller.js'
import { database } from './firebase-config.js'
import {
  ref,
  get,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js'

const prodid = window.location.href.split('?').at(1)
const namaProd = await get(ref(database, `products/${prodid}/productName`))
// Fungsi untuk menampilkan detail produk
async function displayProductDetails() {
  try {
    const prodName = document.getElementById('prodName')
    const prodImage = document.getElementById('prodImage')
    const prodDesc = document.getElementById('prodDesc')
    const prodPrice = document.getElementById('prodPrice')
    console.log('Looking for product: ' + prodid)

    const productData = await get(ref(database, `products/${prodid}`))

    if (productData.exists()) {
      const data = productData.val()
      prodName.textContent = data.productName || 'No name available'
      prodImage.src = data.productImage || './images/default.png' // Menampilkan gambar produk, default jika tidak ada
      prodImage.alt = productData.productName || 'Product Image'
      prodDesc.textContent = data.productDesc || 'No description available'
      prodPrice.textContent = `Rp${data.productPrice || '0'}`
    } else {
      document.body.innerHTML = '<h1>Product Not Found</h1>'
    }
  } catch (error) {
    console.error('Error fetching product data:', error)
    document.body.innerHTML = '<h1>Error loading product data</h1>'
  }
}

// Panggil fungsi untuk menampilkan detail produk
displayProductDetails()

const backButton = document.querySelector('.back-button-details')

backButton.addEventListener('click', () => {
  window.history.back()
})

const defaultActifRadio = document.querySelector('.checkbox-details')
defaultActifRadio.click()
defaultActifRadio.classList += ' active'

document.getElementById('backButton').addEventListener('click', (e) => {
  window.history.back()
})

function amountController() {
  const minusButton = document.querySelector('.minus-button-details')
  const plusButton = document.querySelector('.plus-button-details')
  const numberDisplay = document.querySelector('.number-display-details')

  let currentValue = parseInt(sessionStorage.getItem('amount')) || 1
  numberDisplay.value = currentValue

  const saveToSession = () => {
    sessionStorage.setItem('amount', currentValue)
  }

  numberDisplay.addEventListener('blur', () => {
    currentValue = parseInt(numberDisplay.value)
    if (isNaN(currentValue) || currentValue <= 0) {
      currentValue = 1
    }
    numberDisplay.value = currentValue
    saveToSession()
  })

  minusButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (currentValue > 1) {
      currentValue--
      numberDisplay.value = currentValue
      saveToSession()
    }
  })

  plusButton.addEventListener('click', (e) => {
    e.preventDefault()
    currentValue++
    numberDisplay.value = currentValue
    saveToSession()
  })
}
amountController()

if (sessionStorage.getItem('dataBeli')) {
  const lastData = JSON.parse(sessionStorage.getItem('dataBeli'))
  document.getElementById('namaPembeli').value = lastData.NamaPembeli
  document.getElementById('noPembeli').value = lastData.NomorPembeli
  document.getElementById('alamatPembeli').value = lastData.AlamatPembeli
}

function getActiveRadioValue() {
  const activeCheckbox = document.querySelector('.checkbox-details.active')
  if (activeCheckbox) {
    const radioInput = activeCheckbox
      .closest('.transaction-details')
      .querySelector('input[type="radio"]')
    if (radioInput) {
      return radioInput.value
    }
  }
  return null
}

const transactionDetails = document.querySelectorAll('.transaction-details')
transactionDetails.forEach((transaction) => {
  transaction.addEventListener('click', () => {
    const allCheckboxDetails = document.querySelectorAll('.checkbox-details')
    allCheckboxDetails.forEach((checkbox) =>
      checkbox.classList.remove('active'),
    )

    const checkboxDetails = transaction.querySelector('.checkbox-details')
    if (checkboxDetails) {
      checkboxDetails.classList.add('active')
    }

    const radioInput = transaction.querySelector('input[type="radio"]')
    if (radioInput) {
      radioInput.checked = true
    }
    const activeValue = getActiveRadioValue()
    console.log('Selected radio value:', activeValue)
  })
})

async function buatTransaksi() {
  const namaPembeli = document.getElementById('namaPembeli').value
  const noPembeli = document.getElementById('noPembeli').value
  const alamatPembeli = document.getElementById('alamatPembeli').value
  const modePembayaran = document.getElementById('modePembayaran').value
  const jumlahBeli = parseInt(sessionStorage.getItem('amount')) || 1
  const activeCheckbox = document.querySelector('.checkbox-details.active')
  const radioInput = activeCheckbox
    .closest('.transaction-details')
    .querySelector('input[type="radio"]').value
  const hargaBarang = await get(
    ref(database, `products/${prodid}/productPrice`),
  )
  const hargaBarangValue = hargaBarang.val().replace(/\./g, '')
  const finalBiaya = jumlahBeli * parseInt(hargaBarangValue)
  const formatRupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })

  const IdTransaksi = generateRandomAlphanumeric()

  const dataBeli = {
    IdBarang: prodid || ' ',
    IdTransaksi: IdTransaksi || ' ',
    NamaBarang: namaProd.val() || ' ',
    NamaPembeli: namaPembeli || '',
    NomorPembeli: noPembeli || '',
    AlamatPembeli: alamatPembeli || '',
    Pembayaran: modePembayaran || 'Silahkan Pilih!',
    JumlahBarang: jumlahBeli || 'Silahkan Isi!',
    JenisPengiriman: radioInput || 'Silahkan Pilih!',
    HargaBarang: formatRupiah.format(hargaBarangValue) || ' ',
    TotalBiaya: formatRupiah.format(finalBiaya) || ' ',
  }

  console.log(dataBeli)
  sessionStorage.setItem('dataBeli', JSON.stringify(dataBeli))
  window.location.href = `confirmation.html?${IdTransaksi}`
}

// const tombolKonfirmasi = document.getElementById('tombolKonfirmasi')
// tombolKonfirmasi.addEventListener('click', (e) => {
//   e.preventDefault()
//   buatTransaksi()
// })
document.getElementById('tombolKonfirmasi').addEventListener('click', (e) => {
  e.preventDefault() // Mencegah submit default

  const namaPembeli = document.getElementById('namaPembeli')
  const noPembeli = document.getElementById('noPembeli')
  const alamatPembeli = document.getElementById('alamatPembeli')
  const modePembayaran = document.getElementById('modePembayaran')
  const selectedRadio = document.querySelector(
    'input[name="transaction"]:checked',
  )

  let isValid = true

  // Fungsi untuk menampilkan atau menghapus pesan error
  const showError = (input, message) => {
    let error = input.nextElementSibling
    if (!error || !error.classList.contains('error-message')) {
      error = document.createElement('div')
      error.className = 'error-message'
      error.style.color = 'red'
      error.style.fontSize = '12px'
      error.style.marginTop = '5px'
      input.parentNode.appendChild(error)
    }
    error.textContent = message
    input.classList.add('error')
    isValid = false
  }

  const removeError = (input) => {
    const error = input.nextElementSibling
    if (error && error.classList.contains('error-message')) {
      input.parentNode.removeChild(error)
    }
    input.classList.remove('error')
  }

  // Validasi nama pembeli
  if (!namaPembeli.value.trim()) {
    showError(namaPembeli, 'Nama harus diisi.')
  } else {
    removeError(namaPembeli)
  }

  // Validasi nomor telepon
  if (!noPembeli.value.trim()) {
    showError(noPembeli, 'Nomor telepon harus diisi.')
  } else {
    removeError(noPembeli)
  }

  // Validasi metode pengiriman
  const transactionField = document.querySelector('.transaction-details')
  if (!selectedRadio) {
    showError(transactionField, 'Pilih salah satu metode pengiriman.')
  } else {
    removeError(transactionField)
  }

  // Validasi metode pembayaran
  if (!modePembayaran.value) {
    showError(modePembayaran, 'Pilih metode pembayaran.')
  } else {
    removeError(modePembayaran)
  }

  // Jika semua validasi lolos, lanjutkan proses pembelian
  if (isValid) {
    buatTransaksi()
  }
})

async function initializeProductDetails() {
  try {
    const prodPriceElement = document.getElementById('prodPrice')
    const jumlahBeliElement = document.getElementById('jumlahBeli')

    // Ambil data produk dari Firebase
    const productSnapshot = await get(ref(database, `products/${prodid}`))
    if (!productSnapshot.exists()) {
      console.error('Product not found!')
      document.body.innerHTML = '<h1>Product Not Found</h1>'
      return
    }

    const productData = productSnapshot.val()
    const hargaBarang = parseInt(
      productData.productPrice.replace(/\./g, ''),
      10,
    )

    // Format harga ke rupiah
    const formatRupiah = (value) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(value)

    // Inisialisasi jumlah beli
    let jumlahBeli = parseInt(jumlahBeliElement.value, 10) || 1
    prodPriceElement.textContent = formatRupiah(hargaBarang * jumlahBeli)

    // Fungsi untuk memperbarui harga secara langsung
    const updatePrice = () => {
      jumlahBeli = parseInt(jumlahBeliElement.value, 10) || 1
      if (jumlahBeli <= 0) jumlahBeli = 1 // Validasi nilai minimum
      prodPriceElement.textContent = formatRupiah(hargaBarang * jumlahBeli)
    }

    // Event listener untuk perubahan counter
    jumlahBeliElement.addEventListener('input', updatePrice)

    // Listener untuk tombol +/- pada counter
    document
      .querySelector('.minus-button-details')
      .addEventListener('click', () => {
        if (jumlahBeli > 1) {
          jumlahBeliElement.value = --jumlahBeli
          updatePrice()
        }
      })

    document
      .querySelector('.plus-button-details')
      .addEventListener('click', () => {
        jumlahBeliElement.value = ++jumlahBeli
        updatePrice()
      })
  } catch (error) {
    console.error('Error initializing product details:', error)
    document.body.innerHTML = '<h1>Error loading product data</h1>'
  }
}

// Panggil fungsi untuk inisialisasi
initializeProductDetails()

import { generateRandomAlphanumeric } from "./data-controller.js";
import { database } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const prodid = window.location.href.split('?').at(1);
const namaProd = await get(ref(database, `products/${prodid}/productName`));
// Fungsi untuk menampilkan detail produk
async function displayProductDetails() {
  try {
    
    const prodName = document.getElementById('prodName');
    const prodImage = document.getElementById('prodImage');
    const prodDesc = document.getElementById('prodDesc');
    const prodPrice = document.getElementById('prodPrice');
    console.log("Looking for product: " + prodid);

    const productData = await get(ref(database, `products/${prodid}`));

    if (productData.exists()) {
      const data = productData.val()
      prodName.textContent = data.productName || 'No name available';
      prodImage.src = data.productImage || './images/default.png'; // Menampilkan gambar produk, default jika tidak ada
      prodImage.alt = productData.productName || 'Product Image';
      prodDesc.textContent = data.productDesc || 'No description available';
      prodPrice.textContent = `Rp${data.productPrice || '0'}`;
    } else {
      document.body.innerHTML = '<h1>Product Not Found</h1>';
    }
  } catch (error) {
    console.error('Error fetching product data:', error);
    document.body.innerHTML = '<h1>Error loading product data</h1>';
  }
}

// Panggil fungsi untuk menampilkan detail produk
displayProductDetails();

const backButton = document.querySelector('.back-button-details');

backButton.addEventListener('click', () => {
  window.history.back();
});

const defaultActifRadio = document.querySelector('.checkbox-details');
defaultActifRadio.click();
defaultActifRadio.classList += " active";

document.getElementById("backButton").addEventListener('click', (e) => {
  window.history.back();
})

function amountController() {
  const minusButton = document.querySelector('.minus-button-details');
  const plusButton = document.querySelector('.plus-button-details');
  const numberDisplay = document.querySelector('.number-display-details');

  let currentValue = parseInt(sessionStorage.getItem('amount')) || 1;
  numberDisplay.value = currentValue;

  const saveToSession = () => {
    sessionStorage.setItem('amount', currentValue);
  };

  numberDisplay.addEventListener('blur', () => {
    currentValue = parseInt(numberDisplay.value);
    if (isNaN(currentValue) || currentValue <= 0) {
      currentValue = 1;
    }
    numberDisplay.value = currentValue;
    saveToSession();
  });

  minusButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentValue > 1) {
      currentValue--;
      numberDisplay.value = currentValue;
      saveToSession();
    }
  });

  plusButton.addEventListener('click', (e) => {
    e.preventDefault(); 
    currentValue++;
    numberDisplay.value = currentValue;
    saveToSession();
  });
}
amountController();

if(sessionStorage.getItem("dataBeli")){
  const lastData = JSON.parse(sessionStorage.getItem("dataBeli"));
  document.getElementById("namaPembeli").value = lastData.NamaPembeli;
  document.getElementById("noPembeli").value = lastData.NomorPembeli;
  document.getElementById("alamatPembeli").value = lastData.AlamatPembeli;
}


function getActiveRadioValue() {
  const activeCheckbox = document.querySelector('.checkbox-details.active');
  if (activeCheckbox) {
    const radioInput = activeCheckbox.closest('.transaction-details').querySelector('input[type="radio"]');
    if (radioInput) {
      return radioInput.value;
    }
  }
  return null;
}

const transactionDetails = document.querySelectorAll('.transaction-details');
transactionDetails.forEach(transaction => {
  transaction.addEventListener('click', () => {
    const allCheckboxDetails = document.querySelectorAll('.checkbox-details');
    allCheckboxDetails.forEach(checkbox => checkbox.classList.remove('active'));

    const checkboxDetails = transaction.querySelector('.checkbox-details');
    if (checkboxDetails) {
      checkboxDetails.classList.add('active');
    }

    const radioInput = transaction.querySelector('input[type="radio"]');
    if (radioInput) {
      radioInput.checked = true;
    }
    const activeValue = getActiveRadioValue();
    console.log('Selected radio value:', activeValue);
  });
});


async function buatTransaksi() {

  const namaPembeli = document.getElementById("namaPembeli").value;
  const noPembeli = document.getElementById("noPembeli").value;
  const alamatPembeli = document.getElementById("alamatPembeli").value;
  const modePembayaran = document.getElementById("modePembayaran").value;
  const jumlahBeli = parseInt(sessionStorage.getItem('amount')) || 1;
  const activeCheckbox = document.querySelector('.checkbox-details.active');
  const radioInput = activeCheckbox.closest('.transaction-details').querySelector('input[type="radio"]').value;
  const hargaBarang = await get(ref(database, `products/${prodid}/productPrice`));
  const hargaBarangValue = hargaBarang.val().replace(/\./g, '');
  const finalBiaya = jumlahBeli * parseInt(hargaBarangValue);
  const formatRupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  });

  const IdTransaksi = generateRandomAlphanumeric();
  
  const dataBeli = {
    "IdBarang": prodid || " ",
    "IdTransaksi": IdTransaksi || " ",
    "NamaBarang": namaProd.val() || " ",
    "NamaPembeli": namaPembeli || "Silahkan Isi!",
    "NomorPembeli": noPembeli || "Silahkan Isi!",
    "AlamatPembeli": alamatPembeli || "Silahkan Isi!",
    "Pembayaran": modePembayaran || "Silahkan Pilih!",
    "JumlahBarang": jumlahBeli || "Silahkan Isi!",
    "JenisPengiriman": radioInput || "Silahkan Pilih!",
    "HargaBarang": formatRupiah.format(hargaBarangValue) || " ",
    "TotalBiaya": formatRupiah.format(finalBiaya) || " "
  }

  console.log(dataBeli);
  sessionStorage.setItem("dataBeli", JSON.stringify(dataBeli));
  window.location.href = `confirmation.html?${IdTransaksi}`;
}

const tombolKonfirmasi = document.getElementById("tombolKonfirmasi")
tombolKonfirmasi.addEventListener('click', (e) => {
  e.preventDefault();
  buatTransaksi();
});

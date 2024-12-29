import { database } from './firebase-config.js';
import { ref, get, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
const DATABELI = JSON.parse(sessionStorage.getItem("dataBeli"));
const styleRecipt = `
    <style>
    .recipt {
      width: 450px;
      background-color: white;
      display: flex;
      flex-direction: column;
      padding: 1rem;
      position: absolute;
      z-index: -10;
      left: 35%;
    }

    .recipt .logoCase {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      background-color: yellow;
      border-bottom: 5px solid grey;
    }

    .recipt .logo {
      max-width: 80%;
      object-fit: contain;
    }

    .recipt .separator {
      border-bottom: 5px solid grey;
    }

    .recipt .address {
      padding: 3px 3px;
      margin: 0;
      font-size : 11px
    }

    .recipt .details {
      padding: 1rem;
    }

    .recipt .details .datas {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .recipt .datas .items {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .recipt .datas .items p:first-child {
      font-weight: bold;
    }

    .recipt h4,
    .recipt p {
      margin: 0;
      padding: 0;
    }
  </style>
`;

const RECIPT = `
    <div class="recipt" id="Recipt" style="border: 1px solid grey">
    <div class="logoCase">
      <img src="images/banunnalogo.png" alt="" class="logo">
    </div>
    <p class="address">Jl. Chairil Anwar Jl. Batu Besar No.47 29, Durian Payung, Kec. Tj. Karang Pusat, Kota Bandar Lampung, Lampung 35116</p>
    <div class="separator"></div>
    <div class="details">
      <br>
      <div class="datas">
        <div class="items">
          <p>ID Transaksi</p>
          <p id="IdTransaksi"></p>
        </div>
        <div class="items">
          <p>Tanggal Transaksi</p>
          <p id="TglTransaksi"></p>
        </div>
        <center><b>RINCIAN PEMESANAN</b></center>
        <div class="items">
          <p>Produk</p>
          <p id="NamaBarang"></p>
        </div>
        <div class="items">
          <p>Jumlah</p>
          <p id="JumlahBarang">Pisang</p>
        </div>
        <div class="items">
          <p>Harga</p>
          <p id="HargaBarang">Pisang</p>
        </div>
        <div class="items">
          <p>Total Biaya</p>
          <p id="TotalBiaya">Pisang</p>
        </div>
        <div class="items">
          <p>Pengiriman</p>
          <p id="Pengiriman">Pisang</p>
        </div>
        <div class="items">
          <p>Pembayaran Via</p>
          <p id="Pembayaran">Pisang</p>
        </div>
        <center><b>RINCIAN PEMBELI</b></center>
        <div class="items">
          <p>Nama</p>
          <p id="NamaPembeli">Pisang</p>
        </div>
        <div class="items">
          <p>Nomor</p>
          <p id="NomorPembeli">Pisang</p>
        </div>
        <div class="items">
          <p>Alamat</p>
          <p id="AlamatPembeli">.</p>
        </div>
      </div>

    </div>
  </div>
`

function dateMaker() {
    const currentDate = new Date();

    // Mengambil tanggal, bulan, tahun, jam, menit, dan detik
    const day = currentDate.getDate().toString().padStart(2, '0');  // DD
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');  // MM
    const year = currentDate.getFullYear();  // YYYY
    const hours = currentDate.getHours().toString().padStart(2, '0');  // HH
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');  // MM
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');  // SS

    // Membuat string dengan format yang diinginkan
    const formattedDateTime = `${day}:${month}:${year} | ${month}:${hours};${minutes}:${seconds}`;

    return formattedDateTime;

}

function simpanTransaksi(){
    const transactionData = {
        "IDTransaksi" : DATABELI.IdTransaksi,
        "IDBarang": DATABELI.IdBarang,
        "JumlahBarang": DATABELI.JumlahBarang,
        "TotalBiaya": DATABELI.TotalBiaya,
        "HargaBarang": DATABELI.HargaBarang,
        "AlamatPembeli": DATABELI.AlamatPembeli,
        "NomorPembeli": DATABELI.NomorPembeli,
        "NamaPembeli": DATABELI.NamaPembeli,
        "TanggalDibuat": `${dateMaker()}`,
        "JenisPembayaran": DATABELI.Pembayaran,
        "JenisPengiriman": DATABELI.JenisPengiriman,
        "NamaProduk": DATABELI.NamaBarang,
        "Status": "Belum Selesai",
        "GambarStruk": sessionStorage.getItem("BASE64"),
    };

    
    const dbRef = ref(database, `transactions/${DATABELI.IdTransaksi}`);

    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("Data ditemukan:", snapshot.val());
            set(ref(database, `transactions/${DATABELI.IdTransaksi}`), transactionData)
                .then(() => {
                    console.log("Data transaksi berhasil disimpan.");
                })
                .catch((error) => {
                    console.error("Terjadi kesalahan saat menyimpan data:", error);
                });
        } else {
            console.log("Data tidak ditemukan. Menyimpan data baru...");
            set(ref(database, `transactions/${DATABELI.IdTransaksi}`), transactionData)
                .then(() => {
                    console.log("Data transaksi berhasil disimpan.");
                })
                .catch((error) => {
                    console.error("Terjadi kesalahan saat menyimpan data:", error);
                });
        }
    }).catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data:", error);
    });
}

function BuatRecipt() {
    const DATABELI = JSON.parse(sessionStorage.getItem("dataBeli"));

    document.head.innerHTML += styleRecipt;
    document.getElementById("reciptcase").innerHTML += RECIPT;
    
    document.getElementById("IdTransaksi").innerHTML = DATABELI.IdTransaksi;
    document.getElementById("TglTransaksi").innerHTML = `${dateMaker()}`;
    document.getElementById("NamaBarang").innerHTML = DATABELI.NamaBarang;
    document.getElementById("JumlahBarang").innerHTML = DATABELI.JumlahBarang;
    document.getElementById("HargaBarang").innerHTML = DATABELI.HargaBarang;
    document.getElementById("TotalBiaya").innerHTML = DATABELI.TotalBiaya;
    document.getElementById("Pengiriman").innerHTML = DATABELI.JenisPengiriman;
    document.getElementById("Pembayaran").innerHTML = DATABELI.Pembayaran;
    document.getElementById("NamaPembeli").innerHTML = DATABELI.NamaPembeli;
    document.getElementById("NomorPembeli").innerHTML = DATABELI.NomorPembeli;
    document.getElementById("AlamatPembeli").innerHTML = DATABELI.AlamatPembeli;


    const targetElement = document.getElementById('Recipt');
    html2canvas(targetElement).then(canvas => {

        const imgURL = canvas.toDataURL('image/png');
        const imageBase64 = imgURL;

        const link = document.createElement('a');
        link.href = imgURL;
        link.download = 'Struk Pembelian.png';

        link.click();

        document.querySelector("#reciptcase .recipt").remove();
        document.querySelector("head style").remove();
        sessionStorage.setItem("BASE64", imageBase64);

    }).catch(error => {
        console.error('Error saat menangkap elemen:', error);
    });


}


async function lanjutKeWa(kode, kode2) {
    simpanTransaksi();
    const phoneNumber = await get(ref(database, 'banunaStoreData/storeMainContact'));
    console.log(phoneNumber.val());
    const message = `Konfirmasi Dan Pembayaran | kode transaksi : ${kode} | Total Biaya : ${kode2}`;
    const whatsappUrl = `https://wa.me/${phoneNumber.val()}?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl
}

if (sessionStorage.getItem("dataBeli")) {
    const transaction = JSON.parse(sessionStorage.getItem("dataBeli"));
    if (window.location.href.split('?').at(1) === transaction.IdTransaksi) {
        BuatRecipt();
        document.getElementById("UnduhRecipt").addEventListener('click', () => {
            BuatRecipt();
        });
        document.getElementById("LanjutWa").addEventListener('click', () => {
            lanjutKeWa(transaction.IdTransaksi, transaction.TotalBiaya);
        })
        document.getElementById("backButton").addEventListener('click', () => {
            window.history.back();
        })
        document.getElementById("BackButton").addEventListener('click', () => {
            window.history.back();
        })
    } else {
        document.body.innerHTML = "Maaf Tidak Ada Data Transaksi";
    }
} else {
    document.body.innerHTML = "Maaf Tidak Ada Data Transaksi";
}

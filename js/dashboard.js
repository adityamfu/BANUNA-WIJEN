import { database, generateRandomAlphanumeric, performLogin, specifiedTakeData, universalDataFunction, universalTakeData } from "./data-controller.js";
import { ref, get, set, runTransaction } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { auth, authLogout, checkLogin } from "./firebase-config.js";
if (!auth?.currentUser?.accessToken || auth?.currentUser?.accessToken != localStorage.getItem("token")) checkLogin();

const navDis = document.getElementById("navDis");
const toggleIcon = document.getElementById("toggle");
const navBar = document.getElementById("navBar");
const heading = document.getElementById("Heading");
const navLogo = document.getElementById("NavLogo");



async function prepareWebData() {
    const DATAWEB = await universalTakeData("banunaStoreData");
    document.querySelector("#NamaToko input").value = DATAWEB.storeName
    document.querySelector("#Deskripsi input").value = DATAWEB.headline
    document.querySelector("#Kontak input").value = DATAWEB.storeMainContact
    document.querySelector("#InstaG input").value = DATAWEB.storeIg
    document.querySelector("#FaceB input").value = DATAWEB.storeFb
    document.querySelector("#AlamatToko input").value = DATAWEB.storeAddress

    sessionStorage.setItem("DATAWEB", JSON.stringify(DATAWEB))
}


function batalUbahWeb() {
    const DATAWEB = JSON.parse(sessionStorage.getItem("DATAWEB"));

    const storeNameInput = document.querySelector("#NamaToko input").value;
    const headlineInput = document.querySelector("#Deskripsi input").value;
    const storeMainContactInput = document.querySelector("#Kontak input").value;
    const storeIgInput = document.querySelector("#InstaG input").value;
    const storeFbInput = document.querySelector("#FaceB input").value;
    const storeAddressInput = document.querySelector("#AlamatToko input").value;

    if (
        storeNameInput !== DATAWEB.storeName ||
        headlineInput !== DATAWEB.headline ||
        storeMainContactInput !== DATAWEB.storeMainContact ||
        storeIgInput !== DATAWEB.storeIg ||
        storeFbInput !== DATAWEB.storeFb ||
        storeAddressInput !== DATAWEB.storeAddress
    ) {
        Swal.fire({
            title: 'Anda Yakin Ingin Membatalkan?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                document.querySelector("#NamaToko input").value = DATAWEB.storeName;
                document.querySelector("#Deskripsi input").value = DATAWEB.headline;
                document.querySelector("#Kontak input").value = DATAWEB.storeMainContact;
                document.querySelector("#InstaG input").value = DATAWEB.storeIg;
                document.querySelector("#FaceB input").value = DATAWEB.storeFb;
                document.querySelector("#AlamatToko input").value = DATAWEB.storeAddress;

                console.log("Form telah dikembalikan ke nilai sebelumnya.");
            }
        });

    } else {
        console.log("Data tidak berubah");
    }
}

document.getElementById("BatalUbahWeb").addEventListener('click', () => {
    batalUbahWeb();
});
function kosongkanForm() {
    document.getElementById("IProdukId").value = "";
    document.getElementById("INamaProduk").value = "";
    document.getElementById("IDeskripsi").value = "";
    document.getElementById("IGambar").value = "";
    document.getElementById("IHarga").value = "";
    document.getElementById("IStok").value = "";
    document.getElementById("ITanggal").value = "";
}


function simpanUbahWeb() {
    const DATAWEB = JSON.parse(sessionStorage.getItem("DATAWEB")); // Ambil data dari sessionStorage

    const storeNameInput = document.querySelector("#NamaToko input").value;
    const headlineInput = document.querySelector("#Deskripsi input").value;
    const storeMainContactInput = document.querySelector("#Kontak input").value;
    const storeIgInput = document.querySelector("#InstaG input").value;
    const storeFbInput = document.querySelector("#FaceB input").value;
    const storeAddressInput = document.querySelector("#AlamatToko input").value;

    if (
        storeNameInput !== DATAWEB.storeName ||
        headlineInput !== DATAWEB.headline ||
        storeMainContactInput !== DATAWEB.storeMainContact ||
        storeIgInput !== DATAWEB.storeIg ||
        storeFbInput !== DATAWEB.storeFb ||
        storeAddressInput !== DATAWEB.storeAddress
    ) {
        const updatedData = {
            storeName: storeNameInput,
            headline: headlineInput,
            storeMainContact: storeMainContactInput,
            storeIg: storeIgInput,
            storeFb: storeFbInput,
            storeAddress: storeAddressInput
        };

        console.log("Data telah berubah. Memperbarui data di Firebase...");
        const storeDataRef = ref(database, 'banunaStoreData');
        runTransaction(storeDataRef, (currentData) => {
            if (currentData === null) {
                console.log("Data tidak ada, membuat data baru.");
                return updatedData;
            }

            currentData.storeName = updatedData.storeName;
            currentData.headline = updatedData.headline;
            currentData.storeMainContact = updatedData.storeMainContact;
            currentData.storeIg = updatedData.storeIg;
            currentData.storeFb = updatedData.storeFb;
            currentData.storeAddress = updatedData.storeAddress;

            return currentData;
        })
            .then(() => {
                Swal.fire({
                    title: 'Perubahan ',
                    text: "Perubahan Berhasil",
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ya'
                })
            })
            .catch((error) => {
                console.error("Terjadi kesalahan saat memperbarui data:", error);
            });

    } else {
        console.log("Data tidak berubah.");
    }
}

document.getElementById("SimpanUbahWeb").addEventListener('click', () => {
    simpanUbahWeb();
});


async function prepareProduct() {
    const DATAWEB = await universalTakeData("products");
    const products = Object.values(DATAWEB);
    let productHTML = "";

    products.forEach(element => {
        productHTML += `
        <div class="cards" id="cards-${element.productId}">
            <b>ID : ${element.productId}</b>
            <img src="${element.productImage}" alt="" id="GProduct">
            <b>${element.productName}</b>
            <div class="div">
                <i class="fa-solid fa-square-pen" id="${element.productId}"></i>
                <i class="fa-solid fa-trash" id="trash-${element.productId}"></i>
            </div>
        </div>
    `;
    });

    document.getElementById("Product").innerHTML = productHTML;

    document.querySelectorAll(".fa-square-pen").forEach(icon => {
        icon.addEventListener("click", async (event) => {
            document.getElementById("editCase").classList += " EDIT";
            const ids = event.srcElement.id;
            const itemData = await get(ref(database, `products/${ids}`));
            document.getElementById("editCase").style.display = "flex"
            console.log(itemData.val())

            document.getElementById("IProdukId").value = itemData.val().productId;
            document.getElementById("INamaProduk").value = itemData.val().productName;
            document.getElementById("IDeskripsi").value = itemData.val().productDesc;
            const IGambar = itemData.val().productImage;
            document.getElementById("IHarga").value = itemData.val().productPrice;
            document.getElementById("IStok").value = itemData.val().productStock;
            document.getElementById("ITanggal").value = itemData.val().dateCreated;
            sessionStorage.setItem("IGambar", IGambar);
            const imageContainer = document.getElementById("IGambar").closest(".eItems");

            if (imageContainer) {
                const existingLink = imageContainer.querySelector(".product-image-link");
                if (existingLink) existingLink.remove();

                const imageLink = document.createElement("b");
                imageLink.id = "CekGambar";
                imageLink.style.padding = "0"
                imageLink.href = IGambar
                imageLink.style.marginTop = "5px"
                imageLink.style.cursor = "pointer"
                imageLink.style.color = "blue"
                imageLink.textContent = "Lihat Gambar";
                imageLink.classList.add("product-image-link");

                imageLink.addEventListener("click", () => {
                    Swal.fire({
                        html: ` <img src="${IGambar}"> </img>  `
                    })
                })
                imageContainer.appendChild(imageLink);
            } else {
                console.error("Elemen .eItems tidak ditemukan!");
            }
        });
    });

    document.querySelector("#XEdit").addEventListener("click", (event) => {
        kosongkanForm();
        document.getElementById("editCase").style.display = "none"
        document.getElementById("editCase").className = "editCase"
    });

    document.querySelectorAll(".fa-trash").forEach(icon => {
        icon.addEventListener("click", (event) => {
            Swal.fire({
                title: 'Anda Yakin Ingin Menghapus?',
                text: "Anda Tidak Bisa Mengembalikannya!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    set(ref(database, `products/${event.srcElement.id.split('-')[1]}`), {})
                    prepareProduct();
                }
            });

        });
    });
    async function convert(fileInputId) {
        const inputElement = document.getElementById(fileInputId);
        const file = inputElement.files[0];

        if (!file) {
            throw new Error("Tidak ada file yang dipilih.");
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;

            reader.readAsDataURL(file);
        });
    }

    async function getBase64Image() {
        const base64img = await convert("IGambar");
        return base64img;
    }

    document.querySelectorAll("#SimpanEdit").forEach(icon => {
        icon.addEventListener("click", async (event) => {
            if (document.getElementById("editCase").classList.contains("TAMBAH")) {
                const DataToCreate = {
                    productId: document.getElementById("IProdukId").value,
                    productName: document.getElementById("INamaProduk").value,
                    productDesc: document.getElementById("IDeskripsi").value,
                    productImage: await getBase64Image(),
                    productPrice: document.getElementById("IHarga").value,
                    productStock: document.getElementById("IStok").value,
                    dateCreated: document.getElementById("ITanggal").value
                }
                set(ref(database, `products/${document.getElementById("IProdukId").value}`), DataToCreate)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Produk berhasil disimpan ke database!',
                            showConfirmButton: true,
                            timer: 1500
                        }).then((result) => {
                            if (result.isConfirmed) {
                                prepareProduct()
                                document.getElementById("editCase").classList.remove("TAMBAH")
                                kosongkanForm();
                                document.getElementById("editCase").style.display = "none"
                            }
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal menyimpan produk!',
                            text: `Error: ${error.message}`,
                            confirmButtonText: 'Ya'
                        })

                    });

            } else if (document.getElementById("editCase").classList.contains("EDIT")) {

                const DataToEdit = {
                    productId: document.getElementById("IProdukId").value,
                    productName: document.getElementById("INamaProduk").value,
                    productDesc: document.getElementById("IDeskripsi").value,
                    productImage: document.getElementById("IGambar").value ? await getBase64Image() : sessionStorage.getItem("IGambar"),
                    productPrice: document.getElementById("IHarga").value,
                    productStock: document.getElementById("IStok").value,
                    dateCreated: document.getElementById("ITanggal").value
                }

                set(ref(database, `products/${document.getElementById("IProdukId").value}`), DataToEdit)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Produk berhasil diubah!',
                            showConfirmButton: true,
                            timer: 1500
                        }).then((result) => {
                            if (result.isConfirmed) {
                                document.getElementById("editCase").classList.remove("EDIT")
                                kosongkanForm();
                                document.getElementById("editCase").style.display = "none"
                                prepareProduct()
                            }
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal menyimpan produk!',
                            text: `Error: ${error.message}`,
                            confirmButtonText: 'Ya'
                        })

                    });
            } else {
                Swal.fire({
                    title: 'Perubahan Akan Di Simpan',
                    text: "Anda Yakin?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Tidak',
                    confirmButtonText: 'Ya'
                }).then((result) => {
                    if (result.isConfirmed) {
                        document.getElementById("editCase").style.display = "none"
                    }
                });
            }

        });
    });
    document.querySelectorAll("#BatalEdit").forEach(icon => {
        icon.addEventListener("click", (event) => {
            Swal.fire({
                title: 'Perubahan Akan Di Batalkan',
                text: "Anda Yakin?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Tidak',
                confirmButtonText: 'Ya'
            }).then((result) => {
                if (result.isConfirmed) {
                    kosongkanForm();
                    document.getElementById("editCase").style.display = "none"
                }
            });

        });
    });

    document.querySelector("#OTambahData").addEventListener("click", (event) => {
        document.getElementById("editCase").style.display = "flex"
        document.getElementById("editCase").classList += " TAMBAH";
        document.getElementById("IProdukId").value = generateRandomAlphanumeric()
    });


}

async function prepareTransaction() {
    const caseT = document.getElementById("CaseTransaksi");
    const tSearch = caseT.querySelector(".tablename");
    caseT.innerHTML = "";
    caseT.appendChild(tSearch)
    const DataTransaksi = await universalTakeData("transactions");
    const DataTransaksiArray = Array.isArray(DataTransaksi) ? DataTransaksi : Object.values(DataTransaksi);

    if (DataTransaksiArray.length > 0) {
        DataTransaksiArray.forEach(transaction => {
            let TStatus = true;
            if (transaction.Status === "selesai") {
                TStatus = true;
            } else {
                TStatus = false
            }
            const transactionCard = `
                <div class="traCards" id="traCards-${transaction.IDTransaksi}" style="
                    border-left: ${TStatus ? "5px solid green" : "5px solid red"}
                ">
                    <div>
                        <b>ID Transaksi : </b>${transaction.IDTransaksi}
                    </div>
                    <div>
                        <b>Tanggal Masuk : </b>${transaction.TanggalDibuat}
                    </div>
                    <div>
                        <b>Status : </b>${transaction.Status}
                    </div>
                    <br>
                    <div>
                        <button class="TandaiSelesai" id="${transaction.IDTransaksi}" style="display: ${TStatus ? "none" : "inline-block"}">Tandai Selesai</button>
                        <button class="LihatStruk" data-struk-url="${transaction.GambarStruk}">Lihat Struk</button>
                        <button class="UnduhStruk" id="${transaction.IDTransaksi}" data-struk-url="${transaction.GambarStruk}">Unduh</button>
                    </div>
                </div>
            `;

            caseT.innerHTML += transactionCard;
        });

        const TandaiButtons = document.querySelectorAll(".TandaiSelesai");

        TandaiButtons.forEach(button => {
            button.addEventListener("click", async function () {
                const strukId = this.id;
                await universalDataFunction("update", "transactions", `${strukId}.Status`, "selesai");
                Swal.fire({
                    icon: 'success',
                    title: 'Transaksi berhasil ditandai sebagai selesai!',
                    showConfirmButton: true,
                    timer: 1500
                }).then(async (result) => {
                    if(result.isConfirmed){
                        await prepareTransaction();
                    }
                });
            });
        });

        const lihatStrukButtons = document.querySelectorAll(".LihatStruk");
        lihatStrukButtons.forEach(button => {
            button.addEventListener("click", function () {
                const urlStruk = this.getAttribute("data-struk-url");
                Swal.fire({
                    html: `<img src="${urlStruk}" alt="Struk" width="70%">`
                });
            });
        });

        const unduhStrukButtons = document.querySelectorAll(".UnduhStruk");
        unduhStrukButtons.forEach(button => {
            button.addEventListener("click", function () {
                const urlStruk = this.getAttribute("data-struk-url");
                const filename = this.id;
                const link = document.createElement("a");
                link.href = urlStruk;
                link.download = `${filename}.jpg`;

                link.click();
            });
        });
    } else {
        caseT.innerHTML = "<p>Tidak ada transaksi untuk ditampilkan.</p>";
    }
}

async function prepareUlasan() {
    const UlasanRaw = await universalTakeData("feedbacks");
    const Ulasan = Object.values(UlasanRaw);
    const UlasanCase = document.getElementById("Ulasan");

    Ulasan.forEach(element => {
        const isChecked = element.status === "checked" ? "Aktif" : "Non Aktif";

        UlasanCase.innerHTML += `
            <div class="UCard" id="ulasan-${element.feedbackId}">
                <div class="UHeading">
                    <b>Nama : ${element.feedbackName}</b>
                    <div>
                        <button class="lihatUlasan" id="Lihat-${element.feedbackId}">Lihat</button>
                        <button class="opsiUlasan" id="Opsi-${element.feedbackId}">${isChecked}</button>
                    </div>
                </div>
                <div class="UDetails" id="details-${element.feedbackId}" style="display: none">
                    <b>Tanggal : ${element.dateCreated}</b>
                    <b>Ulasan : </b>${element.feedbackText}
                </div>
            </div>
        `;
    });

    const lihatButtons = document.querySelectorAll(".lihatUlasan");
    lihatButtons.forEach(button => {
        button.addEventListener("click", function () {
            const feedbackId = this.id.split('-')[1];
            const detailsElement = document.getElementById(`details-${feedbackId}`);

            if (detailsElement.style.display === "none") {
                detailsElement.style.display = "flex";
                this.textContent = "Tutup";
            } else {
                detailsElement.style.display = "none";
                this.textContent = "Lihat";
            }
        });
    });

    const opsiButtons = document.querySelectorAll(".opsiUlasan");
    opsiButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const feedbackId = this.id.split('-')[1];
            const isChecked = await specifiedTakeData("feedbacks", feedbackId, "status");

            if (isChecked === "checked") {
                universalDataFunction("update", "feedbacks", `${feedbackId}.status`, "unchecked");
                Swal.fire({
                    icon: 'success',
                    title: 'Feedback Kini Tidak Di tampikan di web!',
                    showConfirmButton: true,
                    timer: 1500
                }).then(() => {
                    button.textContent = "Non Aktif"
                });
            } else {
                universalDataFunction("update", "feedbacks", `${feedbackId}.status`, "checked");
                Swal.fire({
                    icon: 'success',
                    title: 'Feedback Kini Di Tampikan di web!',
                    showConfirmButton: true,
                    timer: 1500
                }).then(() => {
                    button.textContent = "Aktif"
                });
            };

        });
    });

    function updateNavState() {
        if (window.innerWidth <= 768) {
            navDis.style.position = "absolute";
            navDis.style.zIndex = "2";
            navDis.style.width = "0";
            toggleIcon.className = "fa-solid fa-bars";
        } else {
            navDis.style.position = "";
            navDis.style.width = "17rem";
        }
    }

    function toggleNav() {
        if (window.innerWidth <= 768) {
            // Mobile view
            if (toggleIcon.classList.contains("fa-xmark")) {
                // Close the menu
                navDis.style.width = "0";
                navBar.style.display = "none";
                toggleIcon.className = "fa-solid fa-bars";
                heading.insertBefore(toggleIcon, heading.querySelector(".heading b"));
            } else {
                navDis.style.width = "100vw";
                navBar.style.display = "flex";
                navBar.style.width = "calc(100% - 2rem)";
                navBar.style.height = "100%";
                toggleIcon.className = "fa-solid fa-xmark";
                navLogo.appendChild(toggleIcon);
            }
        } else {
            navDis.style.position = "";
            if (toggleIcon.classList.contains("fa-xmark")) {
                navDis.style.width = "0";
                navBar.style.display = "none";
                toggleIcon.className = "fa-solid fa-bars";
            } else {
                navDis.style.width = "17rem";
                navBar.style.display = "flex";
                navBar.style.width = "calc(100% - 2rem)";
                navBar.style.height = "100%";
                toggleIcon.className = "fa-solid fa-xmark";
            }
        }
    }

    function pcari(val, data) {
        const searchValue = val.toLowerCase();
        data.forEach(element => {
            element.style.display = element.textContent.toLowerCase().includes(searchValue) ? "" : "none";
        });
    }

    document.querySelectorAll(".items").forEach(icon => {
        icon.addEventListener("click", () => {
            const sections = ["DataWeb", "TabelProduk", "Transaksi", "Ulasan", "Logout"];
            sections.forEach(section => {
                if (section !== "Logout") {
                    document.getElementById(section).style.display = "none";
                }
            });

            const sectionMap = {
                "DataWeb": () => document.getElementById("DataWeb").style.display = "",
                "TabelProduk": () => {
                    document.getElementById("TabelProduk").style.display = "";
                    addSearchListener("#SProduct input", ".cards");
                },
                "Transaksi": () => {
                    document.getElementById("Transaksi").style.display = "";
                    addSearchListener("#STransaksi input", ".traCards");
                },
                "Ulasan": () => {
                    document.getElementById("Ulasan").style.display = "";
                    addSearchListener("#SUlasan input", ".UCard");
                },
                "Logout": async () => {
                    universalDataFunction("update", "admin-login", auth.currentUser.uid, null)
                    authLogout()
                    Swal.fire({
                        icon: 'success',
                        title: 'Kamu Telah Keluar!',
                        showConfirmButton: true,
                        confirmButtonText: "Oke",
                        timer: 1500
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "index.html"
                            localStorage.removeItem("token");

                        } else {
                            window.location.href = "index.html"
                            localStorage.removeItem("token");
                        }

                    });

                }
            };

            Object.keys(sectionMap).forEach(key => {
                if (icon.classList.contains(key)) sectionMap[key]();
            });

            if (window.innerWidth <= 768) {
                navDis.style.width = "0";
                navBar.style.display = "none";
                toggleIcon.className = "fa-solid fa-bars";
                heading.insertBefore(toggleIcon, heading.querySelector(".heading b"));
            }
        });
    });

    function addSearchListener(inputSelector, targetSelector) {
        const input = document.querySelector(inputSelector);
        const elements = document.querySelectorAll(targetSelector);
        input.addEventListener("keyup", (e) => pcari(e.target.value, elements));
    }


    toggleIcon.addEventListener('click', toggleNav);
    window.addEventListener('resize', updateNavState);

    updateNavState();

}

prepareWebData();
prepareProduct();
prepareTransaction();
prepareUlasan();



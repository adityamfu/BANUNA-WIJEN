import { auth, authLogin, database } from "./firebase-config.js";
import { ref, get, set, update, remove, runTransaction } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

/**
 * Fungsi universal untuk melakukan operasi CRUD pada Firebase.
 * 
 * @param {string} operation - Jenis operasi yang akan dilakukan ("set", "update", "remove").
 * @param {string} model - Nama model (misalnya, "adminAccounts", "partners", dll).
 * @param {Array / single} fields - Daftar field yang akan diperbarui atau ditambahkan.
 * @param {Array / single} data - Daftar data yang akan disimpan di setiap field yang bersesuaian.
 *
 */
function universalDataFunction(operation, model, fields, data) {
    const dbRef = ref(database, `${model}`);

    // Pastikan fields dan data adalah array
    if (!Array.isArray(fields)) {
        fields = [fields];  // Jika field hanya satu, jadikan array
    }

    if (!Array.isArray(data)) {
        data = [data];  // Jika data hanya satu, jadikan array
    }

    if (operation === "update") {
        // Menggunakan runTransaction untuk memperbarui data
        runTransaction(dbRef, (currentData) => {
            if (currentData === null) {
                currentData = {}; // Jika data kosong, buat objek baru
            }

            // Gabungkan perubahan dari fields dan data
            fields.forEach((field, index) => {
                const fieldParts = field.split("."); // Pisahkan berdasarkan titik
                let temp = currentData;

                // Bangun objek bertingkat untuk update
                fieldParts.forEach((part, i) => {
                    if (i === fieldParts.length - 1) {
                        temp[part] = data[index]; // Set nilai akhir
                    } else {
                        temp[part] = temp[part] || {}; // Buat objek jika belum ada
                        temp = temp[part]; // Arahkan ke objek berikutnya
                    }
                });
            });

            // Kembalikan data yang sudah diperbarui
            return currentData;
        })
            .then(() => {
                console.log(`${model} updated successfully!`);
            })
            .catch((error) => {
                console.error(`Error updating ${model}:`, error);
            });
    }
}

async function specifiedTakeData(node, id, key) {
    try {
        // Jika key adalah array, ambil data untuk setiap key dalam array
        if (Array.isArray(key)) {
            const dbRef = ref(database, `${node}/${id}`);  // Path untuk mengambil seluruh data adminId
            const snapshot = await get(dbRef);  // Mengambil data asinkron
            if (snapshot.exists()) {
                let result = {};
                key.forEach(k => {
                    if (snapshot.val()[k] !== undefined) {
                        result[k] = snapshot.val()[k];  // Menyimpan key dan value di result
                    } else {
                        result[k] = null;  // Jika key tidak ada di data, set null
                    }
                });
                return result;  // Mengembalikan objek hasil key-value
            } else {
                return null;  // Jika data tidak ditemukan
            }
        } else {
            // Jika key hanya satu string, ambil nilai langsung dari path tersebut
            const dbRef = ref(database, `${node}/${id}/${key}`);  // Path untuk data yang diminta
            const snapshot = await get(dbRef);  // Mengambil data asinkron
            return snapshot.exists() ? snapshot.val() : null;  // Mengembalikan nilai atau null
        }
    } catch (error) {
        console.error("Error mengambil data:", error);
        return null;  // Mengembalikan null jika terjadi kesalahan
    }
}
// specifiedTakeData("banunaStoreData", "aboutStore", "aboutText") parameter yang tengah merupakan value statis, jika item banyak dan sejenis dan tidak di ketahui (misalnya: id1, id2, id3, etc maka memerlukan iterasi), lakukan seperti pada kode product di bawah ini.
// specifiedTakeData("products", "", "productName") maka hanya mengembalikan productName dari masing" product
// specifiedTakeData("products", "", ["productName", "productPrice", etc]) maka mengembalikan value sesuai yang di pilih dari masing" product
// specifiedTakeData("products", "productId1", "" / "productName" / ["productName", "productPrice", etc]) untuk mengambil semua, satu, banyak data dari productId1 saja

const universalTakeData = async (path) => {
    try {
        // Ganti titik (.) dengan garis miring (/), karena Firebase menggunakan path dengan slash
        const pathFirebase = path.replace(/\./g, "/");

        const dbRef = ref(database, pathFirebase);  // Mendapatkan reference path di Firebase
        const snapshot = await get(dbRef);  // Mengambil data secara asinkron

        // Mengembalikan data jika ada, atau null jika tidak ada
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error mengambil data:", error);
        return null;  // Mengembalikan null jika terjadi kesalahan
    }
}
// contoh penggunaan await universalTakeData("products"); berarti megambil semua data dari products
function generateRandomAlphanumeric(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

async function performLogin() {
    Swal.fire({
        title: 'Silahkan Login',
        customClass: {
            popup: 'swal-solid-background'
        },
        html: `
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
            <div style="display: flex; flex-direction: column; align-items: start; width: 100%;">
                <label for="input1" style="margin-bottom: 5px; font-size: 14px;">Admin ID</label>
                <input type="text" id="input1" placeholder="Masukkan Admin ID" 
                    style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box;">
            </div>
            <div style="display: flex; flex-direction: column; align-items: start; width: 100%;">
                <label for="input2" style="margin-bottom: 5px; font-size: 14px;">Password</label>
                <input type="password" id="input2" placeholder="Masukkan Password" 
                    style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box;">
            </div>
        </div>
    `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        preConfirm: () => {
            const input1 = document.getElementById('input1').value;
            const input2 = document.getElementById('input2').value;
            if (!input1 || !input2) {
                Swal.showValidationMessage('Semua kolom harus diisi!');
            }
            return { input1, input2 };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const isLogged = await authLogin(result.value.input1, result.value.input2)
            if (isLogged.success) {
                const token = isLogged.datauser._tokenResponse.idToken
                localStorage.setItem("token", token);
                set(ref(database, "admin-login"), { [isLogged.datauser.user.uid]: isLogged.datauser._tokenResponse.idToken })
                window.location.reload();
            } else {
                performLogin()
            }
        } else {
            performLogin()
        }
    });
}

export { universalDataFunction, performLogin, universalTakeData, specifiedTakeData,database, generateRandomAlphanumeric, generateCurrentTime };



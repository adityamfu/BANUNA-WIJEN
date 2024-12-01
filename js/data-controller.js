import { database } from "./firebase-config.js";
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

export { universalDataFunction, universalTakeData, specifiedTakeData, database };



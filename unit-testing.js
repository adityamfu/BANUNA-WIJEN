import { universalDataFunction, universalTakeData, database } from "./data-controller.js";
import { ref, get, set, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
const banun = "banuna";
const seedData = () => {
    const data = {
        adminAccounts: {
            adminId1: {
                adminEmail: "admin1@example.com",
                adminPassword: "hashed_password_1",
                adminName: "Admin One",
                adminLastLogin: "2024-11-30T12:00:00Z",
                adminActiveStatus: true,
                dateCreated: "2024-11-01T10:00:00Z"
            },
            adminId2: {
                adminEmail: "admin2@example.com",
                adminPassword: "hashed_password_2",
                adminName: "Admin Two",
                adminLastLogin: "2024-11-29T15:00:00Z",
                adminActiveStatus: false,
                dateCreated: "2024-11-05T09:30:00Z"
            }
        },
        adminLogs: {
            logsId1: {
                adminId: "adminId1",
                adminName: "Admin One",
                ipIdentity: "192.168.0.1",
                changes: "Updated product details",
                dateCreated: "2024-11-30T14:00:00Z"
            }
        },
        products: {
            productId1: {
                productName: "Banana",
                productDesc: "Fresh organic bananas.",
                productPrice: 1.5,
                productImages: ["image1.jpg", "image2.jpg"],
                productVideos: ["video1.mp4"],
                dateCreated: "2024-11-15T11:00:00Z"
            },
            productId2: {
                productName: "Apple",
                productDesc: "Crisp red apples.",
                productPrice: 2.0,
                productImages: ["apple1.jpg"],
                productVideos: [],
                dateCreated: "2024-11-20T09:00:00Z"
            }
        },
        testimonies: {
            testimoniId1: {
                testimoniImage: "testimoni1.jpg",
                dateCreated: "2024-11-25T18:00:00Z"
            }
        },
        feedbacks: {
            feedbackId1: {
                name: "user1",
                feedbackText: "Great product quality!",
                dateCreated: "2024-11-25T13:00:00Z"
            },
            feedbackId2: {
                name: "user2",
                feedbackText: "Fast delivery, very satisfied!",
                dateCreated: "2024-11-26T14:00:00Z"
            }
        },
        payments: {
            paymentId1: {
                paymentName: "Dana",
                paymentImageLogo: "dana_logo.jpg",
                paymentText: "Pembayaran Via Dana",
                dateCreated: "2024-11-01T08:00:00Z",
            },
            paymentId2: {
                paymentName: "Ovo",
                paymentImageLogo: "ovo_logo.jpg",
                paymentText: "Pembayaran Via Ovo",
                dateCreated: "2024-11-01T09:00:00Z",
            }
        },
        transactions: {
            transactionId1: {
                productId: "Bananana",
                buyerName: "John Doe",
                buyerEmail: "johndoe@example.com",
                buyerAddress: "123 Main Street",
                Quantity: 3,
                basePrice: 1.5,
                totalProductPrice: 4.5,
                servicePrice: 1.0,
                amountToPay: 5.5,
                paymentId: "paymentId1",
                recipeImage: "receipt1.jpg",
                dateCreated: "2024-11-29T16:00:00Z"

            },
        },
        partners: {
            partnerId1: {
                partnerName: "Supplier One",
                partnerEmail: "supplier1@example.com",
                partnerSocials: {
                    instagram: {
                        instaId: {
                            instagramUsername: "Banuna",
                            instagramUrl: "https://instagram.com/supplier"
                        }
                    },
                    facebook: {
                        facebookId: {
                            facebookUsername: "Banuna",
                            facebookUrl: "https://facebook.com/supplier"
                        }
                    },
                    youtube: {
                        youtubeId: {
                            youtubeUsername: "Banuna",
                            youtubeUrl: "https://youtube.com/supplier"
                        }
                    },
                    tiktok: {
                        tiktokId: {
                            tiktokUsername: "Banuna",
                            tiktokUrl: "https://tiktok.com/supplier"
                        }
                    }
                },
                partnerImage: "supplier1.jpg",
                partnerAddress: "123 Supplier Street",
                dateCreated: "2024-11-10T10:00:00Z"
            },
            partnerId2: {
                partnerName: "Supplier Two",
                partnerEmail: "supplier2@example.com",
                partnerSocials: {
                    instagram: {
                        instaId1: {
                            instagramUsername: "Banuna",
                            instagramUrl: "https://instagram.com/supplier"
                        }
                    },
                    facebook: {
                        facebookId1: {
                            facebookUsername: "Banuna",
                            facebookUrl: "https://facebook.com/supplier"
                        }
                    },
                    youtube: {
                        youtubeId1: {
                            youtubeUsername: "Banuna",
                            youtubeUrl: "https://youtube.com/supplier"
                        }
                    },
                    tiktok: {
                        tiktokId1: {
                            tiktokUsername: "Banuna",
                            tiktokUrl: "https://tiktok.com/supplier"
                        }
                    }
                },
                partnerImage: "supplier2.jpg",
                partnerAddress: "456 Partner Lane",
                dateCreated: "2024-11-20T10:00:00Z"
            }
        },
        banunaStoreData: {
            storeName: "Banuna Store",
            headline: "Your one-stop fruit shop!",
            description: "We provide the freshest fruits to your doorstep.",
            homeImage: "home.jpg",
            storeAddress: "789 Market Street",
            storeSocials: {
                instagram: {
                    instaId1: {
                        instagramUsername: "Banuna",
                        instagramUrl: "https://instagram.com/supplier"
                    }
                },
                facebook: {
                    facebookId1: {
                        facebookUsername: "Banuna",
                        facebookUrl: "https://facebook.com/supplier"
                    }
                },
                youtube: {
                    youtubeId1: {
                        youtubeUsername: "Banuna",
                        youtubeUrl: "https://youtube.com/supplier"
                    }
                },
                tiktok: {
                    tiktokId1: {
                        tiktokUsername: "Banuna",
                        tiktokUrl: "https://tiktok.com/supplier"
                    }
                }
            },
            storeEmail: "contact@banunastore.com",
            storeContacts: {
                adminName1: "+123456789",
                adminName2: "+987654321"
            },
            storeMainContact: "+123456789",
            aboutStore: {
                aboutTexts: {
                    text1 : "Freshness guaranteed",
                    text2 : "Organic products"
                },
                aboutImages: {
                    aboutImage1: {
                        imageUrl: "about1.jpg",
                        imageDesc: "descAbout1"
                    },
                    aboutImage2: {
                        imageUrl: "about2.jpg",
                        imageDesc: "descAbout2"
                    }
                },
                aboutVideos: {
                    aboutVideo1: {
                        videoUrl: "about1.mp4",
                        videoDesc: "descAbout1"
                    },
                    aboutVideo2: {
                        videoUrl: "about2.mpv",
                        videoDesc: "descAbout2"
                    }
                }
            },
        }
    };


    set(ref(database, 'adminAccounts'), data.adminAccounts)
        .then(() => console.log("Admin accounts data successfully seeded!"))
        .catch((error) => console.error("Error seeding admin accounts:", error));

    set(ref(database, 'adminLogs'), data.adminLogs)
        .then(() => console.log("Admin logs data successfully seeded!"))
        .catch((error) => console.error("Error seeding admin logs:", error));

    set(ref(database, 'products'), data.products)
        .then(() => console.log("Products data successfully seeded!"))
        .catch((error) => console.error("Error seeding products:", error));

    set(ref(database, 'testimonies'), data.testimonies)
        .then(() => console.log("Testimonies data successfully seeded!"))
        .catch((error) => console.error("Error seeding testimonies:", error));

    set(ref(database, 'feedbacks'), data.feedbacks)
        .then(() => console.log("Feedbacks data successfully seeded!"))
        .catch((error) => console.error("Error seeding feedbacks:", error));

    set(ref(database, 'payments'), data.payments)
        .then(() => console.log("Payments data successfully seeded!"))
        .catch((error) => console.error("Error seeding payments:", error));

    set(ref(database, 'transactions'), data.transactions)
        .then(() => console.log("Transactions data successfully seeded!"))
        .catch((error) => console.error("Error seeding transactions:", error));

    set(ref(database, 'partners'), data.partners)
        .then(() => console.log("Partners data successfully seeded!"))
        .catch((error) => console.error("Error seeding partners:", error));

    set(ref(database, 'banunaStoreData'), data.banunaStoreData)
        .then(() => console.log("Banuna store data successfully seeded!"))
        .catch((error) => console.error("Error seeding banuna store data:", error));
};

const clearDatabase = () => {
    remove(ref(database)) // Remove all data at the root
        .then(() => {
            console.log("Database cleared successfully!");
        })
        .catch((error) => {
            console.error("Error clearing database:", error);
        });
};

document.getElementById("seedDatabase").addEventListener('click', () => {
    seedData();
});
document.getElementById("clearDatabase").addEventListener('click', () => {
    clearDatabase();
});


// Contoh pemanggilan dengan hanya satu field dan data dan banyak field banyak data
document.getElementById("testUpdate").addEventListener('click', () => {
    universalDataFunction(
        "update",
        "adminAccounts",
        [
            "adminId1.adminName",
            "adminId1.adminActiveStatus",
            "adminId2.adminActiveStatus"
        ],
        [
            "ahlil",
            "true",
            "true"
        ]
    );
    universalDataFunction(
        "update",
        "banunaStoreData",
        "description",
        "test"
    )
    universalDataFunction(
        "update",
        "feedbacks",
        "feedbackId1.name",
        "nice product",
    )
});


document.getElementById("takeData").addEventListener('click', async () => {
    const data = await universalTakeData("adminAccounts");
    if (data) {
        console.log(data);
        console.log(data.adminId1);
    }
});

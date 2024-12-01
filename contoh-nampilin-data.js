import "./firebase-config.js";
import { universalDataFunction, universalTakeData, specifiedTakeData, database } from "./data-controller.js";

const sections = [
    "welcomeSection",
    "productSection",
    "partnerSection",
    "testimoniesSection",
    "aboutSection",
    "footerSection"
];

async function fetchLandingPageData() {
    const landingPageData = {};

    // Mengambil data untuk setiap section
    landingPageData[sections[0]] = await specifiedTakeData("banunaStoreData", "", [
        "storeName",
        "headline",
        "description",
        "homeImage"
    ]);

    landingPageData[sections[1]] = await universalTakeData("products");
    landingPageData[sections[2]] = await universalTakeData("partners");
    landingPageData[sections[3]] = await universalTakeData("testimonies");

    landingPageData[sections[4]] = {
        ...await specifiedTakeData("banunaStoreData", "aboutStore", [
            "aboutTexts",
            "aboutImages",
            "aboutVideos"
        ]),
        storeName: landingPageData[sections[0]].storeName // Menambahkan storeName ke aboutSection
    };

    landingPageData[sections[5]] = {
        storeSocial: await specifiedTakeData("banunaStoreData", "storeSocials", [
            "facebook",
            "instagram",
            "tiktok",
            "youtube"
        ]),
        storeMainContact: await specifiedTakeData("banunaStoreData", "", "storeMainContact"),
        storeAddress: await specifiedTakeData("banunaStoreData", "", "storeAddress"),
        description: landingPageData[sections[0]].description
    };

    return landingPageData;
}

// Mengambil dan mencetak data
fetchLandingPageData()
    .then((landingPageData) => {
        // Menampilkan data Welcome Section
        const welcomeSection = landingPageData.welcomeSection;
        document.body.innerHTML += `
            <section id="welcomeSection">
                <h1>${welcomeSection.storeName}</h1>
                <p>${welcomeSection.headline}</p>
                <p>${welcomeSection.description}</p>
                <img src="${welcomeSection.homeImage}" alt="${welcomeSection.storeName}">
            </section>
        `;

        // Menampilkan data Product Section
        const productSection = landingPageData.productSection;
        Object.entries(productSection).forEach(([productId, product]) => {
            document.body.innerHTML += `
                <section id="${productId}">
                    <h2>${product.productName}</h2>
                    <p>${product.productDesc}</p>
                    <p>Price: $${product.productPrice}</p>
                    <img src="${product.productImages[0]}" alt="${product.productName}">
                </section>
            `;
        });

        // Menampilkan data Partner Section
        const partnerSection = landingPageData.partnerSection;
        Object.entries(partnerSection).forEach(([partnerId, partner]) => {
            document.body.innerHTML += `
                <section id="${partnerId}">
                    <h3>${partner.partnerName}</h3>
                    <p>Address: ${partner.partnerAddress}</p>
                    <p>Email: ${partner.partnerEmail}</p>
                    <img src="${partner.partnerImage}" alt="${partner.partnerName}">
                    <div>
                        <h4>Socials:</h4>
                        ${Object.entries(partner.partnerSocials).map(([socialKey, social]) => {
                            return Object.entries(social).map(([platform, details]) => {
                                return `
                                    <p>${platform.charAt(0).toUpperCase() + platform.slice(1)}:
                                        <a href="${details[`${platform}Url`]}">${details[`${platform}Username`]}</a>
                                    </p>
                                `;
                            }).join('');
                        }).join('')}
                    </div>
                </section>
            `;
        });

        // Menampilkan data Testimonies Section
        const testimoniesSection = landingPageData.testimoniesSection;
        Object.entries(testimoniesSection).forEach(([testimoniId, testimony]) => {
            document.body.innerHTML += `
                <section id="${testimoniId}">
                    <img src="${testimony.testimoniImage}" alt="Testimony">
                </section>
            `;
        });

        // Menampilkan data About Section
        const aboutSection = landingPageData.aboutSection;
        document.body.innerHTML += `
            <section id="aboutSection">
                <h3>About Us</h3>
                <div>
                    <h4>About Texts:</h4>
                    <p>${aboutSection.aboutTexts.text1}</p>
                    <p>${aboutSection.aboutTexts.text2}</p>
                </div>
                <div>
                    <h4>About Images:</h4>
                    ${Object.entries(aboutSection.aboutImages).map(([imageKey, image]) => {
                        return `
                            <div>
                                <p>${image.imageDesc}</p>
                                <img src="${image.imageUrl}" alt="${image.imageDesc}">
                            </div>
                        `;
                    }).join('')}
                </div>
                <div>
                    <h4>About Videos:</h4>
                    ${Object.entries(aboutSection.aboutVideos).map(([videoKey, video]) => {
                        return `
                            <div>
                                <p>${video.videoDesc}</p>
                                <video controls>
                                    <source src="${video.videoUrl}" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>
        `;

        // Menampilkan data Footer Section
        const footerSection = landingPageData.footerSection;
        document.body.innerHTML += `
            <section id="footerSection">
                <h4>Contact Info:</h4>
                <p>Main Contact: ${footerSection.storeMainContact}</p>
                <p>Address: ${footerSection.storeAddress}</p>
                <p>Description: ${footerSection.description}</p>
                <div>
                    <h4>Social Media:</h4>
                    ${Object.entries(footerSection.storeSocial).map(([socialKey, social]) => {
                        return Object.entries(social).map(([platform, details]) => {
                            return `
                                <p>${platform.charAt(0).toUpperCase() + platform.slice(1)}:
                                    <a href="${details[`${platform}Url`]}">${details[`${platform}Username`]}</a>
                                </p>
                            `;
                        }).join('');
                    }).join('')}
                </div>
            </section>
        `;
    })
    .catch((error) => {
        console.error("Error fetching landing page data:", error);
    });


// document.body.innerHTML += `<pre>${JSON.stringify(landingPageData, null, 2)}</pre>`;
// struktur data dari model landingpagedata
// penggunaan menggunakan separator titik (.) misal landingPageData.welcomeSection.storeName
// jika field merupakan object maka harus menggunakan looping, misal 
// {
//   "welcomeSection": {
//     "storeName": "Banuna Store",
//     "headline": "Your one-stop fruit shop!",
//     "description": "We provide the freshest fruits to your doorstep.",
//     "homeImage": "home.jpg"
//   },
//   "productSection": {
//     "productId1": {
//       "dateCreated": "2024-11-15T11:00:00Z",
//       "productDesc": "Fresh organic bananas.",
//       "productImages": [
//         "image1.jpg",
//         "image2.jpg"
//       ],
//       "productName": "Banana",
//       "productPrice": 1.5,
//       "productVideos": [
//         "video1.mp4"
//       ]
//     },
//     "productId2": {
//       "dateCreated": "2024-11-20T09:00:00Z",
//       "productDesc": "Crisp red apples.",
//       "productImages": [
//         "apple1.jpg"
//       ],
//       "productName": "Apple",
//       "productPrice": 2
//     }
//   },
//   "partnerSection": {
//     "partnerId1": {
//       "dateCreated": "2024-11-10T10:00:00Z",
//       "partnerAddress": "123 Supplier Street",
//       "partnerEmail": "supplier1@example.com",
//       "partnerImage": "supplier1.jpg",
//       "partnerName": "Supplier One",
//       "partnerSocials": {
//         "facebook": {
//           "facebookId": {
//             "facebookUrl": "https://facebook.com/supplier",
//             "facebookUsername": "Banuna"
//           }
//         },
//         "instagram": {
//           "instaId": {
//             "instagramUrl": "https://instagram.com/supplier",
//             "instagramUsername": "Banuna"
//           }
//         },
//         "tiktok": {
//           "tiktokId": {
//             "tiktokUrl": "https://tiktok.com/supplier",
//             "tiktokUsername": "Banuna"
//           }
//         },
//         "youtube": {
//           "youtubeId": {
//             "youtubeUrl": "https://youtube.com/supplier",
//             "youtubeUsername": "Banuna"
//           }
//         }
//       }
//     },
//     "partnerId2": {
//       "dateCreated": "2024-11-20T10:00:00Z",
//       "partnerAddress": "456 Partner Lane",
//       "partnerEmail": "supplier2@example.com",
//       "partnerImage": "supplier2.jpg",
//       "partnerName": "Supplier Two",
//       "partnerSocials": {
//         "facebook": {
//           "facebookId1": {
//             "facebookUrl": "https://facebook.com/supplier",
//             "facebookUsername": "Banuna"
//           }
//         },
//         "instagram": {
//           "instaId1": {
//             "instagramUrl": "https://instagram.com/supplier",
//             "instagramUsername": "Banuna"
//           }
//         },
//         "tiktok": {
//           "tiktokId1": {
//             "tiktokUrl": "https://tiktok.com/supplier",
//             "tiktokUsername": "Banuna"
//           }
//         },
//         "youtube": {
//           "youtubeId1": {
//             "youtubeUrl": "https://youtube.com/supplier",
//             "youtubeUsername": "Banuna"
//           }
//         }
//       }
//     }
//   },
//   "testimoniesSection": {
//     "testimoniId1": {
//       "dateCreated": "2024-11-25T18:00:00Z",
//       "testimoniImage": "testimoni1.jpg"
//     }
//   },
//   "aboutSection": {
//     "aboutTexts": {
//       "text1": "Freshness guaranteed",
//       "text2": "Organic products"
//     },
//     "aboutImages": {
//       "aboutImage1": {
//         "imageDesc": "descAbout1",
//         "imageUrl": "about1.jpg"
//       },
//       "aboutImage2": {
//         "imageDesc": "descAbout2",
//         "imageUrl": "about2.jpg"
//       }
//     },
//     "aboutVideos": {
//       "aboutVideo1": {
//         "videoDesc": "descAbout1",
//         "videoUrl": "about1.mp4"
//       },
//       "aboutVideo2": {
//         "videoDesc": "descAbout2",
//         "videoUrl": "about2.mpv"
//       }
//     },
//     "storeName": "Banuna Store"
//   },
//   "footerSection": {
//     "storeSocial": {
//       "facebook": {
//         "facebookId1": {
//           "facebookUrl": "https://facebook.com/supplier",
//           "facebookUsername": "Banuna"
//         }
//       },
//       "instagram": {
//         "instaId1": {
//           "instagramUrl": "https://instagram.com/supplier",
//           "instagramUsername": "Banuna"
//         }
//       },
//       "tiktok": {
//         "tiktokId1": {
//           "tiktokUrl": "https://tiktok.com/supplier",
//           "tiktokUsername": "Banuna"
//         }
//       },
//       "youtube": {
//         "youtubeId1": {
//           "youtubeUrl": "https://youtube.com/supplier",
//           "youtubeUsername": "Banuna"
//         }
//       }
//     },
//     "storeMainContact": "+123456789",
//     "storeAddress": "789 Market Street",
//     "description": "We provide the freshest fruits to your doorstep."
//   }
// }
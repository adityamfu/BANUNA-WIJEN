import { fetchLandingPageData } from "./data-model.js";
// contoh 1
fetchLandingPageData()
    .then((landingPageData) => {
        const sections = [
            { 
                id: 'welcomeSection', 
                background: 'red', 
                title: 'WELCOME', 
                content: `
                    <h1>${landingPageData.welcomeSection.storeName}</h1>
                    <p>${landingPageData.welcomeSection.headline}</p>
                    <p>${landingPageData.welcomeSection.description}</p>
                    <img src="${landingPageData.welcomeSection.homeImage}" alt="${landingPageData.welcomeSection.storeName}">
                `
            },
            { 
                id: 'productSection', 
                background: 'green', 
                title: 'PRODUCT', 
                content: Object.entries(landingPageData.productSection).map(([productId, product]) => `
                    <div id="${productId}">
                        <h4>${product.productName}</h4>
                        <p>${product.productDesc}</p>
                        <p>Price: $${product.productPrice}</p>
                        <img src="${product.productImages[0]}" alt="${product.productName}">
                    </div>
                `).join('')
            },
            { 
                id: 'partnerSection', 
                background: 'orange', 
                title: 'PARTNERS', 
                content: Object.entries(landingPageData.partnerSection).map(([partnerId, partner]) => `
                    <div id="${partnerId}">
                        <h4>${partner.partnerName}</h4>
                        <p>${partner.partnerDesc}</p>
                        <p>Address: ${partner.partnerAddress}</p>
                        <p>Email: ${partner.partnerEmail}</p>
                        <img src="${partner.partnerImage}" alt="${partner.partnerName}">
                        <div>
                            <h4>Social Media:</h4>
                            ${Object.entries(partner.partnerSocials).map(([platform, social]) => {
                                // Iterasi kedua untuk mengambil detail platform sosial
                                return Object.entries(social).map(([platformId, details]) => {
                                    return `
                                        <p>
                                            ${platform.charAt(0).toUpperCase() + platform.slice(1)}:
                                            <a href="${details[`${platform}Url`]}">${details[`${platform}Username`]}</a>
                                        </p>
                                    `;
                                }).join('');
                            }).join('')}
                        </div>
                    </div>
                `).join('')
            },
            { 
                id: 'testimoniesSection', 
                background: 'yellow', 
                title: 'TESTIMONIALS', 
                content: `
                    <div>
                        ${Object.entries(landingPageData.testimoniesSection.testimonies).map(([testimoniId, testimony]) => `
                            <div id="${testimoniId}">
                                <img src="${testimony.testimoniImage}" alt="Testimonial Image" style="width: 100px; height: 100px;"/>
                                <p>Testimonial #${testimoniId}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div>
                        ${Object.entries(landingPageData.testimoniesSection.feedbacks).map(([feedbackId, feedback]) => `
                            <div id="${feedbackId}">
                                <h5>Feedback from ${feedback.feedbackName}</h5>
                                <p>${feedback.feedbackText}</p>
                            </div>
                        `).join('')}
                    </div>
                `
            },
            { 
                id: 'aboutSection', 
                background: 'green', 
                title: 'ABOUT US', 
                content: `
                    <h4>About Texts:</h4>
                    <p>${landingPageData.aboutSection.aboutTexts.text1}</p>
                    <p>${landingPageData.aboutSection.aboutTexts.text2}</p>
                    <h4>About Images:</h4>
                    ${Object.entries(landingPageData.aboutSection.aboutImages).map(([imageId, image]) => `
                        <div>
                            <p>${image.imageDesc}</p>
                            <img src="${image.imageUrl}" alt="${image.imageDesc}">
                        </div>
                    `).join('')}
                    <h4>About Videos:</h4>
                    ${Object.entries(landingPageData.aboutSection.aboutVideos).map(([videoId, video]) => `
                        <div>
                            <p>${video.videoDesc}</p>
                            <video controls>
                                <source src="${video.videoUrl}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    `).join('')}
                `
            },
            { 
                id: 'footerSection', 
                background: 'red', 
                title: 'FOOTER', 
                content: `
                    <p>Description: ${landingPageData.footerSection.description}</p>
                    <h4>Contact Info:</h4>
                    <p>Main Contact: ${landingPageData.footerSection.storeMainContact}</p>
                    <p>Address: ${landingPageData.footerSection.storeAddress}</p>
                    <h4>Social Media:</h4>
                    ${Object.entries(landingPageData.footerSection.storeSocials).map(([platform, social]) => {
                        // Iterasi kedua untuk mengambil detail platform sosial
                        return Object.entries(social).map(([platformId, details]) => {
                            return `
                                <p>
                                    ${platform.charAt(0).toUpperCase() + platform.slice(1)}:
                                    <a href="${details[`${platform}Url`]}">${details[`${platform}Username`]}</a>
                                </p>
                            `;
                        }).join('');
                    }).join('')}
                `
            }
        ];

        // Looping over sections
        sections.forEach(section => {
            document.body.innerHTML += `
                <section id="${section.id}" style="background-color: ${section.background};">
                    <h3>${section.title}</h3>
                    ${section.content}
                </section>
            `;
        });
    })
    .catch((error) => {
        console.error("Error fetching landing page data:", error);
    });



// contoh 2
// fetchLandingPageData()
//     .then((landingPageData) => {
//         // Menampilkan data Welcome Section
//         const welcomeSection = landingPageData.welcomeSection;
//         document.body.innerHTML += `
//             <section id="welcomeSection" style="background-color: red;">
//                 <h3>WELCOME</h3>
//                 <h1>${welcomeSection.storeName}</h1>
//                 <p>${welcomeSection.headline}</p>
//                 <p>${welcomeSection.description}</p>
//                 <img src="${welcomeSection.homeImage}" alt="${welcomeSection.storeName}">
//             </section>
//         `;

//         // Menampilkan data Product Section
//         const productSection = landingPageData.productSection;
//         document.body.innerHTML += `
//             <section id="productSection" style="background-color: green;">
//                 <h3>PRODUCT</h3>
//                 ${Object.entries(productSection).map(([productId, product]) => {
//                     return `
//                         <div id="${productId}">
//                             <h4>${product.productName}</h4>
//                             <p>${product.productDesc}</p>
//                             <p>Price: $${product.productPrice}</p>
//                             <img src="${product.productImages[0]}" alt="${product.productName}">
//                         </div>
//                     `;
//                 }).join('')}
//             </section>
//         `;

//         // Menampilkan data Partner Section
//         const partnerSection = landingPageData.partnerSection;
//         document.body.innerHTML += `
//             <section id="partnerSection" style="background-color: orange;">
//                 <h3>PARNERS</h3>
//                 ${Object.entries(partnerSection).map(([partnerId, partner]) => {
//                     return `
//                         <div id="${partnerId}">
//                             <h4>${partner.partnerName}</h4>
//                             <p>${partner.partnerDesc}</p>
//                             <p>Address: ${partner.partnerAddress}</p>
//                             <p>Email: ${partner.partnerEmail}</p>
//                             <img src="${partner.partnerImage}" alt="${partner.partnerName}">
//                             <div>
//                                 <h4>Social Media:</h4>
//                                 ${Object.entries(partner.partnerSocials).map(([platform, social]) => {
//                                     return Object.entries(social).map(([platformId, details]) => {
//                                         return `
//                                             <p>
//                                                 ${platform.charAt(0).toUpperCase() + platform.slice(1)}:
//                                                 <a href="${details[`${platform}Url`]}">${details[`${platform}Username`]}</a>
//                                             </p>
//                                         `;
//                                     }).join(''); 
//                                 }).join('')}
//                             </div>
//                         </div>
//                     `;
//                 }).join('')}
//             </section>
//         `;

//         // Menampilkan data Testimonies Section
//         const testimoniesSection = landingPageData.testimoniesSection;
//         document.body.innerHTML += `
//             <section id="testimoniesSection" style="background-color: yellow;">
//                 <h3>TESTIMONI</h3>
//                 <div>
//                     ${Object.entries(testimoniesSection.testimonies).map(([testimoniId, testimony]) => {
//                         return `
//                             <div id="${testimoniId}">
//                                 <img src="${testimony.testimoniImage}" alt="Testimonial Image" style="width: 100px; height: 100px;"/>
//                                 <p>Testimonial #${testimoniId}</p>
//                             </div>
//                         `;
//                     }).join('')}
//                 </div>
//                 <div>
//                     ${Object.entries(testimoniesSection.feedbacks).map(([feedbackId, feedback]) => {
//                         return `
//                             <div id="${feedbackId}">
//                                 <h5>Feedback from ${feedback.feedbackName}</h5>
//                                 <p>${feedback.feedbackText}</p>
//                             </div>
//                         `;
//                     }).join('')}
//                 </div>
//             </section>
//         `;

//         // Menampilkan data About Section
//         const aboutSection = landingPageData.aboutSection;
//         document.body.innerHTML += `
//             <section id="aboutSection" style="background-color : green;">
//                 <h3>ABOUT US</h3>
//                 <div>
//                     <h4>About Texts:</h4>
//                     <p>${aboutSection.aboutTexts.text1}</p>
//                     <p>${aboutSection.aboutTexts.text2}</p>
//                 </div>
//                 <div>
//                     <h4>About Images:</h4>
//                     ${Object.entries(aboutSection.aboutImages).map(([imageId, image]) => {
//                         return `
//                             <div>
//                                 <p>${image.imageDesc}</p>
//                                 <img src="${image.imageUrl}" alt="${image.imageDesc}">
//                             </div>
//                         `;
//                     }).join('')}
//                 </div>
//                 <div>
//                     <h4>About Videos:</h4>
//                     ${Object.entries(aboutSection.aboutVideos).map(([videoId, video]) => {
//                         return `
//                             <div>
//                                 <p>${video.videoDesc}</p>
//                                 <video controls>
//                                     <source src="${video.videoUrl}" type="video/mp4">
//                                     Your browser does not support the video tag.
//                                 </video>
//                             </div>
//                         `;
//                     }).join('')}
//                 </div>
//             </section>
//         `;

//         // Menampilkan data Footer Section
//         const footerSection = landingPageData.footerSection;
//         document.body.innerHTML += `
//             <section id="footerSection" style="background-color: red;">
//                 <h3>FOOTER</h3>
//                 <p>Description: ${footerSection.description}</p>
//                 <h4>Contact Info:</h4>
//                 <p>Main Contact: ${footerSection.storeMainContact}</p>
//                 <p>Address: ${footerSection.storeAddress}</p>
//                 <div>
//                     <h4>Social Media:</h4>
//                     ${Object.entries(footerSection.storeSocials).map(([platform, social]) => {
//                         return Object.entries(social).map(([platformId, details]) => {
//                             return `
//                                 <p>
//                                     ${platform.charAt(0).toUpperCase() + platform.slice(1)}:
//                                     <a href="${details[`${platform}Url`]}">${details[`${platform}Username`]}</a>
//                                 </p>
//                             `;
//                         }).join(''); 
//                     }).join('')}
//                 </div>
//             </section>
//         `;
//     })
//     .catch((error) => {
//         console.error("Error fetching landing page data:", error);
//     });



//struktur landigpagedata
// {
//     "welcomeSection": {
//       "storeName": "Banuna Wijen Official",
//       "headline": "Pilih produk & pesan sekarang juga, bisa kirim ke luar kota loh!",
//       "description": "Pisang Goreng Wijen Beku Bersertifikat Halal & BPOM. ",
//       "homeImage": "home.jpg"
//     },
//     "productSection": {
//       "productId1": {
//         "dateCreated": "2024-11-15T11:00:00Z",
//         "productDesc": "Dengan Taburan Wijen",
//         "productImages": [
//           "pisangwijen.jpg"
//         ],
//         "productName": "Wijen Original",
//         "productPrice": "25.000",
//         "productVideos": [
//           "video1.mp4"
//         ]
//       },
//       "productId2": {
//         "dateCreated": "2024-11-20T09:00:00Z",
//         "productDesc": "Dengan Taburan Keju",
//         "productImages": [
//           "pisankeju.jpg"
//         ],
//         "productName": "Keju Original",
//         "productPrice": "25.000",
//         "productVideos": [
//           "video1.mp4"
//         ]
//       }
//     },
//     "partnerSection": {
//       "partnerId1": {
//         "dateCreated": "2024-11-10T10:00:00Z",
//         "partnerAddress": "Jl. Bunga Sepatu No.raya, Perumnas Way Kandis, Kec. Tj. Senang, Kota Bandar Lampung, Lampung 35135",
//         "partnerDesc": "Frozen food parcel buah, pempek & daging",
//         "partnerEmail": "supplier1@example.com",
//         "partnerImage": "supplier1.jpg",
//         "partnerName": "Daing Mart",
//         "partnerSocials": {
//           "facebook": {
//             "facebookId1": {
//               "facebookUrl": "https://facebook.com/supplier",
//               "facebookUsername": "Banuna"
//             }
//           },
//           "instagram": {
//             "instaId1": {
//               "instagramUrl": "https://instagram.com/supplier",
//               "instagramUsername": "@pempek.daing"
//             }
//           },
//           "tiktok": {
//             "tiktokId1": {
//               "tiktokUrl": "https://tiktok.com/supplier",
//               "tiktokUsername": "Banuna"
//             }
//           },
//           "youtube": {
//             "youtubeId1": {
//               "youtubeUrl": "https://youtube.com/supplier",
//               "youtubeUsername": "Banuna"
//             }
//           }
//         }
//       },
//       "partnerId2": {
//         "dateCreated": "2024-11-20T10:00:00Z",
//         "partnerAddress": "Jl. Yasir Hadi Broto gg cempaka putih, Kedamaian, Kec. Kedamaian, Kota Bandar Lampung, Lampung 35122",
//         "partnerDesc": "Ayam ungkep sahila, frozen food Lampung",
//         "partnerEmail": "supplier2@example.com",
//         "partnerImage": "supplier2.jpg",
//         "partnerName": "Ayam Ungkep Sahila",
//         "partnerSocials": {
//           "facebook": {
//             "facebookId1": {
//               "facebookUrl": "https://facebook.com/supplier",
//               "facebookUsername": "Banuna"
//             }
//           },
//           "instagram": {
//             "instaId1": {
//               "instagramUrl": "https://instagram.com/supplier",
//               "instagramUsername": "@rora.store99"
//             }
//           },
//           "tiktok": {
//             "tiktokId1": {
//               "tiktokUrl": "https://tiktok.com/supplier",
//               "tiktokUsername": "Banuna"
//             }
//           },
//           "youtube": {
//             "youtubeId1": {
//               "youtubeUrl": "https://youtube.com/supplier",
//               "youtubeUsername": "Banuna"
//             }
//           }
//         }
//       }
//     },
//     "testimoniesSection": {
//       "testimonies": {
//         "testimoniId1": {
//           "dateCreated": "2024-11-25T18:00:00Z",
//           "testimoniImage": "testimoni1.jpg"
//         }
//       },
//       "feedbacks": {
//         "feedbackId1": {
//           "dateCreated": "2024-11-25T13:00:00Z",
//           "feedbackName": "Lita Sari",
//           "feedbackText": "Eh, pisang goreng beku wijen ini bener-bener mantap! Crispy dan manisnya pas. Aku suka banget, apalagi ditambah saus sambal, jadi pedas-pedas gitu. Enak buat ngemil sambil nonton film bareng keluarga. Ini jadi camilan favorit di rumah, pasti stoknya selalu ada!"
//         },
//         "feedbackId2": {
//           "dateCreated": "2024-11-26T14:00:00Z",
//           "feedbackName": "Arief",
//           "feedbackText": "Eh, pisang goreng beku wijen ini bener-bener mantap! Crispy dan manisnya pas. Aku suka banget, apalagi ditambah saus sambal, jadi pedas-pedas gitu. Enak buat ngemil sambil nonton film bareng keluarga. Ini jadi camilan favorit di rumah, pasti stoknya selalu ada!"
//         }
//       }
//     },
//     "aboutSection": {
//       "aboutTexts": {
//         "text1": "Freshness guaranteed",
//         "text2": "Organic products"
//       },
//       "aboutImages": {
//         "aboutImage1": {
//           "imageDesc": "descAbout1",
//           "imageUrl": "about1.jpg"
//         },
//         "aboutImage2": {
//           "imageDesc": "descAbout2",
//           "imageUrl": "about2.jpg"
//         }
//       },
//       "aboutVideos": {
//         "aboutVideo1": {
//           "videoDesc": "descAbout1",
//           "videoUrl": "about1.mp4"
//         },
//         "aboutVideo2": {
//           "videoDesc": "descAbout2",
//           "videoUrl": "about2.mpv"
//         }
//       },
//       "storeName": "Banuna Wijen Official"
//     },
//     "footerSection": {
//       "storeSocial": {
//         "facebook": {
//           "facebookId1": {
//             "facebookUrl": "https://facebook.com/supplier",
//             "facebookUsername": "Banuna pisang wijen beku"
//           }
//         },
//         "instagram": {
//           "instaId1": {
//             "instagramUrl": "https://instagram.com/supplier",
//             "instagramUsername": "@Banuna.wijen"
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
//       },
//       "storeMainContact": "+6282281420962",
//       "storeAddress": "Jl. Chairil Anwar Jl. Batu Besar No.47 29, Durian Payung, Kec. Tj. Karang Pusat, Kota Bandar Lampung, Lampung 35116",
//       "description": "Pisang Goreng Wijen Beku Bersertifikat Halal & BPOM. "
//     }
// }
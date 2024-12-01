import "./firebase-config.js";
import { universalDataFunction, universalTakeData, specifiedTakeData, database } from "./data-controller.js";

// start model data untuk landing page
async function fetchLandingPageData() {
    const sections = [
        "welcomeSection",
        "productSection",
        "partnerSection",
        "testimoniesSection",
        "aboutSection",
        "footerSection"
    ];
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
    landingPageData[sections[3]] = {
        testimonies: {
            ...await universalTakeData("testimonies")
        },
        feedbacks: {
            ...await universalTakeData("feedbacks")
        }
    };

    landingPageData[sections[4]] = {
        ...await specifiedTakeData("banunaStoreData", "aboutStore", [
            "aboutTexts",
            "aboutImages",
            "aboutVideos"
        ]),
        storeName: landingPageData[sections[0]].storeName // Menambahkan storeName ke aboutSection
    };

    landingPageData[sections[5]] = {
        storeSocials: await specifiedTakeData("banunaStoreData", "storeSocials", [
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

// end model data untuk landing page

export { fetchLandingPageData };
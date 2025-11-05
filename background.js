console.log("✅ Background loaded");

let imageLinks = [];

// Bắt tất cả request
chrome.webRequest.onCompleted.addListener(
    (details) => {
        console.log("📡 Request:", details.url);

        if (/\.jpg($|\?)/i.test(details.url)) {
            console.log("✅ FOUND JPG:", details.url);

            if (!imageLinks.includes(details.url)) {
                imageLinks.push(details.url);
                chrome.storage.local.set({ imageLinks });
            }
        }
    },
    { urls: ["<all_urls>"] }
);

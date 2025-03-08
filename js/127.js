document.addEventListener("DOMContentLoaded", function () {
    const config = {
        mainDomain: "scfc.top",
        logApi: "https://api.scfc.top/report.php", // PHP 接口地址
        allowList: ["localhost"]
    };

    const currentDomain = window.location.hostname.toLowerCase();

    if (currentDomain !== config.mainDomain && !config.allowList.includes(currentDomain)) {
        const reportData = {
            mirror: currentDomain,
            time: new Date().toISOString(),
            path: window.location.pathname,
            ua: navigator.userAgent.slice(0, 500)
        };

        navigator.sendBeacon(config.logApi, JSON.stringify(reportData));
        window.location.replace(`https://${config.mainDomain}`);
    }
});
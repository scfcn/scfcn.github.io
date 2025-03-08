document.addEventListener("DOMContentLoaded", function () {
    const config = {
        mainDomain: "scfc.top",
        logApi: "https://api.scfc.top/report.php", // PHP 接口地址
        allowList: ["localhost", "*.scfc.top"] // 添加了通配符白名单
    };

    const currentDomain = window.location.hostname.toLowerCase();

    // 检查当前域名是否在 allowList 中
    const isAllowed = config.allowList.some(allowedDomain => {
        if (allowedDomain === currentDomain) {
            return true; // 完全匹配
        }
        if (allowedDomain.endsWith(".*") && currentDomain.endsWith(allowedDomain.slice(0, -2))) {
            return true; // 通配符匹配，例如 *.scfc.top 匹配 sub.scfc.top
        }
        return false;
    });

    // 如果不在白名单中，也不是主域名，则记录并跳转
    if (currentDomain !== config.mainDomain && !isAllowed) {
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
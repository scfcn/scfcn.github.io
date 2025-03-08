document.addEventListener("DOMContentLoaded", function () {
    // 定义主站域名
    const mainDomain = "scfc.top";
    
    // 获取当前域名
    const currentDomain = window.location.hostname;

    // 域名检查逻辑（严格匹配）
    if (currentDomain !== mainDomain.toLowerCase()) {
        // 直接跳转到主站（无确认提示）
        window.location.replace(`https://${mainDomain}`);
    }
});
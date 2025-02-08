document.addEventListener("DOMContentLoaded", function () {
    // Base64编码的主站域名
    const encodedMainDomain = "YmxvZy5zY2ZjLnRvcA"; // 对应 "blog.scfc.top"
    // Base64编码后的有效域名列表（支持通配符）
    const encodedDomainList = [
        'YmxvZy5zY2ZjLnRvcA', // 主站自身（blog.scfc.top）
        'Ki5zY2ZjLnRvcA',     // 对应 *.scfc.top
        'c2NmYy5wYWdlcy5kZXY=',   // 对应其他备用域名（如GitHub Pages）
    ];

    // Base64解码函数
    function decodeBase64(encodedStr) {
        return atob(encodedStr);
    }

    // 解码后的主站域名和域名列表
    const mainDomain = decodeBase64(encodedMainDomain);
    const domainList = encodedDomainList.map(decodeBase64);

    // 判断域名是否匹配列表中的通配符规则
    function isDomainInList(domain, domainList) {
        const convertToRegex = (wildcard) => {
            return new RegExp('^' + wildcard.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
        };
        return domainList.some(wildcardDomain => convertToRegex(wildcardDomain).test(domain));
    }

    // 创建提示横幅
    function addInfoBanner(preFix, url, urlText, postFix) {
        const banner = document.createElement("div");
        banner.id = "domainMismatchBanner";
        const link = document.createElement("a");
        link.href = `https://${url}/?utm_source=domaincheck`;
        link.target = "_blank";
        link.style.color = "#b8dbff";
        link.style.textDecoration = "underline";
        link.innerText = urlText;
        banner.appendChild(document.createTextNode(preFix));
        banner.appendChild(link);
        banner.appendChild(document.createTextNode(postFix));
        banner.style.cssText = `
            background-color: #fb7070;
            color: #fff;
            text-align: center;
            padding: 3px;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
        `;
        document.body.appendChild(banner);
    }

    // 创建水印
    function createWatermark(text) {
        const watermarkDiv = document.createElement("div");
        watermarkDiv.style.cssText = `
            pointer-events: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            opacity: 0.1;
            background: transparent;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
        `;
        const watermarkText = document.createElement("div");
        watermarkText.style.cssText = `
            color: black;
            font-size: 30px;
            transform: rotate(-30deg);
            white-space: nowrap;
            margin: 20px;
        `;
        watermarkText.innerText = text;
        for (let i = 0; i < 50; i++) { // 减少数量以优化性能
            watermarkDiv.appendChild(watermarkText.cloneNode(true));
        }
        document.body.appendChild(watermarkDiv);
    }

    // 获取当前域名
    const currentDomain = window.location.hostname;

    // 域名检查逻辑
    if (currentDomain === 'localhost') {
        addInfoBanner('当前访问的是本地测试站点，可点击', mainDomain, '主站', '访问在线站点。');
    } else if (!isDomainInList(currentDomain, domainList)) {
        // 非授权域名：显示警告横幅+水印+跳转提示
        addInfoBanner('当前域名非本站域名，疑似恶意镜像站，请点击', mainDomain, '主站', '正常访问。请举报此域名！');
        createWatermark(mainDomain);
        const confirmMsg = "警告：您当前访问的站点疑似恶意镜像！是否立即跳转到正版站点？";
        if (confirm(confirmMsg)) window.location.replace(`https://${mainDomain}`);
    } else if (currentDomain !== mainDomain) {
        // 授权镜像站：仅显示提示横幅
        addInfoBanner('您当前访问的是镜像站，如果', mainDomain, '主站', '可正常访问，请优先使用主站！');
    }
});
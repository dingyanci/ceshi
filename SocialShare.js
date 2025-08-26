const SocialShare = (function() {
    // 默认配置
    let config = {
        platforms: {
            facebook: {
                name: 'Facebook',
                scheme: 'fb://share?text={text}&link={url}',
                webUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}',
                text: 'facebook分享这个内容',
                url: window.location.href
            },
            twitter: {
                name: 'Twitter',
                scheme: 'twitter://post?message={text} {url}',
                webUrl: 'https://twitter.com/intent/tweet?text={text}&url={url}',
                text: 'twitter看看这个',
                url: window.location.href
            },
            instagram: {
                name: 'Instagram',
                scheme: 'instagram://app',
                webUrl: 'https://www.instagram.com/',
                text: '',
                url: ''
            },
            youtube: {
                name: 'YouTube',
                scheme: 'youtube://',
                webUrl: 'https://www.youtube.com/',
                text: '',
                url: ''
            },
            whatsapp: {
                name: 'WhatsApp',
                scheme: 'whatsapp://send?text={text} {url}',
                webUrl: 'https://web.whatsapp.com/send?text={text} {url}',
                text: '分享这个内容',
                url: window.location.href
            }
        },
        timeout: 800 // 检测应用是否安装的超时时间(毫秒)
    };
    
    /**
     * 更新平台配置
     * @param {string} platform 平台名称
     * @param {Object} options 新配置
     */
    function updatePlatform(platform, options) {
        if (config.platforms[platform]) {
            config.platforms[platform] = {
                ...config.platforms[platform],
                ...options
            };
        }
    }

    /**
     * 更新所有平台的分享URL
     * @param {string} url 新的分享URL
     */
    function updateUrl(url) {
        Object.values(config.platforms).forEach(platform => {
            platform.url = url;
        });
    }

    /**
     * 分享到指定平台
     * @param {string} platform 平台名称
     */
    function share(platform) {
        const app = config.platforms[platform];
        if (!app) return;

        // 替换模板变量
        const finalUrl = encodeURIComponent(app.url || window.location.href);
        const finalText = encodeURIComponent(app.text || '');
        
        const scheme = app.scheme
            .replace(/{url}/g, finalUrl)
            .replace(/{text}/g, finalText);
            
        const webUrl = app.webUrl
            .replace(/{url}/g, finalUrl)
            .replace(/{text}/g, finalText);

        // 尝试打开应用
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = scheme;
        document.body.appendChild(iframe);

        // 设置超时检测
        setTimeout(() => {
            document.body.removeChild(iframe);
            if (!document.hidden) {
                window.open(webUrl, '_blank'); // 回退到网页版
            }
        }, config.timeout);
    }

    // 公开API
    return {
        updatePlatform,
        updateUrl,
        share
    };
})();




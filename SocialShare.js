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
        timeout : navigator.userAgent.includes('Chrome') ? 1500 : 800,
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
        console.log(config.timeout);
        // 设置超时检测（Google Chrome为1500ms，其他浏览器800ms）
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


// const SocialShare = (function() {
//     // 默认配置
//     let config = {
//         platforms: {
//             facebook: {
//                 name: 'Facebook',
//                 // 官方API分享方式
//                 share: function(options = {}) {
//                     if (typeof FB !== 'undefined') {
//                         FB.ui({
//                             method: 'share',
//                             href: options.url || this.url,
//                             quote: options.text || this.text,
//                             hashtag: options.hashtag || '#分享'
//                         }, function(response) {
//                             console.log('Facebook分享结果:', response);
//                         });
//                     } else {
//                         // 回退到URL方案
//                         const url = encodeURIComponent(options.url || this.url);
//                         const text = encodeURIComponent(options.text || this.text);
//                         const webUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
//                         window.open(webUrl, '_blank');
//                     }
//                 },
//                 // 保留原有URL方案作为回退
//                 scheme: 'fb://share?text={text}&link={url}',
//                 webUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}',
//                 text: '分享这个内容',
//                 url: window.location.href
//             },
//             twitter: {
//                 name: 'Twitter',
//                 scheme: 'twitter://post?message={text} {url}',
//                 webUrl: 'https://twitter.com/intent/tweet?text={text}&url={url}',
//                 text: '看看这个',
//                 url: window.location.href
//             },
//             instagram: {
//                 name: 'Instagram',
//                 scheme: 'instagram://app',
//                 webUrl: 'https://www.instagram.com/',
//                 text: '',
//                 url: ''
//             },
//             youtube: {
//                 name: 'YouTube',
//                 scheme: 'youtube://',
//                 webUrl: 'https://www.youtube.com/',
//                 text: '',
//                 url: ''
//             },
//             whatsapp: {
//                 name: 'WhatsApp',
//                 scheme: 'whatsapp://send?text={text} {url}',
//                 webUrl: 'https://web.whatsapp.com/send?text={text} {url}',
//                 text: '分享这个内容',
//                 url: window.location.href
//             }
//         },
//         timeout: 800,
//         fbAppId: '' // 新增Facebook应用ID配置
//     };

//     /**
//      * 初始化Facebook SDK
//      */
//     function initFacebookSDK() {
//         if (!config.fbAppId) return;
        
//         window.fbAsyncInit = function() {
//             FB.init({
//                 appId: config.fbAppId,
//                 cookie: true,
//                 xfbml: true,
//                 version: 'v18.0'
//             });
//         };

//         (function(d, s, id){
//             if (d.getElementById(id)) return;
//             const fjs = d.getElementsByTagName(s)[0];
//             const js = d.createElement(s);
//             js.id = id;
//             js.src = "https://connect.facebook.net/zh_CN/sdk.js";
//             fjs.parentNode.insertBefore(js, fjs);
//         }(document, 'script', 'facebook-jssdk'));
//     }

//     /**
//      * 更新平台配置
//      * @param {string} platform 平台名称
//      * @param {Object} options 新配置
//      */
//     function updatePlatform(platform, options) {
//         if (config.platforms[platform]) {
//             config.platforms[platform] = {
//                 ...config.platforms[platform],
//                 ...options
//             };
//         }
//     }

//     /**
//      * 更新所有平台的分享URL
//      * @param {string} url 新的分享URL
//      */
//     function updateUrl(url) {
//         Object.values(config.platforms).forEach(platform => {
//             platform.url = url;
//         });
//     }

//     /**
//      * 分享到指定平台
//      * @param {string} platform 平台名称
//      * @param {Object} options 分享选项
//      */
//     function share(platform, options = {}) {
//         const app = config.platforms[platform];
//         if (!app) return;

//         // 特殊处理Facebook官方API
//         if (platform === 'facebook' && typeof app.share === 'function') {
//             app.share(options);
//             return;
//         }

//         // 其他平台保持原有逻辑
//         const finalUrl = encodeURIComponent(options.url || app.url);
//         const finalText = encodeURIComponent(options.text || app.text || '');
        
//         const scheme = app.scheme
//             .replace(/{url}/g, finalUrl)
//             .replace(/{text}/g, finalText);
            
//         const webUrl = app.webUrl
//             .replace(/{url}/g, finalUrl)
//             .replace(/{text}/g, finalText);

//         // 尝试打开应用
//         const iframe = document.createElement('iframe');
//         iframe.style.display = 'none';
//         iframe.src = scheme;
//         document.body.appendChild(iframe);

//         setTimeout(() => {
//             document.body.removeChild(iframe);
//             if (!document.hidden) {
//                 window.open(webUrl, '_blank');
//             }
//         }, config.timeout);
//     }

//     /**
//      * 初始化分享库
//      * @param {Object} userConfig 用户配置
//      */
//     function init(userConfig = {}) {
//         Object.assign(config, userConfig);
//         if (config.fbAppId) {
//             initFacebookSDK();
//         }
//     }

//     // 公开API
//     return {
//         init,
//         updatePlatform,
//         updateUrl,
//         share
//     };
// })();

















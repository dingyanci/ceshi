/**
 * 社交媒体分享库 - SocialShare.js
 * 功能：提供跨平台的社交媒体分享功能，支持应用内打开和网页回退
 * 使用方式：
 * 1. 引入本脚本
 * 2. 调用 SocialShare.init() 初始化
 * 3. 使用 data-social 属性标记分享按钮
 */

const SocialShare = (function() {
    // 默认配置
    const defaultConfig = {
        platforms: {
            facebook: {
                name: 'Facebook',
                scheme: 'fb://share?link={url}&quote={text}',
                webUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}',
                defaultText: '分享这个内容'
            },
            twitter: {
                name: 'Twitter',
                scheme: 'twitter://post?message={text} {url}',
                webUrl: 'https://twitter.com/intent/tweet?text={text}&url={url}',
                defaultText: '看看这个'
            },
            instagram: {
                name: 'Instagram',
                scheme: 'instagram://share',
                webUrl: 'https://www.instagram.com/',
                defaultText: ''
            },
            youtube: {
                name: 'YouTube',
                scheme: 'youtube://channel/{channelId}/community',
                webUrl: 'https://www.youtube.com/channel/{channelId}/community',
                defaultText: '',
                requires: ['channelId']
            }
        },
        url: window.location.href,
        timeout: 1000,
        fadeInDuration: 300
    };

    // 当前配置
    let config = {};

    /**
     * 初始化分享库
     * @param {Object} userConfig 用户自定义配置
     */
    function init(userConfig = {}) {
        // 合并配置
        config = {
            ...defaultConfig,
            ...userConfig
        };

        // 验证必要参数
        validateConfig();

        // 初始化分享按钮
        initButtons();

        // // 淡入显示按钮
        // fadeInButtons();
    }

    /**
     * 验证配置有效性
     */
    function validateConfig() {
        // 检查URL
        if (!config.url) {
            console.warn('SocialShare: 未提供分享URL，将使用当前页面URL');
            config.url = window.location.href;
        }

        // 检查各平台必要参数
        Object.entries(config.platforms).forEach(([key, platform]) => {
            if (platform.requires) {
                platform.requires.forEach(param => {
                    if (!platform[param]) {
                        console.error(`SocialShare: ${platform.name} 需要参数 "${param}"`);
                    }
                });
            }
        });
    }

    /**
     * 初始化分享按钮事件
     */
    function initButtons() {
        document.querySelectorAll('[data-social]').forEach(button => {
            const platform = button.getAttribute('data-social');
            
            if (!config.platforms[platform]) {
                console.warn(`SocialShare: 未知平台 "${platform}"`);
                return;
            }

            button.addEventListener('click', () => {
                shareTo(platform);
            });
        });
    }

    /**
     * 淡入显示分享按钮
     */
    // function fadeInButtons() {
    //     const containers = document.querySelectorAll('[data-social-container]');
    //     containers.forEach(container => {
    //         container.style.transition = `opacity ${config.fadeInDuration}ms`;
    //         container.style.opacity = 1;
    //     });
    // }

    /**
     * 分享到指定平台
     * @param {string} platform 平台名称
     */
    function shareTo(platform) {
        const platformConfig = config.platforms[platform];
        if (!platformConfig) {
            console.error(`SocialShare: 平台 "${platform}" 未配置`);
            return;
        }

        // 替换模板变量
        const text = platformConfig.text || platformConfig.defaultText || '';
        const url = encodeURIComponent(config.url);
        const processedText = encodeURIComponent(text);

        let scheme = platformConfig.scheme
            .replace(/{url}/g, url)
            .replace(/{text}/g, processedText);

        let webUrl = platformConfig.webUrl
            .replace(/{url}/g, url)
            .replace(/{text}/g, processedText);

        // 替换其他变量
        if (platformConfig.requires) {
            platformConfig.requires.forEach(param => {
                const value = encodeURIComponent(platformConfig[param]);
                scheme = scheme.replace(new RegExp(`{${param}}`, 'g'), value);
                webUrl = webUrl.replace(new RegExp(`{${param}}`, 'g'), value);
            });
        }

        // 尝试打开应用
        openApp(scheme, webUrl);
    }

    /**
     * 尝试打开应用，失败则回退到网页
     * @param {string} scheme 应用URL方案
     * @param {string} webUrl 网页URL
     */
    function openApp(scheme, webUrl) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = scheme;
        document.body.appendChild(iframe);

        setTimeout(() => {
            document.body.removeChild(iframe);
            
            // 如果应用未安装，则打开网页版
            if (!document.hidden) {
                window.open(webUrl, '_blank');
            }
        }, config.timeout);
    }

    // 公开API
    return {
        init,
        shareTo
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    SocialShare.init();
});


/**
 * 社交媒体分享库 - SocialShare
 * 功能：提供跨平台的社交媒体分享功能，支持应用内打开和网页回退
 * 使用方法：
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
                scheme: 'fb://share?text=分享内容',
                webUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}',
                btnId: 'facebook-btn'
            },
            twitter: {
                name: 'Twitter',
                scheme: 'twitter://post?message=分享内容',
                webUrl: 'https://twitter.com/intent/tweet?text=分享内容&url={url}',
                btnId: 'twitter-btn'
            },
            instagram: {
                name: 'Instagram',
                scheme: 'instagram://app',
                webUrl: 'https://www.instagram.com/',
                btnId: 'instagram-btn'
            },
            youtube: {
                name: 'YouTube',
                scheme: 'youtube://channel/UCNTpsgEGxdnURsidXvLbcbA/community',
                webUrl: 'https://www.youtube.com/channel/UCNTpsgEGxdnURsidXvLbcbA/community',
                btnId: 'youtube-btn'
            }
        },
        url: window.location.href,
        timeout: 500
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

        // 替换URL变量
        Object.values(config.platforms).forEach(platform => {
            platform.webUrl = platform.webUrl.replace('{url}', encodeURIComponent(config.url));
        });

        // 初始化分享按钮
        initButtons();

        // 淡入显示按钮
        fadeInButtons();
    }

    /**
     * 初始化分享按钮事件
     */
    function initButtons() {
        Object.values(config.platforms).forEach(app => {
            const btn = document.getElementById(app.btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    shareTo(app);
                });
            }
        });
    }

    /**
     * 淡入显示分享按钮
     */
    function fadeInButtons() {
        const containers = document.querySelectorAll('.btn-container');
        containers.forEach(container => {
            container.style.opacity = 1;
        });
    }

    /**
     * 分享到指定平台
     * @param {Object} app 平台配置
     */
    function shareTo(app) {
        // 尝试打开应用
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = app.scheme;
        document.body.appendChild(iframe);

        // 设置超时检测
        setTimeout(() => {
            document.body.removeChild(iframe);
            
            // 如果应用未安装，则打开网页版
            if (!document.hidden) {
                window.open(app.webUrl, '_blank');
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
// document.addEventListener('DOMContentLoaded', () => {
//     SocialShare.init();
// });


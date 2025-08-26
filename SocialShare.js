 // <script>
        // 社交媒体应用配置
        const socialApps = {
            facebook: {
                name: 'Facebook',
                scheme: 'fb://share?link='+ encodeURIComponent(window.location.href)+'&quote='+encodeURIComponent('分享xx内容')+'&text='+encodeURIComponent('内容'),
                webUrl: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href),
                btnId: 'facebook-btn'
            },
            twitter: {
                name: 'Twitter',
                scheme: 'twitter://post?message=' + encodeURIComponent('分享xx内容') + encodeURIComponent(window.location.href),
                webUrl: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('分享xx内容') + '&url=' + encodeURIComponent(window.location.href),
                btnId: 'twitter-btn'
            },
            instagram: {
                name: 'Instagram',
                scheme: 'instagram://share',
                webUrl: 'https://www.instagram.com/',
                btnId: 'instagram-btn'
            },
            youtube: {
                name: 'YouTube',
                scheme: 'youtube://channel/UCNTpsgEGxdnURsidXvLbcbA/community',
                webUrl: 'https://www.youtube.com/channel/UCNTpsgEGxdnURsidXvLbcbA/community',
                btnId: 'youtube-btn'
            }
        };


        // 检测并打开社交媒体应用或网页
        function openSocialMedia(app) {
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
            }, 1000);
        }

        // 为每个按钮添加点击事件
        Object.values(socialApps).forEach(app => {
            document.getElementById(app.btnId).addEventListener('click', () => {
                openSocialMedia(app);
            });
        });
        
        // 页面加载完成后显示按钮
        window.addEventListener('load', () => {
            document.querySelector('.btn-container').style.opacity = 1;
        });
    // </script>

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 1. 滚动触发固定头部
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. 入口卡片动画效果
    // 移除JS对.entry-card的动画控制，完全交由AOS动画库处理
    // const entryCards = document.querySelectorAll('.entry-card');
    // entryCards.forEach((card, index) => {
    //     card.classList.add('card-animated');
    //     card.style.animationDelay = (0.3 + index * 0.15) + 's';
    //     card.addEventListener('mouseenter', () => {
    //         card.style.transform = 'scale(1.05)';
    //         card.style.borderColor = '#8dc63f';
    //         card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
    //     });
    //     card.addEventListener('mouseleave', () => {
    //         card.style.transform = '';
    //         card.style.borderColor = '';
    //         card.style.boxShadow = '';
    //     });
    // });

    // 3. 滚动指示器功能
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const entryCategories = document.querySelector('.entry-categories');
            if (entryCategories) {
                entryCategories.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // 4. 移动菜单切换功能
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // 图像错误处理
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => {
            // 如果图像无法加载，显示占位符
            console.log('图像加载失败:', img.src);
            img.src = 'img/placeholder.png';
        });
    });

    // 添加页面加载完成效果
    document.body.classList.add('page-loaded');

    // 横幅文本动画
    const bannerText = document.querySelector('.banner-text');
    if (bannerText) {
        bannerText.classList.add('banner-text-animated');
    }

    // 返回顶部按钮功能
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        // 监听滚动事件，控制返回顶部按钮的显示和隐藏
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // 点击返回顶部按钮的行为
        backToTopButton.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 创建像素粒子效果
    createPixelParticles();

    // 只对.animate-on-scroll元素设置IntersectionObserver，不再处理.entry-card
    setupIntersectionObserver();

    // 添加鼠标移动视差效果
    setupParallaxEffect();

    // 天气特效系统
    const weatherTypes = [
        { name: '晴天', icon: '☀️', type: 'sunny' },
        { name: '下雨', icon: '🌧️', type: 'rainy' },
        { name: '下雪', icon: '❄️', type: 'snowy' },
        { name: '雷暴', icon: '⛈️', type: 'stormy' },
        { name: '夜晚', icon: '🌙', type: 'night' }
    ];
    let currentWeather = 0;

    function drawWeatherEffect() {
        const canvas = document.getElementById('weatherEffectCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width, h = canvas.height;
        // 粒子数量随分辨率自适应
        const baseCount = Math.floor(w * h / 18000);

        if (weatherTypes[currentWeather].name === '晴天') {
            // 绘制阳光光晕效果
            const gradient = ctx.createRadialGradient(w * 0.2, h * 0.2, 0, w * 0.2, h * 0.2, h * 0.6);
            gradient.addColorStop(0, 'rgba(255, 255, 180, 0.12)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 180, 0.06)');
            gradient.addColorStop(1, 'rgba(255, 255, 180, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            // 绘制太阳光芒
            ctx.save();
            ctx.translate(w * 0.2, h * 0.2);
            ctx.beginPath();
            for (let i = 0; i < 12; i++) {
                ctx.rotate(Math.PI / 6);
                ctx.moveTo(30, 0);
                ctx.lineTo(60, 0);
            }
            ctx.strokeStyle = 'rgba(255, 255, 180, 0.15)';
            ctx.lineWidth = 8;
            ctx.stroke();
            ctx.restore();

        } else if (weatherTypes[currentWeather].name === '下雨' || weatherTypes[currentWeather].name === '雷暴') {
            // 添加雨天背景氛围
            ctx.fillStyle = 'rgba(0, 20, 40, 0.08)';
            ctx.fillRect(0, 0, w, h);

            // 绘制多层雨点，增加层次感
            // 近景雨点 - 大而快
            for (let i = 0; i < baseCount; i++) {
                const x = Math.random() * w;
                const y = (Math.random() * h) - h * 0.1; // 从稍微高一点的位置开始
                const length = 20 + Math.random() * 15;
                const speed = 15 + Math.random() * 10;
                const opacity = 0.6 + Math.random() * 0.3;

                // 计算雨点的终点位置（模拟下落效果）
                const endY = y + length + speed;

                // 绘制雨点
                const gradient = ctx.createLinearGradient(x, y, x, endY);
                gradient.addColorStop(0, `rgba(180, 200, 255, 0)`);
                gradient.addColorStop(0.3, `rgba(180, 200, 255, ${opacity})`);
                gradient.addColorStop(1, `rgba(180, 200, 255, 0)`);

                ctx.beginPath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.moveTo(x, y);
                ctx.lineTo(x, endY);
                ctx.stroke();
            }

            // 中景雨点 - 中等大小和速度
            for (let i = 0; i < baseCount * 1.5; i++) {
                const x = Math.random() * w;
                const y = (Math.random() * h) - h * 0.1;
                const length = 14 + Math.random() * 10;
                const speed = 10 + Math.random() * 8;
                const opacity = 0.4 + Math.random() * 0.3;

                const endY = y + length + speed;

                const gradient = ctx.createLinearGradient(x, y, x, endY);
                gradient.addColorStop(0, `rgba(180, 200, 255, 0)`);
                gradient.addColorStop(0.3, `rgba(180, 200, 255, ${opacity})`);
                gradient.addColorStop(1, `rgba(180, 200, 255, 0)`);

                ctx.beginPath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5;
                ctx.moveTo(x, y);
                ctx.lineTo(x, endY);
                ctx.stroke();
            }

            // 远景雨点 - 小而慢
            for (let i = 0; i < baseCount * 2; i++) {
                const x = Math.random() * w;
                const y = (Math.random() * h) - h * 0.1;
                const length = 8 + Math.random() * 6;
                const speed = 5 + Math.random() * 5;
                const opacity = 0.2 + Math.random() * 0.2;

                const endY = y + length + speed;

                const gradient = ctx.createLinearGradient(x, y, x, endY);
                gradient.addColorStop(0, `rgba(180, 200, 255, 0)`);
                gradient.addColorStop(0.3, `rgba(180, 200, 255, ${opacity})`);
                gradient.addColorStop(1, `rgba(180, 200, 255, 0)`);

                ctx.beginPath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1;
                ctx.moveTo(x, y);
                ctx.lineTo(x, endY);
                ctx.stroke();
            }

            // 雷暴时的闪电效果
            if (weatherTypes[currentWeather].name === '雷暴' && Math.random() < 0.04) {
                // 闪电前的亮光效果
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(0, 0, w, h);

                // 绘制分叉闪电
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                const startX = Math.random() * w;
                let currentX = startX;
                let currentY = 0;

                // 创建闪电路径
                while (currentY < h) {
                    const nextY = currentY + h * 0.2;
                    const nextX = currentX + (Math.random() - 0.5) * 100;

                    ctx.moveTo(currentX, currentY);
                    ctx.lineTo(nextX, nextY);

                    // 随机添加分支
                    if (Math.random() < 0.3) {
                        const branchX = nextX + (Math.random() - 0.5) * 80;
                        const branchY = nextY + h * 0.1;
                        ctx.moveTo(nextX, nextY);
                        ctx.lineTo(branchX, branchY);
                    }

                    currentX = nextX;
                    currentY = nextY;
                }
                ctx.stroke();

                // 闪电周围的光晕
                const gradient = ctx.createRadialGradient(startX, h * 0.5, 0, startX, h * 0.5, h * 0.3);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, w, h);
            }
        } else if (weatherTypes[currentWeather].name === '下雪') {
            // 画像素雪花
            for (let i = 0; i < baseCount * 1.2; i++) {
                const x = Math.random() * w, y = Math.random() * h;
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.fillRect(x, y, 6, 6);
            }
        } else if (weatherTypes[currentWeather].name === '夜晚') {
            // 添加深色蒙版降低亮度
            ctx.fillStyle = 'rgba(0, 0, 32, 0.4)';
            ctx.fillRect(0, 0, w, h);

            // 绘制月亮
            ctx.beginPath();
            ctx.arc(w * 0.8, h * 0.2, 30, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fill();

            // 绘制星星
            for (let i = 0; i < baseCount; i++) {
                const x = Math.random() * w;
                const y = Math.random() * h * 0.8;
                const size = Math.random() * 3 + 1;
                const opacity = 0.1 + Math.random() * 0.3;

                // 绘制十字形星星
                ctx.beginPath();
                ctx.moveTo(x - size, y);
                ctx.lineTo(x + size, y);
                ctx.moveTo(x, y - size);
                ctx.lineTo(x, y + size);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // 随机添加星星闪烁效果
                if (Math.random() < 0.02) {
                    ctx.beginPath();
                    ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
                    ctx.fill();
                }
            }

            // 偶尔出现流星效果
            if (Math.random() < 0.01) {
                ctx.save();
                const sx = Math.random() * w * 0.8 + w * 0.1;
                const sy = Math.random() * h * 0.3;
                const gradient = ctx.createLinearGradient(sx, sy, sx + 100, sy + 30);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + 100, sy + 30);
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    let weatherAnimId = null;
    function weatherLoop() {
        drawWeatherEffect();
        weatherAnimId = requestAnimationFrame(weatherLoop);
    }

    function setWeatherType(idx) {
        currentWeather = idx;
        const btn = document.getElementById('weatherToggleBtn');
        if (btn) {
            btn.innerHTML = weatherTypes[idx].icon + ' ' + weatherTypes[idx].name;
            btn.dataset.weather = weatherTypes[idx].type;
            // 设置CSS变量用于动画
            btn.style.setProperty('--border-color', getComputedStyle(btn).borderColor);
        }
    }

    // 天气切换按钮逻辑
    const btn = document.getElementById('weatherToggleBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            setWeatherType((currentWeather + 1) % weatherTypes.length);
        });
        setWeatherType(0); // 默认晴天
    }
    // 启动天气动画
    weatherLoop();
    // 窗口大小变化时自适应canvas
    window.addEventListener('resize', drawWeatherEffect);

    // 天气按钮拖动功能
    initWeatherButtonDrag();
});

/**
 * 切换移动菜单的显示状态
 */
function toggleMobileMenu() {
    const navMenu = document.querySelector('nav ul');
    if (navMenu) {
        navMenu.classList.toggle('mobile-active');

        // 切换菜单按钮的状态（可选）
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.classList.toggle('active');
        }
    }
}

/**
 * 平滑滚动到指定元素
 * @param {string} selector - 目标元素的CSS选择器
 */
function smoothScrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * 页面切换动画
 * @param {string} url - 目标页面URL
 */
function pageTransition(url) {
    document.body.classList.add('page-transition');
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

/**
 * 创建像素风格的粒子效果
 */
function createPixelParticles() {
    const container = document.getElementById('pixelParticles');
    if (!container) return;

    const colors = ['#8dc63f', '#5d8a2a', '#3a3a3a', '#666666'];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.floor(Math.random() * 6 + 3) + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        particle.style.pointerEvents = 'none';

        // 设置动画
        const duration = Math.random() * 50 + 30;
        const delay = Math.random() * 5;

        particle.style.animation = `floatParticle ${duration}s linear ${delay}s infinite`;
        container.appendChild(particle);
    }

    // 添加动画关键帧
    if (!document.getElementById('particleKeyframes')) {
        const style = document.createElement('style');
        style.id = 'particleKeyframes';
        style.innerHTML = `
            @keyframes floatParticle {
                0% { transform: translateY(0) rotate(0deg); }
                100% { transform: translateY(-100vh) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * 设置交叉观察器，滚动到视口内触发动画
 */
function setupIntersectionObserver() {
    // 定义要观察的元素
    const elementsToObserve = [
        ...document.querySelectorAll('.animate-on-scroll')
    ];

    // 创建交叉观察器
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口
                entry.target.classList.add('animated');
                // 取消观察已触发的元素
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // 开始观察元素
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

/**
 * 设置鼠标移动视差效果
 */
function setupParallaxEffect() {
    const floatingElements = document.querySelectorAll('.floating-element');

    document.addEventListener('mousemove', function (e) {
        floatingElements.forEach((element, index) => {
            const speed = 0.02 + (index * 0.01);
            const x = (window.innerWidth / 2 - e.clientX) * speed;
            const y = (window.innerHeight / 2 - e.clientY) * speed;

            element.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1}deg)`;
        });
    });
}

// 监听窗口大小变化
window.addEventListener('resize', function () {
    // 在小屏幕上，如果窗口调整大小，隐藏移动菜单
    if (window.innerWidth > 768) {
        const navMenu = document.querySelector('nav ul');
        if (navMenu && navMenu.classList.contains('mobile-active')) {
            navMenu.classList.remove('mobile-active');
        }
    }
});

// 为导航菜单项添加动画延迟
function setupMenuAnimation() {
    const menuItems = document.querySelectorAll('nav ul li');
    menuItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
}

// 页面卸载前的过渡动画
window.addEventListener('beforeunload', function (e) {
    // 仅在非强制刷新的情况下显示过渡效果
    if (!e.isTrusted) {
        document.body.classList.add('page-exit');
    }
});

// 天气按钮拖动功能
function initWeatherButtonDrag() {
    const btn = document.getElementById('weatherToggleBtn');
    if (!btn) return;

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let autoHideTimeout;
    let lastMoveTime = 0;
    const moveThrottle = 16; // 约60fps

    // 初始化按钮位置
    function initButtonPosition() {
        btn.style.position = 'fixed';
        btn.style.right = '24px';
        btn.style.bottom = '24px';
        btn.style.left = 'auto';
        btn.style.top = 'auto';
        btn.style.margin = '0';
        btn.style.transform = 'none';
    }

    // 自动隐藏定时器
    function startAutoHideTimer() {
        clearTimeout(autoHideTimeout);
        btn.classList.remove('auto-hide');
        autoHideTimeout = setTimeout(() => {
            if (!isDragging) {
                btn.classList.add('auto-hide');
            }
        }, 3000);
    }

    // 处理拖动开始
    function onDragStart(e) {
        if (!e.target.closest('#weatherToggleBtn')) return;
        e.preventDefault();
        
        const rect = btn.getBoundingClientRect();
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        dragOffsetX = clientX - rect.left;
        dragOffsetY = clientY - rect.top;
        
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
        btn.style.left = rect.left + 'px';
        btn.style.top = rect.top + 'px';
        
        isDragging = true;
        btn.classList.add('dragging');
        lastMoveTime = performance.now();
    }

    // 处理拖动
    function onDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const now = performance.now();
        if (now - lastMoveTime < moveThrottle) return;
        lastMoveTime = now;
        
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        let newLeft = clientX - dragOffsetX;
        let newTop = clientY - dragOffsetY;
        
        const maxX = window.innerWidth - btn.offsetWidth;
        const maxY = window.innerHeight - btn.offsetHeight;
        newLeft = Math.max(0, Math.min(newLeft, maxX));
        newTop = Math.max(0, Math.min(newTop, maxY));
        
        requestAnimationFrame(() => {
        btn.style.left = newLeft + 'px';
        btn.style.top = newTop + 'px';
        });
    }

    // 处理拖动结束
    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        btn.classList.remove('dragging');
        
        const rect = btn.getBoundingClientRect();
        const threshold = Math.min(window.innerWidth * 0.1, 50);
        
        if (rect.left <= threshold) {
            btn.style.left = '0';
            btn.classList.add('left-edge');
            btn.classList.remove('right-edge');
        } else if (window.innerWidth - rect.right <= threshold) {
            btn.style.left = 'auto';
            btn.style.right = '0';
            btn.classList.add('right-edge');
            btn.classList.remove('left-edge');
        } else {
            btn.classList.remove('left-edge', 'right-edge');
        }
        
        if (rect.top <= threshold) {
            btn.style.top = '0';
        } else if (window.innerHeight - rect.bottom <= threshold) {
            btn.style.top = 'auto';
            btn.style.bottom = '0';
        }
        
        startAutoHideTimer();
    }

    // 初始化按钮位置
    initButtonPosition();

    // 添加事件监听器
    btn.addEventListener('mousedown', onDragStart);
    btn.addEventListener('touchstart', onDragStart, { passive: false });
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);
    
    window.addEventListener('resize', () => {
        if (!isDragging) {
            const rect = btn.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                btn.style.left = (window.innerWidth - btn.offsetWidth) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                btn.style.top = (window.innerHeight - btn.offsetHeight) + 'px';
            }
        }
    });
    
    // 鼠标进入时显示
    btn.addEventListener('mouseenter', () => {
        btn.classList.remove('auto-hide');
        clearTimeout(autoHideTimeout);
    });
    
    // 鼠标离开时启动自动隐藏
    btn.addEventListener('mouseleave', () => {
        if (!isDragging) {
            startAutoHideTimer();
        }
    });

    // 初始化自动隐藏
    startAutoHideTimer();
} 
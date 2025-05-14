// Minecraft生物图鉴功能
// 生物数据
const mobsData = {
    hostile: [
        {
            id: 'zombie',
            name: '僵尸',
            image: 'img/monster_zombie_idle.png',
            type: 'hostile',
            stats: {
                health: 20,
                damage: 3,
                speed: 0.5,
                spawn: '夜晚/黑暗处'
            },
            description: '僵尸是Minecraft中最常见的敌对生物之一。它们会在夜晚或黑暗处自然生成，会主动攻击玩家。僵尸会追逐村民，并试图将其转化为僵尸村民。',
            drops: ['腐肉', '铁锭', '胡萝卜', '马铃薯'],
            behavior: '会追逐玩家和村民，在阳光下会燃烧'
        },
        {
            id: 'skeleton',
            name: '骷髅',
            image: 'img/monster_skeleton_idle.png',
            type: 'hostile',
            stats: {
                health: 20,
                damage: 4,
                speed: 0.5,
                spawn: '夜晚/黑暗处'
            },
            description: '骷髅是使用弓箭进行远程攻击的敌对生物。它们会在夜晚或黑暗处自然生成，会主动攻击玩家。骷髅在阳光下会燃烧。',
            drops: ['骨头', '箭', '弓'],
            behavior: '使用弓箭远程攻击，会躲避玩家的近战攻击'
        },
        {
            id: 'spider',
            name: '蜘蛛',
            image: 'img/monster_spider_idle.png',
            type: 'hostile',
            stats: {
                health: 16,
                damage: 2,
                speed: 0.8,
                spawn: '夜晚/黑暗处'
            },
            description: '蜘蛛是可以在白天和夜晚生成的敌对生物。它们可以爬墙，在白天不会主动攻击玩家，但在夜晚会变得具有攻击性。',
            drops: ['线', '蜘蛛眼'],
            behavior: '可以爬墙，在白天保持中立'
        },
        {
            id: 'creeper',
            name: '苦力怕',
            image: 'img/monster_creeper_idle.png',
            type: 'hostile',
            stats: {
                health: 20,
                damage: 49,
                speed: 0.3,
                spawn: '夜晚/黑暗处'
            },
            description: '苦力怕是Minecraft中最危险的生物之一。它们会悄悄接近玩家并在近距离爆炸。爆炸会造成巨大的伤害并破坏周围的方块。',
            drops: ['火药'],
            behavior: '会悄悄接近玩家并爆炸'
        }
    ],
    neutral: [
        {
            id: 'enderman',
            name: '末影人',
            image: 'img/monster_enderman_idle.png',
            type: 'neutral',
            stats: {
                health: 40,
                damage: 7,
                speed: 0.3,
                spawn: '主世界/末地'
            },
            description: '末影人是高大的黑色生物，可以瞬间移动和拾取方块。它们通常不会主动攻击玩家，但如果玩家直视它们的眼睛，它们会变得具有攻击性。',
            drops: ['末影珍珠'],
            behavior: '会瞬移，可以拾取和放置方块'
        }
    ],
    passive: [
        {
            id: 'cow',
            name: '牛',
            image: 'img/monster_cow_idle.png',
            type: 'passive',
            stats: {
                health: 10,
                drops: '生牛肉/皮革',
                speed: 0.2,
                spawn: '主世界'
            },
            description: '牛是友好的被动生物，会自然生成在草地上。它们可以提供生牛肉和皮革，用桶可以收集牛奶。',
            drops: ['生牛肉', '皮革', '牛奶'],
            behavior: '会跟随手持小麦的玩家'
        },
        {
            id: 'sheep',
            name: '羊',
            image: 'img/monster_sheep_idle.png',
            type: 'passive',
            stats: {
                health: 8,
                drops: '羊毛/生羊肉',
                speed: 0.2,
                spawn: '主世界'
            },
            description: '羊是友好的被动生物，会自然生成在草地上。它们可以提供羊毛和生羊肉，可以用剪刀剪羊毛。',
            drops: ['羊毛', '生羊肉'],
            behavior: '会跟随手持小麦的玩家，可以用染料染色'
        }
    ]
};

// 天气特效系统
const weatherTypes = [
    { name: '晴天', icon: '☀️' },
    { name: '下雨', icon: '🌧️' },
    { name: '下雪', icon: '❄️' },
    { name: '雷暴', icon: '⛈️' },
    { name: '夜晚', icon: '🌙' }
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
        btn.innerHTML = `<span>${weatherTypes[idx].icon}</span>${weatherTypes[idx].name}`;
        // 更新天气类型数据属性
        btn.dataset.weather = ['sunny', 'rainy', 'snowy', 'stormy', 'night'][idx];
        // 添加按钮按下动画
        btn.style.animation = 'button-press 0.3s ease';
        setTimeout(() => {
            btn.style.animation = '';
        }, 300);
    }
}

// 显示生物详情
function showMobDetails(mob) {
    const modal = document.getElementById('mobModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalStats = document.getElementById('modalStats');
    const modalDescription = document.getElementById('modalDescription');

    modalImage.src = mob.image;
    modalTitle.textContent = mob.name;

    // 创建统计信息
    modalStats.innerHTML = '';
    Object.entries(mob.stats).forEach(([key, value]) => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.innerHTML = `
            <div class="stat-label" data-key="${key}">${getStatLabel(key)}</div>
            <div class="stat-value">${value}</div>
        `;
        modalStats.appendChild(statItem);
    });

    // 添加掉落物信息
    if (mob.drops) {
        const dropsItem = document.createElement('div');
        dropsItem.className = 'stat-item';
        dropsItem.innerHTML = `
            <div class="stat-label">掉落物</div>
            <div class="stat-value">${Array.isArray(mob.drops) ? mob.drops.join(', ') : mob.drops}</div>
        `;
        modalStats.appendChild(dropsItem);
    }

    // 添加行为信息
    if (mob.behavior) {
        const behaviorItem = document.createElement('div');
        behaviorItem.className = 'stat-item';
        behaviorItem.innerHTML = `
            <div class="stat-label">行为</div>
            <div class="stat-value">${mob.behavior}</div>
        `;
        modalStats.appendChild(behaviorItem);
    }

    // 关键词高亮和段首像素符号
    let desc = mob.description;
    const keywords = ['Minecraft', '生物', '夜晚', '生成', '敌对', '友好', '中立', '攻击', '掉落', '村民', '末影', '苦力怕', '爆炸', '燃烧'];
    keywords.forEach(keyword => {
        desc = desc.replace(new RegExp(keyword, 'g'), `<span class="mob-keyword">${keyword}</span>`);
    });
    modalDescription.innerHTML = `<span class="description-symbol">§</span> ${desc}`;

    // 添加显示动画并显示模态框
    modal.style.display = 'flex';
    
    // 创建像素化粒子效果
    createModalParticles();
    
    // 添加图像动画效果
    setTimeout(() => {
        modalImage.classList.add('animate-image');
    }, 200);
    
    // 添加闪烁效果到标题
    let charIndex = 0;
    const titleText = modalTitle.textContent;
    modalTitle.innerHTML = '';
    const animateTitle = () => {
        if (charIndex < titleText.length) {
            const charSpan = document.createElement('span');
            charSpan.textContent = titleText[charIndex];
            charSpan.style.opacity = '0';
            charSpan.style.animation = `char-appear 0.1s forwards ${charIndex * 0.05}s`;
            modalTitle.appendChild(charSpan);
            charIndex++;
            setTimeout(animateTitle, 50);
        }
    };
    animateTitle();

    // 添加3D效果
    initModalDepth();
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('mobModal');
    const content = document.querySelector('.modal-content');
    
    // 添加关闭动画
    content.classList.add('modal-closing');
    
    // 等待动画完成后隐藏模态框
    setTimeout(() => {
        modal.style.display = 'none';
        content.classList.remove('modal-closing');
        
        // 清除粒子效果
        const particles = document.getElementById('modalParticles');
        if (particles) {
            particles.remove();
        }
        
        // 重置图像动画
        document.getElementById('modalImage').classList.remove('animate-image');
    }, 300);
}

// 创建模态框粒子效果
function createModalParticles() {
    // 检查是否已存在粒子容器
    let particlesContainer = document.getElementById('modalParticles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
    } else {
        particlesContainer = document.createElement('div');
        particlesContainer.id = 'modalParticles';
        document.body.appendChild(particlesContainer);
    }
    
    // 创建像素粒子
    const particleCount = Math.floor(window.innerWidth * window.innerHeight / 15000);
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机位置
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // 随机大小
        const size = 2 + Math.random() * 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // 随机不透明度
        particle.style.opacity = 0.1 + Math.random() * 0.3;
        
        // 随机动画延迟
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        // 随机动画持续时间
        particle.style.animationDuration = `${3 + Math.random() * 7}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// 为模态框添加3D深度效果
function initModalDepth() {
    const modalContent = document.querySelector('.modal-content');
    const maxRotate = 2; // 最大旋转角度
    
    // 监听鼠标移动
    modalContent.addEventListener('mousemove', (e) => {
        const rect = modalContent.getBoundingClientRect();
        
        // 计算鼠标位置相对于元素中心的偏移
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // 根据偏移计算旋转角度
        const rotateY = (mouseX / (rect.width / 2)) * maxRotate;
        const rotateX = -(mouseY / (rect.height / 2)) * maxRotate;
        
        // 应用3D变换
        modalContent.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    // 鼠标离开时重置变换
    modalContent.addEventListener('mouseleave', () => {
        modalContent.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)';
    });
}

// 创建生物卡片
function createMobCard(mob) {
    const card = document.createElement('div');
    card.className = 'mob-card';
    card.dataset.type = mob.type;
    
    // 主卡片内容
    card.innerHTML = `
        <div class="card-glow"></div>
        <img class="mob-image" src="${mob.image}" alt="${mob.name}" loading="lazy">
        <div class="mob-info">
            <h3 class="mob-name">${mob.name}</h3>
            <div class="mob-stats">
                <div class="stat-item">
                    <div class="stat-label">生命值</div>
                    <div class="stat-value">${mob.stats.health}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">伤害</div>
                    <div class="stat-value">${mob.stats.damage || '-'}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">速度</div>
                    <div class="stat-value">${mob.stats.speed}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">生成</div>
                    <div class="stat-value">${mob.stats.spawn}</div>
                </div>
            </div>
            <div class="mob-description">${getMobDescriptionPreview(mob.description)}</div>
        </div>
    `;

    // 添加卡片悬停效果
    card.addEventListener('mouseenter', () => {
        applyHoverEffects(card);
    });
    
    // 添加点击效果
    card.addEventListener('click', () => {
        card.classList.add('card-click');
        setTimeout(() => {
            card.classList.remove('card-click');
            showMobDetails(mob);
        }, 150);
    });

    return card;
}

// 获取生物描述预览（限制字数）
function getMobDescriptionPreview(description) {
    if (description.length > 100) {
        return description.substring(0, 100) + '...';
    }
    return description;
}

// 应用卡片悬停效果
function applyHoverEffects(card) {
    // 添加像素粒子效果
    const particleCount = 5;
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'card-particle';
            
            // 随机位置
            particle.style.left = `${10 + Math.random() * 80}%`;
            particle.style.top = `${10 + Math.random() * 80}%`;
            
            // 添加到卡片
            card.appendChild(particle);
            
            // 动画结束后移除
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }, i * 200);
    }
}

// 初始化图鉴
function initBestiary() {
    const grid = document.getElementById('bestiaryGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');

    // 加载所有生物卡片
    loadMobCards('all');

    // 添加筛选按钮事件监听
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 添加点击动画
            button.classList.add('button-click');
            setTimeout(() => {
                button.classList.remove('button-click');
            }, 150);
            
            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 加载对应类型的生物卡片（应用过渡动画）
            grid.classList.add('grid-fade');
            setTimeout(() => {
                loadMobCards(button.dataset.filter, searchInput.value);
                grid.classList.remove('grid-fade');
            }, 300);
        });
    });

    // 添加搜索框事件监听（带有防抖功能）
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
            grid.classList.add('grid-fade');
            setTimeout(() => {
                loadMobCards(currentFilter, e.target.value);
                grid.classList.remove('grid-fade');
            }, 300);
        }, 300);
    });

    // 添加模态框关闭事件
    document.querySelector('.close-modal').addEventListener('click', closeModal);

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('mobModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 添加键盘ESC关闭事件
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('mobModal').style.display === 'flex') {
            closeModal();
        }
    });
    
    // 添加页面加载动画
    document.body.classList.add('page-loaded');
    
    // 为搜索框添加焦点动画
    searchInput.addEventListener('focus', () => {
        document.querySelector('.search-section').classList.add('search-focus');
    });
    
    searchInput.addEventListener('blur', () => {
        document.querySelector('.search-section').classList.remove('search-focus');
    });
    
    // 添加生物卡片序列化动画
    animateCardEntrance();
}

// 加载生物卡片（带有延迟加载动画）
function loadMobCards(filter, searchText = '') {
    const grid = document.getElementById('bestiaryGrid');
    const noResults = document.getElementById('noResults');
    grid.innerHTML = '';

    let mobsToShow = [];

    if (filter === 'all') {
        mobsToShow = [...mobsData.hostile, ...mobsData.neutral, ...mobsData.passive];
    } else {
        mobsToShow = mobsData[filter] || [];
    }

    // 应用搜索过滤
    if (searchText) {
        const searchLower = searchText.toLowerCase();
        mobsToShow = mobsToShow.filter(mob => {
            return (
                mob.name.toLowerCase().includes(searchLower) ||
                mob.description.toLowerCase().includes(searchLower) ||
                (mob.behavior && mob.behavior.toLowerCase().includes(searchLower)) ||
                (Array.isArray(mob.drops) && mob.drops.some(drop => drop.toLowerCase().includes(searchLower)))
            );
        });
    }

    if (mobsToShow.length === 0) {
        noResults.style.display = 'block';
        noResults.innerHTML = `<img src="img/search-empty.png" alt="未找到" style="width:120px;display:block;margin:0 auto 12px auto;opacity:0.7;"><div>没有找到匹配的生物</div>`;
        
        // 添加抖动动画
        noResults.classList.add('no-results-shake');
        setTimeout(() => {
            noResults.classList.remove('no-results-shake');
        }, 500);
    } else {
        noResults.style.display = 'none';
        mobsToShow.forEach((mob, index) => {
            const card = createMobCard(mob);
            // 添加延迟显示动画
            card.style.animationDelay = `${index * 0.05}s`;
            grid.appendChild(card);
        });
    }
}

// 为生物卡片添加序列化入场动画
function animateCardEntrance() {
    const cards = document.querySelectorAll('.mob-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + index * 50);
    });
}

// 获取统计标签的中文名称
function getStatLabel(key) {
    const labels = {
        health: '生命值',
        damage: '伤害',
        speed: '速度',
        spawn: '生成',
        drops: '掉落物',
        behavior: '行为'
    };
    return labels[key] || key;
}

// 天气按钮拖动功能
function initWeatherButtonDrag() {
    const btn = document.getElementById('weatherToggleBtn');
    if (!btn) return;

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let autoHideTimeout;

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

        // 计算点击位置相对按钮左上角的偏移
        dragOffsetX = clientX - rect.left;
        dragOffsetY = clientY - rect.top;

        // 切换到使用left/top定位
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
        btn.style.left = rect.left + 'px';
        btn.style.top = rect.top + 'px';

        isDragging = true;
        btn.classList.add('dragging');
    }

    // 处理拖动
    function onDrag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

        // 计算新位置，考虑鼠标在按钮内的偏移
        let newLeft = clientX - dragOffsetX;
        let newTop = clientY - dragOffsetY;

        // 限制在窗口范围内
        const maxX = window.innerWidth - btn.offsetWidth;
        const maxY = window.innerHeight - btn.offsetHeight;
        newLeft = Math.max(0, Math.min(newLeft, maxX));
        newTop = Math.max(0, Math.min(newTop, maxY));

        btn.style.left = newLeft + 'px';
        btn.style.top = newTop + 'px';
    }

    // 处理拖动结束
    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        btn.classList.remove('dragging');

        const rect = btn.getBoundingClientRect();
        const threshold = Math.min(window.innerWidth * 0.1, 50); // 最大50px的吸附距离

        // 处理边缘吸附
        if (rect.left <= threshold) {
            // 吸附到左边
            btn.style.left = '0';
            btn.classList.add('left-edge');
            btn.classList.remove('right-edge');
        } else if (window.innerWidth - rect.right <= threshold) {
            // 吸附到右边
            btn.style.left = 'auto';
            btn.style.right = '0';
            btn.classList.add('right-edge');
            btn.classList.remove('left-edge');
        } else {
            btn.classList.remove('left-edge', 'right-edge');
        }

        if (rect.top <= threshold) {
            // 吸附到顶部
            btn.style.top = '0';
        } else if (window.innerHeight - rect.bottom <= threshold) {
            // 吸附到底部
            btn.style.top = 'auto';
            btn.style.bottom = '0';
        }

        startAutoHideTimer();
    }

    // 处理窗口大小变化
    function onResize() {
        if (isDragging) return;

        const rect = btn.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            btn.style.left = (window.innerWidth - btn.offsetWidth) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            btn.style.top = (window.innerHeight - btn.offsetHeight) + 'px';
        }
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

    // 窗口大小变化时调整位置
    window.addEventListener('resize', onResize);

    // 初始化自动隐藏
    startAutoHideTimer();
}

// 页面加载完成后初始化图鉴和拖动功能
document.addEventListener('DOMContentLoaded', () => {
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
    initBestiary();
    initWeatherButtonDrag();
});
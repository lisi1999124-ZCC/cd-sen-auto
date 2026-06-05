// ===== 页面加载 =====
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// ===== 导航栏滚动效果 =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const backToTop = document.getElementById('backToTop');
const wechatFloat = document.getElementById('wechatFloat');

// 滚动时改变导航栏样式
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // 导航栏
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // 返回顶部按钮
    if (scrollY > 400) {
        backToTop.classList.add('visible');
        wechatFloat.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
        wechatFloat.classList.remove('visible');
    }
    
    lastScrollY = scrollY;
}, { passive: true });

// 返回顶部
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 微信浮窗
const wechatBtn = document.getElementById('wechatBtn');
const wechatPopup = document.getElementById('wechatPopup');
if (wechatBtn && wechatPopup) {
    wechatBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        wechatPopup.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
        if (!wechatPopup.contains(e.target) && e.target !== wechatBtn) {
            wechatPopup.classList.remove('show');
        }
    });
}

// 移动端菜单切换
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// 点击导航链接后关闭移动端菜单
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== 滚动淡入动画 =====
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // 添加延迟，让元素依次出现
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
});

// 为同组卡片添加递增延迟
document.querySelectorAll('.services-grid, .cases-grid, .advantage-list, .timeline-items, .partners-grid').forEach(grid => {
    const children = grid.querySelectorAll('.fade-in');
    children.forEach((child, index) => {
        child.dataset.delay = index * 100;
    });
});

fadeElements.forEach(el => fadeObserver.observe(el));

// ===== 数字计数动画 =====
const statNumbers = document.querySelectorAll('.stat-number');
let counted = false;

function animateNumbers() {
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    
    const sectionTop = statsSection.offsetTop;
    const sectionHeight = statsSection.offsetHeight;
    const scrollPosition = window.scrollY + window.innerHeight;
    
    if (scrollPosition > sectionTop + sectionHeight / 3 && !counted) {
        counted = true;
        
        statNumbers.forEach((number, index) => {
            const target = parseInt(number.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();
            
            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // easeOutExpo 缓动
                const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = Math.floor(eased * target);
                
                number.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    number.textContent = target;
                }
            }
            
            // 错开每个数字的开始时间
            setTimeout(() => {
                requestAnimationFrame(updateNumber);
            }, index * 200);
        });
    }
}

window.addEventListener('scroll', animateNumbers, { passive: true });

// 页面加载时也检查一次（如果统计区域已在视口内）
animateNumbers();

// ===== 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== 导航栏活跃链接高亮 =====
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
updateActiveNav();

// ===== 表单提交处理 =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        let isValid = true;
        contactForm.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#e74c3c';
                field.addEventListener('input', function() {
                    this.style.borderColor = '';
                }, { once: true });
                field.addEventListener('change', function() {
                    this.style.borderColor = '';
                }, { once: true });
            }
        });
        
        if (isValid) {
            // 隐藏表单，显示成功消息
            contactForm.style.display = 'none';
            if (formSuccess) {
                formSuccess.classList.add('show');
            }
        } else {
            // 滚动到第一个错误字段
            const firstError = contactForm.querySelector('[style*="border-color"]');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// ===== Hero 视差效果 =====
const hero = document.querySelector('.hero');
if (hero) {
    const heroContent = hero.querySelector('.hero-content');
    const heroParticles = hero.querySelector('.hero-particles');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                heroContent.style.opacity = 1 - progress * 1.2;
            }
            if (heroParticles) {
                heroParticles.style.transform = `translateY(${scrollY * 0.15}px)`;
            }
        }
    }, { passive: true });
}

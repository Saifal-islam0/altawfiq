// ===== تصفية الأخبار حسب الفئة =====
const filterTabs = document.querySelectorAll('.filter-tab');
const featuredCards = document.querySelectorAll('.featured-card');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // تحديث الزر النشط
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const filter = tab.getAttribute('data-filter');
        filterNews(filter);
    });
});

function filterNews(filter) {
    // تصفية البطاقات المميزة
    featuredCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== البحث في الأخبار =====
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    
    // البحث في الأخبار المميزة
    featuredCards.forEach(card => {
        const title = card.querySelector('h2, h3')?.textContent.toLowerCase() || '';
        const content = card.querySelector('p')?.textContent.toLowerCase() || '';
        
        const matches = title.includes(searchTerm) || content.includes(searchTerm);
        card.style.display = matches ? '' : 'none';
    });
    
    // إعادة تعيين الفلاتر عند البحث
    if (searchTerm !== '') {
        filterTabs.forEach(t => t.classList.remove('active'));
        filterTabs[0].classList.add('active');
    }
});

// ===== تأثير الظهور التدريجي للأخبار =====
document.querySelectorAll('.featured-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 300);
});

// ===== مشاركة الأخبار =====
document.querySelectorAll('.read-more').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const card = link.closest('.featured-card');
        const title = card.querySelector('h2, h3').textContent;
        
    });
});

// ===== دالة showNotification =====
function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    const colors = {
        success: 'linear-gradient(135deg, #05bfdb 0%, #00ffca 100%)',
        error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        info: 'linear-gradient(135deg, #0a4d68 0%, #088395 100%)'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%) translateY(-20px)',
        background: colors[type],
        color: type === 'success' ? '#001d3d' : '#fff',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        fontSize: '1rem',
        fontWeight: '600',
        zIndex: '10000',
        opacity: '0',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        minWidth: '300px',
        maxWidth: '90%'
    });
    
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    });
    
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer',
        padding: '5px',
        opacity: '0.7'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    const hide = () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 400);
    };
    
    closeBtn.addEventListener('click', hide);
    setTimeout(hide, 4000);
}

// ===== تفعيل الفلتر النشط عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', () => {
    // التحقق من وجود hash في URL للتصفية المباشرة
    const hash = window.location.hash.replace('#', '');
    if (hash && ['news', 'events', 'achievements', 'activities'].includes(hash)) {
        const targetTab = document.querySelector(`[data-filter="${hash}"]`);
        if (targetTab) {
            targetTab.click();
        }
    }
});
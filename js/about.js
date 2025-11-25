// ===== تأثير الظهور التدريجي للصور =====
const storyImages = document.querySelectorAll('.image-collage img');
storyImages.forEach((img, index) => {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.9)';
    img.style.transition = 'all 0.8s ease';
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                }, index * 200);
                imageObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    imageObserver.observe(img);
});

// ===== تفاعل بطاقة المبرمج =====
const developerCard = document.querySelector('.developer-card');
if (developerCard) {
    const devObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                devObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    developerCard.style.opacity = '0';
    developerCard.style.transform = 'translateY(40px) scale(0.95)';
    developerCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    devObserver.observe(developerCard);
}

// ===== نسخ معلومات التواصل عند النقر المزدوج =====
const contactInfo = document.querySelectorAll('.developer-contact .dev-btn');
contactInfo.forEach(btn => {
    btn.addEventListener('dblclick', (e) => {
        e.preventDefault();
        const text = btn.textContent.trim();
        
        navigator.clipboard.writeText(text).then(() => {
            showNotification('تم نسخ معلومات التواصل!', 'success');
        }).catch(() => {
            showNotification('فشل النسخ، يرجى المحاولة مرة أخرى', 'error');
        });
    });
});

// ===== إشعارات محسّنة =====
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
        <button class="notification-close" aria-label="إغلاق"><i class="fas fa-times"></i></button>
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
        opacity: '0.7',
        transition: 'opacity 0.3s'
    });
    
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
    
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

// ===== تأثير التحميل للصفحة =====
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
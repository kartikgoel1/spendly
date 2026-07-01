// main.js — students will add JavaScript here as features are built

(function () {
    var openBtn = document.getElementById('how-it-works-btn');
    var modal = document.getElementById('how-it-works-modal');
    var closeBtn = document.getElementById('how-it-works-close');
    var iframe = document.getElementById('how-it-works-iframe');

    if (!openBtn || !modal || !closeBtn || !iframe) return;

    function openModal() {
        iframe.src = iframe.dataset.src + '?autoplay=1';
        modal.hidden = false;
    }

    function closeModal() {
        modal.hidden = true;
        iframe.src = '';
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (event) {
        if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !modal.hidden) closeModal();
    });
})();

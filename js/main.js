document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const links = document.querySelectorAll('.sidebar .nav a');

  links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
// ===== Step 2: Panic button with confirmation popup =====
document.addEventListener('DOMContentLoaded', () => {
  const panicBtn = document.querySelector('.panic-btn');
  if (!panicBtn) return; 

 
  const overlay = document.createElement('div');
  overlay.className = 'panic-overlay';
  overlay.innerHTML = `
    <div class="panic-modal">
      <div class="panic-icon">🚨</div>
      <h2>Send emergency alert?</h2>
      <p>This will notify the campus security team immediately.</p>
      <div class="panic-actions">
        <button class="btn btn-ghost" id="panicCancel">Cancel</button>
        <button class="btn btn-danger" id="panicConfirm">Confirm</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const openModal = () => overlay.classList.add('show');
  const closeModal = () => overlay.classList.remove('show');

  panicBtn.addEventListener('click', openModal);
  document.getElementById('panicCancel').addEventListener('click', closeModal);

  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.getElementById('panicConfirm').addEventListener('click', () => {
    closeModal();
    alert('Alert sent to campus security. Stay safe!'); 
  });
});

// ===== Step 3: Select one emergency type at a time =====
document.addEventListener('DOMContentLoaded', () => {
  const typeCards = document.querySelectorAll('.type-card');
  if (typeCards.length === 0) return; 

  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
});
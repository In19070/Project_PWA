let notes = JSON.parse(localStorage.getItem('notes')) || [];
let isEditing = false;
let editingIndex = null;

function saveNote() {
  const title = document.getElementById('note-title').value;
  const content = document.getElementById('note-content').value;
  const tags = document.getElementById('note-tags').value.split(',').map(t => t.trim());
  const priority = document.getElementById('note-priority').value;
  const reminder = document.getElementById('note-reminder').value;
  const imageInput = document.getElementById('new-image');
  const imageFile = imageInput.files[0];

  const note = {
    id: Date.now(),
    title,
    content,
    tags,
    priority,
    reminder,
    createdAt: new Date().toLocaleString(),
    image: null
  };

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function () {
      note.image = reader.result;

      if (isEditing && editingIndex !== null) {
        notes[editingIndex] = note;
        isEditing = false;
        editingIndex = null;
      } else {
        notes.push(note);
      }

      localStorage.setItem('notes', JSON.stringify(notes));
      renderNotes();
      clearForm();
    };
    reader.readAsDataURL(imageFile);
  } else {
    if (isEditing && editingIndex !== null) {
      notes[editingIndex] = note;
      isEditing = false;
      editingIndex = null;
    } else {
      notes.push(note);
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    clearForm();
  }
}

function renderNotes(filtered = notes) {
  const list = document.getElementById('notes-list');
  list.innerHTML = '';

  filtered.forEach((note, index) => {
    const div = document.createElement('div');
    div.className = 'note';

    div.innerHTML = `
      ${note.image ? `<img src="${note.image}" alt="Gambar Catatan" class="note-image">` : ''}
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <small>Tag: ${note.tags.join(', ')} | Prioritas: ${note.priority}</small><br>
      <small>Dibuat: ${note.createdAt}</small><br>
      <button class="edit-btn" onclick="editNote(${index})"><i class="fas fa-edit"></i> Edit</button>
      <button class="delete-btn" onclick="deleteNote(${index})"><i class="fas fa-trash"></i> Hapus</button>
    `;
    list.appendChild(div);
  });
}

function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes();
}

function editNote(index) {
  const note = notes[index];
  document.getElementById('note-title').value = note.title;
  document.getElementById('note-content').value = note.content;
  document.getElementById('note-tags').value = note.tags.join(', ');
  document.getElementById('note-priority').value = note.priority;
  document.getElementById('note-reminder').value = note.reminder;
  document.getElementById('new-image').value = '';

  isEditing = true;
  editingIndex = index;

  showPage('add');
}

function searchNotes() {
  const keyword = document.getElementById('search').value.toLowerCase();
  const filtered = notes.filter(note =>
    note.title.toLowerCase().includes(keyword) ||
    note.content.toLowerCase().includes(keyword) ||
    note.tags.some(tag => tag.toLowerCase().includes(keyword))
  );
  renderNotes(filtered);
}

function showPage(page) {
  const pages = ['home-page', 'add-page', 'settings-page'];
  pages.forEach(p => {
    const section = document.getElementById(p);
    if (section) {
      section.classList.remove('active');
      section.classList.add('hidden');
    }
  });

  const currentPage = document.getElementById(page + '-page');
  if (currentPage) {
    currentPage.classList.add('active');
    currentPage.classList.remove('hidden');
  }
}

function clearForm() {
  document.getElementById('note-title').value = '';
  document.getElementById('note-content').value = '';
  document.getElementById('note-tags').value = '';
  document.getElementById('note-reminder').value = '';
  document.getElementById('new-image').value = '';
}

// Tema gelap/terang
const toggleBtn = document.getElementById('toggle-theme');
if (toggleBtn) {
  const icon = toggleBtn.querySelector('i');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  });
}

// Bahasa pengguna
function showUserLanguage() {
  const lang = navigator.language || navigator.userLanguage;
  const langText = document.getElementById('user-language');
  if (langText) {
    langText.textContent = `Bahasa browser Anda: ${lang}`;
  }
}

window.onload = () => {
  const user = JSON.parse(localStorage.getItem('userProfile'));
if (user && user.name) {
  const userInfo = document.getElementById('user-info');
  if (userInfo) userInfo.textContent = `👋 Hai, ${user.name}!`;
}

  const isDark = localStorage.getItem('theme') === 'dark';
  if (isDark) {
    document.body.classList.add('dark');
  }

  if (toggleBtn) {
    const icon = toggleBtn.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }

  renderNotes();
  showUserLanguage();
};

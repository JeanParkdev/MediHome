const medSearchInput = document.querySelector('#med-search');
const searchBtn = document.querySelector('#search-btn');
const resultsList = document.querySelector('#search-results ul');
const resultsContainer = document.querySelector('#search-results');
const addMedForm = document.querySelector('#add-med-form');

//API Drug finder
const searchDrugs = async (event) => {
    const query = medSearchInput.value.trim();
    if (!query) return;

    resultsList.innerHTML = '<li class="px-4 py-2 text-gray-500">Searching FDA database for "' + query + '"...</li>';
    resultsContainer.classList.remove('hidden');

    try {
        const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${query}*+OR+openfda.generic_name:${query}*&limit=5`);
        const data = await response.json();

        resultsList.innerHTML = '';

        if (data.results) {
            data.results.forEach(drug => {
                const brand = drug.openfda.brand_name ? drug.openfda.brand_name[0] : null;
                const generic = drug.openfda.generic_name ? drug.openfda.generic_name[0] : null;
                const name = brand || generic;  

         if (name) {
            const li = document.createElement('li');
            li.className = "px-4 py-2 hover:bg-blue-100 cursor-pointer border-b border-gray-100 last:border-0";
            li.textContent = name;
            
            // Click a result -> fill the box & hide the list
            li.onclick = () => {
              medSearchInput.value = name;
              resultsContainer.classList.add('hidden');
            };
            
            resultsList.appendChild(li);
        }
      });
    } else {
      resultsList.innerHTML = `<li class="px-4 py-2 text-gray-500">No FDA match. <span class="text-blue-600 font-bold cursor-pointer" onclick="document.querySelector('#search-results').classList.add('hidden')">Use "${query}" anyway</span></li>`;
    }
  } catch (err) {
    console.error(err);
    resultsList.innerHTML = '<li class="px-4 py-2 text-red-500">Error connecting to FDA.</li>';
  }
};
 // Medication Handler
 // add medication
const addMedFormHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#med-search').value.trim();
    const dosage = document.querySelector('#med-dosage').value.trim();
    const frequency = document.querySelector('#med-frequency').value.trim();
    const category = document.querySelector('#med-category').value;
    const refill_date = document.querySelector('#med-refill').value || null;
    const reminder_time = document.querySelector('#med-reminder').value || null;

    console.log("Submitting:", { name, dosage, frequency, category, refill_date, reminder_time });

    if (name && dosage && frequency) {
        const response = await fetch('/api/medications', {
            method: 'POST',
            body: JSON.stringify({ name, dosage, frequency, category, refill_date, reminder_time }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.reload();
        } else {
            const err = await response.json();
            console.error("Database Error:", err);
            alert('Failed to add. Reason: ' + (err.message || 'Check console for details'));
        } 
        } else {
            alert('Please fill out all fields.');
        }
    };
if (addMedForm) {
    addMedForm.addEventListener('submit', addMedFormHandler);
}

    //Edit Meds
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.edit-med-btn');
        if (btn) {
            const d = btn.dataset;
            document.getElementById('edit-med-id').value = d.id;
            document.getElementById('edit-name').value = d.name;
            document.getElementById('edit-dosage').value = d.dosage;
            document.getElementById('edit-freq').value = d.freq;
            document.getElementById('edit-refill').value = d.refill || '';
            document.getElementById('edit-reminder').value = d.reminder || '';
            document.getElementById('edit-med-modal').classList.remove('hidden');
        }
    });
    // Save edit changes 
    const editMedForm = document.querySelector('#edit-med-form');
if (editMedForm) {
    editMedForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-med-id').value;
        const updates = {
            name: document.getElementById('edit-name').value,
            dosage: document.getElementById('edit-dosage').value,
            frequency: document.getElementById('edit-freq').value,
            refill_date: document.getElementById('edit-refill').value || null,
            reminder_time: document.getElementById('edit-reminder').value || null,
        };
        const response = await fetch(`/api/medications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) document.location.reload();
        else alert('Failed to update medication.');
    });
}
    // Delete Meds
    let deleteTargetId = null;
    document.addEventListener('click', (event) => {
        const btn = event.target.closest('.delete-init-btn');
        if (btn) {
            deleteTargetId = btn.dataset.id;
            document.getElementById('delete-warning-modal').classList.remove('hidden');
        }
    });

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            if (deleteTargetId) {
                const response = await fetch(`/api/medications/${deleteTargetId}`, { method: 'DELETE' });
                if (response.ok) document.location.reload();
                else alert('Failed to delete medication.');
            }
        });
}
    // Archive and Restore Handlers
    const toggleStatusHandler = async (id, newStatus) => {
    const response = await fetch(`/api/medications/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: newStatus }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) document.location.reload();
};

document.addEventListener('click', (e) => {
    // Archive
    const archiveBtn = e.target.closest('.archive-med-btn');
    if (archiveBtn) {
        const id = archiveBtn.dataset.id;
        toggleStatusHandler(id, false);
    }
    // Restore
    const restoreBtn = e.target.closest('.restore-med-btn');
    if (restoreBtn) {
        const id = restoreBtn.dataset.id;
        toggleStatusHandler(id, true);
    }
});

// Toast for reminders
const toast = document.getElementById('smart-toast');
const titleEl = document.getElementById('toast-title');
const msgEl = document.getElementById('toast-message');
const iconBg = document.getElementById('toast-icon-bg');
const emojiEl = document.getElementById('toast-emoji');
const primaryBtn = document.getElementById('toast-primary-btn');

const showToast = (title, message, type) => {
    toast.className = "fixed bottom-5 right-5 z-50 w-80 bg-white rounded-lg shadow-2xl border-l-4 overflow-hidden transition-all duration-500 transform translate-y-0";
    
    if (type === 'urgent') {
        // Medication (Purple + Bounce)
        toast.classList.add('border-purple-600', 'animate-bounce');
        iconBg.className = "h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center";
        emojiEl.textContent = "⏰";
        primaryBtn.className = "bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm";
        primaryBtn.textContent = "TAKE NOW";
        
        // Confetti Trigger
        primaryBtn.onclick = () => { 
            dismissToast(); 
            if(typeof confetti === 'function') {
                confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#9333ea', '#2563eb', '#fbbf24'] });
            }
        };
    
    } else if (type === 'warning') {
        // Refill (Orange + No Bounce)
        toast.classList.add('border-orange-500'); 
        iconBg.className = "h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center";
        emojiEl.textContent = "💊";
        primaryBtn.className = "bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm";
        primaryBtn.textContent = "GOT IT";
        primaryBtn.onclick = dismissToast;
    }

    titleEl.textContent = title;
    msgEl.textContent = message;
    toast.classList.remove('hidden');
};

window.dismissToast = () => {
    toast.classList.add('hidden');
};

searchBtn.addEventListener('click', searchDrugs);
addMedForm.addEventListener('submit', addMedFormHandler);
const deleteButtons = document.querySelectorAll('.delete-med');

deleteButtons.forEach(btn => {
    btn.addEventListener('click', deleteMedHandler);

}
);

// Refill Checker
const checkRefills = () => {
    const medCards = document.querySelectorAll('.edit-med-btn');
    const today = new Date();
    
    medCards.forEach(card => {
        const refillDateStr = card.dataset.refill;
        if (!refillDateStr) return;

        const refillDate = new Date(refillDateStr);
        const diffTime = refillDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays <= 3) {
            let msg = diffDays < 0 ? `Your refill was due ${Math.abs(diffDays)} days ago!` : `Refill due in ${diffDays} day(s).`;
            setTimeout(() => {
                showToast('Refill Required', `${card.dataset.name}: ${msg}`, 'warning');
            }, 2000);
        }
    });
};

const checkReminders = () => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    const medCards = document.querySelectorAll('.edit-med-btn');
    medCards.forEach(card => {
        const medName = card.dataset.name;
        const medReminder = card.dataset.reminder;

        if (medReminder && medReminder.startsWith(currentTime)) {
            showToast('Medication Time', `It is time to take your ${medName}.`, 'urgent');
        }
    });
};

checkRefills();
setInterval(checkReminders, 60000);

// Edit Meds
document.addEventListener('click', (e) => {
    const id= e.target.closest('.edit-med-btn');
    if (btn) {
        const d= btn.dataset;
        document.getElementById('edit-med-id').value = d.id;
        document.getElementById('edit-name').value = d.name;
        document.getElementById('edit-dosage').value = d.dosage;
        document.getElementById('edit-freq').value = d.freq;
        document.getElementById('edit-refill').value = d.refill || '';
        document.getElementById('edit-reminder').value = d.reminder || '';
        
        document.getElementById('edit-med-modal').classList.remove('hidden');
    }
});


//Doctor Handler

const addDoctorFormHandler = async (event) => {
    event.preventDefault();
    const name = document.querySelector('#doc-name').value.trim();
    const specialty = document.querySelector('#doc-specialty').value.trim();
    const phone = document.querySelector('#doc-phone').value.trim();
    const email = document.querySelector('#doc-email').value.trim();

    if (name && specialty) {
        const response = await fetch('/api/doctors', {
            method: 'POST',
            body: JSON.stringify({ name, specialty, phone, email }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) document.location.reload();
        else alert('Failed to add doctor.');
    }
};

const docForm = document.querySelector('#add-doctor-form');
if (docForm) docForm.addEventListener('submit', addDoctorFormHandler);


    //Appointment Handler

   const addApptFormHandler = async (event) => {
    event.preventDefault();
    const title = document.querySelector('#appt-title').value.trim();
    const date = document.querySelector('#appt-date').value;
    const time = document.querySelector('#appt-time').value;
    const type = document.querySelector('#appt-type').value;
    const reason = document.querySelector('#appt-reason').value.trim();

    if (title && date && time) {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            body: JSON.stringify({ title, date, time, type, reason }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) document.location.reload();
        else alert('Failed to add appointment');
    }
};

    const apptForm = document.querySelector('#add-appt-form');
    if (apptForm) apptForm.addEventListener('submit', addApptFormHandler);


    document.addEventListener('click', async (event) => {
        if (event.target.closest('.delete-appt')) {
            const id = event.target.closest('.delete-appt').dataset.id;
            const response = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
            if (response.ok) document.location.reload();
        }
    });
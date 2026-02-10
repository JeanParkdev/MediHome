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

const addMedFormHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#med-search').value.trim();
    const dosage = document.querySelector('#med-dosage').value.trim();
    const frequency = document.querySelector('#med-frequency').value.trim();
    const category = document.querySelector('#med-category').value;
    
    console.log("Submitting:", { name, dosage, frequency, category });

    if (name && dosage && frequency) {
        const response = await fetch('/api/medications', {
            method: 'POST',
            body: JSON.stringify({ name, dosage, frequency, category }),
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

    const deleteMedHandler = async (event) => {
        if (event.target.hasAttribute('data-id')) {
            const id = event.target.getAttribute('data-id');

            const response = await fetch(`/api/medications/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                document.location.reload();
            } else {
                alert('Failed to delete medication.');
            }
        }
    };


searchBtn.addEventListener('click', searchDrugs);
addMedForm.addEventListener('submit', addMedFormHandler);
const deleteButtons = document.querySelectorAll('.delete-med');

deleteButtons.forEach(btn => {
    btn.addEventListener('click', deleteMedHandler);

}
);

//Med edit handlers below
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

//save changes from Edit Modal
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
// Archive and Restore Handlers
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('archive-med-btn')) {
        const id = event.target.closest('.archive-med-btn').dataset.id;
        const response = await fetch(`/api/medications/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ is_active: false }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            document.location.reload(); 
        }
    if (event.target.classList.contains('restore-med-btn')) {
        const id = event.target.closest('.restore-med-btn').dataset.id;
        const response = await fetch(`/api/medications/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ is_active: true }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            document.location.reload(); 
        }
    }
}});

//delete with warning
let deleteTargetId = null;
document.addEventListener('click', (event) => {
    const btn = event.target.closest('.delete-init-btn');
    if (btn) {
        deleteTargetId = btn.dataset.id;
        document.getElementById('delete-modal').classList.remove('hidden');
    }
});

const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
        if (deleteTargetId) {
            const response = await fetch(`/api/medications/${deleteTargetId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                document.location.reload();
            } else {
                alert('Failed to delete medication.');
            }
        }});
    }
        


//Archive and Restore Handlers
const toggleStatusHandler = async (id, newStatus) => {
    const response = await fetch(`/api/medications/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: newStatus }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
        document.location.reload();
    }
};
    document.addEventListener('click', (e) => {
        //archive
        if (e.target.classList.contains('archive-med-btn')) {
            const id = e.target.getAttribute('data-id').dataset.id;
            toggleStatusHandler(id, false);
        }
        //restore
        if (e.target.classList.contains('restore-med-btn')) {
            const id= e.target.closest('.restore-med-btn').getAttribute('data-id');
            toggleStatusHandler(id, true);
       }
    });
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
// Save changes from Edit Modal
document.getElementById('edit-med-form').addEventListener('submit', async (e) => {
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
});

document.getElementById('edit-med-form').addEventListener('submit', async (e) => {
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
});

//Doctor Handler

const addDoctorFormHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#doc-name').value.trim();
    const specialty = document.querySelector('#doc-specialty').value.trim();
    const phone = document.querySelector('#doc-phone').value.trim();
    const email = document.querySelector('#doc-email').value.trim();

    if (name && specialty && phone && email) {
        const response = await fetch('/api/doctors', {
            method: 'POST',
            body: JSON.stringify({ name, specialty, phone, email }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.reload();
        } else {
            // const errorData = await response.json();
            // console.log("doc error", errorData);
            alert('Failed to add doctor.');
        }
    }};

    const docForm = document.querySelector('#add-doctor-form');
    if (docForm) {
        docForm.addEventListener('submit', addDoctorFormHandler);
    }

    //Appointment Handler

    const addApptFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#appt-title').value.trim();
    const date = document.querySelector('#appt-date').value;
    const time = document.querySelector('#appt-time').value;
    const type = document.querySelector('#appt-type').value;
    const reason = document.querySelector('#appt-reason').value.trim();

    if (title && date && time && type) {
        const response = await fetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({ title, date, time, type, reason }),
        headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
        document.location.reload();
        } else {
        alert('Failed to add appointment');
        }
    }
    };

    const deleteApptHandler = async (event) => {
    if (event.target.closest('.delete-appt')) {
        const id = event.target.closest('.delete-appt').getAttribute('data-id');
        const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        });

        if (response.ok) {
        document.location.reload();
        } else {
        alert('Failed to delete appointment');
        }
    }
    };

    const apptForm = document.querySelector('#add-appt-form');
    if (apptForm) {
    apptForm.addEventListener('submit', addApptFormHandler);
    }

    document.addEventListener('click', deleteApptHandler);
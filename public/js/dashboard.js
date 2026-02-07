const medSearchInput = document.querySelector('#med-search');
const searchBtn = document.querySelector('#search-btn');
const resultsList = document.querySelector('#search-results ul');
const resultsContainer = document.querySelector('#search-results');
const addMedForm = document.querySelector('#add-med-form');

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
